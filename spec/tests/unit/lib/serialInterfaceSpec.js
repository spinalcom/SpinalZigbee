const frames = require('../../../helpers/sample-frames'),
      proxyquire =  require('proxyquire'),
      mockSerialport = require('../../../helpers/vendor/mock-serialport'),
      serialinterface = proxyquire('../../../../lib/serial-interface', {
        'serialport': mockSerialport
      });

const defaults = {
  portPath: '/dev/ttyUSB0',
  portBaudrate: 115200
}

describe('UT: Serial Interface library', function() {

  var SerialInterface;

  beforeAll(function () {
    SerialInterface = serialinterface.SerialInterface;
  });

  describe('object instantiation,', function() {

    /* TDD */

    it('should call the SerialPort with the respective parameters when specific port path /dev/ttyUSB2 and baudrate 9600 are passed as object in constructor', function() {
      // serial port gets opened with default params
      var serial = new SerialInterface({
        portPath: '/dev/ttyUSB2',
        portBaudrate: 9600
      });

      expect(mockSerialport.SerialPort).toHaveBeenCalledWith('/dev/ttyUSB2', { baudrate: 9600, parser: jasmine.any(Function) }, false);
    });

    it('should call the SerialPort with the default parameters when no arguments are passed in constructor', function() {
      // serial port gets opened with default params
      var serial = new SerialInterface();

      expect(mockSerialport.SerialPort).toHaveBeenCalledWith(defaults.portPath, { baudrate: defaults.portBaudrate, parser: jasmine.any(Function) }, false);
    });

  });

  describe('response and request frame matching,', function () {

    var serial, tools, request, response;

    beforeAll(function() {
      serial = new SerialInterface();
      serialTools = serialinterface.tools;

      // sample request      
      request = frames.networkList[NET_ID]['Management_LQI'].request();

      // sample response
      response = frames.networkList[NET_ID]['Management_LQI'].response();
    });

    /* TDD */

    it('should return false if types don\'t match when type is 146 and expected 145', function () {
      // clone object and change type
      var customResponse = JSON.parse(JSON.stringify(response));
      customResponse.type = 146;

      expect(serialTools.areLinked(request, customResponse)).toBeFalsy();
    });

    it('should return false if net address don\'t match when address is 17CB and expected 0000', function () {
      // clone object and change net address
      var customResponse = JSON.parse(JSON.stringify(response));
      customResponse.remote16 = '17CB';

      expect(serialTools.areLinked(request, customResponse)).toBeFalsy();
    });

    it('should return false if profiles don\'t match when profile is 1 and expected 0', function () {
      // clone object and change profile
      var customResponse = JSON.parse(JSON.stringify(response));
      customResponse.profileId = 1;

      expect(serialTools.areLinked(request, customResponse)).toBeFalsy();
    });

    it('should return false if clusters don\'t match when clusted is 8032 and expected 8031', function () {
      // clone object and change cluster
      var customResponse = JSON.parse(JSON.stringify(response));
      customResponse.clusterId = '8032';

      expect(serialTools.areLinked(request, customResponse)).toBeFalsy();
    });

    it('should return false if transaction sequences don\'t match when sequence is 02 and expected 01', function () {
      // clone object and change transaction sequence
      // WARNING: cloning the object using the JSON method overwrites the Buffer obejct
      var customResponse = JSON.parse(JSON.stringify(response));
      customResponse.data = Buffer.from('020001000160a79f1b13acf53bb4750200007a1300cb17120001ff','hex');

      expect(serialTools.areLinked(request, customResponse)).toBeFalsy();
    });

    it('should return true if type, net address, profile, cluster and transaction sequence are correct for an LQI req/res sample', function () {
      // serial port gets opened with default params
      expect(serialTools.areLinked(request, response)).toBeTruthy();
    });

  });

});
