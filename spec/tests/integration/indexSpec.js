const proxyquire =  require('proxyquire'),
      mockSerialport = require('../../helpers/vendor/mock-serialport'),
      serialinterface = proxyquire('../../../lib/serial-interface', {
        'serialport': mockSerialport
      }),
      ZApi = proxyquire('../../../index', {
        './lib/serial-interface': serialinterface
      });

describe('IT: ZigBee high-level usage library', function() {

  describe('devices discovery,', function() {

    var zapi;

    beforeAll(function() {
      zapi = new ZApi();
    });

    /* TDD */

    it('should return a list by default', function(done) {
      var test_callback = function (response) {
        // is array
        expect(response.totalThings).toEqual(jasmine.any(Number));
        done();
      };
      // discover devices with callback
      zapi.discover().then(test_callback);
    });

    /* BDD */

    describe('when there is only one Netvox light sensor Z311G in the network,', function() {

      beforeAll(function () {
        NET_ID = 0;
      });

      it('should return a list with 1 element', function(done) {
        var testCallback = function (response) {
          // is array with 1 element
          expect(response.totalThings).toEqual(1);
          done();
        };
        // discover devices with callback
        zapi.discover().then(testCallback);
      });

      it('should return a first element with 16bit and 64bit net address, and device id = 0106 in one endpoint', function(done) {
        var testHandler = function (thing, zapi) {
          // 16 bit address in hex
          expect(thing.networkAddress.length).toEqual(4);
          // 64 bit address in hex
          expect(thing.ieeeAddress.length).toEqual(16);
          // only one endpoint
          expect(thing.endpoints.length).toEqual(1);
          // active endpoint is 01
          expect(thing.endpoints[0].value).toEqual('01');
          // profile id of active endpoint is 0104 (Home Profile)
          expect(thing.endpoints[0].profileId).toEqual('0104');
          // device id of active endpoint is 0106 (Light Sensor)
          expect(thing.endpoints[0].deviceId).toEqual('0106');

          zapi.removeListener('thing_discovered', testHandler);
          done();
        };

        zapi.on('thing_discovered', testHandler);

        // discover devices with callback
        zapi.discover();
      });

    });

    describe('when there are two Netvox light sensor Z311G in the network,', function() {

      beforeAll(function () {
        NET_ID = 1;
      });

      it('should return a list with 2 elements', function(done) {
        var testCallback = function (response) {
          // is array with 1 element
          expect(response.totalThings).toEqual(2);
          done();
        };
        // discover devices with callback
        zapi.discover().then(testCallback);
      });

      it('should return two elements with 16bit and 64bit net address, and device id = 0106 in one endpoint', function(done) {
        var total = 0;

        var testHandler = function (thing, zapi) {
          total++;

          // 16 bit address in hex
          expect(thing.networkAddress.length).toEqual(4);
          // 64 bit address in hex
          expect(thing.ieeeAddress.length).toEqual(16);
          // only one endpoint
          expect(thing.endpoints.length).toEqual(1);
          // active endpoint is 01
          expect(thing.endpoints[0].value).toEqual('01');
          // profile id of active endpoint is 0104 (Home Profile)
          expect(thing.endpoints[0].profileId).toEqual('0104');
          // device id of active endpoint is 0106 (Light Sensor)
          expect(thing.endpoints[0].deviceId).toEqual('0106');

          if (total == 2) {
            zapi.removeListener('thing_discovered', testHandler);
            done();
          }
        };

        zapi.on('thing_discovered', testHandler);
        // discover devices with callback
        zapi.discover();
      });

      afterAll(function () {
        NET_ID = 0;
      });

    });

  });

});
