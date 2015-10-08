'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'Circle',

  propTypes: {
    circleFill:       React.PropTypes.string.isRequired,
    circleRadius:     React.PropTypes.number.isRequired,
    className:        React.PropTypes.string,
    cx:               React.PropTypes.number.isRequired,
    cy:               React.PropTypes.number.isRequired
  },

  getDefaultProps() {
    return {
      className:    'rd3-scatterchart-voronoi-circle',
      pathFill:     'transparent'
    };
  },

  render() {
    var props = this.props;

    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        strokeWidth={props.strokeWidth}
        stroke={props.stroke}
        className={props.className}
        fill={props.circleFill}
        r={props.circleRadius}
      />

    );
  },
});
