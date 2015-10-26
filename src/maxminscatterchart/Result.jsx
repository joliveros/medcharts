'use strict';

import React from 'react';
import tweenState from 'react-tween-state';
import d3 from 'd3';
import _ from 'lodash';
import Line from './Line';
import Circle from './Circle';

const pdebug = require('../debug')('Result');

module.exports = React.createClass({
  displayName: 'Result',
  propTypes: {
      active:               React.PropTypes.bool,
      animationDuration:    React.PropTypes.number,
      className:            React.PropTypes.string,
      click:                React.PropTypes.func,
      colors:               React.PropTypes.array,
      fullOpacity:          React.PropTypes.number,
      index:                  React.PropTypes.number,
      isMobile:             React.PropTypes.bool,
      markerFill:           React.PropTypes.string,
      markerSize:           React.PropTypes.number,
      markerSize:         React.PropTypes.number,
      markerSizeOnHover:  React.PropTypes.number,
      mouseEventAreaWidth:  React.PropTypes.number,
      opacity:              React.PropTypes.number,
      strokeWidth:          React.PropTypes.number,
      value:                React.PropTypes.object,
      xScale:               React.PropTypes.func,
      yScale:               React.PropTypes.func,
      zooming:              React.PropTypes.bool
  },
  mixins: [tweenState.Mixin],
  getDefaultProps: function(){
    return {
      active: false,
      animationDuration: 200,
      markerFill: "white",
      markerSize: 8,
      markerSizeOnHover: 12,
      strokeWidth: 2,
      fullOpacity: 1,
      isMobile: false,
      mouseEventAreaWidth: 20,
      opacity: 0.4
    };
  },
  getInitialState: function(){
    let {
      markerSize
    } = this.props;
    let circleRadius = markerSize/2;
    return {
      circleRadius: circleRadius
    };
  },
  initColorScale: function(){
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
    let {
      markerSize
      , markerSizeOnHover
      , animationDuration
      , opacity
      , fullOpacity
      , isMobile
    } = this.props;
    let circleRadiusOnHover = markerSizeOnHover/2;
    let circleRadius = markerSize/2;
    if(isMobile) return;
    this.tweenState('circleRadius', {
      easing: tweenState.easingTypes.easeOutBounce
      , duration: animationDuration
      , beginValue: circleRadius
      , endValue: circleRadiusOnHover
    });

    this.tweenState('opacity', {
      easing: tweenState.easingTypes.linear
      , duration: animationDuration
      , beginValue: opacity
      , endValue: fullOpacity
    });
  }
  , onMouseLeave: function() {
    let {
      animationDuration,
      markerSize,
      markerSizeOnHover,
      fullOpacity,
      isMobile,
      opacity
    } = this.props;
    let circleRadiusOnHover = markerSizeOnHover/2;
    let circleRadius = markerSize/2;
    if(isMobile) return;
    this.tweenState('circleRadius', {
      easing: tweenState.easingTypes.easeInBounce
      , duration: animationDuration
      , beginValue: circleRadiusOnHover
      , endValue: circleRadius
    });

    this.tweenState('opacity', {
      easing: tweenState.easingTypes.linear
      , duration: animationDuration + 100
      , beginValue: fullOpacity
      , endValue: opacity
    });
  }
  , onClick: function(){
    pdebug(`onClick`);
    let {
      click
      , value: {
        coord
      }
    } = this.props;
    let {
      animationDuration,
      markerSize,
      markerSizeOnHover
    } = this.props;
    let circleRadiusOnHover = markerSizeOnHover/2;
    let circleRadius = markerSize/2;
    this.tweenState('circleRadius', {
      easing: tweenState.easingTypes.easeInBounce
      , duration: animationDuration
      , beginValue: circleRadiusOnHover
      , endValue: circleRadius
    });
    pdebug(`#onClick: ${JSON.stringify(coord)}`);
    click(coord);
  },
  render: function() {
    pdebug('#render');
    pdebug(this.props.key);
    let {
      value: {
        coord: {
          x
          , y
        }
        , d: {
          ucl: _ucl
          , lcl: _lcl
          , upperBound
          , lowerBound
        }
      },
      strokeWidth,
      yScale,
      xScale,
      className,
      index,
      markerFill: circleFill,
      opacity,
      mouseEventAreaWidth,
      active,
      fullOpacity,
      isMobile
    } = this.props;
    let circleRadius;
    if(isMobile){
      circleRadius = this.state.circleRadius;
    }
    else{
      circleRadius = this.getTweeningValue('circleRadius');
    }
    opacity = this.getTweeningValue('opacity') || opacity;
    if(active){
      opacity = fullOpacity;
    }
    let [normalColor, abnormalColor] = this.initColorScale().range();
    let ucl = yScale(_ucl);
    let lcl = yScale(_lcl);
    upperBound = yScale(upperBound);
    lowerBound = yScale(lowerBound);
    let rectHeight = Math.abs(upperBound - lowerBound);
    // The circle coordinates
    let cx = xScale(x)
    , cy = yScale(y)
    , _x = xScale(x.getTime());
    let lineProps = {
      x1: _x
      , x2: _x
    };

    return (
      <g
          className={className}
          key={index}
          opacity={opacity}>
        <Line
            {...lineProps}
            className="normal"
            stroke={normalColor}
            strokeWidth={strokeWidth}
            y1={ucl}
            y2={lcl}/>
        <Line
            {...lineProps}
            className="abnormal"
            stroke={abnormalColor}
            strokeWidth={strokeWidth}
            y1={upperBound}
            y2={ucl}/>
        <Line
            {...lineProps}
            className="abnormal"
            stroke={abnormalColor}
            strokeWidth={strokeWidth}
            y1={lowerBound}
            y2={lcl}/>
        <Circle
            circleFill={circleFill}
            circleRadius={circleRadius}
            cx={cx}
            cy={cy}
            stroke={normalColor}
            strokeWidth={strokeWidth}
            />
        <rect
            fill="transparent"
            height={rectHeight}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseOver={this.onMouseOver}
            onTouchEnd={this.onClick}
            onTouchStart={this.onMouseOver}
            width={mouseEventAreaWidth}
            x={_x - mouseEventAreaWidth/2}
            y={upperBound}/>
    </g>
    );
  }
});
