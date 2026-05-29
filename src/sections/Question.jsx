import { useRef, useState } from "react";
import { motion, useTransform, useMotionValueEvent } from "framer-motion";
import { useSectionProgress } from "../lib/useSectionProgress";
import mountain from "../assets/mountain.png";
import "./Question.css";

const TYPED = "등산?";

export default function Question() {
  const ref = useRef(null);
  const scrollYProgress = useSectionProgress(ref);

  // 타이핑: 0 -> 0.25 구간에서 "등산?" 한 글자씩
  const charCount = useTransform(scrollYProgress, [0.04, 0.24], [0, TYPED.length]);
  const [typed, setTyped] = useState(0);
  useMotionValueEvent(charCount, "change", (v) => setTyped(Math.round(v)));

  // "그거 아재 운동 아니야?" 등장
  const lineOpacity = useTransform(scrollYProgress, [0.28, 0.4], [0, 1]);
  const lineY = useTransform(scrollYProgress, [0.28, 0.4], [30, 0]);

  // 산 이미지 줌인 등장
  const imgOpacity = useTransform(scrollYProgress, [0.42, 0.6], [0, 1]);
  const imgScale = useTransform(scrollYProgress, [0.42, 1], [1.6, 1.05]);

  // 마지막 카피
  const finalOpacity = useTransform(scrollYProgress, [0.66, 0.8], [0, 1]);
  const finalY = useTransform(scrollYProgress, [0.66, 0.8], [40, 0]);
  // 앞선 텍스트는 산 등장하며 사라짐
  const questionOpacity = useTransform(scrollYProgress, [0.5, 0.62], [1, 0]);

  return (
    <section className="q" ref={ref}>
      <div className="q__sticky">
        <motion.div className="q__bg" style={{ opacity: imgOpacity, scale: imgScale }}>
          <img src={mountain} alt="" />
          <div className="q__bg-veil" />
        </motion.div>

        <motion.div className="q__center" style={{ opacity: questionOpacity }}>
          <div className="q__typed">
            {TYPED.slice(0, typed)}
            <span className="q__caret" />
          </div>
          <motion.p className="q__line" style={{ opacity: lineOpacity, y: lineY }}>
            그거 아재 운동 아니야?
          </motion.p>
        </motion.div>

        <motion.p className="q__final" style={{ opacity: finalOpacity, y: finalY }}>
          쉽게 할 엄두가 나지 않는 등산
        </motion.p>
      </div>
    </section>
  );
}
