import React, { useRef, useState } from 'react';
import { useSearchMutation } from '../redux/features/rag/ragApi';
import { useGetWorkspacesQuery } from '../redux/features/workspace/workspaceApi';
import { Workspace } from '../types/workspace';
import { Link } from 'react-router-dom';

interface SearchResult {
    uuid: string;
    name: string;
    description: string;
    box: string;
    item_id: number;
    workspace: string;
    workspace_id: number;
    box_id: number;
}

interface SearchResponse {
    generated_result?: string;
    results: SearchResult[];
}

const Search = () => {
    const [search, { isLoading, isError, error }] = useSearchMutation();
    const searchPromiseRef = useRef<ReturnType<typeof search> | null>(null); // Type for storing the mutation promise

    const { data: workspaces, isLoading: isLoadingWorkspaces, isSuccess } = useGetWorkspacesQuery({});
    const [searchType, setSearchType] = useState<'keyword' | 'semantic'>('keyword');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const [useAIFilter, setUseAIFilter] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [visibleResults, setVisibleResults] = useState(2);

    const handleSearchTypeChange = (type: 'keyword' | 'semantic') => {
        if (type === "keyword") {
            setUseAIFilter(false);
        }
        setSearchType(type);
    };

    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Assign searchPromiseRef to the search mutation call
        searchPromiseRef.current = search({
            query: searchQuery,
            type: searchType,
            workspace: selectedWorkspace?.name || "",
            use_ai_filter: useAIFilter,
        });
        try {
            const response = await searchPromiseRef.current.unwrap(); // Use unwrap() to handle the promise response
            setSearchResults(response);
            setVisibleResults(2);
        } catch (err: any) {
            // Log the error for better understanding
            console.error('Error performing search:', err);

            if (err.name && err.name === 'AbortError') {
                console.log('Search was aborted');
            } else {
                console.error('Error performing search:', err);
            }
        }
    };

    // To abort the search
    const abortSearch = () => {
        if (searchPromiseRef.current) {
            searchPromiseRef.current.abort(); // Abort the search if the promise is ongoing
        }
    };
    const renderSearchResults = (results: SearchResult[], title: string) => {
        if (!results || results.length === 0) {
            return (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">{title}</h2>
                    <p className="text-gray-600 italic">No results found.</p>
                </div>
            );
        }

        return (
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <ul className="space-y-2">
                    {results.map((result) => (
                        <li key={result.uuid} className="border p-2 rounded">
                            <h3 className="font-semibold text-lg"><Link to={`/workspaces/${result.workspace_id}/${result.box_id}/${result.item_id}`}>{result.name}</Link></h3>
                            <p><span className="font-medium text-blue-600">Box:</span> <Link to={`/workspaces/${result.workspace_id}/${result.box_id}`}>{result.box}    </Link></p>
                            <p><span className="font-medium text-green-600">Workspace:</span> <Link to={`/workspaces/${result.workspace_id}`}>{result.workspace}</Link></p>
                            {result.description && <p><span className="font-medium text-purple-600">Description:</span> {result.description}</p>}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };
    const renderGeneratedResults = () => {
        if (!useAIFilter) return null;

        if (!searchResults?.generated_result) {
            return (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">AI Filtered Results:</h2>
                    <p className="text-gray-600 italic">No AI filtered results available.</p>
                </div>
            );
        }

        try {
            const parsedResults = JSON.parse(searchResults.generated_result);
            for (const result of parsedResults) {
                const existingResult = searchResults.results.find(el => el.name == result.name);
                if (existingResult) {
                    result.workspace_id = existingResult.workspace_id;
                    result.box_id = existingResult.box_id;
                    result.item_id = existingResult.item_id;
                }
            }
            return renderSearchResults(parsedResults, "AI Filtered Results:");
        } catch (error) {
            console.error('Error parsing generated results:', error);
            return (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">AI Filtered Results:</h2>
                    <p className="text-red-600">Error parsing generated results</p>
                </div>
            );
        }
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
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    Search
                </button>
            </form>
            {isLoading && (
                <div className="mt-4">
                    <p className="text-blue-600">Loading results...</p>
                    <button
                        onClick={abortSearch}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Cancel Search
                    </button>
                </div>
            )}
            {isError && (
                <div className="mt-4 text-red-600">
                    <p>Error: {(error as any)?.data?.message || 'An unknown error occurred'}</p>
                </div>
            )}
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
            {!isLoading && !isError && searchResults ? (
                <>
                    {renderGeneratedResults()}
                    {renderSearchResults(searchResults.results.slice(0, visibleResults), "Search Results:")}
                    {visibleResults < searchResults.results.length && (
                        <button
                            onClick={() => setVisibleResults((prev) => Math.min(prev + 2, searchResults.results.length))}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            See More
                        </button>
                    )}
                </>
            ) : (
                !isLoading && !isError && (
                    <p className="mt-4 text-gray-600 italic">No search results yet. Try searching for something!</p>
                )
            )}
        </div>
    );
};

export default Search;
