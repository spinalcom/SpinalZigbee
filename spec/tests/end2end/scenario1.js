// This scenario is to test Light sensors

const ZApi = require('../../../index');

zapi = new ZApi('/dev/ttyUSB0');

zapi.discover().then(function (deviceList) {

  deviceList.forEach(function (device) {

    readDevice({
      ieeeAddress: device.ieeeAddress,
      networkAddress: device.networkAddress,
      endpoint: device.endpoints[0]
    });

  });

});

function readDevice(deviceInfo) {

  zapi.read(deviceInfo).then(function (response) {

    console.log('Light sensor value:');
    console.log(response);

    setTimeout(function () {

      readDevice(deviceInfo);

    }, 1000);

  });

}
