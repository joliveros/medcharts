'use strict';

var React = require('react');
var d3 = require('d3');
var { Chart, XAxis, YAxis } = require('../common');
var DataSeries = require('./DataSeries');
var utils = require('../utils');
var ms = require('ms');
var pdebug = require('../debug')('ZoomChart')
var { ViewBoxMixin } = require('../mixins');
var clipPathStyle = {
  'clip-path':'url(#chart-area-clip)'
  // , 'pointer-events': 'all'
};
var YEAR_MS = ms('365d');

import  _
, {
  sortBy
, findIndex
} from 'lodash';

module.exports = React.createClass({

  mixins: [
    ViewBoxMixin
   ],

  displayName: 'ZoomChart',
  propTypes: {
    data:                   React.PropTypes.array.isRequired,
    margins:                React.PropTypes.object,
    strokeWidth:  React.PropTypes.number,
    dataMarker:             React.PropTypes.func,
    height:                 React.PropTypes.number.isRequired,
    width:                  React.PropTypes.number.isRequired,
    xAxisUnit:              React.PropTypes.string,
    xAxisClassName:         React.PropTypes.string,
    xAxisStrokeWidth:       React.PropTypes.number,
    yAxisClassName:         React.PropTypes.string,
    yAxisStrokeWidth:       React.PropTypes.number
 },
 getInitialState: function(){
   var {
     data
   } = this.props;
   return {
     dataPointRadius: this.props.dataPointRadius
     , scales: this.calculateScales()
   }
 },
  getDefaultProps() {
    return {
      circleRadius:           3,
      className:              'rd3-max-min-scatter-chart',
      hoverAnimation:         true,
      margins:  {
        top: 10
        , right: 20
        , bottom: 50
        , left: 45
      },
      dataSeriesStrokeWidth:  2,
      dataPointRadius:        5,
      xAxisClassName:         'rd3-max-min-scatter-chart-xaxis',
      xAxisStrokeWidth:       1,
      yAxisClassName:         'rd3-max-min-scatter-chart-yaxis',
      yAxisStrokeWidth:       1
    };
  },
  calculateScales: function(props) {
    pdebug('#calculateScales')
    props = props || this.props;
    var {
      inner: {
        height: chartHeight
        , width: chartWidth
      }
    } = this.getChartDimensions(props);
    var {
      xValues
      , yValues
      , xDomain
      , yDomain
    } = props;
    var xScale, yScale;
    pdebug(`${chartWidth} x ${chartHeight}`)
    if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]') {
      xScale = d3.time.scale()
        .range([0, chartWidth]);
    } else {
      xScale = d3.scale.linear()
        .range([0, chartWidth]);
    }
    xScale.domain([xDomain.lowerBound, xDomain.upperBound]);
    if (yValues.length > 0 && Object.prototype.toString.call(yValues[0]) === '[object Date]') {
      yScale = d3.time.scale()
        .range([chartHeight, 0]);
    } else {
      yScale = d3.scale.linear()
        .range([chartHeight, 0]);
    }
    yScale.domain([yDomain.lowerBound, yDomain.upperBound]);
    xScale.id = _.uniqueId('scale_')
    yScale.id = _.uniqueId('scale_')
    pdebug(`#calculateScales yScale range: ${yScale.range()}`)
    var scales = {
      xScale: xScale,
      yScale: yScale
    };
    return scales;
  },
  componentDidMount: function(){
    pdebug('#componentDidMount')
    var scales = this.calculateScales()
    this.setState(this.initZoom(scales))
  },
  chartOffSet: function(){
    var x = this.props.yAxisOffset < 0 ? (this.props.margins.left + Math.abs(this.props.yAxisOffset)) : this.props.margins.left;
    return `translate(${x}, ${this.props.margins.top})`;
  },
  setZoomingState(){
    let ctx = this;
    this.setState({zooming: true})
    if(this._zoomStateTimer)return;
    this._zoomStateTimer = setTimeout(function(){
      delete ctx._zoomStateTimer;
      ctx.setState({zooming: false});
    }, 100)
  },
  zoomed: function(){
    pdebug('#zoomed')
    this.setZoomingState();
    var {
      zoomInstance: zoom
      , scales: {
        yScale: {
          range: yRange
        }
        , xScale: {
          range: xRange
        }
      }
    } = this.state;
    let {
      scales:{
        yScale
        , xScale
      }
    } = this.state;
    var {
      width
      , height
    } = this.getChartDimensions().inner;
    var {
      scale
      , translate: [tx, ty]
    } = d3.event;
    pdebug(`${scale}: ${zoom.translate()}`)
    var dataSeriesStrokeWidth = this.props.dataSeriesStrokeWidth;
    this.setState({
      dataSeriesStrokeWidth: dataSeriesStrokeWidth
    });
  },
  /**
   * Initialize d3 zoom
   * @return {Function} returns zoom instance.
   */
  initZoom: function(scales){
    pdebug('#initZoom')
    var { xScale, yScale } = scales;
    var {
      width
      , height
    } = this.getChartDimensions().inner;
    var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10]);
    pdebug(_.functions(zoom))
    zoom.x(xScale);
    zoom.y(yScale);
    var chartNode = d3.select(this.refs.clipPath.getDOMNode());
    zoom(chartNode);
    zoom.on('zoom', this.zoomed)
    return {
      zoomInstance: zoom
      , scales: {
        xScale: xScale
        , yScale: yScale
      }
    };
  },
  _updateScales: function(props){
    var scales = this.calculateScales(props)
    this.setState(this.initZoom(scales))
  },
  componentWillReceiveProps: function(props){
    pdebug(`#componentWillReceiveProps ${JSON.stringify(_.pick(props, ['width', 'height']))}`)
    this._updateScales(props);
  },
  getChartDimensions: function(props){
    pdebug('#getChartDimensions')
    // Calculate inner chart dimensions
    var { height
      , width
      , margins
    } = props || this.props;
    pdebug(`#getChartDimensions ${width} x ${height}`)
    var dims = {
      inner:{
        width: width - margins.left - margins.right
        , height: height - margins.top - margins.bottom
      }
    }
    pdebug('#getChartDimensions %s', JSON.stringify(dims))
    return dims;
  },
  DataMarkerClick: function(value){
    pdebug(`#DataMarkerClick ${JSON.stringify(value)}`)
    this.setState({currentValue: value})
  },
  getValueIndex: function(value, sortAxis){
    let {
      data
    } = this.props;
    let _data = data.map((value)=>{
      return value.coord
    });
    _data = sortBy(_data, (value)=>{
      return value[sortAxis];
    });
    return findIndex(_data, sortAxis, value[sortAxis]);
  }
  , getValueAtIndex(index, sortAxis){
    let {
      data
    } = this.props;
    let _data = data.map((value)=>{
      return value.coord
    });
    _data = sortBy(_data, (value)=>{
      return value[sortAxis];
    });
    return _data[index];
  }
  , changeCurrentValue(opts){
    let {
      nextValue
      , orient
    } = opts;
    let {
      currentValue
    } = this.state;
    let {
      data
    } = this.props;
    let sortAxis = orient.match(/top|bottom/)?'x':'y';
    let lastIndex = data.length-1;
    let currentIndex = this.getValueIndex(currentValue, sortAxis);
    let nextIndex = nextValue === 'next'?currentIndex+1:currentIndex-1;
    nextValue = this.getValueAtIndex(nextIndex, sortAxis);
    nextValue.isLast = nextIndex >= lastIndex;
    nextValue.isFirst = nextIndex <= 0;
    this.setState({currentValue: nextValue})
  }
  , render() {
    pdebug('#render')
    var props = this.props;
    var {
      data
      , dataMarker
      , margins
      , width
      , height
      , strokeWidth
    } = props;
    var transform = this.chartOffSet();
    var ctx = this;
    var {
      dataPointRadius
      , dataSeriesStrokeWidth
      , scales: {
        xScale
        , yScale
      }
      , currentValue
      , zooming
    } = this.state;
    var {
      height: innerHeight
      , width: innerWidth
    } = this.getChartDimensions().inner;
    // pdebug('#scale id: %s', xScale.id)
    // pdebug(`yScale range: ${yScale.range()}`)
    // pdebug(`xScale range: ${xScale.range()}`)
    // pdebug('dims %s x %s', width, height)
    if (!data || data.length < 1) {
      return null;
    }

    return (
      <Chart
        colors={props.colors}
        colorAccessor={props.colorAccessor}
        data={data}
        height={height}
        width={width}
        legend={props.legend}
        margins={margins}
        title={props.title}
        viewBox={this.getViewBox()}
        ref="Chart"
      >
        <defs>
          <clipPath id="chart-area-clip">
            <rect
              x="0"
              y="0"
              height={innerHeight}
              width={innerWidth}
              />
          </clipPath>
        </defs>
        <g
          className={props.className}
          transform={transform}
        >
          <XAxis
            ref="xAxis"
            data={data}
            currentValueChange={this.changeCurrentValue}
            value={currentValue}
            height={innerHeight}
            margins={margins}
            stroke={props.axesColor}
            strokeWidth={props.xAxisStrokeWidth.toString()}
            tickFormatting={props.xAxisFormatter}
            tickSize={0}
            width={innerWidth}
            xAxisClassName={props.xAxisClassName}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            xAxisOffset={props.xAxisOffset}
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisTickValues={props.xAxisTickValues}
            xOrient={props.xOrient}
            yOrient={props.yOrient}
            xScale={xScale}
            yScale={yScale}
            gridVertical={props.gridVertical}
            gridVerticalStroke={props.gridVerticalStroke}
            gridVerticalStrokeWidth={props.gridVerticalStrokeWidth}
            gridVerticalStrokeDash={props.gridVerticalStrokeDash}
          />
          <YAxis
            tickSize={0}
            data={data}
            value={currentValue}
            currentValueChange={this.changeCurrentValue}
            width={innerWidth}
            height={innerHeight}
            margins={margins}
            stroke={props.axesColor}
            strokeWidth={props.yAxisStrokeWidth.toString()}
            tickFormatting={props.yAxisFormatter}
            yAxisClassName={props.yAxisClassName}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            yAxisOffset={props.yAxisOffset}
            yAxisTickValues={props.yAxisTickValues}
            yAxisTickCount={props.yAxisTickCount}
            xScale={xScale}
            yScale={yScale}
            xOrient={props.xOrient}
            yOrient={props.yOrient}
            gridHorizontal={props.gridHorizontal}
            gridHorizontalStroke={props.gridHorizontalStroke}
            gridHorizontalStrokeWidth={props.gridHorizontalStrokeWidth}
            gridHorizontalStrokeDash={props.gridHorizontalStrokeDash}
          />
        <g style={clipPathStyle} ref="clipPath">
          <rect
            height={innerHeight}
            width={innerWidth}
            fill="transparent"/>
          <DataSeries
            currentValue={currentValue}
            zooming={zooming}
            width={innerWidth}
            height={innerHeight}
            data={data}
            DataMarker={dataMarker}
            DataMarkerClick={this.DataMarkerClick}
            xScale={xScale}
            yScale={yScale}
            strokeWidth={strokeWidth}/>
          </g>
        </g>
      </Chart>
    );
  }

});
