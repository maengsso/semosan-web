import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { useSectionProgress } from "../lib/useSectionProgress";
import heroBg from "../assets/hero-bg.png";
import logo from "../assets/logo-semosan.svg";
import "./Hero.css";

export default function Hero() {
  const ref = useRef(null);
  const scrollYProgress = useSectionProgress(ref);

  // 로고: opacity 0 -> 100, 1-2 크기로 커지기, 또 내리면 더 커지며 이미지 하단 라인에 맞물림
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 0.72, 1],
    [0.45, 1, 1.37, 1.37]
  );
  // 로고는 배경 이미지 안에서만 움직임(이미지 밖으로 넘어가지 않음). 하단 라인까지 내려갔다가
  // 배경이 위로 흐르면 이미지에 붙은 채 함께 올라감.
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 0.72, 1],
    ["0vh", "0vh", "38vh", "38vh"]
  );
  // 로고가 바닥으로 내려갈 때 배경 산 사진도 같이 위로 흐르며 다음(어두운) 페이지가 드러남
  const bgY = useTransform(scrollYProgress, [0.6, 1], ["0vh", "-32vh"]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section className="hero" ref={ref}>
      <div className="hero__sticky">
        <motion.div className="hero__bg" style={{ y: bgY }}>
          <img src={heroBg} alt="" />
          <div className="hero__bg-veil" />
          <motion.img
            className="hero__logo"
            src={logo}
            alt="semosan"
            style={{ opacity, scale, y }}
          />
        </motion.div>

        <motion.div className="hero__hint" style={{ opacity: hintOpacity }}>
          <span>스크롤</span>
          <span className="hero__hint-arrow">↓</span>
        </motion.div>
      </div>
    </section>
  );
}
