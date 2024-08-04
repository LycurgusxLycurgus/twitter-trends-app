'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const TrendingHashtags: React.FC = () => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/trends');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setHashtags(data.trends);
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError('Failed to fetch trends. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Button 
        onClick={fetchTrends} 
        disabled={isLoading}
        className="w-64 h-24 text-xl mb-8"
      >
        {isLoading ? 'Loading...' : 'Get Trending Hashtags'}
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hashtags.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Top 10 Trending Hashtags:</h2>
          <ul className="list-disc pl-5">
            {hashtags.map((tag, index) => (
              <li key={index} className="mb-2">{tag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrendingHashtags;