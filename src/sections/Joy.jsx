import { motion } from "framer-motion";
import card1 from "../assets/joy-card1.png";
import card2a from "../assets/joy-card2a.png";
import card2b from "../assets/joy-card2b.png";
import card3 from "../assets/joy-card3.png";
import "./Joy.css";

const CARDS = [
  {
    label: "오래 기록되는 성취감",
    caption: ["내가 완등한 산을 지도로 한눈에 확인하고", "세상의 모든 산을 하나씩 정복해나가요"],
    variant: "single",
    images: [{ src: card1, className: "joy-img joy-img--map" }],
  },
  {
    label: "다양한 정상 인증",
    caption: ["멋진 정상샷부터 우리만의 생생한 순간까지", "다양한 등산의 추억을 남기고 공유해요"],
    variant: "stack",
    images: [
      { src: card2a, className: "joy-img joy-img--photo joy-img--photo-back" },
      { src: card2b, className: "joy-img joy-img--photo joy-img--photo-front" },
    ],
  },
  {
    label: "경험 소비 영역의 확장",
    caption: ["완벽한 등산 루트를 위해, 맛집부터 교통까지", "필요한 정보를 한눈에 탐색해요."],
    variant: "single",
    images: [{ src: card3, className: "joy-img joy-img--detail" }],
  },
];

export default function Joy() {
  return (
    <section className="joy">
      <div className="joy__inner">
        <motion.div
          className="joy__header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="joy__eyebrow">요즘 등산러들이 등산을 즐기는 법</p>
          <h2 className="joy__title">세모산이 제안하는 등산의 즐거움</h2>
        </motion.div>

        <div className="joy__cards">
          {CARDS.map((card, i) => (
            <motion.div
              className="joy__card"
              key={card.label}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
            >
              <div className="joy__pill">{card.label}</div>
              <div className="joy__shot">
                <div className={`joy__stage joy__stage--${card.variant}`}>
                  {card.images.map((img, idx) => (
                    <img key={idx} src={img.src} alt="" className={img.className} />
                  ))}
                </div>
                <div className="joy__caption">
                  {card.caption.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
