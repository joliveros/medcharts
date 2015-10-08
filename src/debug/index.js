var prefix = 'react-d3';
module.exports = function(str){

  var _debug = require('debug')(`${prefix}:${str}`);
  if(process.env.NODE_ENV === 'development'){
    console.log('development')
    require('debug').enable(`${prefix}*`);
  }
  return _debug;
}
