export const cityData = {
  seoul: { label: "대한민국 서울 KR", lat: 37.5665, lon: 126.978 },
  newyork: { label: "미국 뉴욕 US", lat: 40.7128, lon: -74.006 },
  la: { label: "미국 LA US", lat: 34.0522, lon: -118.2437 },
  vegas: { label: "미국 라스베가스 US", lat: 36.1699, lon: -115.1398 },
  tokyo: { label: "일본 도쿄 JP", lat: 35.6895, lon: 139.6917 },
  paris: { label: "프랑스 파리 FR", lat: 48.8566, lon: 2.3522 },
};

export async function fetchWeather(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    lat +
    "&longitude=" +
    lon +
    "&current=temperature_2m,relative_humidity_2m,weather_code,is_day" +
    "&timezone=auto";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("날씨 API 응답 오류 (상태 코드: " + response.status + ")");
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error("날씨 데이터 형식이 올바르지 않습니다.");
  }

  return {
    time: data.current.time,
    temperature_2m: data.current.temperature_2m,
    relative_humidity_2m: data.current.relative_humidity_2m,
    weather_code: data.current.weather_code,
    is_day: data.current.is_day,
    timezone: data.timezone,
  };
}
