import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';

function Wardrobe() {
  const navigate = useNavigate();

  const redirectToAddClothingItem = () => {
    navigate('/add-clothing-item');
  };

  return (
    <div>
      <div className="py-5 bg-antiqueWhite text-white">
        <div className="text-center mb-12">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            type="button"
            onClick={redirectToAddClothingItem}
          >
            Add Clothing
          </button>
          <div className='bg-slate-700'>
            <h2 className="mt-5">Head</h2>
            <Carousel bodySectionId={1} />
          </div>
          <div className='bg-mutedTeal'>
            <h2 className="mt-5">Upper-body</h2>
            <Carousel bodySectionId={2} />
          </div>
          <div className='bg-slate-900'>
            <h2 className="mt-5">Lower-body</h2>
            <Carousel bodySectionId={3} />
          </div>
          <div className='bg-mutedTeal'>
            <h2 className="mt-5">Feet</h2>
            <Carousel bodySectionId={4} />
          </div>
          <div className='bg-slate-700'>
            <h2 className="mt-5">One-pieces</h2>
            <Carousel bodySectionId={5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wardrobe;
