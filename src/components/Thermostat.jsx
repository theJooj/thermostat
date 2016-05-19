import React from 'react';
import 'whatwg-fetch';

class Thermostat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let currentStateIcon;
    switch(this.props.currentState){
      case 'heat':
        currentStateIcon = <i className="fa fa-2x fa-fire mdl-button--primary" aria-hidden="true"></i>
        break;
      case 'cool':
        currentStateIcon = <i className="wi fa-2x wi-snowflake-cold mdl-button--accent"></i>
        break;
      case 'off':
        currentStateIcon = <span>Off</span>
        break;
    }

    const resumeButton = this.props.tempOverride ?
      <button onClick={this.props.resumeProgram} className="mdl-button mdl-js-button mdl-button--raised resume">
        Resume Program
      </button> :  null;

    const thermostatRender = this.props.tempLoading ?
      <div>Getting info from thermostat...</div> :
      <div className="thermostatContent">
        <div className="display">
          <p>{Math.round(this.props.temperature)}<i className="wi wi-fahrenheit" /></p>
          <div className="state">{this.props.targetTemp}&deg; {currentStateIcon}</div>
        </div>
        <div className="controls">
          <button onClick={this.props.increaseTemp} className="mdl-button mdl-js-button mdl-button--fab mdl-button--primary" style={{marginBottom: 20}}>
            <i className="material-icons">add</i>
          </button>
          <button onClick={this.props.decreaseTemp} className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
            <i className="material-icons">remove</i>
          </button>
          {resumeButton}
        </div>
      </div>
    return (
      <div className="thermostat">
        {thermostatRender}
      </div>
    );
  }
}

Thermostat.defaultProps = {
};

export default Thermostat;
