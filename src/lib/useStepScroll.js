import { useEffect } from "react";

/**
 * 페이지를 "한 칸씩 툭툭 걸리게" 스크롤하는 컨트롤러.
 * - 휠/트랙패드/스와이프/키보드 한 번에 한 정거장만 이동
 * - 세게 굴려도 한 칸만 (감도 둔화 + 쿨다운)
 * - 정거장 사이는 부드럽게 이어져 섹션 애니메이션이 자연스럽게 재생됨
 *
 * 정거장 = 큰 섹션 + 그 안의 핵심 장면(프레임).
 * TALL_STOPS: <main> 안 섹션 순서별로, (섹션 높이 - 화면높이) 대비 멈출 위치(0~1).
 */
const TALL_STOPS = {
  0: [0, 1], // Hero: 로고 인트로 전체를 한 흐름으로 (덜 빡빡하게)
  // Question: 빈 화면(커서) → 한 칸 이동하며 "등산?" 타이핑 → 아재 운동 → 마지막 카피
  1: [0.02, 0.2, 0.45, 0.85],
  // Brand: 카피 → 로더 장면 진입(여기서 동그라미는 시간에 맞춰 자동으로 채워짐)
  2: [0.22, 0.6],
};

function buildStops() {
  const vh = window.innerHeight;
  const sections = Array.from(document.querySelectorAll("main > section"));
  const stops = [];

  sections.forEach((sec, i) => {
    const top = sec.offsetTop;
    const scrollable = Math.max(sec.offsetHeight - vh, 0);

    if (TALL_STOPS[i]) {
      TALL_STOPS[i].forEach((f) => stops.push(top + f * scrollable));
    } else if (scrollable <= 8) {
      stops.push(top); // 화면보다 짧은 섹션: 위쪽 한 정거장
    } else {
      // 일반 섹션이 길면 화면 단위로 나눠 정거장 추가
      const stepPx = vh * 0.9;
      const count = Math.ceil(scrollable / stepPx);
      for (let s = 0; s <= count; s++) {
        stops.push(top + Math.min(s * stepPx, scrollable));
      }
    }
  });

  const maxY = Math.max(
    document.documentElement.scrollHeight - vh,
    0
  );
  const cleaned = stops
    .map((y) => Math.round(Math.max(0, Math.min(y, maxY))))
    .sort((a, b) => a - b);

  // 너무 가까운(20px 이내) 정거장 합치기
  const result = [];
  for (const y of cleaned) {
    if (!result.length || y - result[result.length - 1] > 20) result.push(y);
  }
  return result;
}

export function useStepScroll() {
  useEffect(() => {
    let raf = 0;
    let touchStartY = null;
    let isMoving = false; // 한 칸 이동(트윈) 진행 중
    let prevTime = performance.now();
    let scrollings = []; // 최근 휠 신호 세기 기록

    // 최근 number개 신호 세기의 평균
    const getAverage = (arr, number) => {
      const last = arr.slice(Math.max(arr.length - number, 0));
      if (!last.length) return 0;
      return last.reduce((a, b) => a + b, 0) / last.length;
    };

    // ease-out: 시작은 바로 붙고 끝에서 부드럽게 안착 → "두둑" 멈칫거림 제거
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateTo = (y) => {
      cancelAnimationFrame(raf);
      const startY = window.scrollY;
      const dist = y - startY;
      if (Math.abs(dist) < 1) return;
      // 이동 거리에 비례한 시간(가까우면 빠르게, 멀면 천천히)
      const dur = Math.min(Math.max(Math.abs(dist) * 0.5, 450), 900);
      const t0 = performance.now();
      isMoving = true;
      const tick = (now) => {
        const t = Math.min((now - t0) / dur, 1);
        window.scrollTo(0, startY + dist * easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else isMoving = false;
      };
      raf = requestAnimationFrame(tick);
    };

    const step = (dir) => {
      const stops = buildStops();
      if (stops.length < 2) return;
      const y = window.scrollY;
      const eps = 6;
      let target;
      if (dir > 0) {
        target = stops.find((s) => s > y + eps);
      } else {
        const prior = stops.filter((s) => s < y - eps);
        target = prior[prior.length - 1];
      }
      if (target === undefined) return;
      animateTo(target);
    };

    // 키보드·터치는 관성이 없으므로 이동 중만 아니면 바로 한 칸.
    const doStep = (dir) => {
      if (isMoving) return;
      step(dir);
    };

    // 휠/트랙패드: 신호 세기가 점점 커지면(새로 굴린 손짓) 한 칸 이동,
    // 점점 작아지면(관성 꼬리) 무시. → 한 번 굴림 = 딱 한 칸, 절대 안 멈춤.
    const onWheel = (e) => {
      e.preventDefault();
      const curTime = performance.now();
      const abs = Math.abs(e.deltaY);

      const timeDiff = curTime - prevTime;
      prevTime = curTime;
      // 0.2초 이상 끊겼으면 새 손짓 — 기록 초기화
      if (timeDiff > 200) scrollings = [];
      if (scrollings.length > 149) scrollings.shift();
      scrollings.push(abs);

      if (abs < 2 || isMoving) return;

      // 최근 신호(끝 10개)가 그 이전 흐름(70개)보다 세거나 같으면 = 가속 중 = 새 손짓
      const accelerating = getAverage(scrollings, 10) >= getAverage(scrollings, 70);
      if (accelerating) step(e.deltaY > 0 ? 1 : -1);
    };

    const onKey = (e) => {
      const down = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const up = ["ArrowUp", "PageUp"];
      if (down.includes(e.key)) {
        e.preventDefault();
        doStep(1);
      } else if (up.includes(e.key)) {
        e.preventDefault();
        doStep(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        animateTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        animateTo(document.documentElement.scrollHeight - window.innerHeight);
      }
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      e.preventDefault(); // 네이티브 관성 스크롤 차단
    };
    const onTouchEnd = (e) => {
      if (touchStartY == null) return;
      const endY = (e.changedTouches[0] || {}).clientY ?? touchStartY;
      const dy = touchStartY - endY;
      touchStartY = null;
      if (Math.abs(dy) < 24) return;
      doStep(dy > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
}
