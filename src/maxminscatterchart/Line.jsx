'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Line',

  propTypes: {
    x1:               React.PropTypes.number.isRequired,
    y1:               React.PropTypes.number.isRequired,
    x2:               React.PropTypes.number.isRequired,
    y2:               React.PropTypes.number.isRequired,
    fill:             React.PropTypes.string,
    path:             React.PropTypes.string,
    stroke:           React.PropTypes.string,
    strokeWidth:      React.PropTypes.number,
    strokeDashArray:  React.PropTypes.string,
    className:        React.PropTypes.string
  },

  getDefaultProps() {
    return {
      stroke: '#3182bd',
      fill: 'none',
      strokeWidth: 1,
      className: 'rd3-linechart-line'
    };
  },

  render() {
    var props = this.props;
    return (
      <line
        x1={props.x1}
        y1={props.y1}
        x2={props.x2}
        y2={props.y2}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        strokeDasharray={props.strokeDashArray}
        fill={props.fill}
        className={props.className}
      />
    );
  }

});
