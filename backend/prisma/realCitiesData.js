/**
 * Five cities per continent, each from a different country.
 * Hints are quiz-style clues. Images filled separately (satelliteImageData null in seed).
 */

export const REAL_CITIES = [
  // AFRICA
  {
    continent: "AFRICA",
    name: "Cairo",
    country: "Egypt",
    description:
      "Major hub on a famous river delta; home to millennia of monuments.",
    hint1: "Think of pyramids and a river that defined ancient life here.",
    hint2: "The metro area is among the largest on its continent.",
  },
  {
    continent: "AFRICA",
    name: "Lagos",
    country: "Nigeria",
    description:
      "Coastal megacity known for commerce, music, and Atlantic-facing sprawl.",
    hint1: "This country is Africa’s most populous; this city sits on a lagoon.",
    hint2: "Former capital vibes—finance and film scenes thrive here.",
  },
  {
    continent: "AFRICA",
    name: "Nairobi",
    country: "Kenya",
    description:
      "High-altitude capital near wildlife parks and the Great Rift.",
    hint1: "Safari gateway: many visitors land here before heading to the Maasai Mara.",
    hint2: "East African tech hub nicknamed “Silicon Savannah” by some.",
  },
  {
    continent: "AFRICA",
    name: "Cape Town",
    country: "South Africa",
    description:
      "Harbor city beneath a flat-topped mountain at Africa’s southwest tip.",
    hint1: "Famous peak with a cable car—Table Mountain overlooks the CBD.",
    hint2: "Robben Island and wine routes are nearby tourist draws.",
  },
  {
    continent: "AFRICA",
    name: "Casablanca",
    country: "Morocco",
    description:
      "Atlantic port and business heart; classic film title, modern industry.",
    hint1: "Morocco’s largest city; Hassan II Mosque overlooks the ocean.",
    hint2: "Name means “white house” in Spanish.",
  },

  // ANTARCTICA (research stations)
  {
    continent: "ANTARCTICA",
    name: "McMurdo Station",
    country: "United States",
    description:
      "US Antarctic research hub on Ross Island; logistics base for the ice.",
    hint1: "Largest community on the continent by population—still tiny by normal city standards.",
    hint2: "Named after a British naval officer; run by the USAP.",
  },
  {
    continent: "ANTARCTICA",
    name: "Rothera Research Station",
    country: "United Kingdom",
    description:
      "British Antarctic Survey facility on Adelaide Island’s west coast.",
    hint1: "UK’s primary Antarctic hub for planes and field science.",
    hint2: "South of the Antarctic Circle on the west side of the peninsula region.",
  },
  {
    continent: "ANTARCTICA",
    name: "Mawson Station",
    country: "Australia",
    description:
      "Australia’s oldest continuous Antarctic station, on the MacRobertson Land coast.",
    hint1: "Named after an Australian explorer of the Heroic Age.",
    hint2: "Australia’s program often stages from Hobart.",
  },
  {
    continent: "ANTARCTICA",
    name: "Esperanza Base",
    country: "Argentina",
    description:
      "Argentine base on the Trinity Peninsula; one of the milder Antarctic settlements.",
    hint1: "Spanish word for “hope” in the name; South American operator.",
    hint2: "Families have wintered here—school made news as southernmost.",
  },
  {
    continent: "ANTARCTICA",
    name: "Novolazarevskaya Station",
    country: "Russia",
    description:
      "Russian inland station in Queen Maud Land, named after an old Russian explorer.",
    hint1: "Operates with ice runway logistics.",
    hint2: "Eastern side of Antarctica; Soviet-era naming pattern.",
  },

  // ASIA
  {
    continent: "ASIA",
    name: "Tokyo",
    country: "Japan",
    description:
      "Capital region mixing neon districts, temples, and bullet-train sprawl.",
    hint1: "World-class metro region; Mount Fuji appears on clear days to the west.",
    hint2: "Shibuya crossing and the Imperial Palace sit in this prefecture cluster.",
  },
  {
    continent: "ASIA",
    name: "Mumbai",
    country: "India",
    description:
      "Arabian Sea port and Bollywood capital on a narrow peninsula.",
    hint1: "Formerly Bombay; Gateway of India faces the harbor.",
    hint2: "Dabbawalas and Marine Drive—financial capital of its country.",
  },
  {
    continent: "ASIA",
    name: "Bangkok",
    country: "Thailand",
    description:
      "Chao Phraya River capital of golden temples and street food.",
    hint1: "Long ceremonial name; locals shorten to Krung Thep.",
    hint2: "Grand Palace and floating markets draw millions of tourists.",
  },
  {
    continent: "ASIA",
    name: "Singapore",
    country: "Singapore",
    description:
      "Island city-state at the Strait of Malacca chokepoint.",
    hint1: "Merlion mascot; hawker culture recognized by UNESCO.",
    hint2: "Entire country is one island metropolis with Changi Airport.",
  },
  {
    continent: "ASIA",
    name: "Dubai",
    country: "United Arab Emirates",
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
    description:
      "Seine river capital of art, cafés, and global diplomacy.",
    hint1: "Iron tower built for a world’s fair still defines the skyline.",
    hint2: "Louvre pyramid and Notre-Dame restoration headlines.",
  },
  {
    continent: "EUROPE",
    name: "Berlin",
    country: "Germany",
    description:
      "Reunified capital of clubs, museums, and Cold War memory.",
    hint1: "East Side Gallery murals on a former barrier wall.",
    hint2: "Brandenburg Gate; Reichstag dome—capital moved back in the 1990s.",
  },
  {
    continent: "EUROPE",
    name: "Rome",
    country: "Italy",
    description:
      "Seven-hill capital of emperors, popes, and pasta.",
    hint1: "Colosseum and Vatican are nearby landmarks.",
    hint2: "All roads once led here—Republic and Empire ruins everywhere.",
  },
  {
    continent: "EUROPE",
    name: "Madrid",
    country: "Spain",
    description:
      "High-plateau capital of art museums and late-night tapas.",
    hint1: "Prado and Reina Sofía; not the coastal city with Sagrada Familia.",
    hint2: "Royal Palace and Retiro Park; bullfighting heritage region.",
  },
  {
    continent: "EUROPE",
    name: "Warsaw",
    country: "Poland",
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
    description:
      "Harbor city of islands and boroughs; UN and finance hub.",
    hint1: "Statue of Liberty guards the Upper Bay; grid streets famous worldwide.",
    hint2: "Times Square and Central Park—not the nation’s political capital.",
  },
  {
    continent: "NORTH_AMERICA",
    name: "Toronto",
    country: "Canada",
    description:
      "Lake Ontario shore multicultural hub with a needle tower.",
    hint1: "CN Tower once world’s tallest freestanding; Raptors and Maple Leafs home.",
    hint2: "Largest city in its province; Niagara Falls day-trip distance.",
  },
  {
    continent: "NORTH_AMERICA",
    name: "Mexico City",
    country: "Mexico",
    description:
      "High-altitude basin capital built on ancient lakebed Aztec roots.",
    hint1: "Zócalo and Templo Mayor ruins; tacos al pastor on every corner.",
    hint2: "One of Earth’s most populous metros; Chapultepec Castle overlooks sprawl.",
  },
  {
    continent: "NORTH_AMERICA",
    name: "Havana",
    country: "Cuba",
    description:
      "Caribbean capital of vintage cars and Spanish colonial fortifications.",
    hint1: "Malecón seawall; cigars and salsa—long US embargo context.",
    hint2: "Old Habana UNESCO core with pastel facades.",
  },
  {
    continent: "NORTH_AMERICA",
    name: "Panama City",
    country: "Panama",
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
    description:
      "Harbor city with opera shells and surf beaches eastward.",
    hint1: "Coathanger bridge and Bondi; not the national capital Canberra.",
    hint2: "First British colony site; New Year’s fireworks over the harbor.",
  },
  {
    continent: "OCEANIA",
    name: "Auckland",
    country: "New Zealand",
    description:
      "Volcanic-field city of sails between two harbors.",
    hint1: "Sky Tower jump; Māori and Pacific communities strong here.",
    hint2: "Largest city in New Zealand; ferries to nearby islands.",
  },
  {
    continent: "OCEANIA",
    name: "Suva",
    country: "Fiji",
    description:
      "Pacific archipelago capital on the largest island’s southeast coast.",
    hint1: "Rugby-loving nation; tropical cyclone season matters.",
    hint2: "Port on Viti Levu; Indian-Fijian cultural mix from colonial labor.",
  },
  {
    continent: "OCEANIA",
    name: "Port Moresby",
    country: "Papua New Guinea",
    description:
      "Capital on a Gulf of Papua bay; gateway to highland tribes.",
    hint1: "Independent since 1975; Tok Pisin widely spoken.",
    hint2: "Coral Sea north; Kokoda Track history from WWII.",
  },
  {
    continent: "OCEANIA",
    name: "Honiara",
    country: "Solomon Islands",
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
    description:
      "Inland megacity of finance, street art, and endless neighborhoods.",
    hint1: "Portuguese-speaking; not the beach-famous Rio.",
    hint2: "Congonhas and Guarulhos airports serve this state capital sprawl.",
  },
  {
    continent: "SOUTH_AMERICA",
    name: "Buenos Aires",
    country: "Argentina",
    description:
      "Plata River port of tango, beef, and Parisian-style avenues.",
    hint1: "La Boca colorful houses; Obelisco on 9 de Julio.",
    hint2: "Mate tea culture; football clubs Boca and River split the city.",
  },
  {
    continent: "SOUTH_AMERICA",
    name: "Lima",
    country: "Peru",
    description:
      "Pacific coastal capital above pre-Columbian pyramids in the desert strip.",
    hint1: "Ceviche capital; Plaza Mayor with colonial balconies.",
    hint2: "Gateway to Machu Picchu by air—not at altitude itself.",
  },
  {
    continent: "SOUTH_AMERICA",
    name: "Bogotá",
    country: "Colombia",
    description:
      "High Andean plateau capital of museums and cable-car barrios.",
    hint1: "Monserrate overlooks sprawl at 2,600 m elevation.",
    hint2: "Ciclovía Sundays; coffee axis flights from El Dorado airport.",
  },
  {
    continent: "SOUTH_AMERICA",
    name: "Santiago",
    country: "Chile",
    description:
      "Andean-foot capital in a valley with wine routes nearby.",
    hint1: "Costanera skyscraper; earthquakes shape building codes.",
    hint2: "Hour to Valparaíso port; ski resorts east in winter.",
  },
];
