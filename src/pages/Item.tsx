import { useParams, Link } from "react-router-dom";
import { useLazyGetSingleBoxQuery } from "../redux/features/box/boxApi";
import { useLazyGetSingleWorkspaceQuery } from "../redux/features/workspace/workspaceApi";
import { useLazyGetSingleItemQuery } from "../redux/features/item/itemApi";
import { useEffect } from "react";

const Item = () => {
    const { itemId, boxId, workspaceId } = useParams();
    const [getItem, { data: item, isLoading }] = useLazyGetSingleItemQuery({});
    const [getSingleBox, { data: singleBox, isBoxLoading, isSuccess }] = useLazyGetSingleBoxQuery({});
    const [getSingleWorkspace, { data: singleWorkspace, isLoading: isWorkspaceLoading, isSuccess: isWorkspaceSuccess }] = useLazyGetSingleWorkspaceQuery({});

    useEffect(() => {
        getItem(itemId);
        getSingleBox(boxId);
        getSingleWorkspace(workspaceId);

    }, [boxId, workspaceId]);
    return (
        <div>
            <h3 className='m-4 text-xl font-bold'>
                <Link to="/workspaces" className='text-blue-500'>Workspaces</Link>
                /
                <Link to={`/workspaces/${workspaceId}`} className='text-blue-500 ml-1'>{singleWorkspace?.name}</Link>
                /
                <Link to={`/workspaces/${workspaceId}/${boxId}`} className='text-blue-500 ml-1'>{singleBox?.name}</Link>
                /
                <span className=' ml-1'>{item?.name}</span>
            </h3>
            <div className="p-4 mt-4">
                <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="relative h-48">
                        <img
                            className="w-full h-full object-cover"
                            src={item?.imageUrl || 'https://via.placeholder.com/400x200'}
                            alt={item?.name}
                        />
                        <button className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm">
                            Update Image
                        </button>
                    </div>
                    <div className="p-6">
                        <h2 className="font-bold text-xl mb-2">{item?.name}</h2>
                        <p className="text-gray-700 text-base mb-2">{item?.description}</p>
                        <p className="text-gray-600 text-sm mb-4">Quantity: {item?.quantity}</p>
                        <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Update Item Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Item;