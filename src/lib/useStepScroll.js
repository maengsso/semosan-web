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
  0: [0, 0.55, 1], // Hero: 로고 등장 → 꽉 찬 로고 → 바닥 라인+다음 페이지
  // Question: 빈 화면(커서) → 한 칸 이동하며 "등산?" 타이핑 → 아재 운동 → 마지막 카피
  1: [0.02, 0.2, 0.45, 0.85],
  // Brand: 카피 → 동그라미 빈 상태 → 한 칸 이동하며 채워짐+질문
  2: [0.22, 0.6, 0.95],
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
    let animating = false;
    let locked = false;
    let raf = 0;
    let unlockTimer = 0;
    let touchStartY = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateTo = (y) => {
      cancelAnimationFrame(raf);
      animating = true;
      const startY = window.scrollY;
      const dist = y - startY;
      if (Math.abs(dist) < 1) {
        animating = false;
        return;
      }
      const dur = 800;
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min((now - t0) / dur, 1);
        window.scrollTo(0, startY + dist * easeInOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else animating = false;
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

    // 한 번의 연속 동작 = 한 칸. 동작이 멈추고 220ms 지나야 다시 이동 가능.
    const scheduleUnlock = () => {
      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        if (animating) scheduleUnlock();
        else locked = false;
      }, 220);
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 4) return;
      if (!locked && !animating) {
        locked = true;
        step(e.deltaY > 0 ? 1 : -1);
      }
      scheduleUnlock();
    };

    const onKey = (e) => {
      const down = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const up = ["ArrowUp", "PageUp"];
      if (down.includes(e.key)) {
        e.preventDefault();
        if (!locked && !animating) {
          locked = true;
          step(1);
        }
        scheduleUnlock();
      } else if (up.includes(e.key)) {
        e.preventDefault();
        if (!locked && !animating) {
          locked = true;
          step(-1);
        }
        scheduleUnlock();
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
      if (Math.abs(dy) < 30) return;
      if (!locked && !animating) {
        locked = true;
        step(dy > 0 ? 1 : -1);
      }
      scheduleUnlock();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(unlockTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
}
