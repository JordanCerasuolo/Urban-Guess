/**
 * Five cities per continent, each from a different country.
 * lat/lng WGS84 for Mapbox satellite fetch; imageKey = safe ASCII filename stem.
 */

export const REAL_CITIES = [
  // AFRICA
  {
    continent: "AFRICA",
    name: "Cairo",
    country: "Egypt",
    lat: 30.0444,
    lng: 31.2357,
    imageKey: "cairo",
    description:
      "Major hub on a famous river delta; home to millennia of monuments.",
    hint1: "Think of pyramids and a river that defined ancient life here.",
    hint2: "The metro area is among the largest on its continent.",
  },
  {
    continent: "AFRICA",
    name: "Lagos",
    country: "Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    imageKey: "lagos",
    description:
      "Coastal megacity known for commerce, music, and Atlantic-facing sprawl.",
    hint1: "This country is Africa’s most populous; this city sits on a lagoon.",
    hint2: "Former capital vibes—finance and film scenes thrive here.",
  },
  {
    continent: "AFRICA",
    name: "Nairobi",
    country: "Kenya",
    lat: -1.2921,
    lng: 36.8219,
    imageKey: "nairobi",
    description:
      "High-altitude capital near wildlife parks and the Great Rift.",
    hint1: "Safari gateway: many visitors land here before heading to the Maasai Mara.",
    hint2: "East African tech hub nicknamed “Silicon Savannah” by some.",
  },
  {
    continent: "AFRICA",
    name: "Cape Town",
    country: "South Africa",
    lat: -33.9249,
    lng: 18.4241,
    imageKey: "cape_town",
    description:
      "Harbor city beneath a flat-topped mountain at Africa’s southwest tip.",
    hint1: "Famous peak with a cable car—Table Mountain overlooks the CBD.",
    hint2: "Robben Island and wine routes are nearby tourist draws.",
  },
  {
    continent: "AFRICA",
    name: "Casablanca",
    country: "Morocco",
    lat: 33.5731,
    lng: -7.5898,
    imageKey: "casablanca",
    description:
      "Atlantic port and business heart; classic film title, modern industry.",
    hint1: "Morocco’s largest city; Hassan II Mosque overlooks the ocean.",
    hint2: "Name means “white house” in Spanish.",
  },

  // ASIA
  {
    continent: "ASIA",
    name: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    imageKey: "tokyo",
    description:
      "Capital region mixing neon districts, temples, and bullet-train sprawl.",
    hint1: "World-class metro region; Mount Fuji appears on clear days to the west.",
    hint2: "Shibuya crossing and the Imperial Palace sit in this prefecture cluster.",
  },
  {
    continent: "ASIA",
    name: "Mumbai",
    country: "India",
    lat: 19.076,
    lng: 72.8777,
    imageKey: "mumbai",
    description:
      "Arabian Sea port and Bollywood capital on a narrow peninsula.",
    hint1: "Formerly Bombay; Gateway of India faces the harbor.",
    hint2: "Dabbawalas and Marine Drive—financial capital of its country.",
  },
  {
    continent: "ASIA",
    name: "Bangkok",
    country: "Thailand",
    lat: 13.7563,
    lng: 100.5018,
    imageKey: "bangkok",
    description:
      "Chao Phraya River capital of golden temples and street food.",
    hint1: "Long ceremonial name; locals shorten to Krung Thep.",
    hint2: "Grand Palace and floating markets draw millions of tourists.",
  },
  {
    continent: "ASIA",
    name: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    imageKey: "singapore",
    description:
      "Island city-state at the Strait of Malacca chokepoint.",
    hint1: "Merlion mascot; hawker culture recognized by UNESCO.",
    hint2: "Entire country is one island metropolis with Changi Airport.",
  },
  {
    continent: "ASIA",
    name: "Dubai",
    country: "United Arab Emirates",
    lat: 25.2048,
    lng: 55.2708,
    imageKey: "dubai",
    description:
      "Desert metropolis famous for skyscrapers and artificial islands.",
    hint1: "Burj Khalifa and palm-shaped reclamation projects.",
    hint2: "Emirate name matches the city; not the federal capital Abu Dhabi.",
  },

  // EUROPE
  {
    continent: "EUROPE",
    name: "Paris",
    country: "France",
    lat: 48.8566,
    lng: 2.3522,
    imageKey: "paris",
    description:
      "Seine river capital of art, cafés, and global diplomacy.",
    hint1: "Iron tower built for a world’s fair still defines the skyline.",
    hint2: "Louvre pyramid and Notre-Dame restoration headlines.",
  },
  {
    continent: "EUROPE",
    name: "Berlin",
    country: "Germany",
    lat: 52.52,
    lng: 13.405,
    imageKey: "berlin",
    description:
      "Reunified capital of clubs, museums, and Cold War memory.",
    hint1: "East Side Gallery murals on a former barrier wall.",
    hint2: "Brandenburg Gate; Reichstag dome—capital moved back in the 1990s.",
  },
  {
    continent: "EUROPE",
    name: "Rome",
    country: "Italy",
    lat: 41.9028,
    lng: 12.4964,
    imageKey: "rome",
    description:
      "Seven-hill capital of emperors, popes, and pasta.",
    hint1: "Colosseum and Vatican are nearby landmarks.",
    hint2: "All roads once led here—Republic and Empire ruins everywhere.",
  },
  {
    continent: "EUROPE",
    name: "Madrid",
    country: "Spain",
    lat: 40.4168,
    lng: -3.7038,
    imageKey: "madrid",
    description:
      "High-plateau capital of art museums and late-night tapas.",
    hint1: "Prado and Reina Sofía; not the coastal city with Sagrada Familia.",
    hint2: "Royal Palace and Retiro Park; bullfighting heritage region.",
  },
  {
    continent: "EUROPE",
    name: "Warsaw",
    country: "Poland",
    lat: 52.2297,
    lng: 21.0122,
    imageKey: "warsaw",
    description:
      "Vistula River capital rebuilt after WWII with Old Town UNESCO site.",
    hint1: "Rising skyscrapers in a city reborn from wartime rubble.",
    hint2: "Chopin’s homeland capital; Palace of Culture Stalin-era skyline.",
  },

  // NORTH_AMERICA
  {
    continent: "NORTH_AMERICA",
    name: "New York",
    country: "United States",
    lat: 40.7128,
    lng: -74.006,
    imageKey: "new_york",
    description:
      "Harbor city of islands and boroughs; UN and finance hub.",
    hint1: "Statue of Liberty guards the Upper Bay; grid streets famous worldwide.",
    hint2: "Times Square and Central Park—not the nation’s political capital.",
  },
  {
    continent: "NORTH_AMERICA",
    name: "Toronto",
    country: "Canada",
    lat: 43.6532,
    lng: -79.3832,
    imageKey: "toronto",
    description:
      "Lake Ontario shore multicultural hub with a needle tower.",
    hint1: "CN Tower once world’s tallest freestanding; Raptors and Maple Leafs home.",
    hint2: "Largest city in its province; Niagara Falls day-trip distance.",
  },
  {
    continent: "NORTH_AMERICA",
    name: "Mexico City",
    country: "Mexico",
    lat: 19.4326,
    lng: -99.1332,
    imageKey: "mexico_city",
    description:
      "High-altitude basin capital built on ancient lakebed Aztec roots.",
    hint1: "Zócalo and Templo Mayor ruins; tacos al pastor on every corner.",
    hint2: "One of Earth’s most populous metros; Chapultepec Castle overlooks sprawl.",
  },
  {
    continent: "NORTH_AMERICA",
    name: "Havana",
    country: "Cuba",
    lat: 23.1136,
    lng: -82.3666,
    imageKey: "havana",
    description:
      "Caribbean capital of vintage cars and Spanish colonial fortifications.",
    hint1: "Malecón seawall; cigars and salsa—long US embargo context.",
    hint2: "Old Habana UNESCO core with pastel facades.",
  },
  {
    continent: "NORTH_AMERICA",
    name: "Panama City",
    country: "Panama",
    lat: 8.9824,
    lng: -79.5199,
    imageKey: "panama_city",
    description:
      "Pacific-side capital anchoring a famous canal’s Pacific locks.",
    hint1: "Casco Viejo skyline contrasts with canal shipping economy.",
    hint2: "Bridge of the Americas connects continents at the isthmus.",
  },

  // OCEANIA
  {
    continent: "OCEANIA",
    name: "Sydney",
    country: "Australia",
    lat: -33.8688,
    lng: 151.2093,
    imageKey: "sydney",
    description:
      "Harbor city with opera shells and surf beaches eastward.",
    hint1: "Coathanger bridge and Bondi; not the national capital Canberra.",
    hint2: "First British colony site; New Year’s fireworks over the harbor.",
  },
  {
    continent: "OCEANIA",
    name: "Auckland",
    country: "New Zealand",
    lat: -36.8509,
    lng: 174.7645,
    imageKey: "auckland",
    description:
      "Volcanic-field city of sails between two harbors.",
    hint1: "Sky Tower jump; Māori and Pacific communities strong here.",
    hint2: "Largest city in New Zealand; ferries to nearby islands.",
  },
  {
    continent: "OCEANIA",
    name: "Suva",
    country: "Fiji",
    lat: -18.1416,
    lng: 178.4419,
    imageKey: "suva",
    description:
      "Pacific archipelago capital on the largest island’s southeast coast.",
    hint1: "Rugby-loving nation; tropical cyclone season matters.",
    hint2: "Port on Viti Levu; Indian-Fijian cultural mix from colonial labor.",
  },
  {
    continent: "OCEANIA",
    name: "Port Moresby",
    country: "Papua New Guinea",
    lat: -9.4438,
    lng: 147.1803,
    imageKey: "port_moresby",
    description:
      "Capital on a Gulf of Papua bay; gateway to highland tribes.",
    hint1: "Independent since 1975; Tok Pisin widely spoken.",
    hint2: "Coral Sea north; Kokoda Track history from WWII.",
  },
  {
    continent: "OCEANIA",
    name: "Honiara",
    country: "Solomon Islands",
    lat: -9.4316,
    lng: 159.9568,
    imageKey: "honiara",
    description:
      "Guadalcanal WWII history and Melanesian capital on a hilly coast.",
    hint1: "Pacific nation east of PNG; Battle of Guadalcanal sites nearby.",
    hint2: "Iron Bottom Sound diving; national museum in this town.",
  },

  // SOUTH_AMERICA
  {
    continent: "SOUTH_AMERICA",
    name: "São Paulo",
    country: "Brazil",
    lat: -23.5505,
    lng: -46.6333,
    imageKey: "sao_paulo",
    description:
      "Inland megacity of finance, street art, and endless neighborhoods.",
    hint1: "Portuguese-speaking; not the beach-famous Rio.",
    hint2: "Congonhas and Guarulhos airports serve this state capital sprawl.",
  },
  {
    continent: "SOUTH_AMERICA",
    name: "Buenos Aires",
    country: "Argentina",
    lat: -34.6037,
    lng: -58.3816,
    imageKey: "buenos_aires",
    description:
      "Plata River port of tango, beef, and Parisian-style avenues.",
    hint1: "La Boca colorful houses; Obelisco on 9 de Julio.",
    hint2: "Mate tea culture; football clubs Boca and River split the city.",
  },
  {
    continent: "SOUTH_AMERICA",
    name: "Lima",
    country: "Peru",
    lat: -12.0464,
    lng: -77.0428,
    imageKey: "lima",
    description:
      "Pacific coastal capital above pre-Columbian pyramids in the desert strip.",
    hint1: "Ceviche capital; Plaza Mayor with colonial balconies.",
    hint2: "Gateway to Machu Picchu by air—not at altitude itself.",
  },
  {
    continent: "SOUTH_AMERICA",
    name: "Bogotá",
    country: "Colombia",
    lat: 4.711,
    lng: -74.0721,
    imageKey: "bogota",
    description:
      "High Andean plateau capital of museums and cable-car barrios.",
    hint1: "Monserrate overlooks sprawl at 2,600 m elevation.",
    hint2: "Ciclovía Sundays; coffee axis flights from El Dorado airport.",
  },
  {
    continent: "SOUTH_AMERICA",
    name: "Santiago",
    country: "Chile",
    lat: -33.4489,
    lng: -70.6693,
    imageKey: "santiago",
    description:
      "Andean-foot capital in a valley with wine routes nearby.",
    hint1: "Costanera skyscraper; earthquakes shape building codes.",
    hint2: "Hour to Valparaíso port; ski resorts east in winter.",
  },
];
