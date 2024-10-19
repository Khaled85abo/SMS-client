import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAddResourceMutation } from '../redux/features/resource/resourceApi';

interface ResourceFormProps {
  onResourceAdded: () => void;

}

const ResourceForm: React.FC<ResourceFormProps> = ({ onResourceAdded }) => {
  const [addResource, { isLoading, isSuccess, error: apiError }] = useAddResourceMutation();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useFileName, setUseFileName] = useState(true);

  useEffect(() => {
    if (file && useFileName) {
      setName(file.name);
    }
  }, [file, useFileName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select a file');
      return;
    }


    const formData = new FormData();
    const resourceData = {
      name: useFileName ? file.name : name,
      work_space_id: workspaceId
    };

    formData.append('resource', JSON.stringify(resourceData));
    formData.append('file', file);

    try {
      await addResource(formData).unwrap();
      setName('');
      setDescription('');
      setTags('');
      setFile(null);
      onResourceAdded();
    } catch (error) {
      setError('Failed to add resource. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4 bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useFileName}
            onChange={(e) => setUseFileName(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-900">Use file name as resource name</span>
        </label>
      </div>
      {!useFileName && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      )}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-900">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-900">File</label>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          required
          className="mt-1 block w-full"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {apiError && (
        <p className="text-red-500">
          {(apiError as any).data?.message || 'An error occurred'}
        </p>
      )}
      <button type="submit" className="bg-green-500  text-white font-bold py-2 px-4 rounded" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Resource'}
      </button>
    </form>
  );
};

export default ResourceForm;
