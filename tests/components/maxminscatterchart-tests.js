'use strict';
window.DEBUG='react-d3'

var expect = require('chai').expect;
var React = require('react/addons');
var pdebug = require('../../src/debug')('MaxMinScatterChart:test');
var convertHex = require('convert-hex');
var _ = require('lodash');
var { MaxMinScatterChart } = require('../../src/maxminscatterchart');
var { generateArrayOfControlResultObjects: generate } = require('../utils/datagen');
var TestUtils = React.addons.TestUtils;
var shallowRenderer = TestUtils.createRenderer();
var points = 5;
var circleRadius = 4;
var _data, colors;
pdebug(shallowRenderer)
var CHART_CLASS_NAME  = 'rd3-max-min-scatter-chart';
var CIRCLE_CLASS_NAME = 'rd3-scatterchart-voronoi-circle';

colors = [
    0x2ecc71
  , 0xf1c40f
  , 0xf39c12
  , 0xe74c3c
];
_data = [
  {
    name: "series1",
    values: generate(points)
  }
];

describe.only('MaxMinScatterChart', function() {
  before(function() {
  })
  it('renders scatter chart', function() {
    var chart = TestUtils.renderIntoDocument(
      <MaxMinScatterChart
        circleRadius={circleRadius}
        data={_data}
        width={800}
        height={400}
      />
    );
    var {
      props: {
        data
        , xValues
        , yValues
        , yDomain
        , xDomain
        , width
        , height
      }
    } = chart.refs.chart;
    expect(data[0]).to.have.keys('coord', 'd', 'id', 'series', 'seriesIndex');
    expect(xValues[0]).to.be.instanceof(Date);
    expect(yValues[0]).to.be.string;
    pdebug(_.pick(xDomain, ['lowerBound', 'upperBound']))
    pdebug(_.pick(yDomain, ['lowerBound', 'upperBound']))
    expect(yDomain.lowerBound).to.not.be.equal(Infinity)
    expect(yDomain.upperBound).to.not.be.equal(Infinity)
  });
});
