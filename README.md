# Unified Lending Platform

A modern lending platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of deals, metrics, and pipeline
- **Deal Management**: Complete deal lifecycle management
- **Origination Module**: New deal creation and processing
- **Underwriting Module**: Risk assessment and approval workflow
- **Portfolio Management**: Loan portfolio monitoring and analytics
- **API Routes**: RESTful API for backend operations

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Icons**: Lucide React
- **Charts**: Recharts
- **Theme**: next-themes for dark/light mode

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── deals/         # Deal management endpoints
│   │   └── users/         # User management endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── ...           # Feature components
│   └── styles/           # Global styles
└── ...
```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/deals` - Get all deals
- `POST /api/deals` - Create new deal
- `GET /api/deals/[id]` - Get deal details
- `PUT /api/deals/[id]` - Update deal
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Development

This project uses:

- **ESLint** for code linting
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Next.js App Router** for routing and API

## Deployment

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```
