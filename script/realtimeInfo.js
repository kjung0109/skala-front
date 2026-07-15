import { cityData, fetchWeather } from "./weatherAPI.js";

const citySelect = document.getElementById("citySelect");
const weatherBox = document.getElementById("weather-box");
const worldtimeBox = document.getElementById("worldtime-box");

async function showWeather(cityKey) {
  const city = cityData[cityKey];

  weatherBox.innerHTML =
    "<p><strong>📌 " + city.label + "</strong></p>" +
    "<p>실시간 날씨 로딩 중... ⏳</p>";
  worldtimeBox.innerHTML = "<p>현지 시각 불러오는 중... ⏳</p>";

  const current = await fetchWeather(city.lat, city.lon);
  const [localDate, localTime] = current.time.split("T");

  weatherBox.innerHTML =
    "<p><strong>📌 " + city.label + " 실시간 날씨</strong></p>" +
    "<ul>" +
    "<li>현재 기온: " + current.temperature_2m + "°C</li>" +
    "<li>현재 습도: " + current.relative_humidity_2m + "%</li>" +
    "</ul>";

  worldtimeBox.innerHTML =
    "<p><strong>🕐 " + city.label + " 현지 시각</strong></p>" +
    "<ul>" +
    "<li>" + localDate + " " + localTime + "</li>" +
    "<li>시간대: " + current.timezone + "</li>" +
    "</ul>";
}

citySelect.addEventListener("change", function () {
  const selectedCity = citySelect.value;

  if (!selectedCity) {
    weatherBox.innerHTML = "<p>도시를 선택하면 실시간 날씨 정보가 표시됩니다.</p>";
    worldtimeBox.innerHTML = "<p>도시를 선택하면 현지 시각이 표시됩니다.</p>";
    return;
  }

  showWeather(selectedCity);
});
