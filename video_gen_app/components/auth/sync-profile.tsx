'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Logger } from '@/lib/logger';

interface SyncError {
  error: string;
  code?: string;
}

export default function SyncProfile() {
  const { isLoaded, userId } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const syncProfile = async () => {
      if (!isLoaded || !userId || isSyncing) return;

      try {
        setIsSyncing(true);
        Logger.info('Starting profile sync', { userId });

        const response = await fetch('/api/sync-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to sync profile');
        }

        Logger.info('Profile sync completed', { userId });
        
        // Reset retry count on success
        setRetryCount(0);
      } catch (error) {
        Logger.error('Profile sync failed', error as Error, {
          userId,
          retryCount,
        });
        
        // Handle different error types
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        // Implement retry logic for transient failures
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          // Exponential backoff: 2s, 4s, 8s
          const backoffDelay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => setIsSyncing(false), backoffDelay);
          
          toast.error(`Profile sync failed: ${errorMessage}. Retrying in ${backoffDelay/1000}s...`);
        } else {
          toast.error('Failed to sync profile after multiple attempts. Please try again later.');
        }
      } finally {
        if (retryCount >= MAX_RETRIES) {
          setIsSyncing(false);
        }
      }
    };

    syncProfile();
  }, [isLoaded, userId, isSyncing, retryCount]);

  // This component doesn't render anything
  return null;
}
