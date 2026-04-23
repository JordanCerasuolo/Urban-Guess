# Project Setup

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create or edit a `.env` file in the `backend` directory with the following:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="qwertyuiopasdfghjklzxcvbnm1234567890"
MAPBOX_ACCESS_TOKEN=""
```

Add your Mapbox API key to `MAPBOX_ACCESS_TOKEN`.

## Database Setup

While in the `backend` directory, run:

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

## Return to Root Directory

```bash
cd ..
```

## Start the API

```bash
npm run dev:api
```

The API should now be running locally.
