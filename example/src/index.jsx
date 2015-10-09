import React from 'react';
import { MaxMinScatterChart as Chart } from '../../src/index.js';
const data = require('./data');
const margins = {
  top: 10
  , right: 20
  , bottom: 75
  , left: 45
};
var { values } = data[0];
values.map((value)=>{
  var { date } = value;
  value.date = new Date(date);
  return value;
});
// React dev tools
if (typeof window !== 'undefined') {
  window.react = React;
}



React.render(
  <div>
      <Chart
          data={data}
          height={300}
          isMobile={true}
          margins={margins}
          strokeWidth={3}
          width={600}/>
    {/*
      <Chart
          data={data}
          height={400}
          isMobile={true}
          margins={margins}
          strokeWidth={3}
          width={900}/>
    */}
  </div>
  , document.getElementById('app')
);
