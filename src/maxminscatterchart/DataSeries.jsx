'use strict';

var React = require('react');
var d3 = require('d3');
var pdebug = require('../debug')('MaxMinScatterChart:DataSeries');
import { pick } from 'lodash';
const chartName = 'scatterchart';

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    className:          React.PropTypes.string,
    currentValue:       React.PropTypes.object,
    data:               React.PropTypes.array.isRequired,
    dataGroupClassName: React.PropTypes.string,
    DataMarker:         React.PropTypes.func.isRequired,
    DataMarkerClick:    React.PropTypes.func,
    isMobile:           React.PropTypes.bool,
    xScale:             React.PropTypes.func,
    yScale:             React.PropTypes.func,
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
  shouldComponentUpdate(props) {
    // if(props.zooming)return false;
    let {
      currentValue: previous
    } = this.props;
    let {
      currentValue
    } = props;
    if(currentValue === previous)return false;
    return true;
  },
  render: function() {
    pdebug('#render');
    var {
      currentValue,
      data,
      dataGroupClassName,
      DataMarker,
      DataMarkerClick
    } = this.props;
    currentValue = currentValue || {};
    var props = pick(this.props, [
      'xScale'
      , 'yScale'
      , 'height'
      , 'isMobile'
      , 'width'
      , 'zooming'
    ]);
    return (
      <g
          className={dataGroupClassName}>
        {
          data.map((value, idx) =>{
            let active = value.coord.x === currentValue.x;
            return (
              <DataMarker
                  {...props}
                  active={active}
                  click={DataMarkerClick}
                  key={idx}
                  value={value}/>
            );
          })
        }
      </g>
    );
  }

});
