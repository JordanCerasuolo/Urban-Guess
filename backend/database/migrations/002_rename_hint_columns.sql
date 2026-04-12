-- Optional upgrade: rename hint columns from older naming to hint_1 / hint_2
-- Safe to run on DBs that already use hint_1 / hint_2 (no-op).

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'cities' AND column_name = 'hint_after_wrong_try_1'
    ) THEN
        ALTER TABLE cities RENAME COLUMN hint_after_wrong_try_1 TO hint_1;
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'cities' AND column_name = 'hint_after_wrong_try_2'
    ) THEN
        ALTER TABLE cities RENAME COLUMN hint_after_wrong_try_2 TO hint_2;
    END IF;
END $$;

COMMENT ON COLUMN cities.hint_1 IS 'First hint to serve in-game (e.g. after first wrong guess).';
COMMENT ON COLUMN cities.hint_2 IS 'Second hint to serve in-game (e.g. after second wrong guess).';
