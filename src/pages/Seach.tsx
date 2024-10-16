import React, { useState } from 'react';

const Search = () => {
    const [searchType, setSearchType] = useState<'keyword' | 'semantic'>('keyword');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchTypeChange = (type: 'keyword' | 'semantic') => {
        setSearchType(type);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log(`Performing ${searchType} search for: ${searchQuery}`);
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
        </div>
    );
};

export default Search;
