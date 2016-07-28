var frame = {};

frame['Active_Endpoints'] = {

  /*
   * Active Endpoints Request 0x0005
   *
   * Explicit Addressing Command Frame (API 1)
   *
   * 7E 00 17 11 02 00 00 00 00 00 00 FF FF 38 0C 00 00 00 05 00 00 00 00 01 0C 38 60
   *
   * Start delimiter: 7E
   * Length: 00 17 (23)
   * Frame type: 11 (Explicit Addressing Command Frame)
   * Frame ID: 02 (2)
   * 64-bit dest. address: 00 00 00 00 00 00 FF FF
   * 16-bit dest. address: 38 0C
   * Source endpoint: 00
   * Dest. endpoint: 00
   * Cluster ID: 00 05
   * Profile ID: 00 00
   * Broadcast radius: 00 (0)
   * Transmit options: 00
   * RF data: 01 0C 38
   * Checksum: 60
   *
   **/

  request: function (format) {

    var raw = '7E 00 17 11 02 00 00 00 00 00 00 FF FF 38 0C 00 00 00 05 00 00 00 00 01 0C 38 60';

    var structured = {
      type: 17,
      destination16: '380C',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0005',
      profileId: '0000',
      data: [ '0x01', '0x0C', '0x38' ]
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  },

  /*
   * Active Endpoints Response 0x8005
   *
   * Explicit RX Indicator (API 1)
   *
   * 7E 00 18 91 00 13 7A 00 00 02 76 7C 38 0C 00 00 80 05 00 00 01 01 00 0C 38 01 01 DC
   *
   * Start delimiter: 7E
   * Length: 00 18 (24)
   * Frame type: 91 (Explicit RX Indicator)
   * 64-bit source address: 00 13 7A 00 00 02 76 7C
   * 16-bit source address: 38 0C
   * Source endpoint: 00
   * Destination endpoint: 00
   * Cluster ID: 80 05
   * Profile ID: 00 00
   * Receive options: 01
   * RF data: 01 00 0C 38 01 01
   * Checksum: DC
   *
   **/

  response: function (format) {

    var raw = '7E 00 18 91 00 13 7A 00 00 02 76 7C 38 0C 00 00 80 05 00 00 01 01 00 0C 38 01 01 DC';

    var structured = {
      type: 145,
      remote64: '00137a00000275b4',
      remote16: '380C',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '8005',
      profileId: '0000',
      receiveOptions: 01,
      data: Buffer.from('01000C380101','hex')
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  }

};


frame['Simple_Descriptor'] = {

  /*
   * Simple Descriptor Request 0x0004
   *
   * Explicit Addressing Command Frame (API 1)
   *
   * 7E 00 18 11 03 00 00 00 00 00 00 FF FF 38 0C 00 00 00 04 00 00 00 00 01 0C 38 01 5F
   *
   * Start delimiter: 7E
   * Length: 00 18 (24)
   * Frame type: 11 (Explicit Addressing Command Frame)
   * Frame ID: 03 (3)
   * 64-bit dest. address: 00 00 00 00 00 00 FF FF
   * 16-bit dest. address: 38 0C
   * Source endpoint: 00
   * Dest. endpoint: 00
   * Cluster ID: 00 04
   * Profile ID: 00 00
   * Broadcast radius: 00 (0)
   * Transmit options: 00
   * RF data: 01 0C 38 01
   * Checksum: 5F
   *
   **/

  request: function (format) {

    var raw = '7E 00 18 11 03 00 00 00 00 00 00 FF FF 38 0C 00 00 00 04 00 00 00 00 01 0C 38 01 5F';

    var structured = {
      type: 17,
      destination16: '380C',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0004',
      profileId: '0000',
      data: [ '0x01', '0x0C', '0x38', '0x01' ]
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  },

  /*
   * Simple Descriptor Response 0x8004
   *
   * Explicit RX Indicator (API 1)
   *
   * 7E 00 2D 91 00 13 7A 00 00 02 76 7C 38 0C 00 00 80 04 00 00 01 01 00 0C 38 16 01 04 01 03 04 00 07 00 00 01 00 03 00 15 00 00 05 02 05 05 0B 00 80
   *
   * Start delimiter: 7E
   * Length: 00 2D (45)
   * Frame type: 91 (Explicit RX Indicator)
   * 64-bit source address: 00 13 7A 00 00 02 76 7C
   * 16-bit source address: 38 0C
   * Source endpoint: 00
   * Destination endpoint: 00
   * Cluster ID: 80 04
   * Profile ID: 00 00
   * Receive options: 01
   * RF data: 01 00 0C 38 16 01 04 01 03 04 00 07 00 00 01 00 03 00 15 00 00 05 02 05 05 0B 00
   * Checksum: 80
   *
   **/

  response: function (format) {

    var raw = '7E 00 2D 91 00 13 7A 00 00 02 76 7C 38 0C 00 00 80 04 00 00 01 01 00 0C 38 16 01 04 01 03 04 00 07 00 00 01 00 03 00 15 00 00 05 02 05 05 0B 00 80';

    var structured = {
      type: 145,
      remote64: '00137a00000275b4',
      remote16: '380C',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '8004',
      profileId: '0000',
      receiveOptions: 01,
      data: Buffer.from('01000C381601040103040007000001000300150000050205050B00','hex')
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  }

};



frame['Start_Warning'] = {

  /*
   * Read Attribute Request
   *
   * Explicit Addressing Command Frame (API 1)
   *
   * 7E 00 1A 11 01 00 00 00 00 00 00 FF FF 38 0C 00 01 05 02 01 04 00 00 01 01 00 11 02 00 89
   *
   * Start delimiter: 7E
   * Length: 00 1A (26)
   * Frame type: 11 (Explicit Addressing Command Frame)
   * Frame ID: 01 (1)
   * 64-bit dest. address: 00 00 00 00 00 00 FF FF
   * 16-bit dest. address: 38 0C
   * Source endpoint: 00
   * Dest. endpoint: 01
   * Cluster ID: 05 02
   * Profile ID: 01 04
   * Broadcast radius: 00 (0)
   * Transmit options: 00
   * RF data: 01 01 00 11 02 00
   * Checksum: 89
   *
   **/

  request: function (format) {

    var raw = '7E 00 1A 11 01 00 00 00 00 00 00 FF FF 38 0C 00 01 05 02 01 04 00 00 01 01 00 11 02 00 89';

    var structured = {
      type: 17,
      destination16: '380C',
      sourceEndpoint: '00',
      destinationEndpoint: '01',
      clusterId: '0502',
      profileId: '0104',
      data: [ '0x01', '0x01', '0x00', '0x11', '0x02', '0x00' ]
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  },

  response: function (format) {

    var raw = '';

    var structured = {};

    if (format === 'raw')
      return raw;
    else
      return structured;
  }

};

module.exports = frame;
