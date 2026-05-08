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

For email verification, set `SMTP_USER` to your Gmail address and `SMTP_PASS` to a Gmail App Password. 
To create one:  
1. Enable 2-Step Verification on your Google account
2. Visit https://myaccount.google.com/u/1/apppasswords or https://myaccount.google.com/apppasswords
3. If the setting is not available for you, try with a different gmail account
4. Create a new app specific password for "Urban Guess"
5. Replace `'xxxx xxxx xxxx xxxx'` with the 16-character app password

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
# On windows (Cole) I had to do: 
# winget install --id=astral-sh.uv -e
# uv venv --python 3.12
# uv pip install -r requirements.txt
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
