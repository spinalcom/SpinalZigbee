const C = require('xbee-api').constants;

var frame = {};

// Management LQI (Neighbor Table) Request
frame['Management_LQI'] = {

  request: function (options) {

    var startIndex = typeof options === 'undefined' || typeof options.startIndex === 'undefined' ? '00' : options.startIndex.toString(16);

    var networkAddressStr = options.networkAddress;
    var ieeeAddressStr = options.ieeeAddress;

    var frame = {
      type: C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME,
      destination64: ieeeAddressStr,
      destination16: networkAddressStr,
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0031', // 0x0031 = Management LQI
      profileId: '0000', // ZDP
      data: [ '01', startIndex ]
    }

    return frame;
  }
}

// Management Rtg (Routing Table) Request
frame['Management_Rtg'] = {

  request: function () {
    var frame = {
      type: C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME,
      destination64: '0000000000000000', // coordinator,
      destination16: '0000', // coordinator
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0032', // 0x0031 = Management LQI
      profileId: '0000', // ZDP
      data: [ '01', '00' ]
    }

    return frame;
  }
}

// Active Endpoints Request
frame['Active_Endpoints'] = {

  request: function (options) {

    // TODO: Check for errors (no netaddress passed)
    // TODO: debug why ieee address is necessary (isn't sufficient with unknown?)
    var networkAddressStr = options.networkAddress;
    var ieeeAddressStr = options.ieeeAddress;
    var dataBytes = ['0x01'].concat(options.networkAddress.split(/(..)/).reverse().join('').replace(/(..)/g,'0x$1').split(/(....)/).filter(Boolean));

    var frame = {
      type: C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME,
      destination16: networkAddressStr,
      destination64: ieeeAddressStr,
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0005', // 0x0005 = Active Endpoints
      profileId: '0000', // ZDP
      data: dataBytes
    };

    return frame;
  }
}

// Simple Descriptor Request
frame['Simple_Descriptor'] = {

  request: function (options) {

    // TODO: Check for errors (no netaddress passed)
    var networkAddressStr = options.networkAddress;
    var ieeeAddressStr = options.ieeeAddress;
    var dataBytes = ['0x01'].concat(options.networkAddress.replace(/(..)/g,'0x$1').split(/(....)/).reverse().filter(Boolean));

    dataBytes.push(options.endpoint);

    var frame = {
      type: C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME,
      destination16: networkAddressStr,
      destination64: ieeeAddressStr,
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0004', // 0x0005 = Active Endpoints
      profileId: '0000', // ZDP
      data: dataBytes
    }

    return frame;
  }

}

// Attribute Illuminance Read
frame['Read_Attribute_Illuminance'] = {

  request: function (options) {

    // TODO: Check for errors (no netaddress passed)
    var networkAddressStr = options.networkAddress;
    var ieeeAddressStr = options.ieeeAddress;

    var frame = {
      type: C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME,
      destination16: networkAddressStr,
      destination64: ieeeAddressStr,
      sourceEndpoint: '00',
      destinationEndpoint: options.endpoint,
      clusterId: '0400',
      profileId: '0104',
      data: [ '0x00', '0x01', '0x00', '0x00', '0x00' ]
    }

    return frame;
  }

}

// Start Warning Command
frame['Start_Warning'] = {

  request: function (options) {

    // TODO: Check for errors (no netaddress passed)
    var networkAddressStr = options.networkAddress;
    var ieeeAddressStr = options.ieeeAddress;

    var timerBytes = typeof options.timer === 'undefined' ? [ '0x01', '0x00' ] : options.timer.toString(16).replace(/((.){1,2})/g,'0x$1').split(/(0x..?)/).filter(Boolean).reverse();

    if (timerBytes.length === 1) timerBytes.push('0x0');
    else if (timerBytes.length > 2) timerBytes = timerBytes.slice(0, 2);

    var headerBytes = [ '0x01', '0x01', '0x00' ];
    var alarmTypeBytes = [ '0x11' ];

    var frame = {
      type: C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME,
      destination16: networkAddressStr,
      destination64: ieeeAddressStr,
      sourceEndpoint: '00',
      destinationEndpoint: options.endpoint,
      clusterId: '0502',
      profileId: '0104',
      data: headerBytes.concat(alarmTypeBytes, timerBytes)
    };

    return frame;
  }

}


frame['Base_Command'] = {

  request: function (options) {

    var frame = {
      type: C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME,
      destination64: options.ieeeAddress,
      destination16: options.networkAddress,
      destinationEndpoint: options.endpoint,
      sourceEndpoint: '00',
      clusterId: options.clusterId,
      profileId: options.profileId,
      data: options.data
    };

    return frame;
  }

}



module.exports = frame;
