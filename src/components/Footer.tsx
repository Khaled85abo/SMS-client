const Footer = () => {
  return (
    <div className="mt-auto bg-gray-800 text-white text-center p-4">
      <p>Follow us on social media!</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="https://facebook.com" className="hover:text-blue-500">
          Facebook
        </a>
        <a href="https://instagram.com" className="hover:text-pink-500">
          Instagram
        </a>
        <a href="https://twitter.com" className="hover:text-blue-400">
          Twitter
        </a>
      </div>
    </div>
  );
};

export default Footer;
