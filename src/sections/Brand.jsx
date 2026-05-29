import { useRef, useState } from "react";
import { motion, useTransform, useMotionValueEvent } from "framer-motion";
import { useSectionProgress } from "../lib/useSectionProgress";
import "./Brand.css";

const DOTS = [0, 1, 2, 3, 4];

export default function Brand() {
  const ref = useRef(null);
  const p = useSectionProgress(ref);

  // 카피: 등장 -> 잠깐 유지 -> 위로 사라짐
  const copyOpacity = useTransform(p, [0, 0.18, 0.46, 0.56], [0, 1, 1, 0]);
  const copyY = useTransform(p, [0, 0.18, 0.56], [60, 0, -40]);
  const copyScale = useTransform(p, [0, 0.18], [0.92, 1]);

  // 로딩 점: 5개 순차적으로 채워짐
  const fillCount = useTransform(p, [0.58, 0.95], [0, 5]);
  const [filled, setFilled] = useState(0);
  useMotionValueEvent(fillCount, "change", (v) => setFilled(Math.round(v)));
  const dotsOpacity = useTransform(p, [0.5, 0.6, 0.97, 1], [0, 1, 1, 0]);
  const labelOpacity = useTransform(p, [0.58, 0.68], [0, 1]);

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

        <motion.div className="brand__loader" style={{ opacity: dotsOpacity }}>
          <div className="brand__dots">
            {DOTS.map((i) => (
              <span
                key={i}
                className={`brand__dot${i < filled ? " is-on" : ""}`}
              />
            ))}
          </div>
          <motion.p className="brand__label" style={{ opacity: labelOpacity }}>
            그런데, 등산이 왜 이렇게 핫해졌을까?
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
