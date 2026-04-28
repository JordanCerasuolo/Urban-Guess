# Project Setup (git bash recomended)

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
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"
APP_URL="http://localhost:3000"
```

Create a Mapbox API key (https://www.mapbox.com) and add it to `MAPBOX_ACCESS_TOKEN`.

For email verification, set `SMTP_USER` to your Gmail address and `SMTP_PASS` to a Gmail App Password. To create one: enable 2-Step Verification on your Google account, then visit https://myaccount.google.com/apppasswords to generate a 16-character app password.

## Database Setup

While in the `backend` directory, run:

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```
Then also run:

```bash
pip install -r requirements.txt
npm run mapbox:fetch
npm run prisma:seed:images
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
