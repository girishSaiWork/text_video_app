import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Logger } from '@/lib/logger';
import { AuthError, ValidationError, DatabaseError, handleError } from '@/lib/error';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new AuthError('User not authenticated');
    }

    const user = await currentUser();
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      throw new ValidationError('No primary email address found');
    }

    Logger.info('Syncing user profile', { userId });

    // Prepare user data according to Supabase schema
    const userData = {
      user_id: userId,
      email: user.primaryEmailAddress.emailAddress,
      // Default tier is set in the database schema
      // stripe_customer_id and stripe_subscription_id will be set later
    };

    // Validate required fields
    if (!userData.email) {
      throw new ValidationError('Email is required');
    }

    // Log the data being sent to Supabase
    Logger.info('Attempting to upsert profile', { 
      userId,
      email: userData.email
    });

    // Upsert user profile in Supabase using admin client
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(userData, {
        onConflict: 'user_id',
        returning: 'representation',
      });

    if (error) {
      Logger.error('Supabase error', error as Error, { 
        userId,
        error: error.message,
        code: error.code 
      });
      throw new DatabaseError('Failed to sync profile', error);
    }

    Logger.info('Profile synced successfully', { userId });

    return NextResponse.json(
      { message: 'Profile synced successfully', data },
      { status: 200 }
    );
  } catch (error) {
    Logger.error('Profile sync failed', error as Error, {
      path: '/api/sync-profile',
      method: 'POST',
    });

    const { error: errorMessage, status, code } = handleError(error);

    return NextResponse.json(
      { error: errorMessage, code },
      { status }
    );
  }
}
