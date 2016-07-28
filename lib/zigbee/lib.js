const Q = require('q'),      
      frame = require('./frames');

var scanNetwork = function(params, thingsFound, thingsRequested) {

  // TODO: check for params
  var serial = params.serial;

  // first call
  if (typeof thingsRequested === 'undefined') {

    var coordinator = {
      ieeeAddress: "0000000000000000",
      networkAddress: "0000",
      type: 0,
      siblings: [],
      children: []
    };

    thingsRequested = [ coordinator ];

    thingsFound = [ coordinator ];
  }

  return Q.all(thingsRequested.map(function (thing) {
    // request
    var thingInfo = {
      ieeeAddress: thing.ieeeAddress,
      networkAddress: thing.networkAddress,
    };
    // TODO: pass the whole thing

    return _requestNeighboursTable(serial, thingInfo);

  }.bind(this))).then(function (thingsNeighbours) {

    var thingsToRequest = [];

    // TODO: responses is a collection of things with its respective neighbours already
    // classified in siblings and children, so we iterate only in siblings

    thingsNeighbours.forEach(function (neighbours, index) {

      // add new thing found to thingsFound
      neighbours.siblings.forEach(function (neighbour) {

        // add thing if it's not listed and it's not coordinator (may be repeated because of default ieeeAddress)

        isNew = thingsFound.every(function (thing) {
          return thing.ieeeAddress != neighbour.ieeeAddress && thing.networkAddress != neighbour.networkAddress;
        });

        isCoordinator = neighbour.ieeeAddress == "0000000000000000" || neighbour.networkAddress == "0000";

        if (!isCoordinator && isNew) {
          thingsFound.push(neighbour);

          thingsRequested[index].siblings.push(neighbour);

          if (neighbour.type == 0 || neighbour.type == 1)
            thingsToRequest.push(neighbour);
        }

      });

      thingsRequested[index].children = neighbours.children;

    });

    if (thingsToRequest.length > 0)
      return scanNetwork(params, thingsFound, thingsToRequest);
    else
      return thingsFound;

  }).then(function (moreThings) {

    moreThings.forEach(function (thing) {

      isNewThing = thingsFound.every(function (oldThing) {
        return thing.ieeeAddress != oldThing.ieeeAddress && thing.networkAddress != oldThing.networkAddress;
      });

      if (isNewThing) 
        thingsFound.push(thing);

    });

    return thingsFound;

  })
  .catch(function (error) {
    console.log('Error on scanning function:', error);
  });

}

var requestActiveEndpoints = function (params) {

  var thing = params.thing;
  var serial = params.serial;

  var frameTx = frame['Active_Endpoints'].request({
    ieeeAddress: thing.ieeeAddress,
    networkAddress: thing.networkAddress
  });

  return serial.sendFrame(frameTx)
    .then(function (frameRx) {

      return {
        thing: thing,
        frameRx: frameRx,
        serial: serial
      }
    });
}

var requestSimpleDescriptor = function (params) {

  var thing = params.thing;
  var frameRx = params.frameRx;
  var serial = params.serial;

  // save frame to send
  var frameTx = frame['Simple_Descriptor'].request({
    ieeeAddress: frameRx.remote64,
    networkAddress: frameRx.remote16,
    endpoint: frameRx.data.readInt8(5)
  });

  return serial.sendFrame(frameTx)
    .then(function (frameRx) {

      return {
        thing: thing,
        frameRx: frameRx
      }
    });
}

var parseEndpoints = function (params) {

  var thing = params.thing;
  var frameRx = params.frameRx;

  var totalClusters = frameRx.data.readUInt8(11);
  var clusters = [];
  var clusterListOffset = 12;

  while (totalClusters--) {
    clusters.push(frameRx.data.toString('hex', clusterListOffset, clusterListOffset + 2).split(/(..)/).reverse().join(""));
    clusterListOffset += 2;
  }

  thing.endpoints = [
    {
      value: frameRx.data.toString('hex', 5, 6),
      profileId: frameRx.data.toString('hex', 6, 8).split(/(..)/).reverse().join(""),
      deviceId: frameRx.data.toString('hex', 8, 10).split(/(..)/).reverse().join(""),
      clusterList: clusters
    }
  ];

  return { thing: thing };
}

function _requestNeighboursTable (serial, options) {

  var neighbours = {
    children: [],
    siblings: []
  };

  var defaultOptions = {
    startIndex: 0
  };

  options = options || defaultOptions;
  options.startIndex = options.startIndex || defaultOptions.startIndex;

  var areNewNeighbours = false;

  // create frame "Management LQI (Neighbor Table) Request"
  var frameTx = frame['Management_LQI'].request(options);

  return serial.sendFrame(frameTx).then(function (frameRx) {
    // TODO: check status and iterate
    // TODO: do a function that returns the correct string when reading in LE

    var totalNeighbours = frameRx.data.readUInt8(2);
    var totalInResponse = i = frameRx.data.readUInt8(4);
    var startIndex = frameRx.data.readUInt8(3);

    var offset = 5;

    while (i--) {

      var ieeeAddress = frameRx.data.toString('hex', offset + 8, offset + 16).split(/(..)/).reverse().join("");
      var networkAddress = frameRx.data.toString('hex', offset + 16, offset + 18).split(/(..)/).reverse().join("");
      var otherOptions = frameRx.data.readUInt8(offset + 18);

      var neighbourType = _getNeighbourType(otherOptions);
      var relationship = _getRelationship(otherOptions);

      var neighbour = {
        ieeeAddress: ieeeAddress,
        networkAddress: networkAddress,
        type: neighbourType,
        // TODO: remove from here and add in relationship conditional
        siblings: [],
        children: []
      }

      if (relationship === 2)
        neighbours.siblings.push(neighbour);
      else if (relationship === 1) {
        neighbour.parent = options.ieeeAddress;
        neighbours.children.push(neighbour);
      }

      offset += 22;
    }

    if (totalNeighbours > (startIndex + totalInResponse)) {

      areNewNeighbours = true;

      var nextIndex = startIndex + totalInResponse;
      options.startIndex = nextIndex;
      return _requestNeighboursTable(serial, options);

    }

  }).then(function (moreNeighbours) {

    // check if moreNeigbours has new neighbours and store them
/*
    moreNeighbours.forEach(function (neighbour) {

      isNewNeighbour = neighbours.every(function (oldNeighbour) {
        return neighbour.ieeeAddress != oldNeighbour.ieeeAddress && neighbour.networkAddress != oldNeighbour.networkAddress;
      });

      if (isNewNeighbour) 
        neighbours.push(neighbour);

    });
*/

    if (areNewNeighbours) {
      neighbours.siblings = neighbours.siblings.concat(moreNeighbours.siblings);
      neighbours.children = neighbours.children.concat(moreNeighbours.children);
    }

    return neighbours;

  }).catch(function (error) {
    console.log('ZigBee frame could no be sent:', error);
  });

}

function _getRelationship(rawBits) {
  var mask = 14;
  var rightSifts = 1;

  return ((rawBits & mask) >> rightSifts);
}

function _getNeighbourType(rawBits) {
  var mask = 3;
  var rightSifts = 192;

  return ((rawBits & mask) >> rightSifts);
}

module.exports.scanNetwork = scanNetwork;
module.exports.requestActiveEndpoints = requestActiveEndpoints;
module.exports.requestSimpleDescriptor = requestSimpleDescriptor;
module.exports.parseEndpoints = parseEndpoints;
