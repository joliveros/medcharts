'use strict';

import React, { Component } from 'react';
import tweenState, { stackBehavior } from 'react-tween-state';
import mixin from 'es6-react-mixins';
import d3 from 'd3';
import _ from 'lodash'
import Line from './Line';
import Circle from './Circle';

const pdebug = require('../debug')('Result');
const chartName = '';

module.exports = React.createClass({
  mixins: [tweenState.Mixin]
  , getInitialState: function(){
    return {
    }
  }
  , getDefaultProps: function(){
    return {
      strokeWidth: 2
      , circleRadius: 4
      , circleRadiusOnHover: 6
      , animationDuration: 200
      , opacity: 0.4
      , fullOpacity: 1
      , mouseEventAreaWidth: 20
    }
  }
  , propTypes: {
    key:                    React.PropTypes.number.isRequired
    , strokeWidth:          React.PropTypes.number
    , circleRadius:         React.PropTypes.number
    , circleRadiusOnHover:  React.PropTypes.number
    , animationDuration:    React.PropTypes.number
    , opacity:              React.PropTypes.number
    , mouseEventAreaWidth:  React.PropTypes.number
    , click:                React.PropTypes.func
  }
  , componentDidMount: function(){
    let {
      circleRadius
    } = this.props;
    this.setState({circleRadius: circleRadius});
  }
  , initColorScale: function(){
    let {
      colors
    } = this.props;
    if(!_.isArray(colors))return d3.scale.category10();
    let d3_category4 = colors.map(function(value){
      return d3.rgb(value >> 16, value >> 8 & 0xff, value & 0xff) + "";
    });
    d3.scale.category4 = function() {
      return d3.scale.ordinal().range(d3_category4);
    };
    return d3.scale.category4();
  }
  , onMouseOver: function(){
    if(this.props.zooming)return;
    let {
      circleRadius
      , circleRadiusOnHover
      , animationDuration
      , opacity
      , fullOpacity
    } = this.props;

    this.tweenState('circleRadius', {
      easing: tweenState.easingTypes.easeOutBounce
      , duration: animationDuration
      , beginValue: circleRadius
      , endValue: circleRadiusOnHover
    })

    this.tweenState('opacity', {
      easing: tweenState.easingTypes.linear
      , duration: animationDuration
      , beginValue: opacity
      , endValue: fullOpacity
    })
  }
  , onMouseLeave: function() {
    if(this.props.zooming)return;
    let {
      circleRadius
      , circleRadiusOnHover
      , animationDuration
      , opacity
      , fullOpacity
    } = this.props;

    this.tweenState('circleRadius', {
      easing: tweenState.easingTypes.easeInBounce
      , duration: animationDuration
      , beginValue: circleRadiusOnHover
      , endValue: circleRadius
    })

    this.tweenState('opacity', {
      easing: tweenState.easingTypes.linear
      , duration: animationDuration + 100
      , beginValue: fullOpacity
      , endValue: opacity
    })
  }
  , onClick: function(){
    let {
      click
      , value: {
        coord
      }
    } = this.props;
    pdebug(`#onClick: ${JSON.stringify(coord)}`)
    return click(coord);
  }
  , render: function() {
    let {
      value: {
        coord: {
          x
          , y
        }
        , d: {
          ucl: _ucl
          , lcl: _lcl
        }
        , id
      }
      , yScale
      , xScale
      , className
      , key
      , markerFill: circleFill
      , strokeWidth
      , markerSize
      , height
      , width
      , opacity
      , mouseEventAreaWidth
      , active
      , fullOpacity
    } = this.props;

    let circleRadius = this.getTweeningValue('circleRadius');
    opacity = this.getTweeningValue('opacity') || opacity;
    if(active){
      opacity = fullOpacity;
    }
    let [normalColor, abnormalColor] = this.initColorScale().range();

    let {
      onMouseOver
      , onMouseLeave
    } = this;
    let ucl = yScale(_ucl)
    let lcl = yScale(_lcl)

    let HalfControlRange = (ucl-lcl)/2;
    let UpperDangerValue = HalfControlRange + ucl;
    let LowerDangerValue = lcl - HalfControlRange;
    let rectHeight = Math.abs(UpperDangerValue - LowerDangerValue);
    // The circle coordinates
    let cx = xScale(x)
    , cy = yScale(y)
    , _x = xScale(x.getTime())
    let lineProps = {
      x1: _x
      , x2: _x
      , strokeWidth: strokeWidth
    };

    return (
      <g className={className}
        key={key}
        opacity={opacity}>
        <Line
          {...lineProps}
          y1={ucl}
          y2={lcl}
          stroke={normalColor}
          className="normal"/>
        <Line
          {...lineProps}
          y1={UpperDangerValue}
          y2={ucl}
          stroke={abnormalColor}
          className="abnormal"/>
        <Line
          {...lineProps}
          y1={LowerDangerValue}
          y2={lcl}
          stroke={abnormalColor}
          className="abnormal"/>
        <Circle
          circleFill="white"
          circleRadius={circleRadius}
          strokeWidth={strokeWidth}
          stroke={normalColor}
          cx={cx}
          cy={cy}/>
        <rect
          x={_x - mouseEventAreaWidth/2}
          y={UpperDangerValue}
          width={mouseEventAreaWidth}
          height={rectHeight}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
          fill="transparent"/>
    </g>
    );
  }
})
