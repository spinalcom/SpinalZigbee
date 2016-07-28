const SerialInterface = jasmine.createSpy('MockSerialInterface');

SerialInterface.prototype.sendFrame = function (frameTx) {
  // do nothing for the moment
  return true;
}

module.exports = { SerialInterface: SerialInterface };
