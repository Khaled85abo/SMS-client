
import { useSpring, animated } from "@react-spring/web";
import Carousel from "../components/Carousel";
const Home = () => {
  const h1Springs = useSpring({
    from: { x: 10, opacity: 0 },
    to: { x: 0, opacity: 1 },
  });
  const pSprings = useSpring({
    from: { x: -10, opacity: 0, duration: 2500 },
    to: { x: 0, opacity: 1, duration: 2500 },
  });
  return (
    <div>
      <div className="py-12  bg-header_bg text-white h-[45vh]">
        <div className="text-center mb-12">
        <Carousel />
        </div>
        <div className="text-center mb-12">
        <Carousel />
        </div>
      </div>
    </div>
  );
};

export default Home;
