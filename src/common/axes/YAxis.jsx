'use strict';

var React = require('react');
var d3 = require('d3');
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');
var pdebug = require('../../debug')('YAxis');

import YAxisSelectedLabel from './YAxisSelectedLabel';

module.exports = React.createClass({

  displayName: 'YAxis',

  propTypes: {
    fill:                     React.PropTypes.string,
    gridVertical:             React.PropTypes.bool,
    gridVerticalStroke:       React.PropTypes.string,
    gridVerticalStrokeDash:   React.PropTypes.string,
    gridVerticalStrokeWidth:  React.PropTypes.number,
    height:                   React.PropTypes.number.isRequired,
    isMobile:                 React.PropTypes.bool,
    stroke:                   React.PropTypes.string,
    strokeWidth:              React.PropTypes.string,
    tickStroke:               React.PropTypes.string,
    value:                    React.PropTypes.object,
    width:                    React.PropTypes.number.isRequired,
    xOrient:                  React.PropTypes.oneOf(['top', 'bottom']),
    xScale:                   React.PropTypes.func.isRequired,
    yAxisClassName:           React.PropTypes.string,
    yAxisLabel:               React.PropTypes.string,
    yAxisOffset:              React.PropTypes.number,
    yAxisTickValues:          React.PropTypes.array,
    yOrient:                  React.PropTypes.oneOf(['left', 'right']),
    yScale:                   React.PropTypes.func.isRequired,
    zooming:                  React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      fill:           'none',
      stroke:         '#000',
      strokeWidth:    '1',
      tickStroke:     '#000',
      yAxisClassName: 'rd3-y-axis',
      yAxisLabel:     '',
      yAxisOffset:    0,
      xOrient:        'bottom',
      yOrient:        'left',
      zooming:        false
    };
  },

  render() {
    pdebug('#render');
    var props = this.props;
    let {
      isMobile
      , value
      , xScale
    } = this.props;
    value = value || {};
    let {
      x
      , y
    } = value;
    let markerHeight = x?xScale(x):0;
    var t;
    if (props.yOrient === 'right') {
       t = `translate(${props.yAxisOffset + props.width}, 0)`;
    } else {
       t = `translate(${props.yAxisOffset}, 0)`;
    }

    var tickArguments;
    if (props.yAxisTickCount) {
      tickArguments = [props.yAxisTickCount];
    }

    if (props.yAxisTickInterval) {
      tickArguments = [d3.time[props.yAxisTickInterval.unit], props.yAxisTickInterval.interval];
    }

    return (
      <g
          className={props.yAxisClassName}
          transform={t}>
          <AxisTicks
              gridHorizontal={props.gridHorizontal}
              gridHorizontalStroke={props.gridHorizontalStroke}
              gridHorizontalStrokeDash={props.gridHorizontalStrokeDash}
              gridHorizontalStrokeWidth={props.gridHorizontalStrokeWidth}
              height={props.height}
              innerTickSize={props.tickSize}
              orient={props.yOrient}
              orient2nd={props.xOrient}
              scale={props.yScale}
              tickArguments={tickArguments}
              tickFormatting={props.tickFormatting}
              tickStroke={props.tickStroke}
              tickTextStroke={props.tickTextStroke}
              tickValues={props.yAxisTickValues}
              width={props.width}
          />
        <AxisLine
            {...props}
            orient={props.yOrient}
            outerTickSize={props.tickSize}
            scale={props.yScale}
            stroke={props.stroke}
        />
      {y?
          <YAxisSelectedLabel
              markerHeight={markerHeight}
              maxPosition={props.height}
              orient={props.yOrient}
              scale={props.yScale}
              value={y}/>:null
        }
        <Label
            height={props.height}
            label={props.yAxisLabel}
            margins={props.margins}
            offset={props.yAxisLabelOffset}
            orient={props.yOrient}/>
      </g>
    );
  }
});
