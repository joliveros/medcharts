import React
, {
  Component
} from 'react';
import { MaxMinScatterChart as Chart } from '../../src/index.js';
const data = require('./data');
const margins = {
  top: 10
  , right: 20
  , bottom: 60
  , left: 45
};

export default class Container extends Component {
  constructor(props){
    super();
    this.props = this.props || props;
    var { values } = data[0];
    values.map((value)=>{
      var { date } = value;
      value.date = new Date(date);
      return value;
    })
    this.props.data = data;
    this.state = {};
  }
  componentDidMount(){
    this.getChildContainerDimensions()
    window.addEventListener('resize', this.handleResize);
  }
  handleResize(e){
    this.getChildContainerDimensions();
  }
  getChildContainerDimensions(){
    var container = this.refs.container.getDOMNode();
    var dims = {
      width: container.offsetWidth
      , height: container.offsetHeight
    };
    this.setState({dims: dims});
  }
  render(){
    let {
      data
      , height
      , width
    } = this.props;
    let {
      dims
    } = this.state;

    return(
      <div
        ref="container"
        className="container"
        height={height}
        width={width}>
        <Chart
          {...dims}
          data={data}
          strokeWidth={3}
          margins={margins}
        />
      </div>
    )
  }
}
