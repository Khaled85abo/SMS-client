import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const redirectToSignup = () => {
    navigate("/signup");
  };
  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div
        className="bg-blue-500 text-white text-center p-12 flex flex-col justify-center items-center space-y-4"
        style={{
          backgroundImage: "url(https://example.com/your-background-image.jpg)",
          backgroundSize: "cover",
        }}
      >
        <h1 className="text-4xl font-bold">
          Welcome to your personal clothing Co-pilot
        </h1>
        <p className="text-xl">Find your perfect outfit for every occasion!</p>
        <button
          onClick={redirectToSignup}
          className="mt-4 bg-yellow-400 text-blue-500 font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition duration-200"
        >
          Sign up now
        </button>
        <button
          onClick={redirectToLogin}
          className="mt-4 bg-yellow-400 text-blue-500 font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition duration-200"
        >
          Log in
        </button>
      </div>

      {/* Introduction Section */}
      <div className="p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Discover the Latest Trends</h2>
        <p>
          Explore a wide range of clothing and accessories curated just for you.
          Experience fashion like never before.
        </p>
      </div>

      {/* Featured Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-12">
        <div className="flex flex-col items-center">
          <img
            src="https://example.com/featured-1.jpg"
            alt="Featured 1"
            className="mb-4"
          />
          <h3 className="text-xl font-semibold">Summer Collection</h3>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="https://example.com/featured-2.jpg"
            alt="Featured 2"
            className="mb-4"
          />
          <h3 className="text-xl font-semibold">Formal Wear</h3>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="https://example.com/featured-3.jpg"
            alt="Featured 3"
            className="mb-4"
          />
          <h3 className="text-xl font-semibold">Casual Outfits</h3>
        </div>
      </div>
    </div>
  );
};

export default Landing;
