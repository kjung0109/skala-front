// 시간표에서 오늘 날짜에 해당하는 요일 열을 강조
document.addEventListener("DOMContentLoaded", function () {
  const tables = document.querySelectorAll(".table-scroll table");
  if (!tables.length) return;

  const now = new Date();
  const todayMonth = now.getMonth() + 1;
  const todayDate = now.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  let matched = false;

  tables.forEach(function (table) {
    const headers = Array.from(table.querySelectorAll("thead th"));
    let targetCol = -1;

    headers.forEach(function (th, i) {
      const m = th.textContent.match(/(\d+)\s*월\s*(\d+)\s*일/);
      if (m && Number(m[1]) === todayMonth && Number(m[2]) === todayDate) {
        targetCol = i;
        th.classList.add("today-head");
        th.insertAdjacentHTML(
          "beforeend",
          '<span class="today-badge">📍 오늘</span>'
        );
      }
    });

    if (targetCol === -1) return;
    matched = true;

    // rowspan/colspan을 고려해 tbody 그리드를 만들어 해당 열 셀만 태그
    const rows = table.querySelectorAll("tbody tr");
    const pending = {}; // 열 인덱스 -> 위에서 내려오는 rowspan 잔여 행 수

    rows.forEach(function (tr) {
      const occupied = {};
      for (const col in pending) {
        if (pending[col] > 0) {
          occupied[col] = true;
          pending[col]--;
        }
      }

      let cIdx = 0;
      Array.from(tr.children).forEach(function (cell) {
        while (occupied[cIdx]) cIdx++;

        const colspan = cell.colSpan || 1;
        const rowspan = cell.rowSpan || 1;

        if (cIdx <= targetCol && targetCol < cIdx + colspan) {
          cell.classList.add("today-col");
        }

        if (rowspan > 1) {
          for (let c = cIdx; c < cIdx + colspan; c++) {
            pending[c] = (pending[c] || 0) + (rowspan - 1);
          }
        }

        cIdx += colspan;
      });
    });
  });

  // 어느 표에도 오늘이 없으면 안내 문구 표시
  if (!matched) {
    const host = document.querySelector(".container");
    const firstCard = host && host.querySelector(".section-card");
    if (firstCard) {
      const note = document.createElement("p");
      note.className = "today-note";
      note.textContent =
        "📅 오늘(" + todayMonth + "월 " + todayDate + "일 " +
        weekdays[now.getDay()] + ")은 아래 시간표 기간에 포함되지 않습니다.";
      host.insertBefore(note, firstCard);
    }
  }
});
