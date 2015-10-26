'use strict';

var React = require('react');
var pdebug = require('../../debug')('XAxisSelectedLabel');
import tweenState
, {
  Mixin as tweenStateMixin
} from 'react-tween-state';
import moment from 'moment';
const baseClassName = 'selected-value-label';
const arrowClassName = `${baseClassName}-arrow`;
const containerClassName = `${baseClassName}-container`;
const arrowStyle = {
  cursor: 'pointer'
};
const textStyle = {
  "alignment-baseline":"center"
};
const leftPath = "M1171 1235l-531 -531l531 -531q19 -19 19 -45t-19 -45l-166 -166q-19 -19 -45 -19t-45 19l-742 742q-19 19 -19 45t19 45l742 742q19 19 45 19t45 -19l166 -166q19 -19 19 -45t-19 -45z";
const rightPath = "M1107 659l-742 -742q-19 -19 -45 -19t-45 19l-166 166q-19 19 -19 45t19 45l531 531l-531 531q-19 19 -19 45t19 45l166 166q19 19 45 19t45 -19l742 -742q19 -19 19 -45t-19 -45z";
module.exports = React.createClass({
  displayName: 'XAxisSelectedLabel',

  propTypes: {
    animationDuration:    React.PropTypes.number,
    cornerRadius:         React.PropTypes.number,
    currentValueChange:   React.PropTypes.func,
    fill:                 React.PropTypes.string,
    height:               React.PropTypes.number,
    horizontalTransform:  React.PropTypes.string,
    isFirst:              React.PropTypes.bool,
    isLast:               React.PropTypes.bool,
    isMobile:             React.PropTypes.bool,
    margins:              React.PropTypes.object,
    markerHeight:         React.PropTypes.number,
    maxPosition:          React.PropTypes.number.isRequired,
    offset:               React.PropTypes.number,
    orient:               React.PropTypes.string,
    scale:                React.PropTypes.func.isRequired,
    strokeWidth:          React.PropTypes.number,
    textAnchor:           React.PropTypes.string,
    value:                React.PropTypes.object.isRequired,
    verticalTransform:    React.PropTypes.string,
    width:                React.PropTypes.number,
    zooming:              React.PropTypes.bool
  },
  mixins:[tweenStateMixin],

  getDefaultProps() {
    return {
      horizontalTransform: 'rotate(270)',
      strokeWidth:         2,
      textAnchor:          'middle',
      verticalTransform:   'rotate(0)',
      cornerRadius:        5,
      width:               130,
      height:              35,
      offset:              35,
      fill:                '#ecf0f1',
      margins:             {
        left: 5
        , right: 5
        , top: 5
        , bottom: 5
      },
      animationDuration:  300
    };
  }
  , getInitialState(){
    return {
      opacity: 0
      , visible: false
      , position: 0
      , markerHeight: 0
    };
  }
  , componentDidMount(){
    this.initPosition();
    this.initVisibility();
  }
  , componentWillReceiveProps(props){
    this.initPosition(props);
    this.initVisibility();
  }
  , adjustedScale(scale){
    scale = scale || this.props.scale;
    return scale.rangeBand ? (d) => { return scale(d) + scale.rangeBand() / 2; } : scale;
  }
  , hide(){
    let {
      visible
    } = this.state;
    let {
      animationDuration
    } = this.props;
    if(!visible)return;
    this.setState({visible: false});
    this.tweenState('opacity', {
      easing: tweenState.easingTypes.linear
      , duration: animationDuration
      , beginValue: 1
      , endValue: 0
    });
  }
  , show(){
    let {
      visible
    } = this.state;
    let {
      animationDuration
    } = this.props;
    if(visible)return;
    this.setState({visible: true});
    this.tweenState('opacity', {
      easing: tweenState.easingTypes.linear
      , duration: animationDuration
      , beginValue: 0
      , endValue: 1
    });
  }
  , isVisible(scale){
    let {
      value
      , width
    } = this.props;
    let _value = this.adjustedScale(scale)(value);
    let offset = width/2;
    _value = _value >= offset && _value <=this.props.maxPosition - offset;
    return _value;
  }
  , translateY(value){
    return `translate(${value},0)`;
  }
  , translateX(value){
    return `translate(0,${value})`;
  }

  , animateState(key, opts){
    let ctx = this;
    return new Promise((resolve) => {
      opts.onEnd = resolve;
      ctx.tweenState(key, opts);
    });
  }
  , async initPosition(props){
    let ctx = this;
    props = props || this.props;
    let {
      scale
      , value
      , markerHeight
    } = props;
    let {
      position: previous
    } = this.state;
    this.setState({markerHeight: 0});
    let newPosition = this.adjustedScale(scale)(value);
    let {
      animationDuration
    } = this.props;
    await ctx.animateState('position', {
      easing: tweenState.easingTypes.easeOutQuart
      , duration: animationDuration + 200
      , beginValue: previous
      , endValue: newPosition
    });
    this.setState({markerHeight: markerHeight});
  }
  , initVisibility(){
    if(this.isVisible()){
      return this.show();
    }
    this.hide();
  }
  , onClickLeft(){
    let opts = {
      nextValue: 'previous'
      , orient: this.props.orient
    };
    this.props.currentValueChange(opts);
  }
  , onClickRight(){
    let opts = {
      nextValue: 'next'
      , orient: this.props.orient
    };
    this.props.currentValueChange(opts);
  }
  , render() {
    pdebug('render');
    let {
      orient
      , verticalTransform
      , horizontalTransform
      , strokeWidth
      , textAnchor
      , height
      , width
      , offset
      , cornerRadius
      , fill
      , margins
      , value
      , isLast
      , isFirst
    } = this.props;
    let {
      opacity
      , position
      , markerHeight
    } = this.state;
    opacity = this.getTweeningValue('opacity')|| opacity;
    position = this.getTweeningValue('position') || position;
    if(!value)return null;
    let transform = orient.match(/top|bottom/)?verticalTransform:horizontalTransform;
    let translate = orient.match(/top|bottom/)?this.translateY(position):this.translateX(position);
    value = moment(value).format('DD/MM/YYYY');
    let arrowScale = 0.01*0.75;
    let arrowOffset = offset + 2;
      return (
        <g
            opacity={opacity}
            transform={translate}>
          <g
              transform={`translate(${-width/2},${offset})`}>
              <rect
                  className={containerClassName}
                  fill={fill}
                  height={height}
                  rx={cornerRadius}
                  ry={cornerRadius}
                  width={width}
                >
              </rect>
              {isFirst?null:
                <g
                    className={arrowClassName}>
                    <path
                        d={leftPath}
                        transform={`translate(${margins.left},${22}) scale(${arrowScale}, -${arrowScale})`}/>
                    <rect
                        fill="transparent"
                        height={height}
                        onClick={this.onClickLeft}
                        style={arrowStyle}
                        transform={`translate(${-width/8},0)`}
                        width={width/2}/>
                </g>
              }
              {isLast?null:
                <g
                    className={arrowClassName}
                    transform={`translate(${width - margins.right - 10},${arrowOffset})`}>
                    <path
                        d={rightPath}
                        transform={`translate(${0},${-15}) scale(${arrowScale}, -${arrowScale})`}
                      />
                    <rect
                        fill="transparent"
                        height={height}
                        onClick={this.onClickRight}
                        style={arrowStyle}
                        transform={`translate(${-width/8},-${arrowOffset})`}
                        width={width/2}/>
                </g>
              }
              <text
                  strokeWidth={strokeWidth.toString()}
                  style={textStyle}
                  textAnchor={textAnchor}
                  transform={transform}
                  x={width/2}
                  y={height/2}>
                  {value}
              </text>
              <line
                  className={`${baseClassName}-line-marker`}
                  opacity="1"
                  stroke="#3182bd"
                  strokeDasharray="3,3"
                  strokeWidth={strokeWidth}
                  x1={width/2}
                  x2={width/2}
                  y1={-markerHeight}
                  y2="0"/>
          </g>
        </g>
      );
    }
});
