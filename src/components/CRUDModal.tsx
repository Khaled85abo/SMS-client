type CRUDModalProps = {
    modalType: "create" | "edit" | "delete";
    selectedItem: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    submitModal: () => void;
    closeModal: () => void;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    modalError: string;
    modalSuccess: string;
}

const CRUDModal = ({ modalType, selectedItem, handleInputChange, submitModal, closeModal, isCreating, isUpdating, isDeleting, modalError, modalSuccess }: CRUDModalProps) => {
    return <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto  h-full w-full">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold">
                {modalType === 'create' ? 'Create New Workspace' :
                    modalType === 'edit' ? 'Edit Workspace' : 'Delete Workspace'}
            </h3>
            {modalType !== 'delete' ? (
                <form>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={selectedItem.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={selectedItem.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </form>
            ) : (
                <p>Are you sure you want to delete: {selectedItem?.name}?</p>
            )}
            <div className="mt-4">
                <button
                    className={`${modalType === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white px-4 py-2 rounded mr-2`}
                    onClick={submitModal}
                >
                    {modalType === 'create' ? 'Create' : modalType === 'edit' ? 'Save' : 'Delete'}
                </button>
                <button
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </div>
            {/* New div for loading, error, or success messages */}
            <div className="mt-4">
                {(isCreating || isUpdating || isDeleting) && (
                    <p className="text-blue-500">Loading...</p>
                )}
                {modalError && (
                    <p className="text-red-500">{modalError}</p>
                )}
                {modalSuccess && (
                    <p className="text-green-500">{modalSuccess}</p>
                )}
            </div>
        </div>
    </div>;
};

export default CRUDModal;