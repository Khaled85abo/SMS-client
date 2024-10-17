import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSpring, animated } from "@react-spring/web";

const Layout = () => {
  const springs = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
  });
  return (
    <div className="flex flex-col min-h-screen font-best">
      <Header />
      <animated.div
        className=" min-h-screen overflow-hidden"
        style={{
          ...springs,
        }}
      >
        <Outlet />
      </animated.div>
      <Footer />
    </div>
  );
};

export default Layout;
