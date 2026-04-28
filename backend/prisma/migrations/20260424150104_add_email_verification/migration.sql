-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "continent" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "normalized_answer" TEXT NOT NULL,
    "satellite_image_data" BLOB,
    "satellite_image_mime_type" TEXT,
    "description" TEXT,
    "hint_1" TEXT,
    "hint_2" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "quiz_runs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "score_total" INTEGER NOT NULL DEFAULT 0,
    "num_rounds" INTEGER NOT NULL DEFAULT 5,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" DATETIME,
    CONSTRAINT "quiz_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_rounds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quiz_run_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "round_order" INTEGER NOT NULL,
    "points_earned" INTEGER NOT NULL DEFAULT 0,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "resolved_try_number" INTEGER,
    "gave_up" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_rounds_quiz_run_id_fkey" FOREIGN KEY ("quiz_run_id") REFERENCES "quiz_runs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_rounds_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "round_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "round_id" TEXT NOT NULL,
    "try_number" INTEGER NOT NULL,
    "typed_answer_raw" TEXT,
    "typed_answer_normalized" TEXT,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "is_given_up" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "round_submissions_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "quiz_rounds" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cities_continent_country_name_key" ON "cities"("continent", "country", "name");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_rounds_quiz_run_id_round_order_key" ON "quiz_rounds"("quiz_run_id", "round_order");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_rounds_quiz_run_id_city_id_key" ON "quiz_rounds"("quiz_run_id", "city_id");

-- CreateIndex
CREATE UNIQUE INDEX "round_submissions_round_id_try_number_key" ON "round_submissions"("round_id", "try_number");
