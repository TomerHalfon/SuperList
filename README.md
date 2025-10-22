# SuperList - Shopping List Manager

A modern shopping list management application built with Next.js 15, MUI, and Supabase.

## Features

- 🔐 **User Authentication** - Email/password and Google SSO
- 📝 **Shopping Lists** - Create and manage multiple shopping lists
- ✅ **Item Management** - Add, edit, and check off items
- 🎨 **Theme Support** - Light and dark mode
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material-UI (MUI) v7
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand + TanStack Query
- **Language**: TypeScript

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SuperList
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to **Settings** → **API** to find your project credentials

#### Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** 
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your **Publishable API key** (NOT the Secret key!)
  - In newer Supabase dashboards, this is labeled as "Publishable key"
  - In older dashboards, this was called "anon public" key
  - ⚠️ **DO NOT** use the "Secret key" in the browser - it must remain private!

Get these from: Supabase Dashboard → Settings → API

#### Run Database Migrations

1. Install Supabase CLI (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

   Or manually run the SQL files in the Supabase SQL Editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_add_soft_delete.sql`

#### Configure Authentication Providers

##### Email Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

##### Google OAuth

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Google** provider
3. Create OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project (or select existing)
   - Enable **Google+ API**
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Set Application Type to **Web application**
   - Add authorized redirect URIs:
     - Development: `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - Production: `https://<your-domain>.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**
4. Paste the credentials into Supabase:
   - Go back to Supabase **Authentication** → **Providers** → **Google**
   - Enter **Client ID** and **Client Secret**
   - Save

#### Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration** in Supabase
2. Add the following redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

### 3. Run the Development Server

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app will redirect you to the login page. You can:
- Sign up with email/password
- Sign in with Google
- Toggle between light and dark themes

## Project Structure

```
SuperList/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes (login, signup)
│   ├── lists/               # Shopping list pages
│   ├── api/                 # API routes (if any)
│   └── layout.tsx           # Root layout with providers
├── src/
│   ├── actions/             # Server actions
│   ├── components/          # React components
│   │   ├── features/        # Feature-specific components
│   │   ├── layout/          # Layout components
│   │   ├── providers/       # Context providers
│   │   └── ui/              # MUI wrapper components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and configurations
│   │   ├── auth/            # Authentication utilities
│   │   ├── storage/         # Data storage layer
│   │   ├── utils/           # Helper functions
│   │   └── validations/     # Zod schemas
│   └── types/               # TypeScript type definitions
├── supabase/
│   ├── migrations/          # Database migrations
│   └── seed.sql             # Seed data
└── middleware.ts            # Next.js middleware for auth
```

## Authentication Flow

### Email/Password Authentication

1. User enters email and password on `/login` or `/signup`
2. Form data is validated using Zod schemas
3. Server action calls Supabase Auth API
4. On success, user is redirected to home or original destination
5. Middleware validates session on subsequent requests

### Google OAuth Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. Google redirects back to `/auth/callback` with code
4. Code is exchanged for a session
5. User is redirected to home or original destination

### Route Protection

- Middleware checks for valid session on all routes except `/login`, `/signup`, and `/auth/callback`
- Unauthenticated users are redirected to `/login?redirect={original-path}`
- After successful login, users are redirected back to their original destination

## Development Notes

### Custom Component Wrappers

This project uses custom wrappers around MUI components to:
- Maintain consistent API across the app
- Allow easy theming and customization
- Reduce direct dependency on MUI throughout the codebase

All custom components are in `src/components/ui/`.

### State Management

- **Local State**: React `useState` for component-specific state
- **Global State**: Zustand for app-wide state
- **Server State**: TanStack Query for API data caching
- **Auth State**: Supabase Auth with session management

### Database Access

The app uses a storage abstraction layer in `src/lib/storage/` that supports:
- JSON file storage (development)
- Supabase (production)

Configure the storage backend in your code by importing from `src/lib/storage/index.ts`.

## Deployment

### Environment Variables

Make sure to set the following environment variables in your production environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Deploy on Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Post-Deployment

1. Update Supabase redirect URLs with your production domain
2. Update Google OAuth redirect URIs with your production domain
3. Test authentication flows in production

## Troubleshooting

### Authentication Issues

**Problem**: "Invalid login credentials" error
- Check that your email/password are correct
- Verify that the email provider is enabled in Supabase

**Problem**: Google OAuth not working
- Verify Google Client ID and Secret in Supabase
- Check that redirect URIs are correctly configured in Google Cloud Console
- Ensure Supabase redirect URLs include your domain

**Problem**: "Session not found" error
- Clear browser cookies and try again
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly

### Database Issues

**Problem**: "relation does not exist" error
- Run database migrations: `supabase db push`
- Or manually run SQL files in Supabase SQL Editor

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [MUI Documentation](https://mui.com/material-ui/getting-started/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

## License

MIT
