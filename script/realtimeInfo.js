import { cityData, fetchWeather } from "./weatherAPI.js";

const citySelect = document.getElementById("citySelect");
const weatherBox = document.getElementById("weather-box");

async function showWeather(cityKey) {
  const city = cityData[cityKey];

  weatherBox.innerHTML =
    "<p><strong>📌 " + city.label + "</strong></p>" +
    "<p>실시간 날씨 로딩 중... ⏳</p>";

  const current = await fetchWeather(city.lat, city.lon);

  weatherBox.innerHTML =
    "<p><strong>📌 " + city.label + " 실시간 날씨</strong></p>" +
    "<ul>" +
    "<li>현재 기온: " + current.temperature_2m + "°C</li>" +
    "<li>현재 습도: " + current.relative_humidity_2m + "%</li>" +
    "</ul>";
}

citySelect.addEventListener("change", function () {
  const selectedCity = citySelect.value;

  if (!selectedCity) {
    weatherBox.innerHTML = "<p>도시를 선택하면 실시간 날씨 정보가 표시됩니다.</p>";
    return;
  }

  showWeather(selectedCity);
});
