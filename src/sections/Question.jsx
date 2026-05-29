import { useRef, useState } from "react";
import { motion, useTransform, useMotionValueEvent } from "framer-motion";
import { useSectionProgress } from "../lib/useSectionProgress";
import mountain from "../assets/mountain.png";
import "./Question.css";

const TYPED = "등산?";

export default function Question() {
  const ref = useRef(null);
  const scrollYProgress = useSectionProgress(ref);

  // Beat 1: "등산?" 한 글자씩 타이핑 — 한 스크롤 안에 완성
  const charCount = useTransform(scrollYProgress, [0.03, 0.13], [0, TYPED.length]);
  const [typed, setTyped] = useState(0);
  useMotionValueEvent(charCount, "change", (v) => setTyped(Math.round(v)));
  // 다음 스크롤에서 "등산?" 페이드아웃
  const typedOpacity = useTransform(scrollYProgress, [0.26, 0.36], [1, 0]);

  // Beat 2: "그거 아재 운동 아니야?" 페이드인 + 줌인, 이후 산 등장하며 페이드아웃
  const lineOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.4, 0.56, 0.66],
    [0, 1, 1, 0]
  );
  // 들어온 뒤에도 스크롤하면 계속 더 커짐
  const lineScale = useTransform(
    scrollYProgress,
    [0.28, 0.4, 0.66],
    [0.6, 1, 1.6]
  );

  // 산 이미지 줌인 등장
  const imgOpacity = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);
  const imgScale = useTransform(scrollYProgress, [0.5, 1], [1.6, 1.05]);

  // 마지막 카피
  const finalOpacity = useTransform(scrollYProgress, [0.72, 0.86], [0, 1]);
  const finalY = useTransform(scrollYProgress, [0.72, 0.86], [40, 0]);

  return (
    <section className="q" ref={ref}>
      <div className="q__sticky">
        <motion.div className="q__bg" style={{ opacity: imgOpacity, scale: imgScale }}>
          <img src={mountain} alt="" />
          <div className="q__bg-veil" />
        </motion.div>

        <div className="q__layer">
          <motion.div className="q__typed" style={{ opacity: typedOpacity }}>
            {TYPED.slice(0, typed)}
            <span className="q__caret" />
          </motion.div>
        </div>

        <div className="q__layer">
          <motion.p
            className="q__line"
            style={{ opacity: lineOpacity, scale: lineScale }}
          >
            그거 아재 운동 아니야?
          </motion.p>
        </div>

        <div className="q__layer q__layer--top">
          <motion.p className="q__final" style={{ opacity: finalOpacity, y: finalY }}>
            쉽게 할 엄두가 나지 않는 등산
          </motion.p>
        </div>
      </div>
    </section>
  );
}
