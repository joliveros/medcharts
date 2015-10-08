import React from 'react';
import { MaxMinScatterChart as Chart } from '../../src/index.js';
var data = require('./data');

var { values } = data[0];
values.map((value)=>{
  var { date } = value;
  value.date = new Date(date);
  return value;
})
// React dev tools
if (typeof window !== 'undefined') {
  window.react = React;
}

let margins = {
  top: 10
  , right: 20
  , bottom: 60
  , left: 45
};

React.render(
  <Chart
    width={900}
    height={400}
    data={data}
    strokeWidth={3}
    margins={margins}
  />
  , document.getElementById('app')
);
