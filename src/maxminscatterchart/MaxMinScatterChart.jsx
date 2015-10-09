'use strict';

var React = require('react');
var Chart = require('./ZoomChart');
var DataMarker = require('./Result');
var utils = require('../utils');
var _ = require('lodash');
var ms = require('ms');
var { TimeValueChartPropsMixin } = require('../mixins');
var pdebug = require('../debug')('MaxMinScatterChart');
var YEAR_MS = ms('365d');
import d3 from 'd3';

module.exports = React.createClass({
  displayName: 'MaxMinScatterChart',
  propTypes: {
    className:              React.PropTypes.string,
    data:                   React.PropTypes.array.isRequired,
    height:                 React.PropTypes.number,
    isMobile:               React.PropTypes.bool,
    strokeWidth:            React.PropTypes.number,
    width:                  React.PropTypes.number,
    xAxisClassName:         React.PropTypes.string,
    xAxisStrokeWidth:       React.PropTypes.number,
    xAxisUnit:              React.PropTypes.string,
    yAxisClassName:         React.PropTypes.string,
    yAxisStrokeWidth:       React.PropTypes.number
  },
  mixins: [
    TimeValueChartPropsMixin
  ],
  getDefaultProps() {
    return {
    };
  },
  getYValues: function(){
    var yValues = [];
    this.props.data.forEach((series) => {
      series.values.forEach((value) => {
        yValues.push(value);
      });
    });
    return yValues;
  },
  /*
   * This function calculates the inital x domain for the graph based on the
   * dates and values of the data set. It also appends some padding.
   */
  calculateInitialxDomain: function(values) {
    // Tuple of the max and min date in the dataset
    var xExtent = {
      upperBound: _.max(values),
      lowerBound: _.min(values)
    };
    // Calculate a chunk of time based on the max and min dates which we'll
    // use as padding
    var extraTime = (xExtent.upperBound - xExtent.lowerBound) * 0.1 || YEAR_MS;

    // Calculate the domain for the x axis with padding
    var xDomain = {};
    if(_.isDate(xExtent.lowerBound))
    xDomain.lowerBound = new Date(xExtent.lowerBound.getTime() - extraTime);
    else
    xDomain.lowerBound = xExtent.lowerBound;

    if(_.isDate(xExtent.upperBound))
    xDomain.upperBound = new Date(xExtent.upperBound.getTime() + extraTime);
    else
    xDomain.upperBound = xExtent.upperBound;
    return xDomain;
  },
  calculateInitialyDomain: function(values) {
    var refRanges = this.getRefRanges(values);
    // Array of all lower and upper bounds in the ref range
    var boundRefRanges = _.flatten(_.map(refRanges, function(refRange) {
        if (refRange && refRange.lcl !== undefined && refRange.ucl !== undefined) {
          return [refRange.lcl, refRange.ucl];
        }
      }));
    var maxValue = _.max(values);
    var minValue = _.min(values);
    var maxRange = _.max(boundRefRanges);
    var minRange = _.min(boundRefRanges);

    var refRangePlusValues = [maxValue, minValue, maxRange, minRange];
    // This calculates the extent of domain we'll use for the y axis by
    // checking the min and max ranges with the min and max of the value dataset
    // to make sure we have a Y axis that covers everything
    var yExtent = {
      upperBound: _.max(refRangePlusValues),
      lowerBound: _.min(refRangePlusValues)
    };

    // This recalculates the  yExtent if infinity is the upper bound currently
    // It changes to either the highest refRange or highest value depending
    // on which one is currently infinity
    if (yExtent.upperBound === Infinity) {
      yExtent.upperBound = _.max(boundRefRanges);
      if (_.max(boundRefRanges) === Infinity) {
        yExtent.upperBound = _.max(values);
      }
    }

    if (yExtent.lowerBound === -Infinity) {
      yExtent.lowerBound = _.min(boundRefRanges);
      if (_.min(boundRefRanges) === -Infinity) {
        yExtent.lowerBound = _.min(values);
      }
    }
    // Calculate a chunk of range based on the max and min we selected so the
    // Y axis look better
    var extraRange = (yExtent.upperBound - yExtent.lowerBound) * 0.2;

    // The final y-domain that we'll return
    var yDomain = {};

    // This block makes sure that our padding doesn't alter the ranges in
    // scenarios where we're not supposed to e.g., positive only ranges
    if (yExtent.lowerBound >= 0 && ((yExtent.lowerBound - extraRange) < 0)) {
      // if lowest bound greater than zero but padding pushes extent below zero
      // add no padding
      yDomain.lowerBound = yExtent.lowerBound;
    } else {
      // otherwise just pad
    yDomain.lowerBound = yExtent.lowerBound - extraRange;
    }
    yDomain.upperBound = yExtent.upperBound + extraRange;

    // Limit to 3 scientific values bc JavaScript does float math weirdly
    yDomain.lowerBound = +(yDomain.lowerBound.toFixed(3));
    yDomain.upperBound = +(yDomain.upperBound.toFixed(3));
    return yDomain;
  },
  getDates: function(values) {
    return _.map(values, function(value) {
      return value.date;
    });
  },
  /* Returns an array of reference ranges */
  getRefRanges: function(values) {
    return _.map(values, function(value) {
      return _.pick(value.d, ['value','lcl', 'ucl']);
    });
  },
  flattenData: function(){
    var {
      data
      , yAccessor
      , xAccessor
    } = this.props;
    return utils.flattenData(data, xAccessor, yAccessor);
  },
  getChartDimensions: function(props){
    pdebug('#getChartDimensions');
    // Calculate inner chart dimensions
    var { height
      , width
      , margins
    } = props || this.props;
    pdebug(`#getChartDimensions ${width} x ${height}`);
    var dims = {
      inner:{
        width: width - margins.left - margins.right
        , height: height - margins.top - margins.bottom
      }
    };
    pdebug('#getChartDimensions %s', JSON.stringify(dims));
    return dims;
  },
  calculateScales: function(opts) {
    pdebug('#calculateScales');
    opts = opts || {};
    var {
      xValues
      , yValues
      , xDomain
      , yDomain
      , dimensions: {
        height: chartHeight
        , width: chartWidth
      }
    } = opts;
    var xScale, yScale;
    pdebug(`${chartWidth} x ${chartHeight}`);
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
    xScale.id = _.uniqueId('scale_');
    yScale.id = _.uniqueId('scale_');
    pdebug(`#calculateScales yScale range: ${yScale.range()}`);
    return {
      xScale: xScale,
      yScale: yScale
    };
  },
  render() {
    pdebug('#render');
    var props = _.omit(this.props, ['data']);
    var {
      allValues
      , xValues
      , yValues
    } = this.flattenData();
    let innerDimensions = this.getChartDimensions().inner;
    var xDomain = this.calculateInitialxDomain(xValues);
    var yDomain = this.calculateInitialyDomain(allValues);
    let scaleOpts = {
      xValues: xValues
      , yValues: yValues
      , xDomain: xDomain
      , yDomain: yDomain
      , dimensions: innerDimensions
    };
    let {
      xScale: xChartScale
      , yScale: yChartScale
    } = this.calculateScales(scaleOpts);
    let {
      xScale
      , yScale
    } = this.calculateScales(scaleOpts);
    if (!allValues || allValues.length < 1) {
      return null;
    }
    return (
      <Chart
          {...props}
          data={allValues}
          dataMarker={DataMarker}
          innerDimensions={innerDimensions}
          ref="chart"
          xChartScale={xChartScale}
          xDomain={xDomain}
          xScale={xScale}
          xValues={xValues}
          yChartScale={yChartScale}
          yDomain={yDomain}
          yScale={yScale}
          yValues={yValues}/>
    );
  }

});
