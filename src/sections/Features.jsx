import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import featMap from "../assets/feat-map.png";
import featFeed from "../assets/feat-feed.png";
import featTrack from "../assets/feat-track.png";
import featCommunity from "../assets/feat-community.png";
import "./Features.css";

const TABS = [
  {
    id: "map",
    tab: "정복지도",
    title: "정복 지도 아카이빙",
    desc: ["완등한 산이 정복 지도에 마커로 기록됩니다", "내 정복 지도를 채워 나가는 재미를 느껴보세요"],
    img: featMap,
  },
  {
    id: "feed",
    tab: "세모피드",
    title: "세모피드",
    desc: ["다른 등산러들의 생생한 완등의 순간을", "피드로 확인하고 내 기록도 공유해보세요"],
    img: featFeed,
  },
  {
    id: "track",
    tab: "실시간 트래킹",
    title: "실시간 트래킹",
    desc: [
      "산행을 실시간으로 트래킹 해 나만의 기록으로!",
      "코스 경로와 남은 시간은 물론, 클라이브로",
      "정상까지의 등반 과정을 생생하게 기록할 수 있어요",
    ],
    img: featTrack,
  },
  {
    id: "community",
    tab: "커뮤니티",
    title: "커뮤니티",
    desc: ["등산 후기, 날씨 정보, 등산템 추천, 맛집 공유 등", "산을 좋아하는 사람들이 모여 소통해요"],
    img: featCommunity,
  },
];

export default function Features() {
  const [active, setActive] = useState(0);
  const current = TABS[active];

  return (
    <section className="feat">
      <div className="feat__inner">
        <motion.nav
          className="feat__tabs"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          {TABS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`feat__tab${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              {i === active && (
                <motion.span
                  className="feat__tab-pill"
                  layoutId="feat-tab-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="feat__tab-label">{t.tab}</span>
            </button>
          ))}
        </motion.nav>

        <div className="feat__stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="feat__content"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="feat__copy">
                <h2 className="feat__title">{current.title}</h2>
                <div className="feat__desc">
                  {current.desc.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              <motion.div
                className="feat__phone"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={current.img} alt={current.title} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
