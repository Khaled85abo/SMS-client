import { useSpring, animated } from "@react-spring/web";

const About = () => {
  const springs = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
  });
  return (
    <div className="container m-auto">
      <animated.div
        style={{
          ...springs,
        }}
      >
        <h2 className="text-3xl">About page</h2>
      </animated.div>
    </div>
  );
};

export default About;
