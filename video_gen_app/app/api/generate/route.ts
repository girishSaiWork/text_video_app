import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    console.log('API: Starting video generation request');
    
    const { prompt } = await req.json();
    console.log('API: Received prompt:', prompt);

    if (!prompt) {
      console.log('API: No prompt provided');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('API: Checking for API token:', !!process.env.REPLICATE_API_TOKEN);
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    try {
      console.log('API: Creating prediction with Replicate');
      const prediction = await replicate.predictions.create({
        version: "983ec70a06fd872ef4c29bb6b728556fc2454125a5b2c68ab51eb8a2a9eaa46a",
        input: {
          cfg: 3,
          steps: 30,
          length: 97,
          prompt: prompt,
          target_size: 640,
          aspect_ratio: "16:9",
          negative_prompt: "low quality, worst quality, deformed, distorted, watermark"
        }
      });

      console.log('API: Prediction created:', prediction);

      // Poll for the prediction status
      let result = await replicate.predictions.get(prediction.id);
      while (result.status !== 'succeeded' && result.status !== 'failed') {
        console.log('API: Waiting for prediction, status:', result.status);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        result = await replicate.predictions.get(prediction.id);
      }

      if (result.status === 'failed') {
        throw new Error(result.error || 'Video generation failed');
      }

      console.log('API: Generation completed, result:', result);

      // The output should be an array with the video URL
      if (!result.output || !Array.isArray(result.output) || !result.output[0]) {
        throw new Error('Invalid output format from Replicate');
      }

      return NextResponse.json({ video: result.output[0] });
    } catch (replicateError: any) {
      console.error('API: Replicate error:', replicateError);
      
      // Check if it's a billing required error
      if (replicateError.status === 402) {
        return NextResponse.json(
          { 
            error: 'Billing setup required',
            detail: 'This model requires billing to be set up on Replicate. Please visit https://replicate.com/account/billing to configure billing.',
            link: 'https://replicate.com/account/billing'
          },
          { status: 402 }
        );
      }
      throw replicateError;
    }
  } catch (error: any) {
    console.error('API: Detailed error:', error);
    console.error('API: Full error object:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { 
        error: error.message || 'Error generating video',
        detail: error.detail || 'An unexpected error occurred'
      },
      { status: error.status || 500 }
    );
  }
}
