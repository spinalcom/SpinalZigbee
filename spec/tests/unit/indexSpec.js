const proxyquire =  require('proxyquire'),
      mockSerialInterface = require('../../helpers/mock-serial-interface'),
      ZApi = proxyquire('../../../index', {
        './lib/serial-interface': mockSerialInterface
      });

describe('UT: ZigBee high-level usage library', function() {

  describe('object instantiation', function() {

    /* TDD */

    it('should call the SerialInterface without parameters when no args are passed in constructor', function() {
      var zapi = new ZApi();

      expect(mockSerialInterface.SerialInterface).toHaveBeenCalledWith({});
    });

    it('should call the SerialInterface with the respective parameters when specific port path /dev/ttyUSB1 is passed as 1st argument in constructor', function() {
      var zapi = new ZApi('/dev/ttyUSB1');
      // args object has custom path
      expect(mockSerialInterface.SerialInterface).toHaveBeenCalledWith({ portPath: '/dev/ttyUSB1' });
    });

    it('should call the SerialInterface with the respective parameters when specific port path /dev/ttyUSB2 and baudrate 9600 are passed as 1st and 2nd argument in constructor', function() {
      var zapi = new ZApi('/dev/ttyUSB2', 9600);
      // args object has custom path and baudrate
      expect(mockSerialInterface.SerialInterface).toHaveBeenCalledWith({ portPath: '/dev/ttyUSB2', portBaudrate: 9600 });
    });

    it('should call the SerialInterface with the respective parameters when specific port path /dev/ttyUSB3 and baudrate 57600 are passed as object in constructor', function() {
      var zapi = new ZApi({
        portPath: '/dev/ttyUSB3',
        portBaudrate: 57600
      });
      // args object has custom path and baudrate
      expect(mockSerialInterface.SerialInterface).toHaveBeenCalledWith({ portPath: '/dev/ttyUSB3', portBaudrate: 57600 });
    });

  });

});
