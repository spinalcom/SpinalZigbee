const SerialPort = require('serialport').SerialPort,
      XBeeAPI = require('xbee-api').XBeeAPI,
      C = require('xbee-api').constants,
      Q = require('q');

// TODO: Move somewhere else, where it depends on an instance
var xbeeAPI = new XBeeAPI({
  api_mode: 1
});

// we can be waiting for 1000 frames at the same time
// this value is random, but should be big enough
xbeeAPI.setMaxListeners(1000);

function SerialInterface (options) {

  // set parameters
  this.options = {
    portPath: (options && typeof options.portPath !== 'undefined') ? options.portPath : this.defaults.portPath,
    portBaudrate: (options && typeof options.portBaudrate !== 'undefined') ? options.portBaudrate : this.defaults.portBaudrate
  }

  // create serialport instance but do not open it yet
  this.serialport = new SerialPort(this.options.portPath, {
    baudrate: this.options.portBaudrate,
    parser: xbeeAPI.rawParser()
  }, false);

  // defualt timeout of 10 sec
  this.timeout = 10;

};

SerialInterface.prototype.defaults = {
  portPath: '/dev/ttyUSB0',
  portBaudrate: 115200,
  frameParser: xbeeAPI.rawParser
};

SerialInterface.prototype.sendFrame = function (frameTx, ignoreResponse) {
  // create promise
  var deferred = Q.defer();
  var maxWait = this.timeout * 1000;
  var isListenerActive = true;

  // some commands don't have an explicit response, so we don't wait for it
  ignoreResponse = typeof ignoreResponse === 'undefined' ? false : ignoreResponse;

  var callback = function (frameRx) {
    // check and resolve the promise
    if (ignoreResponse || areLinked(frameTx, frameRx)) {
      deferred.resolve(frameRx);
      isListenerActive = false;
      xbeeAPI.removeListener('frame_object', callback);
    }
  };

  // create writing function linked to the object context
  var writeSerialport = (function () {
    // format frame
    var frameTxBinary = xbeeAPI.buildFrame(frameTx);

    // send frame to serial port
    this.serialport.write(frameTxBinary, function(err, res) {
      if (err) throw(err)
      else
        // call the callback if we are not waiting for a response
        // TODO: replace this by an event emitter
        if (ignoreResponse)
          callback({});
    });
  }).bind(this);

  // finish setting up the frame to be transmitted
  frameTx.id = frameTx.id || xbeeAPI.nextFrameId();

  // clear up: remove listener after the timeout and a bit, it's no longer needed
  setTimeout(function() {
    if (isListenerActive)
      xbeeAPI.removeListener('frame_object', callback);
  }, maxWait + 1000);

  // attach callback so we're waiting for the response
  xbeeAPI.on('frame_object', callback);

  // connect to serial port
  if (this.serialport.isOpen()) {

    writeSerialport();

  } else {
    this.serialport.open(function (err) {
      // TODO: Change logs for Errors
      if (err !== null)
        console.log('Port could not be opened:', err);
      else
        writeSerialport();
    });
  }

  // return our promise with a timeout
  return deferred.promise.timeout(maxWait);

};

// TODO: Pass to frame library??
// helper function to determine
function areLinked (request, response) {
  // check frame types
  switch (request.type) {

    case C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME:
      if (response.type !== C.FRAME_TYPE.ZIGBEE_EXPLICIT_RX)
        return false;
      break;

    default:
      return false;
      break;
  }

  // check net address
  if (request.destination16 !== response.remote16)
    return false;

  // check profile id
  if (request.profileId !== response.profileId)
    return false;

  // check cluster id
  // first 8 character for ZDP
  if (isZDP(response) && request.clusterId.replace(/^0/, '8') !== response.clusterId)
    return false;
  else if (isZCL(response) && request.clusterId !== response.clusterId)
    return false;

  // check transaction sequence
  // first byte for ZDP
  // second byte for ZCL (non manufacturer specific)
  if (isZDP(response) && parseInt(request.data[0]) !== response.data.readInt8(0))
    return false
  else if (isZCL(response) && parseInt(request.data[1]) !== response.data.readInt8(1))
    return false;

  return true;
};

function isZDP(frame) {
  return parseInt(frame.profileId, 16) === 0;
}

function isZCL(frame) {
  return !isZDP(frame);
}


module.exports.SerialInterface = SerialInterface;
module.exports.tools = {
  areLinked: areLinked
}
