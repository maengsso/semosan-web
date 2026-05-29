import { motion } from "framer-motion";
import "./PainPoints.css";

import ppWindow1 from "../assets/pp-window1.svg";
import ppWindow2 from "../assets/pp-window2.svg";
import ppWindow3 from "../assets/pp-window3.svg";
import ppWindow4 from "../assets/pp-window4.svg";
import ppWindow5 from "../assets/pp-window5.svg";
import ppMagnifier from "../assets/pp-magnifier.svg";

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
};

const bubble = (i) => ({
  initial: { opacity: 0, y: 20, scale: 0.96 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, delay: 0.12 + i * 0.14, ease: "easeOut" },
});

export default function PainPoints() {
  return (
    <section className="pp">
      <div className="pp__inner">
        <motion.header className="pp__header" {...reveal} transition={{ duration: 0.6 }}>
          <p className="pp__eyebrow">REALITY CHECK</p>
          <h2 className="pp__title">등산러 현실</h2>
        </motion.header>

        {/* Panel 1 : chat bubbles */}
        <motion.article className="pp__panel" {...reveal} transition={{ duration: 0.7 }}>
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

          <div className="pp__copy">
            <p className="pp__label pp__label--green">등산러 현실 1</p>
            <h3 className="pp__head">‘30분만 더’의 무한 굴레</h3>
            <p className="pp__body">
              이정표의 숫자는 기억에서 사라진 지 오래, 내가 지금 어디인지, 정상까지 얼마나
              더 가야 하는지 알 수 없을 때 밀려오는 막막함에 등산을 포기하고 싶어져요
            </p>
          </div>
        </motion.article>

        {/* Panel 2 : review search windows */}
        <motion.article className="pp__panel" {...reveal} transition={{ duration: 0.7 }}>
          <div className="pp__windows" aria-hidden="true">
            <img src={ppWindow1} className="pp__win pp__win--1" alt="" />
            <img src={ppWindow3} className="pp__win pp__win--3" alt="" />
            <img src={ppWindow4} className="pp__win pp__win--4" alt="" />
            <img src={ppWindow2} className="pp__win pp__win--2" alt="" />
            <img src={ppWindow5} className="pp__win pp__win--5" alt="" />
            <img src={ppMagnifier} className="pp__magnifier" alt="" />
          </div>

          <div className="pp__copy">
            <p className="pp__label pp__label--blue">등산러 현실 2</p>
            <h3 className="pp__head">분명 2시간이면 된다고 했는데</h3>
            <p className="pp__body">
              등산해보니 내 기대와는 다른 코스, 시작부터 마무리까지 완벽한 하루를 보내기
              위해 나와 비슷한 등산러의 후기글을 찾아보고 비교하는 데에 쓴 시간이 아까워져요
            </p>
          </div>
        </motion.article>

        {/* Panel 3 : rejection-reason donut */}
        <motion.article className="pp__panel" {...reveal} transition={{ duration: 0.7 }}>
          <div className="pp__donut-wrap" aria-hidden="true">
            <motion.div
              className="pp__donut"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
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

          <div className="pp__copy">
            <p className="pp__label pp__label--red">등산러 현실 3</p>
            <h3 className="pp__head">나 다시 돌아갈래</h3>
            <p className="pp__body">
              호기롭게 등산을 시작했지만, 슬슬 오르는 것도 지겨워요. 정상을 찍겠다고 이렇게까지
              해야 하나 싶은 생각과 함께, 언제 끝날지 모르는 코스가 막연하게 느껴지기 시작해요
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
