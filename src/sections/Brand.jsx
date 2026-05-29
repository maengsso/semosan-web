import { useRef, useState, useEffect } from "react";
import { motion, useTransform, useMotionValueEvent } from "framer-motion";
import { useSectionProgress } from "../lib/useSectionProgress";
import "./Brand.css";

const DOTS = [0, 1, 2, 3, 4];

export default function Brand() {
  const ref = useRef(null);
  const p = useSectionProgress(ref);

  // 카피: 등장 -> 잠깐 유지 -> 위로 사라짐 (스크롤 따라감)
  const copyOpacity = useTransform(p, [0, 0.18, 0.46, 0.56], [0, 1, 1, 0]);
  const copyY = useTransform(p, [0, 0.18, 0.56], [60, 0, -40]);
  const copyScale = useTransform(p, [0, 0.18], [0.92, 1]);

  // 로더(동그라미+문구): 이 장면에 "진입"하면 스크롤과 무관하게
  // 시간에 맞춰 자동으로 페이드인 + 동그라미가 하나씩 채워짐.
  const [loaderIn, setLoaderIn] = useState(false);
  const [filled, setFilled] = useState(0);

  useMotionValueEvent(p, "change", (v) => {
    // 카피가 사라지는 지점(0.5) 이후 = 로더 장면 진입
    if (v >= 0.5) setLoaderIn(true);
    else setLoaderIn(false);
  });

  // 진입하면 타이머로 동그라미를 0→5개 순차적으로 채운다.
  useEffect(() => {
    if (!loaderIn) {
      setFilled(0);
      return;
    }
    setFilled(0);
    const timers = DOTS.map((_, i) =>
      setTimeout(() => setFilled(i + 1), 450 + i * 240)
    );
    return () => timers.forEach(clearTimeout);
  }, [loaderIn]);

  return (
    <section className="brand" ref={ref}>
      <div className="brand__sticky">
        <motion.h2
          className="brand__copy"
          style={{ opacity: copyOpacity, y: copyY, scale: copyScale }}
        >
          세모산과 함께
          <br />
          <span className="brand__accent">쉽고 즐거운 취미</span>로!
        </motion.h2>

        <motion.div
          className="brand__loader"
          initial={false}
          animate={{ opacity: loaderIn ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="brand__dots">
            {DOTS.map((i) => (
              <span
                key={i}
                className={`brand__dot${i < filled ? " is-on" : ""}`}
              />
            ))}
          </div>
          <motion.p
            className="brand__label"
            initial={false}
            animate={{ opacity: loaderIn ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: loaderIn ? 0.25 : 0 }}
          >
            그런데, 등산이 왜 이렇게 핫해졌을까?
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
