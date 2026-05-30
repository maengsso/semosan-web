import { useRef, useState, useEffect } from "react";
import { motion, useMotionValueEvent } from "framer-motion";
import { useSectionProgress } from "../lib/useSectionProgress";
import "./PainPoints.css";

import ppWindow1 from "../assets/pp-window1.svg";
import ppWindow2 from "../assets/pp-window2.svg";
import ppWindow3 from "../assets/pp-window3.svg";
import ppWindow4 from "../assets/pp-window4.svg";
import ppWindow5 from "../assets/pp-window5.svg";
import ppMagnifier from "../assets/pp-magnifier.svg";

const PANELS = [
  {
    key: "p1",
    tone: "green",
    label: "등산러 현실 1",
    head: "‘30분만 더’의 무한 굴레",
    body: "이정표의 숫자는 기억에서 사라진 지 오래, 내가 지금 어디인지, 정상까지 얼마나 더 가야 하는지 알 수 없을 때 밀려오는 막막함에 등산을 포기하고 싶어져요",
  },
  {
    key: "p2",
    tone: "blue",
    label: "등산러 현실 2",
    head: "분명 2시간이면 된다고 했는데",
    body: "등산해보니 내 기대와는 다른 코스, 시작부터 마무리까지 완벽한 하루를 보내기 위해 나와 비슷한 등산러의 후기글을 찾아보고 비교하는 데에 쓴 시간이 아까워져요",
  },
  {
    key: "p3",
    tone: "red",
    label: "등산러 현실 3",
    head: "나 다시 돌아갈래",
    body: "호기롭게 등산을 시작했지만, 슬슬 오르는 것도 지겨워요. 정상을 찍겠다고 이렇게까지 해야 하나 싶은 생각과 함께, 언제 끝날지 모르는 코스가 막연하게 느껴지기 시작해요",
  },
];

const bubble = (i) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.12 + i * 0.12, ease: "easeOut" },
});

function PanelVisual({ tone }) {
  if (tone === "green") {
    return (
      <div className="pp__chat">
        <motion.div className="pp__bub pp__bub--them" {...bubble(0)}>
          정상까지 얼마나 더 가야돼?
        </motion.div>
        <motion.div className="pp__bub pp__bub--me" {...bubble(1)}>
          딱 30분만 더 가면 돼
        </motion.div>
        <motion.div className="pp__bub pp__bub--them" {...bubble(2)}>
          정상까지 얼마나 남았어?
        </motion.div>
        <motion.div className="pp__bub pp__bub--me" {...bubble(3)}>
          진짜 30분만 더 가면 돼
        </motion.div>
        <motion.div className="pp__bub pp__bub--them" {...bubble(4)}>
          ... 나 내려갈래
        </motion.div>
      </div>
    );
  }

  if (tone === "blue") {
    return (
      <div className="pp__windows" aria-hidden="true">
        <img src={ppWindow1} className="pp__win pp__win--1" alt="" />
        <img src={ppWindow3} className="pp__win pp__win--3" alt="" />
        <img src={ppWindow4} className="pp__win pp__win--4" alt="" />
        <img src={ppWindow2} className="pp__win pp__win--2" alt="" />
        <img src={ppWindow5} className="pp__win pp__win--5" alt="" />
        <img src={ppMagnifier} className="pp__magnifier" alt="" />
      </div>
    );
  }

  return (
    <div className="pp__donut-wrap" aria-hidden="true">
      <div className="pp__donut" />
      <div className="pp__stat">
        <span className="pp__stat-pill">등산 비호감 사유</span>
        <span className="pp__stat-num">46.5%</span>
      </div>
      <motion.span className="pp__tag pp__tag--1" {...bubble(1)}>
        힘들기만 하다
      </motion.span>
      <motion.span className="pp__tag pp__tag--2" {...bubble(2)}>
        고생만 하고 재미없다
      </motion.span>
    </div>
  );
}

export default function PainPoints() {
  const ref = useRef(null);
  const p = useSectionProgress(ref);
  const [active, setActive] = useState(0);
  // 지금 "닫히는 중"인 박스 인덱스 — 접히는 동안 그 박스 텍스트만 숨긴다
  const [closing, setClosing] = useState(null);
  const prevActive = useRef(0);

  useMotionValueEvent(p, "change", (v) => {
    const next = v < 0.36 ? 0 : v < 0.68 ? 1 : 2;
    setActive((cur) => (cur === next ? cur : next));
  });

  // active가 바뀌면 직전 박스가 접히는 중 → 안착 후 다시 표시
  useEffect(() => {
    const prev = prevActive.current;
    if (prev === active) return;
    prevActive.current = active;
    setClosing(prev);
    const t = setTimeout(() => setClosing(null), 560);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section className="pp" ref={ref}>
      <div className="pp__sticky">
        <div className="pp__inner">
          <div className="pp__accordion">
            {PANELS.map((panel, i) => {
              const isOpen = i === active;
              const isClosing = i === closing;
              return (
                <motion.article
                  key={panel.key}
                  className={`pp__panel pp__panel--${panel.tone} ${
                    isOpen ? "is-open" : "is-closed"
                  }`}
                  initial={false}
                  animate={{ flexGrow: isOpen ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 32, mass: 0.9 }}
                  onClick={() => setActive(i)}
                >
                  {isOpen && (
                    <motion.div
                      className="pp__visual"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
                    >
                      <PanelVisual tone={panel.tone} />
                    </motion.div>
                  )}

                  <div className="pp__copy">
                    {isOpen && (
                      <motion.p
                        className={`pp__label pp__label--${panel.tone}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35, delay: 0.18, ease: "easeOut" }}
                      >
                        {panel.label}
                      </motion.p>
                    )}
                    <motion.h3
                      className="pp__head"
                      animate={{ opacity: isClosing ? 0 : 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {panel.head}
                    </motion.h3>
                    {isOpen && (
                      <motion.p
                        className="pp__body"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
                      >
                        {panel.body}
                      </motion.p>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
