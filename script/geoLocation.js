// 실제 위치 기반으로 현재 지역명을 표시
// 1) 브라우저 Geolocation으로 위도·경도 획득
// 2) BigDataCloud 역지오코딩(좌표 -> 주소, 무료·키 불필요)으로 지역명 변환
document.addEventListener("DOMContentLoaded", function () {
  const badge = document.getElementById("location-badge");
  if (!badge) return;

  if (!("geolocation" in navigator)) {
    badge.textContent = "📍 위치 정보를 지원하지 않는 브라우저입니다";
    return;
  }

  badge.textContent = "📍 위치 확인 중...";

  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 600000,
  });

  async function onSuccess(position) {
    const { latitude, longitude } = position.coords;

    try {
      const url =
        "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
        latitude + "&longitude=" + longitude + "&localityLanguage=ko";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("역지오코딩 응답 오류 (상태 코드: " + response.status + ")");
      }

      const data = await response.json();
      const region = data.principalSubdivision || "";

      // 행정 계층에서 구/군(adminLevel 6)을, 그리고 동(locality)까지 표시
      const admins = (data.localityInfo && data.localityInfo.administrative) || [];
      const districts = admins.filter(function (a) {
        return a.adminLevel === 6;
      });
      const district = districts.length ? districts[districts.length - 1].name : "";
      const dong = data.locality || "";

      // 시 · 구 · 동 순으로 조합하되 중복은 제거
      const parts = [];
      [region, district, dong].forEach(function (name) {
        if (name && parts.indexOf(name) === -1) {
          parts.push(name);
        }
      });

      const label = parts.join(" ") || data.city || data.countryName || "알 수 없는 위치";
      badge.textContent = "📍 " + label;
    } catch (error) {
      console.error("위치 이름을 가져오지 못했습니다:", error);
      badge.textContent =
        "📍 현재 위치 (" + latitude.toFixed(2) + ", " + longitude.toFixed(2) + ")";
    }
  }

  function onError(error) {
    let message;
    if (error.code === error.PERMISSION_DENIED) {
      message = "위치 권한이 거부되었습니다";
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      message = "위치를 확인할 수 없습니다";
    } else if (error.code === error.TIMEOUT) {
      message = "위치 확인 시간이 초과되었습니다";
    } else {
      message = "위치를 가져오지 못했습니다";
    }
    badge.textContent = "📍 " + message;
  }
});
