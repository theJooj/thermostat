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
      currentState: 'off',
      counter: 60
    };
  }
  componentWillMount() {
    // used for testing when away from python server
    // this.setState({
    //   tempLoading: false,
    //   temperature: 70
    // });
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

    const screensaver = () => {
      setTimeout(() => {
        let newCounter;
        if(this.state.counter > 0) {
          newCounter = this.state.counter - 1;
          this.setState({counter: newCounter});
        } else {
          this.setState({counter: 0});
        }
        screensaver();
      }, 1000)
    }
    screensaver();
  }

  resetCounter(){
    this.setState({counter: 60});
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
    const dashboardContent = this.state.counter > 0 ?
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
    :
    <div className="screensaver">
      <p>{this.state.temperature}<i className="wi wi-fahrenheit" /></p>
    </div>
    return (
      <div onClick={this.resetCounter.bind(this)}>
        {dashboardContent}
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
