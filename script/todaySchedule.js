// 홈 화면에 오늘 날짜의 일정을 표시 (myClass.html 시간표를 단일 소스로 파싱)
document.addEventListener("DOMContentLoaded", async function () {
  const listEl = document.getElementById("today-schedule");
  const dayEl = document.getElementById("today-schedule-day");
  if (!listEl) return;

  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  if (dayEl) {
    dayEl.textContent = month + "월 " + date + "일 (" + weekdays[now.getDay()] + ")";
  }

  try {
    const response = await fetch("myClass.html");
    if (!response.ok) {
      throw new Error("시간표 응답 오류 (상태 코드: " + response.status + ")");
    }
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const blocks = extractDayBlocks(doc, month, date);

    if (!blocks || !blocks.length) {
      listEl.innerHTML =
        '<li class="ts-empty">오늘은 등록된 일정이 없습니다.</li>';
      return;
    }

    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    listEl.innerHTML = blocks
      .map(function (b) {
        const time = b.start + (b.end ? "~" + b.end : "");
        const startMin = toMinutes(b.start);
        const endMin = b.end ? toMinutes(b.end) : startMin;
        const isNow = b.end && startMin <= nowMinutes && nowMinutes < endMin;
        const isPast = b.end && endMin <= nowMinutes;
        const cls =
          "ts-item" + (isNow ? " is-now" : "") + (isPast ? " is-past" : "");
        return (
          '<li class="' + cls + '">' +
          '<span class="ts-time">' + time + "</span>" +
          '<span class="ts-icon" aria-hidden="true">' + activityIcon(b.activity) + "</span>" +
          '<span class="ts-act">' + b.activity + "</span>" +
          (isNow ? '<span class="ts-now-badge">NOW</span>' : "") +
          "</li>"
        );
      })
      .join("");
  } catch (error) {
    console.error("오늘 일정을 불러오지 못했습니다:", error);
    listEl.innerHTML =
      '<li class="ts-empty">일정을 불러오지 못했습니다.</li>';
  }
});

// 활동 내용의 키워드로 대표 아이콘을 결정 (구체적인 키워드부터 검사)
function activityIcon(text) {
  if (/점심/.test(text)) return "🍽️";
  if (/휴일/.test(text)) return "☕";
  if (/저녁|휴식/.test(text)) return "🌙";
  if (/면접/.test(text)) return "🎤";
  if (/인적성|모의검사|검사|시험/.test(text)) return "📝";
  if (/GitHub|깃|제출/.test(text)) return "🐙";
  if (/실습/.test(text)) return "💻";
  if (/Python/i.test(text)) return "🐍";
  if (/HTML|CSS|JavaScript/.test(text)) return "📘";
  if (/분석|직무|기업|점검|정리|준비|키워드|확인/.test(text)) return "🔍";
  return "📌";
}

// "HH:MM" 을 분 단위 숫자로 변환
function toMinutes(t) {
  const parts = t.split(":");
  return Number(parts[0]) * 60 + Number(parts[1]);
}

// 시간표 표에서 오늘 열의 일정을 (시간·활동) 블록으로 추출
function extractDayBlocks(doc, month, date) {
  const tables = doc.querySelectorAll(".table-scroll table");

  for (const table of tables) {
    const headers = Array.from(table.querySelectorAll("thead th"));
    let target = -1;
    headers.forEach(function (th, i) {
      const m = th.textContent.match(/(\d+)\s*월\s*(\d+)\s*일/);
      if (m && Number(m[1]) === month && Number(m[2]) === date) {
        target = i;
      }
    });
    if (target === -1) continue;

    // rowspan/colspan을 고려해 각 행의 시간과 오늘 열 활동을 구함
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const pending = {}; // 열 -> { rowsLeft, cell }
    const perRow = [];

    rows.forEach(function (row) {
      const occupied = {};
      for (const col in pending) {
        if (pending[col].rowsLeft > 0) {
          occupied[col] = pending[col].cell;
          pending[col].rowsLeft--;
        }
      }

      let cIdx = 0;
      let timeLabel = "";
      let activityCell = occupied[target] || null;

      Array.from(row.children).forEach(function (cell) {
        while (occupied[cIdx]) cIdx++;

        const colspan = cell.colSpan || 1;
        const rowspan = cell.rowSpan || 1;

        if (cIdx === 0 && cell.tagName === "TH") {
          timeLabel = cell.textContent.trim();
        }
        if (cIdx <= target && target < cIdx + colspan) {
          activityCell = cell;
        }
        if (rowspan > 1) {
          for (let c = cIdx; c < cIdx + colspan; c++) {
            pending[c] = { rowsLeft: rowspan - 1, cell: cell };
          }
        }
        cIdx += colspan;
      });

      perRow.push({
        time: timeLabel,
        activity: activityCell ? activityCell.textContent.trim() : "",
      });
    });

    // 같은 활동이 연속되는 시간대를 하나의 블록으로 합침
    const blocks = [];
    perRow.forEach(function (r) {
      if (!r.activity) return;
      const parts = r.time.split("~");
      const start = parts[0] || r.time;
      const end = parts[1] || "";
      const last = blocks[blocks.length - 1];
      if (last && last.activity === r.activity) {
        last.end = end || last.end;
      } else {
        blocks.push({ start: start, end: end, activity: r.activity });
      }
    });

    return blocks;
  }

  return null;
}
