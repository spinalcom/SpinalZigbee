// This scenario is to test Warning alarms

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

  deviceInfo.ignoreResponse = true;

  zapi.read(deviceInfo).then(function (response) {

    console.log('Alarm fired:');
    console.log(response);

    setTimeout(function () {

      readDevice(deviceInfo);

    }, 1000);

  });

}
