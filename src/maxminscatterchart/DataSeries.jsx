'use strict';

var React = require('react');
var d3 = require('d3');
var assert = require('chai').assert;
var pdebug = require('../debug')('MaxMinScatterChart:DataSeries');
var _ = require('lodash');
var chartName = 'scatterchart'
module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    className:          React.PropTypes.string,
    currentValue:       React.PropTypes.object,
    data:               React.PropTypes.array.isRequired,
    DataMarker:         React.PropTypes.func.isRequired,
    DataMarkerClick:    React.PropTypes.func,
    zooming:            React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      className: `rd3-${chartName}-dataseries`
      , dataGroupClassName: `rd3-${chartName}-datagroup`
      , interpolationType: 'linear'
      , strokeWidth: 2
      , colors: d3.scale.category20c()
    };
  },

  render: function() {
    var {
      data
      , dataGroupClassName
      , DataMarker
      , DataMarkerClick
      , currentValue
    } = this.props;
    currentValue = currentValue || {};
    var props = _.pick(this.props, [
      'xScale'
      , 'yScale'
      , 'height'
      , 'width'
      , 'strokeWidth'
      , 'zooming'
    ]);
    return (
      <g className={dataGroupClassName}>
        {
          data.map((value, idx) =>{
            let active = value.coord.x === currentValue.x;
            return (
              <DataMarker
                {...props}
                key={idx}
                value={value}
                active={active}
                click={DataMarkerClick}/>
            );
          })
        }
      </g>
    );
  }

});
