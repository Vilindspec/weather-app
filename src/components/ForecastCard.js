import React from "react";

const ForecastCard = ({ date, icon, temp, description }) => {
  return (
    <div className="forecast-card">
      <p>{date}</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}.png`}
        alt={description}
      />
      <p>{temp}°C</p>
      <p style={{ textTransform: "capitalize" }}>{description}</p>
    </div>
  );
};

export default ForecastCard;
