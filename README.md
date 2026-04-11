# UrbanGuess
Web-based city guessing game by their satellite images

## Environment Setup Requirements

Required environment items for the current auth and database setup.

## 1. Install project dependencies
This installs all packages used by the app, including bcrypt, pg, and dotenv.

```bash
npm install
```

## 2. Ensure bcrypt is installed
Login and signup use password hashing/verification with bcrypt.

```bash
npm install bcrypt --save
```

## 3. Create a .env file in the project root
Database connection is loaded from environment variables in backend/db/pool.js.

```env
DATABASE_HOST=localhost
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
DATABASE_PORT=5432
```

## 4. Make sure PostgreSQL is running and your DB has a users table
Auth service reads/writes to users with fields: id, username, email, password_hash.

## 5. Start the app
Run the server after dependencies and environment variables are ready.

```bash
node app.js
```
## Then go here on browser
http://localhost:3000