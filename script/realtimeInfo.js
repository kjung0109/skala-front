import { cityData, fetchWeather } from "./weatherAPI.js";

// WMO 날씨 코드를 아이콘과 설명으로 변환 (is_day: 1이면 낮, 0이면 밤)
function describeWeather(code, isDay) {
  const clearIcon = isDay ? "☀️" : "🌙";
  const table = {
    0: { icon: clearIcon, text: "맑음" },
    1: { icon: isDay ? "🌤️" : "🌙", text: "대체로 맑음" },
    2: { icon: "⛅", text: "구름 조금" },
    3: { icon: "☁️", text: "흐림" },
    45: { icon: "🌫️", text: "안개" },
    48: { icon: "🌫️", text: "짙은 안개" },
    51: { icon: "🌦️", text: "약한 이슬비" },
    53: { icon: "🌦️", text: "이슬비" },
    55: { icon: "🌦️", text: "강한 이슬비" },
    61: { icon: "🌧️", text: "약한 비" },
    63: { icon: "🌧️", text: "비" },
    65: { icon: "🌧️", text: "강한 비" },
    66: { icon: "🌧️", text: "어는 비" },
    67: { icon: "🌧️", text: "강한 어는 비" },
    71: { icon: "🌨️", text: "약한 눈" },
    73: { icon: "❄️", text: "눈" },
    75: { icon: "❄️", text: "강한 눈" },
    77: { icon: "🌨️", text: "싸락눈" },
    80: { icon: "🌦️", text: "약한 소나기" },
    81: { icon: "🌦️", text: "소나기" },
    82: { icon: "⛈️", text: "강한 소나기" },
    85: { icon: "🌨️", text: "소나기눈" },
    86: { icon: "🌨️", text: "강한 소나기눈" },
    95: { icon: "⛈️", text: "뇌우" },
    96: { icon: "⛈️", text: "우박 동반 뇌우" },
    99: { icon: "⛈️", text: "강한 우박 뇌우" },
  };
  return table[code] || { icon: "🌡️", text: "정보 없음" };
}

const citySelect = document.getElementById("citySelect");
const weatherBox = document.getElementById("weather-box");
const worldtimeBox = document.getElementById("worldtime-box");

async function showWeather(cityKey) {
  const city = cityData[cityKey];

  weatherBox.innerHTML =
    "<p><strong>📌 " + city.label + "</strong></p>" +
    "<p>실시간 날씨 로딩 중... ⏳</p>";
  worldtimeBox.innerHTML = "<p>현지 시각 불러오는 중... ⏳</p>";

  try {
    const current = await fetchWeather(city.lat, city.lon);
    const [localDate, localTime] = current.time.split("T");
    const sky = describeWeather(current.weather_code, current.is_day);

    weatherBox.innerHTML =
      "<p class=\"info-city\">📌 " + city.label + " 실시간 날씨</p>" +
      "<div class=\"weather-main\">" +
      "<span class=\"weather-main-icon\">" + sky.icon + "</span>" +
      "<span class=\"weather-main-text\">" + sky.text + "</span>" +
      "</div>" +
      "<div class=\"stat-grid\">" +
      "<div class=\"stat-tile\">" +
      "<span class=\"stat-tile-icon\">🌡️</span>" +
      "<span class=\"stat-tile-value\">" + current.temperature_2m + "°C</span>" +
      "<span class=\"stat-tile-label\">기온</span>" +
      "</div>" +
      "<div class=\"stat-tile\">" +
      "<span class=\"stat-tile-icon\">💧</span>" +
      "<span class=\"stat-tile-value\">" + current.relative_humidity_2m + "%</span>" +
      "<span class=\"stat-tile-label\">습도</span>" +
      "</div>" +
      "</div>";

    worldtimeBox.innerHTML =
      "<p class=\"info-city\">🕐 " + city.label + " 현지 시각</p>" +
      "<div class=\"time-display\">" +
      "<span class=\"time-big\">" + localTime + "</span>" +
      "<span class=\"time-date\">" + localDate + "</span>" +
      "</div>" +
      "<p class=\"time-zone\">🌐 " + current.timezone + "</p>";
  } catch (error) {
    console.error("날씨 정보를 불러오지 못했습니다:", error);
    weatherBox.innerHTML =
      "<p>⚠️ 날씨 정보를 불러오지 못했습니다.<br>네트워크 상태를 확인한 뒤 다시 선택해 주세요.</p>";
    worldtimeBox.innerHTML =
      "<p>⚠️ 현지 시각을 불러오지 못했습니다.</p>";
  }
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

// 페이지 로드 시 기본 도시(서울) 날씨를 자동으로 표시
const defaultCity = "seoul";
citySelect.value = defaultCity;
showWeather(defaultCity);
