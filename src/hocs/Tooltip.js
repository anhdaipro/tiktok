import React,{useState,useEffect,useRef,useCallback} from 'react'
export default class Tooltip extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    }
    this.handleMouseIn = this.handleMouseIn.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }
  
  handleMouseIn() {
    this.setState({ show: true });
  }

  handleMouseOut() {
    this.setState({ show: false });
  }

  render() {
    return (
      <div className='tooltip'
          onMouseOver={this.handleMouseIn}
          onMouseLeave={this.handleMouseOut}
      >
        {this.state.show &&
            <div className={`tooltip-content ${this.props.position}`}>
                {this.props.content}
            </div>
        }
        {this.props.children}
      </div>
    );
  }
}
