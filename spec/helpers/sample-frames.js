const network1 = require('./frames/network-1'),
      network2 = require('./frames/network-2'),
      network3 = require('./frames/network-3');

var frame = {};

frame.networkList = [ network1, network2, network3 ]

// global variable that gives context to frame responses
NET_ID = 0;

module.exports = frame;
