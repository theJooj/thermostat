require('normalize.css');
require('styles/App.less');

import React from 'react';
import Thermostat from './Thermostat'
import WeatherForecast from './WeatherForecast'

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempLoading: true,
      tempOverride: false,
      currentState: 'off'
    };
  }
  componentWillMount() {
    setInterval(()=>{
      fetch('http://127.0.0.1:5000/').then((response) => {
        return response.json();
      }).then((j) => {
        this.setState({
          tempLoading: false,
          temperature: j.temperature,
          targetTemp: j.targetTemp,
          tempOverride: j.tempOverride,
          currentState: j.currentState
        });
      });
    }, 5000);
  }

  increaseTemp() {
    fetch('http://127.0.0.1:5000/increaseTemp').then((response) => {
      return response.json();
    }).then((j) => {
      this.setState({
        tempOverride: j.tempOverride,
        targetTemp: j.targetTemp
      });
    });
  }

  decreaseTemp() {
    fetch('http://127.0.0.1:5000/decreaseTemp').then((response) => {
      return response.json();
    }).then((j) => {
      this.setState({
        tempOverride: j.tempOverride,
        targetTemp: j.targetTemp
      });
    });
  }

  resumeProgram() {
    fetch('http://127.0.0.1:5000/resumeProgram').then((response) => {
      return response.json();
    }).then((j) => {
      this.setState({
        tempOverride: j.tempOverride,
        targetTemp: j.targetTemp
      });
    });
  }

  render() {
    return (
      <div className="dashboard">
        <Thermostat
          currentState = {this.state.currentState}
          tempOverride = {this.state.tempOverride}
          tempLoading = {this.state.tempLoading}
          temperature = {this.state.temperature}
          targetTemp = {this.state.targetTemp}
          resumeProgram = {this.resumeProgram}
          increaseTemp = {this.increaseTemp}
          decreaseTemp = {this.decreaseTemp} />
        <WeatherForecast />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
