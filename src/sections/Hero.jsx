import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { useSectionProgress } from "../lib/useSectionProgress";
import heroBg from "../assets/hero-bg.png";
import logo from "../assets/logo-semosan.svg";
import "./Hero.css";

export default function Hero() {
  const ref = useRef(null);
  const scrollYProgress = useSectionProgress(ref);

  // 로고: opacity 0 -> 100, 1-2 크기로 커지기, 또 내리면 더 커지고 하단 라인에 맞물리게
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.65, 1],
    [0.45, 1, 1, 1.37]
  );
  const y = useTransform(scrollYProgress, [0, 0.65, 1], ["0vh", "0vh", "38vh"]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section className="hero" ref={ref}>
      <div className="hero__sticky">
        <div className="hero__bg">
          <img src={heroBg} alt="" />
          <div className="hero__bg-veil" />
        </div>

        <motion.img
          className="hero__logo"
          src={logo}
          alt="semosan"
          style={{ opacity, scale, y }}
        />

        <motion.div className="hero__hint" style={{ opacity: hintOpacity }}>
          <span>스크롤</span>
          <span className="hero__hint-arrow">↓</span>
        </motion.div>
      </div>
    </section>
  );
}
