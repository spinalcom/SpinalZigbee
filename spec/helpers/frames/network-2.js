/* Two Netvox light sensors Z311G in the network */
const lightSensor1Frames = require('./light-sensor-1'),
      lightSensor2Frames = require('./light-sensor-2');

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
   * 7E 00 2D 91 00 13 A2 00 40 A3 15 7B 00 00 00 00 80 31 00 00 01 01 00 01 00 01 60 A7 9F 1B 13 AC F5 3B B4 75 02 00 00 7A 13 00 CB 17 12 00 01 FF 35
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
   * RF data: 01 00 01 00 01 60 A7 9F 1B 13 AC F5 3B B4 75 02 00 00 7A 13 00 CB 17 12 00 01 FF
   * Checksum: 35
   *
   **/

  response: function (format) {

    var raw = '7E 00 43 91 00 13 A2 00 40 A3 15 7B 00 00 00 00 80 31 00 00 01 01 00 02 00 02 60 A7 9F 1B 13 AC F5 3B ED 75 02 00 00 7A 13 00 38 59 12 00 01 FF 60 A7 9F 1B 13 AC F5 3B B4 75 02 00 00 7A 13 00 CB 17 12 00 01 FF EF';

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
      data: Buffer.from('010001000160a79f1b13acf53bb4750200007a1300cb17120001ff','hex')
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  }

    

};

frame.devices = [ lightSensor1Frames, lightSensor2Frames ]

module.exports = frame;
