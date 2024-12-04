'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ErrorResponse {
  error: string;
  detail?: string;
  link?: string;
}

export function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const generateVideo = async () => {
    try {
      console.log('Frontend: Starting video generation');
      setLoading(true);
      setError(null);
      setVideo(null);

      console.log('Frontend: Sending request with prompt:', prompt);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      console.log('Frontend: Response status:', response.status);
      const responseData = await response.json();
      console.log('Frontend: Response data:', responseData);

      if (!response.ok) {
        setError({
          error: responseData.error,
          detail: responseData.detail,
          link: responseData.link
        });
        return;
      }

      // Replicate returns an array of video URLs, we take the first one
      const videoUrl = Array.isArray(responseData.video) ? responseData.video[0] : responseData.video;
      console.log('Frontend: Video URL:', videoUrl);
      
      setVideo(videoUrl);
    } catch (err) {
      console.error('Frontend: Error details:', err);
      setError({
        error: 'Error generating video',
        detail: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
      console.log('Frontend: Request completed');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Your Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="Describe the video you want to generate... (e.g., 'A serene lake at sunset with gentle ripples on the water')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-y text-base p-4"
            />
          </div>
          <Button 
            onClick={generateVideo} 
            disabled={loading || !prompt}
            className="w-full py-6 text-lg font-semibold"
          >
            {loading ? 'Generating Video...' : 'Generate Video'}
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="p-6 border-red-500 bg-red-50">
          <div className="text-red-500">
            <h3 className="font-bold text-lg mb-2">{error.error}</h3>
            {error.detail && <p className="mb-2">{error.detail}</p>}
            {error.link && (
              <p>
                <a 
                  href={error.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Set up billing on Replicate →
                </a>
              </p>
            )}
          </div>
        </Card>
      )}

      {loading && (
        <Card className="p-6 bg-blue-50">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Generating your video...</p>
            <p className="text-gray-600">This process may take a few minutes. Please be patient while we create your video.</p>
          </div>
        </Card>
      )}

      {video && (
        <Card className="p-6">
          <h3 className="font-medium mb-4">Your Generated Video</h3>
          <video 
            controls 
            className="w-full rounded-lg shadow-lg"
            src={video}
          >
            Your browser does not support the video tag.
          </video>
        </Card>
      )}
    </div>
  );
}
