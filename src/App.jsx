import Hero from "./sections/Hero.jsx";
import Question from "./sections/Question.jsx";
import Brand from "./sections/Brand.jsx";
import PainPoints from "./sections/PainPoints.jsx";
import Trend from "./sections/Trend.jsx";
import Joy from "./sections/Joy.jsx";
import Features from "./sections/Features.jsx";
import { useStepScroll } from "./lib/useStepScroll";

export default function App() {
  useStepScroll();
  return (
    <main>
      <Hero />
      <Question />
      <Brand />
      <PainPoints />
      <Trend />
      <Joy />
      <Features />
    </main>
  );
}
