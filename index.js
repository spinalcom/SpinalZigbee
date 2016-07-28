// IMPORTANT TODO LIST:
// 1. handle better the errors when connections are lost (keep retrying)
// 2. add subscribe function


const util = require('util'),
      SerialInterface = require('./lib/serial-interface').SerialInterface,
      zigbeeLib = require('./lib/zigbee/lib'),
      frame = require('./lib/zigbee/frames'), // TODO: remove this after encapsulating base command
      EventEmitter = require('events').EventEmitter;

// TODO: Add comments for docs
function ZApi() {

  var options = {};

  if (arguments.length > 0) {

    if (typeof arguments[0] === 'object') {
      // overwrite port attibutes with the ones passed
      options = util._extend(options, arguments[0]);

    } else {

      // set port path
      if (typeof arguments[0] === 'string') {
        options.portPath = arguments[0];
      }

      // set port baudrate
      if (typeof arguments[1] === 'number') {
        options.portBaudrate = arguments[1];
      }
    }
  }

  // establish a communication with serial
  this.serial = new SerialInterface(options);
};

util.inherits(ZApi, EventEmitter);


ZApi.prototype.discover = function(params) {

  var self = this;

  defaultParams = {
    timeout: 15 // 10 sec
  };

  params = params || defaultParams;
  params.timeout = params.timeout || defaultParams.timeout;

  this.emit('discovery_started');

  // remove event listeners 1 sec after the tiemout is fired
  setTimeout(function () {
    this.emit('discovery_ended');
  }.bind(this), params.timeout * 1000 + 1000);

  this.serial.timeout = params.timeout;

  var params = {
    serial: this.serial
  };

  return zigbeeLib.scanNetwork(params).then(function (routers) {

    var totalThings = 0;

    // remove coordinator to be really just routers
    var coordinator_children = [];
    routers = routers.filter(function (router) {
      var coordinator = router.networkAddress == "0000" || router.ieeeAddress == "0000000000000000";
      if (coordinator) {
        coordinator_children = router.children;
        return false;
      }
      return true;
    });

    // add coordinator childrens at the same level than routers
    routers = routers.concat(coordinator_children);

    // get information per sibling
    routers.forEach(function (router) {

      // get information per child
      router.children.forEach(function (endDevice) {
        var endDeviceParams = {
          thing: endDevice,
          serial: params.serial
        };

        // TODO: modularize this in a zigbeeLib.discoverThing(params).then(.. this.emit ..);
        zigbeeLib.requestActiveEndpoints(endDeviceParams)
          .then(zigbeeLib.requestSimpleDescriptor)
          .then(zigbeeLib.parseEndpoints)
          .then(function (response) {
            self.emit('thing_discovered', response.thing, self);
          })
          .catch(function (error) {
            // TODO: emit error
            console.log('Error occurred while trying to communicate with device ' + thing.ieeeAddress, err);
          });

      });

      var routerParams = {
        thing: router,
        serial: params.serial
      };

      zigbeeLib.requestActiveEndpoints(routerParams)
        .then(zigbeeLib.requestSimpleDescriptor)
        .then(zigbeeLib.parseEndpoints)
        .then(function (response) {
          self.emit('thing_discovered', response.thing, self);
        })
        .catch(function (error) {
          // TODO: emit error
          console.log('Error occurred while trying to communicate with device ' + thing.ieeeAddress, err);
        });

      totalThings += 1 + router.children.length;

    });

    return { totalThings: totalThings };

  }).catch(function (error) {
    console.log('Error occurred while trying to scan network:', error);
  });

};

ZApi.prototype.sendCommand = function (destination, commandParameters, options) {

  // TODO: check and throw for erros in options

  var ignoreResponse = (typeof options === 'undefined' || typeof options.ignoreResponse === 'undefined') ? false : options.ignoreResponse;

  Object.assign(commandParameters, destination);

  var frameTx = frame['Base_Command'].request(commandParameters);

  return this.serial.sendFrame(frameTx, ignoreResponse).then(function (frameRx) {

    return frameRx;

  }).catch(function (err) {
    console.log('ZigBee frame could no be sent:', err);
  });

}

module.exports = ZApi;
