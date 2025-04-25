import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./sun.avif";
import ForecastCard from "./components/ForecastCard";

const apiKey = "37391e49cd663e7ef8ada10f9bd5f559";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [recent, setRecent] = useState(
    () => JSON.parse(localStorage.getItem("recentCities")) || []
  );

  // Get weather by coordinates (on page load)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=${language}&units=metric`
      )
        .then((res) => res.json())
        .then((data) => {
          setWeather(data);
          setCity(data.name);
          getForecast(data.coord.lat, data.coord.lon);
        })
        .catch((err) => console.error(err));
    });
  }, [language]); 
  

  // Get forecast data
  const getForecast = async (lat, lon) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
  
    const dailyForecast = [];
    const forecastMap = {};
  
    data.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!forecastMap[date] && item.dt_txt.includes('12:00:00')) {
        forecastMap[date] = item;
      }
    });
  
    for (let date in forecastMap) {
      dailyForecast.push(forecastMap[date]);
    }
  
    setForecast(dailyForecast);
  };
  
  // Get weather by city name
  const getWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=${language}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setWeather(data);
      getForecast(data.coord.lat, data.coord.lon);
      setError("");

      // Save to recent
      const updated = [data.name, ...recent.filter((c) => c !== data.name)].slice(0, 5);
      setRecent(updated);
      localStorage.setItem("recentCities", JSON.stringify(updated));

      // Notify
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Weather in ${data.name}`, {
          body: `${data.weather[0].description}, ${data.main.temp}°C`,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      }
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  // Voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
  
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.start();
  
    recognition.onresult = (event) => {
      const spokenCity = event.results[0][0].transcript;
      setCity(spokenCity);
      getWeather(spokenCity);
    };
  
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError('Microphone error: ' + event.error);
    };
  };
  

  // Ask for notification permission once
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className={`container theme-${theme}`}>
      <header>
        <img src={logo} alt="Weather Logo" className="logo" />
        <h1>React Weather App</h1>

               <button
          onClick={() =>
            setTheme(
              theme === "light" ? "sunset" : theme === "sunset" ? "midnight" : "light"
            )
          }
          className="theme-toggle"
        >
          Switch Theme
        </button>
      </header>

      <section className="search">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Search</button>
        <button onClick={handleVoiceInput}>🎤</button>
      </section>

      <div className="recent-searches">
        {recent.map((c, i) => (
          <button key={i} onClick={() => setCity(c)}>
            {c}
          </button>
        ))}
      </div>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="pt">Português</option>
      </select>

      {error && <p className="error">{error}</p>}

      {weather && (
        <section className="card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p className="temp">{weather.main.temp}°C</p>
          <p className="desc">{weather.weather[0].description}</p>
        </section>
      )}

      {/* {forecast.length > 0 && (
        <section className="forecast-grid">
          {forecast.map((item, index) => (
            <div className="forecast-card" key={index}>
              <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt=""
              />
              <p>{item.main.temp}°C</p>
              <p style={{ textTransform: "capitalize" }}>
                {item.weather[0].description}
              </p>
            </div>
          ))}
        </section>
      )} */}



{forecast.length > 0 && (
  <section className="forecast-grid">
    {forecast.map((item, index) => (
      <ForecastCard
        key={index}
        date={new Date(item.dt_txt).toLocaleDateString()}
        icon={item.weather[0].icon}
        temp={item.main.temp}
        description={item.weather[0].description}
      />
    ))}
  </section>
)}


      <footer>
        <p>&copy;2025 Vilindspec_All Rights Reserved.</p>
      </footer>
    </div>
  );
}


export default App;