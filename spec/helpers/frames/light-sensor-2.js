var frame = {};

frame['Active_Endpoints'] = {

  /*
   * Active Endpoints Request 0x0005
   *
   * Explicit Addressing Command Frame (API 1)
   *
   * 7E 00 17 11 02 00 00 00 00 00 00 FF FF 59 38 00 00 00 05 00 00 00 00 01 38 59 C6
   *
   * Start delimiter: 7E
   * Length: 00 17 (23)
   * Frame type: 11 (Explicit Addressing Command Frame)
   * Frame ID: 02 (2)
   * 64-bit dest. address: 00 00 00 00 00 00 FF FF
   * 16-bit dest. address: 59 38
   * Source endpoint: 00
   * Dest. endpoint: 00
   * Cluster ID: 00 05
   * Profile ID: 00 00
   * Broadcast radius: 00 (0)
   * Transmit options: 00
   * RF data: 01 38 59
   * Checksum: C6
   *
   **/

  request: function (format) {

    var raw = '7E 00 17 11 02 00 00 00 00 00 00 FF FF 59 38 00 00 00 05 00 00 00 00 01 38 59 C6';

    var structured = {
      type: 17,
      destination16: '5938',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0005',
      profileId: '0000',
      data: [ '0x01', '0x38', '0x59' ]
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
   * 7E 00 18 91 00 13 7A 00 00 02 75 ED 59 38 00 00 80 05 00 00 41 01 00 38 59 01 01 92
   *
   * Start delimiter: 7E
   * Length: 00 18 (24)
   * Frame type: 91 (Explicit RX Indicator)
   * 64-bit source address: 00 13 7A 00 00 02 75 ED
   * 16-bit source address: 59 38
   * Source endpoint: 00
   * Destination endpoint: 00
   * Cluster ID: 80 05
   * Profile ID: 00 00
   * Receive options: 41
   * RF data: 01 00 38 59 01 01
   * Checksum: 92
   *
   **/

  response: function (format) {

    var raw = '7E 00 18 91 00 13 7A 00 00 02 75 ED 59 38 00 00 80 05 00 00 41 01 00 38 59 01 01 92';

    var structured = {
      type: 145,
      remote64: '00137A00000275ED',
      remote16: '5938',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '8005',
      profileId: '0000',
      receiveOptions: 41,
      data: Buffer.from('010038590101','hex')
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
   * 7E 00 18 11 03 00 00 00 00 00 00 FF FF 59 38 00 00 00 04 00 00 00 00 01 38 59 01 C5
   *
   * Start delimiter: 7E
   * Length: 00 18 (24)
   * Frame type: 11 (Explicit Addressing Command Frame)
   * Frame ID: 03 (3)
   * 64-bit dest. address: 00 00 00 00 00 00 FF FF
   * 16-bit dest. address: 59 38
   * Source endpoint: 00
   * Dest. endpoint: 00
   * Cluster ID: 00 04
   * Profile ID: 00 00
   * Broadcast radius: 00 (0)
   * Transmit options: 00
   * RF data: 01 38 59 01
   * Checksum: C5
   *
   **/

  request: function (format) {

    var raw = '7E 00 18 11 03 00 00 00 00 00 00 FF FF 59 38 00 00 00 04 00 00 00 00 01 38 59 01 C5';

    var structured = {
      type: 17,
      destination16: '5938',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '0004',
      profileId: '0000',
      data: [ '0x01', '0x38', '0x59', '0x01' ]
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
   * 7E 00 2D 91 00 13 7A 00 00 02 75 ED 59 38 00 00 80 04 00 00 41 01 00 38 59 16 01 04 01 06 01 00 07 00 00 01 00 03 00 15 00 20 00 05 0B 00 04 00 1E
   *
   * Start delimiter: 7E
   * Length: 00 2D (45)
   * Frame type: 91 (Explicit RX Indicator)
   * 64-bit source address: 00 13 7A 00 00 02 75 ED
   * 16-bit source address: 59 38
   * Source endpoint: 00
   * Destination endpoint: 00
   * Cluster ID: 80 04
   * Profile ID: 00 00
   * Receive options: 41
   * RF data: 01 00 38 59 16 01 04 01 06 01 00 07 00 00 01 00 03 00 15 00 20 00 05 0B 00 04 00
   * Checksum: 1E
   *
   **/

  response: function (format) {

    var raw = '7E 00 2D 91 00 13 7A 00 00 02 75 ED 59 38 00 00 80 04 00 00 41 01 00 38 59 16 01 04 01 06 01 00 07 00 00 01 00 03 00 15 00 20 00 05 0B 00 04 00 1E';

    var structured = {
      type: 145,
      remote64: '00137A00000275ED',
      remote16: '5938',
      sourceEndpoint: '00',
      destinationEndpoint: '00',
      clusterId: '8004',
      profileId: '0000',
      receiveOptions: 41,
      data: Buffer.from('01003859160104010601000700000100030015002000050B000400','hex')
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  }

};



frame['Read_Attribute_Illuminance'] = {

  /*
   * Read Attribute Request
   *
   * Explicit Addressing Command Frame (API 1)
   *
   * 7E 00 19 11 01 00 00 00 00 00 00 FF FF 59 38 00 01 04 00 01 04 00 00 40 01 00 00 00 13
   *
   * Start delimiter: 7E
   * Length: 00 19 (25)
   * Frame type: 11 (Explicit Addressing Command Frame)
   * Frame ID: 01 (1)
   * 64-bit dest. address: 00 00 00 00 00 00 FF FF
   * 16-bit dest. address: 59 38
   * Source endpoint: 00
   * Dest. endpoint: 01
   * Cluster ID: 04 00
   * Profile ID: 01 04
   * Broadcast radius: 00 (0)
   * Transmit options: 00
   * RF data: 40 01 00 00 00
   * Checksum: 13
   *
   **/

  request: function (format) {

    var raw = '7E 00 19 11 01 00 00 00 00 00 00 FF FF 59 38 00 01 04 00 01 04 00 00 40 01 00 00 00 13';

    var structured = {
      type: 17,
      destination16: '5938',
      sourceEndpoint: '00',
      destinationEndpoint: '01',
      clusterId: '0400',
      profileId: '0104',
      data: [ '0x40', '0x01', '0x00', '0x00', '0x00' ]
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  },

  /*
   * Read Attribute Response
   *
   * Explicit RX Indicator (API 1)
   *
   * 7E 00 1B 91 00 13 7A 00 00 02 75 ED 59 38 01 00 04 00 01 04 41 18 01 01 00 00 00 21 20 63 E3
   *
   * Start delimiter: 7E
   * Length: 00 1B (27)
   * Frame type: 91 (Explicit RX Indicator)
   * 64-bit source address: 00 13 7A 00 00 02 75 ED
   * 16-bit source address: 59 38
   * Source endpoint: 01
   * Destination endpoint: 00
   * Cluster ID: 04 00
   * Profile ID: 01 04
   * Receive options: 41
   * RF data: 18 01 01 00 00 00 21 20 63
   * Checksum: E3
   *
   **/

  response: function (format) {

    var raw = '7E 00 1B 91 00 13 7A 00 00 02 75 ED 59 38 01 00 04 00 01 04 41 18 01 01 00 00 00 21 20 63 E3';

    var structured = {
      type: 145,
      destination16: '5938',
      sourceEndpoint: '00',
      destinationEndpoint: '01',
      clusterId: '0400',
      profileId: '0104',
      data: Buffer.from('180101000000212063', 'hex')
    };

    if (format === 'raw')
      return raw;
    else
      return structured;
  }

};

module.exports = frame;
