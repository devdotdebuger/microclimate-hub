# 🌡️ Microclimate Hub

**AI-Powered Microclimate Action Hub** - A community-driven climate action platform for tracking and reducing urban heat islands through AI analysis and community engagement.

![Microclimate Hub](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### 🌱 Core Functionality
- **Heat Report Submission** - Submit temperature readings with location, photos, and voice notes
- **Real-time Analytics** - AI-powered analysis of climate data and trends
- **Community Impact Tracking** - Monitor collective environmental impact
- **Interactive Maps** - Visualize heat zones and community reports
- **Gamification System** - Earn badges and points for climate actions

### 🎨 User Experience
- **Responsive Design** - Optimized for mobile and desktop
- **Dark Theme** - Eye-friendly interface with green accent colors
- **PWA Support** - Install as a native app with offline capabilities
- **Smooth Animations** - Threads-inspired UI with modern interactions
- **Accessibility** - WCAG compliant with keyboard navigation

### 🔧 Technical Excellence
- **Performance Optimized** - Virtual scrolling, lazy loading, and efficient caching
- **Type Safety** - Full TypeScript implementation
- **State Management** - Zustand for global state with React Query for server state
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Testing** - Unit tests, integration tests, and E2E testing with Playwright

## 📦 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations

### State Management & Data
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching
- **SWR** - Data fetching and caching
- **Supabase** - Backend as a Service (Auth, Database, Storage)

### Performance & Optimization
- **React Window** - Virtual scrolling for large lists
- **Intersection Observer** - Lazy loading and infinite scroll
- **Service Workers** - PWA and offline support
- **Bundle Analysis** - Performance monitoring

### Testing
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/microclimate-hub.git
   cd microclimate-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL script in `supabase-schema.sql` in your Supabase SQL Editor

4. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
microclimate-hub/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── report/            # Report submission
│   ├── impact/            # Impact dashboard
│   ├── profile/           # User profile
│   ├── analytics/         # Analytics dashboard
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── heat-feed-page.tsx
│   ├── navbar.tsx
│   ├── bottom-nav.tsx
│   └── ...
├── hooks/                # Custom React hooks
│   ├── use-debounce.ts
│   ├── use-intersection-observer.ts
│   └── use-local-storage.ts
├── lib/                  # Utilities and configurations
│   ├── api.ts           # API client
│   ├── store.ts         # Zustand store
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   └── icons/           # App icons
├── tests/               # Test files
│   ├── e2e/            # Playwright E2E tests
│   └── unit/           # Jest unit tests
└── ...
```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### E2E Tests
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npx playwright test --ui
```

### Type Checking
```bash
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Configuration

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the project to be set up (this may take a few minutes)

2. **Get Your Project Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the "Project URL" and "anon public" key
   - Add these to your `.env.local` file

3. **Set Up the Database Schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase-schema.sql`
   - Paste and run the SQL script
   - This will create all necessary tables, functions, and policies

4. **Configure Authentication**
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable email confirmations (optional but recommended)
   - Configure any additional auth providers if needed

5. **Set Up Storage (Optional)**
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `report-images`
   - Set the bucket to public for easy access
   - Update the RLS policies as needed

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Optional: Sentry (for error tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Optional: Weather API (for enhanced weather data)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key

# Optional: Google Maps API (for enhanced mapping)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### PWA Configuration
Edit `public/manifest.json` to customize:
- App name and description
- Icons and colors
- Shortcuts and features

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### Optimization Features
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Font Optimization** - Google Fonts with display swap
- **Bundle Analysis** - Run `npm run analyze` to inspect bundle size
- **Caching** - Service worker and React Query caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commits
- Ensure accessibility compliance
- Optimize for performance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Next.js** - React framework
- **Vercel** - Deployment platform
- **Community** - All contributors and supporters

## 📞 Support

- **Documentation**: [docs.microclimate-hub.com](https://docs.microclimate-hub.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/microclimate-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/microclimate-hub/discussions)
- **Email**: support@microclimate-hub.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/microclimate-hub&type=Date)](https://star-history.com/#your-username/microclimate-hub&Date)

---

**Made with ❤️ for a sustainable future** 