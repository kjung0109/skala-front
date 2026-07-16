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

// WMO 코드와 낮/밤을 배경 그라데이션용 카테고리 클래스로 변환
function weatherCategory(code, isDay) {
  if (code === 0 || code === 1) return isDay ? "sky-clear-day" : "sky-clear-night";
  if (code === 2 || code === 3) return "sky-cloud";
  if (code === 45 || code === 48) return "sky-fog";
  if (code >= 71 && code <= 77) return "sky-snow";
  if (code === 85 || code === 86) return "sky-snow";
  if (code >= 95) return "sky-storm";
  if (code >= 51 && code <= 82) return "sky-rain";
  return "sky-cloud";
}

const citySelect = document.getElementById("citySelect");
const myLocationBtn = document.getElementById("myLocationBtn");
const weatherBox = document.getElementById("weather-box");
const worldtimeBox = document.getElementById("worldtime-box");

let clockTimer;

// 선택한 도시의 시간대(IANA)를 이용해 현지 시각을 매초 갱신
function startLocalClock(timezone) {
  clearInterval(clockTimer);

  const bigEl = worldtimeBox.querySelector(".time-big");
  const dateEl = worldtimeBox.querySelector(".time-date");
  if (!bigEl || !dateEl) return;

  const timeFmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateFmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  function tick() {
    const now = new Date();
    bigEl.textContent = timeFmt.format(now);
    dateEl.textContent = dateFmt.format(now);
  }

  tick();
  clockTimer = setInterval(tick, 1000);
}

// 브라우저 Geolocation으로 현재 좌표를 Promise로 반환
function getPosition() {
  return new Promise(function (resolve, reject) {
    if (!("geolocation" in navigator)) {
      reject(new Error("geolocation 미지원"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000,
    });
  });
}

async function showWeather(cityKey) {
  weatherBox.innerHTML = "<p>실시간 날씨 로딩 중... ⏳</p>";
  worldtimeBox.innerHTML = "<p>현지 시각 불러오는 중... ⏳</p>";

  let city;
  if (cityKey === "mylocation") {
    try {
      const position = await getPosition();
      city = {
        label: "내 위치",
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
    } catch (error) {
      console.error("위치를 가져오지 못했습니다:", error);
      clearInterval(clockTimer);
      weatherBox.innerHTML =
        "<p>⚠️ 위치 정보를 사용할 수 없습니다.<br>브라우저에서 위치 접근을 허용한 뒤 다시 선택해 주세요.</p>";
      worldtimeBox.innerHTML = "<p>⚠️ 현지 시각을 불러오지 못했습니다.</p>";
      return;
    }
  } else {
    city = cityData[cityKey];
  }

  try {
    const current = await fetchWeather(city.lat, city.lon);
    const [localDate, localTime] = current.time.split("T");
    const sky = describeWeather(current.weather_code, current.is_day);
    const skyClass = weatherCategory(current.weather_code, current.is_day);

    weatherBox.innerHTML =
      "<p class=\"info-city\">📌 " + city.label + " 실시간 날씨</p>" +
      "<div class=\"weather-main " + skyClass + "\">" +
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

    // API가 준 시간대로 현지 시각을 실시간 갱신
    startLocalClock(current.timezone);
  } catch (error) {
    console.error("날씨 정보를 불러오지 못했습니다:", error);
    clearInterval(clockTimer);
    weatherBox.innerHTML =
      "<p>⚠️ 날씨 정보를 불러오지 못했습니다.<br>네트워크 상태를 확인한 뒤 다시 선택해 주세요.</p>";
    worldtimeBox.innerHTML =
      "<p>⚠️ 현지 시각을 불러오지 못했습니다.</p>";
  }
}

citySelect.addEventListener("change", function () {
  const selectedCity = citySelect.value;

  if (!selectedCity) {
    clearInterval(clockTimer);
    weatherBox.innerHTML = "<p>도시를 선택하면 실시간 날씨 정보가 표시됩니다.</p>";
    worldtimeBox.innerHTML = "<p>도시를 선택하면 현지 시각이 표시됩니다.</p>";
    return;
  }

  showWeather(selectedCity);
});

// '내 위치' 버튼: 실시간 좌표로 현재 위치 날씨 조회 (조회 중 로딩 상태 표시)
if (myLocationBtn) {
  const locationLabel = myLocationBtn.querySelector(".my-location-label");

  myLocationBtn.addEventListener("click", async function () {
    citySelect.value = "";
    myLocationBtn.classList.add("locating");
    myLocationBtn.disabled = true;
    if (locationLabel) locationLabel.textContent = "확인 중...";

    await showWeather("mylocation");

    if (locationLabel) locationLabel.textContent = "내 위치";
    myLocationBtn.classList.remove("locating");
    myLocationBtn.disabled = false;
  });
}

// 페이지 로드 시 기본 도시(서울) 날씨를 자동으로 표시
const defaultCity = "seoul";
citySelect.value = defaultCity;
showWeather(defaultCity);
