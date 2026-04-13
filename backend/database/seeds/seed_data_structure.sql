-- Geo Typing Game Seed Data Structure
-- Template to seed canonical city data.
-- Satellite image BYTEA ingestion should be done by an API-driven script.
-- Per city: max 3 tries; after wrong try 1 / 2 serve hint_1 / hint_2 from cities.

-- ============================================================================
-- SEED CITIES
-- ============================================================================
-- Matching flow:
--   1) Compare user raw input to cities.name
--   2) If not equal, compare normalized input to cities.normalized_answer
-- Hints: return hint_1 after first wrong guess, hint_2 after second (optional; description is separate).

INSERT INTO cities (
    id,
    continent,
    name,
    country,
    normalized_answer,
    satellite_image_data,
    satellite_image_mime_type,
    description,
    hint_1,
    hint_2,
    is_active
) VALUES
    (uuid_generate_v4(), 'EUROPE', 'Paris', 'France', 'paris', NULL, NULL, 'Capital of France',
     'This city is nicknamed La Ville Lumière (the City of Light).',
     'A famous iron tower here was built for an 1889 world''s fair.',
     TRUE),
    (uuid_generate_v4(), 'ASIA', 'Tokyo', 'Japan', 'tokyo', NULL, NULL, 'Capital of Japan',
     'This metro area is one of the most populous in the world.',
     'The country''s emperor traditionally resides in this capital region.',
     TRUE),
    (uuid_generate_v4(), 'NORTH_AMERICA', 'New York', 'United States', 'new york', NULL, NULL, 'Major city in the United States',
     'This city has a green rectangle park famous in movies.',
     'Its harbor once welcomed a copper-green statue as a gift from France.',
     TRUE),
    (uuid_generate_v4(), 'EUROPE', 'London', 'United Kingdom', 'london', NULL, NULL, 'Capital of the United Kingdom',
     'The River Thames flows through this capital.',
     'Big Ben is a bell in a clock tower near the Houses of Parliament.',
     TRUE),
    (uuid_generate_v4(), 'EUROPE', 'Rome', 'Italy', 'rome', NULL, NULL, 'Capital of Italy',
     'This city is nicknamed the Eternal City.',
     'Tiny country inside it is home to the Pope.',
     TRUE),
    (uuid_generate_v4(), 'OCEANIA', 'Sydney', 'Australia', 'sydney', NULL, NULL, 'Largest city in Australia',
     'This harbor city hosted the 2000 Summer Olympics.',
     'Its opera house has sail-like roof shells.',
     TRUE),
    (uuid_generate_v4(), 'ASIA', 'Dubai', 'United Arab Emirates', 'dubai', NULL, NULL, 'Major city in UAE',
     'This city is in a federation of seven emirates.',
     'It is known for very tall skyscrapers in the desert.',
     TRUE),
    (uuid_generate_v4(), 'EUROPE', 'Barcelona', 'Spain', 'barcelona', NULL, NULL, 'Major city in Spain',
     'Antoni Gaudí left many unusual buildings here.',
     'This region has its own language besides Spanish.',
     TRUE),
    (uuid_generate_v4(), 'EUROPE', 'Amsterdam', 'Netherlands', 'amsterdam', NULL, NULL, 'Capital of the Netherlands',
     'Canals and narrow houses are iconic here.',
     'Many locals commute by bicycle.',
     TRUE),
    (uuid_generate_v4(), 'ASIA', 'Singapore', 'Singapore', 'singapore', NULL, NULL, 'City-state in Southeast Asia',
     'This island nation banned chewing gum sales for years.',
     'It has a famous hotel with a ship on three towers.',
     TRUE);

-- ============================================================================
-- SATELLITE IMAGE INGESTION (OUTSIDE STATIC SQL SEED)
-- ============================================================================
-- Recommended ingestion loop in application/script:
-- 1) Fetch city rows where satellite_image_data IS NULL
-- 2) Call your satellite API with city/coordinates
-- 3) Store returned bytes in satellite_image_data and MIME in satellite_image_mime_type
-- 4) Keep cities.is_active = TRUE only for rows with valid image payload

-- ============================================================================
-- OPTIONAL SAMPLE GAME DATA (FOR LOCAL TESTING)
-- ============================================================================
-- INSERT INTO quiz_runs (id, user_id, continent, score_total, num_rounds, ended_at)
-- VALUES (
--   uuid_generate_v4(),
--   (SELECT id FROM users LIMIT 1),
--   'EUROPE',
--   0,
--   5,
--   NULL
-- );
