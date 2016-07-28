/* One Warning Device Z602A in the network */
const warningDeviceFrames = require('./warning-device-1');

var frame = {};

frame['Management_LQI'] = {

  /*
   * Management LQI Request 0x0031
   *
   * Explicit Addressing Command Frame (API 1)
   * 
   * 7E 00 16 11 02 00 00 00 00 00 00 00 00 00 00 00 00 00 31 00 00 00 00 01 00 BF
   * 
   * Start delimiter: 7E
   * Length: 00 16 (22)
   * Frame type: 11 (Explicit Addressing Command Frame)
   * Frame ID: 02 (2)
   * 64-bit dest. address: 00 00 00 00 00 00 00 00
   * 16-bit dest. address: 00 00
   * Source endpoint: 00
   * Dest. endpoint: 00
   * Cluster ID: 00 31
   * Profile ID: 00 00
   * Broadcast radius: 00 (0)
   * Transmit options: 00
   * RF data: 01 00
   * Checksum: BF
   *
   **/

  request: function (format) {

    var raw = '7E 00 16 11 02 00 00 00 00 00 00 00 00 00 00 00 00 00 31 00 00 00 00 01 00 BA';

    var structured = {
      type: 17,
      destination64: '0000000000000000', // coordinator,
      destination16: '0000', // coordinator
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0031', // 0x0031 = Management LQI
      profileId: '0000', // ZDP
      data: [ '0x01', '0x00' ]
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  },

  /*
   * Management LQI Response 0x8031
   *
   * Explicit RX Indicator (API 1)
   *
   * 7E 00 2D 91 00 13 A2 00 40 A3 15 7B 00 00 00 00 80 31 00 00 01 01 00 01 00 01 5A 2A 14 FA 5F 17 50 20 7C 76 02 00 00 7A 13 00 0C 38 35 02 0F FF 0F
   *
   * Start delimiter: 7E
   * Length: 00 2D (45)
   * Frame type: 91 (Explicit RX Indicator)
   * 64-bit source address: 00 13 A2 00 40 A3 15 7B
   * 16-bit source address: 00 00
   * Source endpoint: 00
   * Destination endpoint: 00
   * Cluster ID: 80 31
   * Profile ID: 00 00
   * Receive options: 01
   * RF data: 01 00 01 00 01 5A 2A 14 FA 5F 17 50 20 7C 76 02 00 00 7A 13 00 0C 38 35 02 0F FF
   * Checksum: 0F
   *
   **/

  response: function (format) {

    var raw = '7E 00 2D 91 00 13 A2 00 40 A3 15 7B 00 00 00 00 80 31 00 00 01 01 00 01 00 01 5A 2A 14 FA 5F 17 50 20 7C 76 02 00 00 7A 13 00 0C 38 35 02 0F FF 0F';

    // TODO: OLD structure
    var structured = {
      type: 145,
      remote64: '0013a20040a3157b',
      remote16: '0000',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '8031',
      profileId: '0000',
      receiveOptions: 1,
      data: Buffer.from('01000100015A2A14FA5F1750207C760200007A13000C3835020FFF','hex')
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  }

    

};

frame.devices = [ warningDeviceFrames ]

module.exports = frame;
