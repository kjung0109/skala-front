const cityData = {
  seoul: { label: "대한민국 서울 KR", lat: 37.5665, lon: 126.978 },
  newyork: { label: "미국 뉴욕 US", lat: 40.7128, lon: -74.006 },
  la: { label: "미국 LA US", lat: 34.0522, lon: -118.2437 },
  vegas: { label: "미국 라스베가스 US", lat: 36.1699, lon: -115.1398 },
  tokyo: { label: "일본 도쿄 JP", lat: 35.6895, lon: 139.6917 },
  paris: { label: "프랑스 파리 FR", lat: 48.8566, lon: 2.3522 },
};

const citySelect = document.getElementById("citySelect");
const weatherBox = document.getElementById("weather-box");

citySelect.addEventListener("change", function () {
  const selectedCity = citySelect.value;

  if (!selectedCity) {
    weatherBox.innerHTML = "<p>도시를 선택하면 실시간 날씨 정보가 표시됩니다.</p>";
    return;
  }

  const city = cityData[selectedCity];

  weatherBox.innerHTML =
    "<p><strong>📍 " + city.label + "</strong></p>" +
    "<ul>" +
    "<li>위도(Latitude): " + city.lat + "</li>" +
    "<li>경도(Longitude): " + city.lon + "</li>" +
    "</ul>";
});
