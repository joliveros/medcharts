'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Line',

  propTypes: {
    className:        React.PropTypes.string,
    fill:             React.PropTypes.string,
    path:             React.PropTypes.string,
    stroke:           React.PropTypes.string,
    strokeDashArray:  React.PropTypes.string,
    strokeWidth:      React.PropTypes.number,
    x1:               React.PropTypes.number.isRequired,
    x2:               React.PropTypes.number.isRequired,
    y1:               React.PropTypes.number.isRequired,
    y2:               React.PropTypes.number.isRequired
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
          className={props.className}
          fill={props.fill}
          stroke={props.stroke}
          strokeDasharray={props.strokeDashArray}
          strokeWidth={props.strokeWidth}
          x1={props.x1}
          x2={props.x2}
          y1={props.y1}
          y2={props.y2}
      />
    );
  }

});
