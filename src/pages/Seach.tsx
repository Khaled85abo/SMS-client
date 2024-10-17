import React, { useState } from 'react';
import { useSearchMutation } from '../redux/features/rag/ragApi';
import { useGetWorkspacesQuery } from '../redux/features/workspace/workspaceApi';
import { Workspace } from '../types/workspace';

const Search = () => {
    const [search, { isLoading, isError, error }] = useSearchMutation();
    const { data: workspaces, isLoading: isLoadingWorkspaces, isSuccess } = useGetWorkspacesQuery({});
    const [searchType, setSearchType] = useState<'keyword' | 'semantic'>('keyword');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const [useAIFilter, setUseAIFilter] = useState(false);

    const handleSearchTypeChange = (type: 'keyword' | 'semantic') => {
        setSearchType(type);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log(`Performing ${searchType} search for: ${searchQuery}`);
        console.log(`Selected workspace: ${selectedWorkspace}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Search</h1>
            <div className="mb-4">
                <span className="mr-4">Search Type:</span>
                <button
                    className={`px-4 py-2 rounded-l-md ${searchType === 'keyword' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleSearchTypeChange('keyword')}
                >
                    Keyword
                </button>
                <button
                    className={`px-4 py-2 rounded-r-md ${searchType === 'semantic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleSearchTypeChange('semantic')}
                >
                    Semantic
                </button>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Select Workspace:</h2>
                <div>
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            name="workspace"
                            value=""
                            checked={selectedWorkspace === null}
                            onChange={() => setSelectedWorkspace(null)}
                            className="form-radio"
                        />
                        <span className="ml-2">None</span>
                    </label>
                    {isLoadingWorkspaces ? (
                        <p>Loading workspaces...</p>
                    ) : (
                        workspaces?.map((workspace: Workspace) => (
                            <label key={workspace.id} className="inline-flex items-center mr-4">
                                <input
                                    type="radio"
                                    name="workspace"
                                    value={workspace.id}
                                    checked={selectedWorkspace?.id === workspace.id}
                                    onChange={() => setSelectedWorkspace(workspace)}
                                    className="form-radio"
                                />
                                <span className="ml-2">{workspace.name}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Enter ${searchType} search...`}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Search
                </button>
            </form>
            {searchType === 'semantic' && (
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={useAIFilter}
                            onChange={(e) => setUseAIFilter(e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Use AI Filter</span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default Search;
