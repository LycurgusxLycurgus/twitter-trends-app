import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = encodeURIComponent('https://twitter-trends.iamrohit.in/united-states');
      const response = await axios.get(`${proxyUrl}${targetUrl}`);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      
      // Find the table with id 'twitter-trends'
      const table = doc.querySelector('table#twitter-trends');
      
      if (table) {
        // Get all rows in the tbody
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        
        const topTrends = rows.slice(0, 10).map(row => {
          const anchor = row.querySelector('th:nth-child(2) a.tweet');
          return anchor ? anchor.textContent?.trim() || '' : '';
        }).filter(trend => trend !== '');

        console.log('Extracted trends:', topTrends);
        setTrends(topTrends);
      } else {
        throw new Error('Could not find trends table');
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      setError('Error fetching trends. Please try again.');
      setTrends([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={fetchTrends}
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Get Top 10 Trending Hashtags'}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {trends.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Top 10 Trending Topics:</h2>
          <ul className="list-disc list-inside">
            {trends.map((trend, index) => (
              <li key={index} className="text-lg">{trend}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;