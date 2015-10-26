var prefix = 'react-d3';
import { noop } from 'lodash';
module.exports = function(str){
  let _debug;
  if(process.env.NODE_ENV === 'development'){
    _debug = require('debug')(`${prefix}:${str}`);
    require('debug').enable(`${prefix}*`);
  }
  else{
    _debug = function() {
      return noop;
    };
  }
  return _debug;
};
