import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

/**
 * 섹션의 스크롤 진행도(0~1)를 추적하는 모션값을 반환.
 * 0 = 섹션 상단이 뷰포트 상단에 닿은 순간
 * 1 = 섹션 하단이 뷰포트 하단에 닿은 순간
 * (framer-motion useScroll target 방식이 일부 환경에서 멈추는 문제를 우회)
 */
export function useSectionProgress(ref) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
      progress.set(total > 0 ? scrolled / total : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, progress]);

  return progress;
}
