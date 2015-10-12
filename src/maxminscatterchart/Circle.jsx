'use strict';

var React = require('react');

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
          className={props.className}
          cx={props.cx}
          cy={props.cy}
          fill={props.circleFill}
          r={props.circleRadius}
          stroke={props.stroke}
          strokeWidth={props.strokeWidth}
      />

    );
  },
});
