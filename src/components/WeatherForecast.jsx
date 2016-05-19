import React from 'react';
import config from '../../config.js'

const wundergroundApiKey = config.weatherUnderground.apiKey;

class WeatherForecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherLoading: true
    }
  }

  weatherIcon(condition) {
    switch(condition) {
        case 'cloudy':
          return 'wi wi-day-cloudy';
        case 'rain':
          return 'wi wi-rain'
        case 'chanceflurries':
          return 'wi wi-snow-wind'
        case 'chancerain':
          return 'wi wi-rain'
        case 'chancesleat':
          return 'wi wi-sleet'
        case 'chancesnow':
          return 'wi wi-snow'
        case 'chancetstorms':
          return 'wi wi-thunderstorm'
        case 'clear':
          return 'wi wi-day-sunny'
        case 'flurries':
          return 'wi wi-snow-wind'
        case 'hazy':
          return 'wi wi-day-haze'
        case 'mostlycloudy':
          return 'wi wi-day-cloudy'
        case 'mostlysunny':
          return 'wi wi-day-sunny'
        case 'partlycloudy':
          return 'wi wi-day-cloudy'
        case 'partlysunny':
          return 'wi wi-day-sunny'
        case 'rain':
          return 'wi wi-showers'
        case 'sleat':
          return 'wi wi-sleet'
        case 'snow':
          return 'wi wi-snow'
        case 'sunny':
          return 'wi wi-day-sunny'
        case 'tstorms':
          return 'wi wi-thunderstorm'
      }
  }

  getWeather() {
    fetch(`http://api.wunderground.com/api/${wundergroundApiKey}/conditions/forecast/q/20164.json`).then((response) => {
      return response.json();
    }).then((j) => {
      let weatherIcon = this.weatherIcon(j.current_observation.icon);

      this.setState({
        weatherLoading: false,
        current: j.current_observation,
        forecast: j.forecast,
        weatherIcon
      });
    });
  }

  componentWillMount() {
    this.getWeather();

    setInterval(() => {
      this.getWeather();
    }, 1800000);

    // code for getting commute time

    // fetch('http://localhost:3000')
    //   .then((response) => {
    //     return response.json();
    //   }).then((j) => {
    //     console.log(j);
    //   });
  }

  render() {
    const weatherIcon = {
      fontSize: '4em'
    };
    const forecastItems = this.state.weatherLoading ?
      null :
      this.state.forecast.simpleforecast.forecastday.map((day, index) => {
        let weatherIcon = this.weatherIcon(day.icon)
        return (
          <li key={index}>
            <div className="left">{day.date.weekday_short}</div>
            <div className="center"><i className={weatherIcon} /></div>
            <div className="right">{day.high.fahrenheit}&deg; / {day.low.fahrenheit}&deg;</div>
          </li>
        );
      });
    const currentConditions = this.state.weatherLoading ?
      <div>Loading...</div> :
      <div className="weatherWidget mdl-shadow--2dp">
        <div className="widgetContent">
          <p className="location">{this.state.current.display_location.full}</p>
          <div className="currentConditions">
            <p>{Math.round(this.state.current.temp_f)} <i className="wi wi-fahrenheit" /></p>
            <i className={this.state.weatherIcon} style={weatherIcon} />
          </div>
          <div className="feelsLike">Feels like {Math.round(this.state.current.feelslike_f)}&deg;</div>
          <p className="conditionText">{this.state.current.weather}</p>
        </div>
        <ul className="threeDay">
          {forecastItems}
        </ul>
      </div>
    return (
      <div className="forecast">
        {currentConditions}
      </div>
    );
  }
}

WeatherForecast.defaultProps = {
};

export default WeatherForecast;
