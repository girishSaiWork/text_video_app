# AI Video Generation App

A modern web application that generates videos using AI, built with Next.js and featuring secure authentication and profile management.

### AI Model & Integration
- **Replicate** - AI model deployment platform
  - Model: fofr/ltx-video
  - Type: Text-to-Video Generation
  - Features:
    - High-quality video generation
    - Text prompt optimization
    - Multiple style options
    - Custom video parameters:
      - Number of frames
      - Frame rate
      - Video resolution
      - Seed value for reproducibility

### Environment Variables
Add these to your `.env.local`:
```env
REPLICATE_API_TOKEN=your_replicate_api_token

## Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Sonner** - Toast notifications
- **TypeScript** - Type-safe JavaScript

### Backend & Infrastructure
- **Clerk** - Authentication and user management
- **Supabase** - PostgreSQL database
- **Next.js API Routes** - Backend API endpoints

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Features

- 🔐 **Secure Authentication**
  - Sign up/Sign in with email
  - Protected routes
  - Profile management

- 👤 **User Profiles**
  - Automatic profile sync between Clerk and Supabase
  - Tier management (Free/Premium)
  - Stripe integration ready

- 🎥 **Video Generation** (Coming Soon)
  - AI-powered video creation
  - Multiple video styles
  - Custom video parameters

## Getting Started

1. **Clone the repository**
```bash
git clone [repository-url]
cd video-gen-app
```
2.  **Install dependencies**
```bash
npm install
```

3. **Set up environment variables Create a .env.local file with:**

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

4. **Run the development server**
```bash
npm run dev
```

5. **Open the app in your browser**
```bash
http://localhost:3000
```

## **Project Structure**

video-gen-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication pages
│   └── layout.tsx        # Root layout
├── components/            # React components
├── lib/                   # Utility functions
├── public/               # Static assets
└── types/                # TypeScript types

License
This project is licensed under the MIT License - see the LICENSE file for details.