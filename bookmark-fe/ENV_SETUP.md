# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Optional: Analytics
# NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Error Tracking
# NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Environment-Specific Examples

### Development (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Staging (.env.staging)

```bash
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com/v1
```

### Production (.env.production)

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/v1
```

## Usage

The API URL is automatically picked up by the RTK Query configuration in `src/stores/slices/query/bookmarks.ts`.

If no environment variable is set, it defaults to `http://localhost:3001/api/v1`.

## Next.js Environment Variables

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are server-side only
- Next.js automatically loads `.env.local`, `.env.development`, `.env.production`, etc.
