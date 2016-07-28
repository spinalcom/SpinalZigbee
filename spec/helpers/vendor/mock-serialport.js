const sampleFrames = require('../sample-frames'),
      SerialPort = jasmine.createSpy('MockSerialPort');

/* Stubs */

SerialPort.prototype.write = function (frameTxBuffer, callback) {
  // get parser function from last call
  var lastContext = SerialPort.calls.mostRecent();
  var bufferParser = lastContext.args[1].parser;

  var frameRxBuffer = _getResponseFrame(frameTxBuffer);

  if (frameRxBuffer !== null)
    bufferParser(lastContext, frameRxBuffer);
  // else throw error

  callback(null, {});
};

SerialPort.prototype.on = function (event, callback) {
  // let's pretend the port is always open
  if (event == 'open')
    callback();
};

SerialPort.prototype.isOpen = function (callback) {
  // let's pretend the port is always open
  return true;
};

SerialPort.prototype.close = function () {
  return true;
}

/* Mock functionality */

function _getResponseFrame (frameTxBuffer) {

  var sampleFrameRxBuffer = _frameSearch(frameTxBuffer);

  if (sampleFrameRxBuffer !== null)
    return Buffer.from(sampleFrameRxBuffer, 'hex');

  return null
}

function _frameSearch(frameBuffer) {

  var frameString = frameBuffer.toString('hex');

  var frameSamples = _getSampleFrames();

  for (var frameId in frameSamples) {
    frameSampleStr = frameSamples[frameId].request('raw').replace(/ /g, '');
    if (_frameMatch(frameString, frameSampleStr))
      return frameSamples[frameId].response('raw').replace(/ /g, '');
  }

  return null;
}

function _getSampleFrames() {

  var frames = [];
  var networkFrames = sampleFrames.networkList[NET_ID];

  // push network frames
  var networkFramesIds = Object.getOwnPropertyNames(networkFrames);
  for (var frameId in networkFramesIds) {
    var sampleFrameName = networkFramesIds[frameId];
    if (sampleFrameName !== 'devices') {
      var sampleFrame = networkFrames[sampleFrameName];
      frames.push(sampleFrame);
    }
  }

  // push network devices frames
  for (var deviceId in networkFrames.devices) {
    for (var frameId in networkFrames.devices[deviceId]) {
      var sampleFrame = networkFrames.devices[deviceId][frameId];
      frames.push(sampleFrame);
    }
  }

  return frames;
}

function _frameMatch(frame, frameToMatch) {

  var profileAndCluster = frameToMatch.slice(34,42);
  var networkAddress = frameToMatch.slice(26,30);

  var regex = new RegExp('7E[0-9a-z]{24}' + networkAddress + '[0-9a-z]{4}' + profileAndCluster + '[0-9a-z]{2,}', 'i');

  return frame.match(regex) !== null;
}

module.exports.SerialPort = SerialPort;
