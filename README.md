# LinksFam Creator Dashboard

[![CI/CD Pipeline](https://github.com/linkfam_v2/linksfam-frontend/workflows/Frontend%20CI/CD%20Pipeline/badge.svg)](https://github.com/linkfam_v2/linksfam-frontend/actions)
[![codecov](https://codecov.io/gh/linkfam_v2/linksfam-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/linkfam_v2/linksfam-frontend)

React-based dashboard for content creators and influencers to manage collaborations and campaigns.

## 🚀 Features

- **Creator Dashboard** - Comprehensive analytics and performance metrics
- **Campaign Management** - Track active and completed collaborations
- **Content Analytics** - Detailed insights on content performance
- **Earnings Tracking** - Revenue analytics and payment management
- **Profile Management** - Social account linking and bio optimization
- **Real-time Notifications** - Instant updates on new opportunities

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Zustand** for state management
- **Chart.js** for analytics visualization

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/linkfam_v2/linksfam-frontend.git
cd linksfam-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

## 📱 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
```

## 🌍 Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development

# Authentication
VITE_AUTH_DOMAIN=your-auth-domain
VITE_AUTH_CLIENT_ID=your-client-id

# Analytics
VITE_GA_TRACKING_ID=your-ga-id
VITE_MIXPANEL_TOKEN=your-mixpanel-token
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── stores/             # Zustand stores
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 🚀 Deployment

The application is automatically deployed via GitHub Actions:
- **Staging**: Deploys on push to `develop` branch → staging-linksfam.vercel.app
- **Production**: Deploys on push to `main` branch → app.linksfam.com

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- Dashboard.test.tsx

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Repositories

- [Backend API](https://github.com/linkfam_v2/linksfam-backend)
- [Landing Website](https://github.com/linkfam_v2/linksfam-landing)
- [Documentation](https://github.com/linkfam_v2/linksfam-docs)
- [Infrastructure](https://github.com/linkfam_v2/linksfam-infrastructure)
