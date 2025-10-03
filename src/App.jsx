import { FiMapPin } from "react-icons/fi";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";
import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "04088fabe7007a2d88ed9e3a5570484c"; // Replace with your key

function App() {
  const [city, setCity] = useState("Surat");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [inputCity, setInputCity] = useState("");
  const [showForm, setShowForm] = useState(false); // 👈 new state to toggle form

  const getWeatherIcon = (condition, size = 48) => {
    switch (condition) {
      case "Clear":
        return <WiDaySunny size={size} />;
      case "Clouds":
        return <WiCloud size={size} />;
      case "Rain":
        return <WiRain size={size} />;
      case "Snow":
        return <WiSnow size={size} />;
      case "Thunderstorm":
        return <WiThunderstorm size={size} />;
      case "Mist":
      case "Fog":
      case "Haze":
        return <WiFog size={size} />;
      default:
        return <WiDaySunny size={size} />;
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      const daily = forecastData.list.filter((f) =>
        f.dt_txt.includes("12:00:00")
      );

      setWeather(data);
      setForecast(daily.slice(0, 4));
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity) {
      setCity(inputCity);
      setInputCity("");
      setShowForm(false); 
    }
  };

  return (
    <div className="app">
      {weather && (
        <div className="weather-container">
          {/* LEFT CARD */}
          <div className="left-card">
            <h2>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</h2>
            <p>{new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
            <p className="location">
              <FiMapPin size={18} style={{ marginRight: "6px" }} />{" "}
              {weather.name}, {weather.sys.country}
            </p>

            <div className="temp-section">
              {getWeatherIcon(weather.weather[0].main)}
              <h1>{Math.round(weather.main.temp)}°C</h1>
              <p>{weather.weather[0].main}</p>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="right-card">
            <div className="details">
              <p>
                <b>PRECIPITATION</b>{" "}
                {weather.rain ? weather.rain["1h"] + "%" : "0%"}
              </p>
              <p>
                <b>HUMIDITY</b> {weather.main.humidity}%
              </p>
              <p>
                <b>WIND</b> {weather.wind.speed} km/h
              </p>
            </div>

            <div className="forecast">
             {forecast.map((f, idx) => {
               const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
               const forecastDay = new Date(f.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });

          return (
              <div key={idx} className={`day ${today === forecastDay ? "active" : ""}`}>
              <p>{forecastDay}</p>
              {getWeatherIcon(f.weather[0].main, 28)}
              <p>{Math.round(f.main.temp)}°C</p>
          </div>
        );
       })}
     </div>


            {/* Toggle between Button and Form */}
            {!showForm ? (
              <button
                className="change-btn"
                onClick={() => setShowForm(true)}
              >
                <FiMapPin size={18} style={{ marginRight: "6px" }} />
                Change Location
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="change-location">
                <input
                  type="text"
                  value={inputCity}
                  onChange={(e) => setInputCity(e.target.value)}
                  placeholder="Enter city"
                />
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
