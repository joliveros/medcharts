'use strict';

var React = require('react');
var d3 = require('d3');
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');
var XAxisSelectedLabel = require('./XAxisSelectedLabel');
var pdebug = require('../../debug')('XAxis');

module.exports = React.createClass({

  displayName: 'XAxis',
  propTypes: {
    currentValueChange:       React.PropTypes.func,
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
    xAxisClassName:           React.PropTypes.string,
    xAxisLabel:               React.PropTypes.string,
    xAxisOffset:              React.PropTypes.number,
    xAxisTickValues:          React.PropTypes.array,
    xOrient:                  React.PropTypes.oneOf(['top', 'bottom']),
    xScale:                   React.PropTypes.func.isRequired,
    yOrient:                  React.PropTypes.oneOf(['left', 'right']),
    yScale:                   React.PropTypes.func.isRequired,
    zooming:                  React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      fill:            'none',
      stroke:          'none',
      strokeWidth:     'none',
      tickStroke:      '#000',
      xAxisClassName:  'rd3-x-axis',
      xAxisLabel:      '',
      xAxisLabelOffset: 0,
      xAxisOffset:      0,
      xOrient:         'bottom',
      yOrient:         'left',
      zooming:         false
    };
  },
  shouldComponentUpdate(props) {
    if(props.zooming && props.isMobile)return false;
    return true;
  },
  render() {
    pdebug('#render');
    var props = this.props;
    let {
      isMobile
      , value
      , yScale
    } = this.props;
    value = value || {};
    let {
      isLast
      , isFirst
      , x
      , y
    } = value;
    let markerHeight = yScale(y);
    var translate = `translate(0 ,${props.xAxisOffset +
    props.height})`;
    var tickArguments;
    if (typeof props.xAxisTickCount !== 'undefined') {
      tickArguments = [props.xAxisTickCount];
    }
    if (typeof props.xAxisTickInterval !== 'undefined') {
      tickArguments = [d3.time[props.xAxisTickInterval.unit], props.xAxisTickInterval.interval];
    }
    return (
      <g
          className={props.xAxisClassName}
          ref='axis'
          transform={translate}>
          <AxisTicks
              gridVertical={props.gridVertical}
              gridVerticalStroke={props.gridVerticalStroke}
              gridVerticalStrokeDash={props.gridVerticalStrokeDash}
              gridVerticalStrokeWidth={props.gridVerticalStrokeWidth}
              height={props.height}
              innerTickSize={props.tickSize}
              orient={props.xOrient}
              orient2nd={props.yOrient}
              scale={props.xScale}
              tickArguments={tickArguments}
              tickFormatting={props.tickFormatting}
              tickStroke={props.tickStroke}
              tickTextStroke={props.tickTextStroke}
              tickValues={props.xAxisTickValues}
              width={props.width}
          />
        <AxisLine
            {...props}
            orient={props.xOrient}
            outerTickSize={props.tickSize}
            scale={props.xScale}
            stroke={props.stroke}/>
        {x?
          <XAxisSelectedLabel
              currentValueChange={props.currentValueChange}
              isFirst={isFirst}
              isLast={isLast}
              markerHeight={markerHeight}
              maxPosition={props.width}
              orient={props.xOrient}
              scale={props.xScale}
              value={x}
            />:null
        }
        <Label
            label={props.xAxisLabel}
            margins={props.margins}
            offset={props.xAxisLabelOffset}
            orient={props.xOrient}
            width={props.width}/>
      </g>
    );
  }

});
