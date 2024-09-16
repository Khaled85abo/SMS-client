import { useParams } from "react-router-dom";

const Confirmation = () => {
  const { token } = useParams();
  return (
    <div>
      <h1>Confirmation</h1>
      <h3>{token}</h3>
    </div>
  );
};

export default Confirmation;
