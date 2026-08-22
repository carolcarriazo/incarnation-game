// ============================================================
// THE THREAD OF FATE — Static Game Data
// ============================================================

// ─────────────────────────────────────────────────
// PERSONALITY TRAITS
// ─────────────────────────────────────────────────
export const PERSONALITY_TRAITS = [
  "traditional and bound by custom", "open-minded and curious", "stubborn and unyielding",
  "deeply empathetic", "highly ambitious", "cynical and guarded", "quick to anger",
  "melancholic and contemplative", "brave", "quietly observant", "charming and persuasive",
  "deeply pious", "lethargic", "anxious and risk-averse", "stoic under pressure", "garrulous and social",
  "frugal and meticulous", "neurotic", "generous to a fault", "resigned and passive",
  "fiercely independent", "devoted to family", "pragmatic and resourceful", "idealistic",
  "secretive and guarded", "easily led by others", "deeply single-minded and focused", "deeply curious about nature"
];

// ─────────────────────────────────────────────────
// DISABILITY / CONGENITAL CONDITION POOL
// Prevalence-weighted by approximate birth incidence per 1,000 live births.
// The AI receives the category + examples and determines the specific condition.
// ─────────────────────────────────────────────────
export const DISABILITY_POOL = [
  {
    category: "Visual impairment",
    weight: 30,
    examples: [
      "crossed eyes (strabismus) and poor eyesight",
      "clouded eye lenses (congenital cataracts)",
      "congenital colour-blindness",
      "severe congenital near-sightedness",
      "rapid involuntary eye twitching (nystagmus)"
    ],
    visibleAtBirth: false, heartDefect: false
  },
  {
    category: "Musculoskeletal condition",
    weight: 20,
    examples: [
      "a curved spine developing during childhood growth (scoliosis)",
      "a turned foot (clubfoot)",
      "a congenital dislocated hip resulting in a pronounced limp",
      "a stiff twisted neck (torticollis)",
      "webbed fingers or toes (syndactyly)"
    ],
    visibleAtBirth: false, heartDefect: false
  },
  {
    category: "Hearing impairment",
    weight: 16,
    examples: [
      "partial hardness of hearing",
      "complete congenital deafness in both ears",
      "chronic deafness in one ear",
      "persistent ringing and muffled hearing"
    ],
    visibleAtBirth: false, heartDefect: false
  },
  {
    category: "Congenital heart condition",
    weight: 8,
    examples: [
      "a heart murmur causing chronic fatigue and shortness of breath upon exertion",
      "a hole in the heart (septal defect)",
      "poor circulation causing bluish skin and reduced stamina"
    ],
    visibleAtBirth: false, heartDefect: true
  },
  {
    category: "Neurological or motor condition",
    weight: 6,
    examples: [
      "stiff muscle spasms and awkward walking gait (cerebral palsy)",
      "nerve weakness in the lower spine",
      "chronic muscle weakness and poor coordination"
    ],
    visibleAtBirth: false, heartDefect: false
  },
  {
    category: "Neurodivergent condition",
    weight: 5,
    examples: [
      "autism spectrum (deep sensory sensitivity, social eccentricity, and specialized focus)",
      "reading and symbol difficulty (dyslexia)",
      "inability to speak in public or unfamiliar settings (selective mutism)",
      "intense restlessness and impulsivity (ADHD)"
    ],
    visibleAtBirth: false, heartDefect: false
  },
  {
    category: "Intellectual developmental condition",
    weight: 3,
    examples: [
      "Down syndrome (gentle facial features, slow speech, and lifelong dependency)",
      "significant developmental learning delays"
    ],
    visibleAtBirth: true, heartDefect: false
  },
  {
    category: "Facial anomaly",
    weight: 1.5,
    examples: [
      "a cleft lip and palate affecting speech and feeding",
      "a large dark birthmark (port-wine stain) covering part of the face",
      "asymmetry in the facial bones"
    ],
    visibleAtBirth: true, heartDefect: false
  },
  {
    category: "Limb or digit difference",
    weight: 1,
    examples: [
      "an extra finger or toe (polydactyly)",
      "a shortened limb or missing fingers",
      "fused fingers"
    ],
    visibleAtBirth: true, heartDefect: false
  },
  {
    category: "Metabolic condition",
    weight: 0.8,
    examples: [
      "severe digestive intolerance to milk (galactosemia)",
      "thyroid deficiency causing stunted physical and mental growth"
    ],
    visibleAtBirth: false, heartDefect: false
  },
  {
    category: "Short stature condition",
    weight: 0.4,
    examples: [
      "dwarfism (disproportionate short stature with shortened limbs)",
      "brittle bones prone to frequent fractures"
    ],
    visibleAtBirth: false, heartDefect: false
  },
];

// ─────────────────────────────────────────────────
// MODERN COUNTRIES — Population-weighted pool for the Modern Era (1850-2000)
// Weights approximate world population share (baseline ~1950, in % units).
// urbanStart / urbanEnd = urbanisation fraction at 1850 / 2000.
// minorityClassBias: multipliers applied to each class tier when isMinority = true.
//   { working, middle, upper } — values are then renormalized.
// ─────────────────────────────────────────────────
export const MODERN_COUNTRIES = [
  {
    name: "China", weight: 22, lang: "Mandarin Chinese",
    lat: 35.86, lng: 104.19, urbanStart: 0.08, urbanEnd: 0.36, lifeExpectancy: 73,
    minorities: ["Uyghur Muslim", "Tibetan", "Hui (Chinese Muslim)", "Manchu", "Zhuang", "Yi"],
    minorityChance: 0.09,
    minorityClassBias: { working: 1.4, middle: 0.75, upper: 0.35 }
  },
  {
    name: "India", weight: 15, lang: "Hindi or a regional Indian language",
    lat: 20.59, lng: 78.96, urbanStart: 0.09, urbanEnd: 0.28, lifeExpectancy: 68,
    minorities: ["Dalit (Scheduled Caste)", "Muslim minority", "Sikh minority", "Adivasi (tribal) indigenous", "Christian tribal minority"],
    minorityChance: 0.28,
    minorityClassBias: { working: 2.8, middle: 0.40, upper: 0.10 }
  },
  {
    name: "USA", weight: 6, lang: "English",
    lat: 37.09, lng: -95.71, urbanStart: 0.20, urbanEnd: 0.79, lifeExpectancy: 77,
    minorities: ["Black American (African-American)", "Mexican-American (Chicano)", "Chinese-American immigrant", "Puerto Rican", "Italian immigrant", "Jewish immigrant (Ashkenazi)", "Irish-American immigrant"],
    minorityChance: 0.25,
    minorityClassBias: { working: 2.3, middle: 0.50, upper: 0.15 }
  },
  {
    name: "Russia / Soviet Union", weight: 7, lang: "Russian",
    lat: 61.52, lng: 105.31, urbanStart: 0.10, urbanEnd: 0.73, lifeExpectancy: 70,
    minorities: ["Chechen or Caucasian minority", "Tatar Muslim minority", "Ukrainian minority", "Jewish (Ashkenazi)", "Central Asian deportee minority"],
    minorityChance: 0.16,
    minorityClassBias: { working: 1.5, middle: 0.80, upper: 0.35 }
  },
  {
    name: "Indonesia", weight: 3.5, lang: "Indonesian (Bahasa) or a regional language",
    lat: -0.79, lng: 113.92, urbanStart: 0.06, urbanEnd: 0.42, lifeExpectancy: 69,
    minorities: ["Chinese Indonesian (Tionghoa)", "Papuan indigenous", "Balinese Hindu", "Dayak indigenous (Borneo)", "Christian minority in Java"],
    minorityChance: 0.10,
    minorityClassBias: { working: 1.6, middle: 0.70, upper: 0.50 }
  },
  {
    name: "Brazil", weight: 2.5, lang: "Brazilian Portuguese",
    lat: -14.24, lng: -51.93, urbanStart: 0.12, urbanEnd: 0.81, lifeExpectancy: 73,
    minorities: ["Afro-Brazilian (Pardo or Preto)", "Indigenous Amazonian", "Japanese-Brazilian immigrant", "Quilombola community member"],
    minorityChance: 0.45,
    minorityClassBias: { working: 2.0, middle: 0.55, upper: 0.25 }
  },
  {
    name: "Japan", weight: 3.2, lang: "Japanese",
    lat: 36.20, lng: 138.25, urbanStart: 0.15, urbanEnd: 0.79, lifeExpectancy: 83,
    minorities: ["Burakumin (former Edo-era outcaste)", "Zainichi Korean", "Okinawan", "Ainu indigenous (Hokkaido)"],
    minorityChance: 0.05,
    minorityClassBias: { working: 2.0, middle: 0.60, upper: 0.20 }
  },
  {
    name: "Germany", weight: 3, lang: "German",
    lat: 51.17, lng: 10.45, urbanStart: 0.28, urbanEnd: 0.75, lifeExpectancy: 80,
    minorities: ["Jewish German", "Polish Ruhrpolen immigrant worker", "Sinti or Roma", "Turkish Gastarbeiter (post-1960)", "East Prussian expellee"],
    minorityChance: 0.06,
    minorityClassBias: { working: 1.8, middle: 0.60, upper: 0.25 }
  },
  {
    name: "United Kingdom", weight: 2.2, lang: "English",
    lat: 55.38, lng: -3.44, urbanStart: 0.55, urbanEnd: 0.89, lifeExpectancy: 80,
    minorities: ["South Asian (Indian or Pakistani) immigrant", "Afro-Caribbean immigrant", "Irish immigrant", "Jewish (Ashkenazi)", "West African immigrant"],
    minorityChance: 0.08,
    minorityClassBias: { working: 1.9, middle: 0.60, upper: 0.30 }
  },
  {
    name: "France", weight: 2, lang: "French",
    lat: 46.23, lng: 2.21, urbanStart: 0.25, urbanEnd: 0.77, lifeExpectancy: 81,
    minorities: ["North African Algerian (Harki or immigrant)", "West African immigrant", "Romani (Manouche)", "Vietnamese or Indochinese immigrant"],
    minorityChance: 0.07,
    minorityClassBias: { working: 1.8, middle: 0.65, upper: 0.30 }
  },
  {
    name: "Italy", weight: 2, lang: "Italian",
    lat: 41.87, lng: 12.57, urbanStart: 0.22, urbanEnd: 0.67, lifeExpectancy: 82,
    minorities: ["Southern Italian internal migrant (in industrial north)", "Jewish Italian", "Romani (Sinti)", "Slovene minority (Trieste area)"],
    minorityChance: 0.05,
    minorityClassBias: { working: 1.7, middle: 0.70, upper: 0.40 }
  },
  {
    name: "Mexico", weight: 1.8, lang: "Spanish",
    lat: 23.63, lng: -102.55, urbanStart: 0.14, urbanEnd: 0.75, lifeExpectancy: 74,
    minorities: ["Indigenous (Nahua, Maya, Zapotec, or Mixtec)", "Afro-Mexican (Costa Chica community)", "Chinese-Mexican immigrant"],
    minorityChance: 0.18,
    minorityClassBias: { working: 2.4, middle: 0.45, upper: 0.15 }
  },
  {
    name: "Pakistan", weight: 1.5, lang: "Urdu or a regional Pakistani language",
    lat: 30.37, lng: 69.35, urbanStart: 0.08, urbanEnd: 0.33, lifeExpectancy: 67,
    minorities: ["Ahmadiyya Muslim (persecuted)", "Hindu minority", "Christian minority", "Hazara Shia minority", "Baloch separatist community"],
    minorityChance: 0.07,
    minorityClassBias: { working: 2.5, middle: 0.40, upper: 0.15 }
  },
  {
    name: "Bangladesh", weight: 1.3, lang: "Bengali",
    lat: 23.68, lng: 90.36, urbanStart: 0.05, urbanEnd: 0.24, lifeExpectancy: 72,
    minorities: ["Hindu minority", "Bihari (Urdu-speaking) stateless minority", "Chittagong Hill Tracts indigenous (Chakma or Marma)"],
    minorityChance: 0.10,
    minorityClassBias: { working: 2.2, middle: 0.50, upper: 0.20 }
  },
  {
    name: "Nigeria", weight: 1.5, lang: "Yoruba, Igbo, Hausa, or another Nigerian language",
    lat: 9.08, lng: 8.68, urbanStart: 0.05, urbanEnd: 0.44, lifeExpectancy: 54,
    minorities: ["Igbo (in Hausa-majority north)", "Yoruba (in Igbo-majority east)", "Fulani pastoralist minority", "Ijaw (Niger Delta)", "Tiv minority"],
    minorityChance: 0.25,
    minorityClassBias: { working: 1.6, middle: 0.75, upper: 0.45 }
  },
  {
    name: "Philippines", weight: 1.1, lang: "Filipino (Tagalog) or a regional language",
    lat: 12.88, lng: 121.77, urbanStart: 0.10, urbanEnd: 0.48, lifeExpectancy: 72,
    minorities: ["Muslim Moro (Bangsamoro)", "Lumad indigenous (Mindanao)", "Chinese Filipino (Tsinoy)", "Igorot indigenous (Luzon Highlands)"],
    minorityChance: 0.12,
    minorityClassBias: { working: 1.8, middle: 0.60, upper: 0.35 }
  },
  {
    name: "Vietnam", weight: 1.3, lang: "Vietnamese",
    lat: 14.06, lng: 108.28, urbanStart: 0.07, urbanEnd: 0.24, lifeExpectancy: 76,
    minorities: ["Hmong highland minority", "Khmer Krom minority (southern Vietnam)", "Cham Muslim minority", "Chinese-Vietnamese (Hoa)"],
    minorityChance: 0.14,
    minorityClassBias: { working: 1.7, middle: 0.65, upper: 0.35 }
  },
  {
    name: "Egypt", weight: 1, lang: "Arabic",
    lat: 26.82, lng: 30.80, urbanStart: 0.12, urbanEnd: 0.43, lifeExpectancy: 72,
    minorities: ["Coptic Christian", "Nubian minority", "Bedouin (Sinai)", "Jewish Egyptian (pre-1948)"],
    minorityChance: 0.12,
    minorityClassBias: { working: 1.8, middle: 0.65, upper: 0.35 }
  },
  {
    name: "Ethiopia", weight: 1, lang: "Amharic, Oromo, or another Ethiopian language",
    lat: 9.15, lng: 40.49, urbanStart: 0.04, urbanEnd: 0.18, lifeExpectancy: 65,
    minorities: ["Oromo (in Amhara-dominant region)", "Somali (Ogaden) minority", "Tigrinya minority", "Anuak indigenous (Gambela)", "Afar pastoralist"],
    minorityChance: 0.35,
    minorityClassBias: { working: 1.6, middle: 0.70, upper: 0.40 }
  },
  {
    name: "DR Congo", weight: 0.8, lang: "Lingala, Swahili, or another Congolese language",
    lat: -4.04, lng: 21.76, urbanStart: 0.04, urbanEnd: 0.30, lifeExpectancy: 57,
    minorities: ["Pygmy (Aka or Mbuti) indigenous", "Tutsi minority (eastern DRC)", "Banyamulenge", "Luba minority"],
    minorityChance: 0.20,
    minorityClassBias: { working: 1.5, middle: 0.75, upper: 0.50 }
  },
  {
    name: "Argentina", weight: 0.9, lang: "Spanish",
    lat: -38.42, lng: -63.62, urbanStart: 0.30, urbanEnd: 0.91, lifeExpectancy: 76,
    minorities: ["Indigenous Mapuche or Quechua", "Jewish Argentine (Ashkenazi)", "Afro-Argentine", "Bolivian immigrant worker"],
    minorityChance: 0.08,
    minorityClassBias: { working: 1.8, middle: 0.65, upper: 0.35 }
  },
  {
    name: "Korea", weight: 1.2, lang: "Korean",
    lat: 35.91, lng: 127.77, urbanStart: 0.08, urbanEnd: 0.81, lifeExpectancy: 82,
    minorities: ["Chinese-Korean (Joseonjok)", "Baekjeong (historical outcaste class)", "Japanese-era mixed heritage"],
    minorityChance: 0.03,
    minorityClassBias: { working: 2.0, middle: 0.60, upper: 0.25 }
  },
  {
    name: "Poland", weight: 1.3, lang: "Polish",
    lat: 51.92, lng: 19.15, urbanStart: 0.20, urbanEnd: 0.62, lifeExpectancy: 76,
    minorities: ["Jewish (Ashkenazi)", "German minority (Silesia)", "Ukrainian minority", "Romani (Sinti/Roma)"],
    minorityChance: 0.08,
    minorityClassBias: { working: 1.9, middle: 0.60, upper: 0.25 }
  },
  {
    name: "Spain", weight: 1, lang: "Spanish (Castilian), Catalan, Basque, or Galician",
    lat: 40.46, lng: -3.75, urbanStart: 0.28, urbanEnd: 0.77, lifeExpectancy: 83,
    minorities: ["Roma (Gitano)", "Moroccan immigrant", "Basque separatist community", "Catalan regionalist"],
    minorityChance: 0.07,
    minorityClassBias: { working: 1.8, middle: 0.65, upper: 0.35 }
  },
  {
    name: "Ukraine", weight: 1.3, lang: "Ukrainian or Russian",
    lat: 48.38, lng: 31.17, urbanStart: 0.12, urbanEnd: 0.68, lifeExpectancy: 72,
    minorities: ["Jewish (Ashkenazi)", "Crimean Tatar", "Polish minority (Galicia)", "Romani"],
    minorityChance: 0.12,
    minorityClassBias: { working: 1.7, middle: 0.70, upper: 0.30 }
  },
  {
    name: "South Africa", weight: 0.7, lang: "Zulu, Xhosa, Afrikaans, or English",
    lat: -30.56, lng: 22.94, urbanStart: 0.08, urbanEnd: 0.57, lifeExpectancy: 64,
    minorities: ["Black African (Zulu, Xhosa, or Sotho) under colonial/apartheid rule", "Coloured (mixed-race) community", "Indian South African", "Malay Cape community"],
    minorityChance: 0.50,
    minorityClassBias: { working: 3.0, middle: 0.30, upper: 0.08 }
  },
  {
    name: "Tanzania", weight: 0.5, lang: "Swahili or a Bantu regional language",
    lat: -6.37, lng: 34.89, urbanStart: 0.03, urbanEnd: 0.23, lifeExpectancy: 65,
    minorities: ["Arab-Swahili coastal elite (in inland context)", "Indian Tanzanian merchant", "Maasai pastoralist", "Zanzibar Shirazi"],
    minorityChance: 0.12,
    minorityClassBias: { working: 1.5, middle: 0.80, upper: 0.50 }
  },
  {
    name: "Kenya", weight: 0.6, lang: "Swahili or a Kenyan regional language",
    lat: 0.02, lng: 37.91, urbanStart: 0.04, urbanEnd: 0.35, lifeExpectancy: 66,
    minorities: ["Kikuyu (in Luo or Luhya region)", "Somali (northeastern Kenya)", "Indian Kenyan merchant class", "Maasai pastoralist"],
    minorityChance: 0.18,
    minorityClassBias: { working: 1.6, middle: 0.75, upper: 0.45 }
  },
  {
    name: "Turkey", weight: 0.9, lang: "Turkish",
    lat: 38.96, lng: 35.24, urbanStart: 0.12, urbanEnd: 0.65, lifeExpectancy: 77,
    minorities: ["Kurdish minority", "Armenian minority (pre-1915 survivors/descendants)", "Greek Orthodox minority (Istanbul)", "Alevi Muslim minority"],
    minorityChance: 0.18,
    minorityClassBias: { working: 2.0, middle: 0.55, upper: 0.25 }
  },
  {
    name: "Iran", weight: 0.8, lang: "Persian (Farsi)",
    lat: 32.43, lng: 53.69, urbanStart: 0.15, urbanEnd: 0.64, lifeExpectancy: 75,
    minorities: ["Azerbaijani Turk minority", "Kurdish minority", "Arab minority (Khuzestan)", "Baloch minority", "Bahá'í (persecuted religious minority)"],
    minorityChance: 0.25,
    minorityClassBias: { working: 1.7, middle: 0.70, upper: 0.40 }
  },
  {
    // Catch-all for remaining ~10% of world population
    name: "Rest of the World", weight: 9.4, lang: "a regional language",
    lat: 5.0, lng: 20.0, urbanStart: 0.10, urbanEnd: 0.50, lifeExpectancy: 68,
    minorities: ["a significant regional ethnic or religious minority"],
    minorityChance: 0.15,
    minorityClassBias: { working: 1.7, middle: 0.70, upper: 0.40 }
  },
];

// ─────────────────────────────────────────────────
// HISTORICAL ERAS
// Each region now includes lat/lng for the world map pin.
// MODERN era has an empty regions array — it uses MODERN_COUNTRIES instead.
// ─────────────────────────────────────────────────
export const ERAS = [
  {
    id: 'PALEOLITHIC', name: 'Upper Paleolithic', startYear: -70000, endYear: -10000, weight: 2,
    infantMortality: 0.10, childMortality: 0.08, maternalMortality: 0.04, survivingAdultMean: 58, exposureRate: 0.50,
    regions: [
      { text: "East African Rift (Tanzania / Kenya)", lang: "an ancestral proto-human language", minorityChance: 0.02, modernLifeExpectancy: 65, lat: -2.5, lng: 36.0 },
      { text: "Southern African Savanna (Kalahari)", lang: "an early Khoisan click dialect", minorityChance: 0.02, modernLifeExpectancy: 65, lat: -25.0, lng: 24.0 },
      { text: "West African Forest Basin", lang: "an ancestral Niger-Congo dialect", minorityChance: 0.02, modernLifeExpectancy: 60, lat: 6.0, lng: 0.0 },
      { text: "Ice Age Franco-Cantabria (Lascaux / Altamira)", lang: "a Paleolithic European hunter dialect", minorityChance: 0.02, modernLifeExpectancy: 82, lat: 44.0, lng: 1.0 },
      { text: "Central European Mammoth Steppe", lang: "a Paleolithic dialect", minorityChance: 0.02, modernLifeExpectancy: 80, lat: 50.0, lng: 15.0 },
      { text: "Eurasian Steppes & Altai Mountains", lang: "an Ancient North Eurasian dialect", minorityChance: 0.03, modernLifeExpectancy: 72, lat: 51.0, lng: 85.0 },
      { text: "Levant & Fertile Corridor (Kebaran / Natufian)", lang: "an early Afroasiatic foraging dialect", minorityChance: 0.04, modernLifeExpectancy: 74, lat: 32.5, lng: 35.5 },
      { text: "Zagros Mountains & Iranian Plateau", lang: "a Paleolithic hunter-gatherer dialect", minorityChance: 0.03, modernLifeExpectancy: 73, lat: 34.0, lng: 48.0 },
      { text: "Sundaland & Maritime Southeast Asia", lang: "an early Australo-Melanesian dialect", minorityChance: 0.03, modernLifeExpectancy: 72, lat: 0.0, lng: 105.0 },
      { text: "East Asian Loess Plateau & Yellow River Basin", lang: "an ancestral East Asian dialect", minorityChance: 0.03, modernLifeExpectancy: 76, lat: 36.0, lng: 110.0 },
      { text: "Siberian Taiga & Lake Baikal", lang: "an Ancient Paleo-Siberian dialect", minorityChance: 0.02, modernLifeExpectancy: 70, lat: 53.0, lng: 108.0 },
      { text: "Aboriginal Australia (Sahul / Lake Mungo)", lang: "an early Pama-Nyungan language", minorityChance: 0.02, modernLifeExpectancy: 82, lat: -33.7, lng: 143.0 },
      { text: "Early Americas (Monte Verde / Patagonia)", lang: "an ancient Indigenous American dialect", minorityChance: 0.02, modernLifeExpectancy: 75, lat: -41.5, lng: -73.0 }
    ],
    classes: [{ name: "Nomadic Forager", chance: 0.95 }, { name: "Tribe Shaman/Elder", chance: 0.05 }]
  },
  {
    id: 'NEOLITHIC', name: 'Neolithic Revolution', startYear: -10000, endYear: -3000, weight: 10,
    infantMortality: 0.09, childMortality: 0.08, maternalMortality: 0.05, survivingAdultMean: 58, exposureRate: 0.40,
    regions: [
      { text: "Fertile Crescent (Jericho / Göbekli Tepe / Levant)", lang: "a Proto-Semitic / Afroasiatic language", minorityChance: 0.08, modernLifeExpectancy: 74, lat: 37.2, lng: 38.9 },
      { text: "Mesopotamian Alluvium (Proto-Sumerian Settlements)", lang: "an early Mesopotamian substrate", minorityChance: 0.10, modernLifeExpectancy: 73, lat: 32.0, lng: 45.0 },
      { text: "Nile Valley (Pre-Dynastic Egypt / Merimde)", lang: "Proto-Egyptian", minorityChance: 0.06, modernLifeExpectancy: 72, lat: 27.0, lng: 31.0 },
      { text: "Yellow River Basin (Yangshao Culture, China)", lang: "Proto-Sino-Tibetan", minorityChance: 0.04, modernLifeExpectancy: 76, lat: 35.0, lng: 112.0 },
      { text: "Yangtze River Delta (Hemudu / Liangzhu, China)", lang: "Proto-Austroasiatic / Hmong-Mien", minorityChance: 0.04, modernLifeExpectancy: 76, lat: 30.0, lng: 120.0 },
      { text: "Indus Valley (Mehrgarh, South Asia)", lang: "Proto-Dravidian", minorityChance: 0.08, modernLifeExpectancy: 70, lat: 29.3, lng: 67.6 },
      { text: "Ganges River Valley (Early Rice Cultivators, India)", lang: "an ancient Austroasiatic / Munda language", minorityChance: 0.06, modernLifeExpectancy: 69, lat: 25.5, lng: 83.0 },
      { text: "Danubian & Balkan Basin (Vinča Culture, Europe)", lang: "Pre-Indo-European Old European", minorityChance: 0.05, modernLifeExpectancy: 79, lat: 44.8, lng: 20.5 },
      { text: "Atlantic Megalithic Coast (Stonehenge / Carnac / Iberia)", lang: "an ancient Megalithic European language", minorityChance: 0.04, modernLifeExpectancy: 81, lat: 51.2, lng: -1.8 },
      { text: "Pontic-Caspian Steppe (Proto-Indo-European Pastoralists)", lang: "Proto-Indo-European", minorityChance: 0.04, modernLifeExpectancy: 72, lat: 48.0, lng: 44.0 },
      { text: "Jomon Japan (Sedentary Foragers)", lang: "Proto-Japonic / Ancient Ainu", minorityChance: 0.03, modernLifeExpectancy: 84, lat: 35.7, lng: 139.7 },
      { text: "Korean Peninsula (Jeulmun Pottery Period)", lang: "Proto-Koreanic", minorityChance: 0.03, modernLifeExpectancy: 83, lat: 37.5, lng: 127.0 },
      { text: "Southeast Asian Mainland (Ban Chiang, Thailand)", lang: "Proto-Austroasiatic", minorityChance: 0.04, modernLifeExpectancy: 75, lat: 17.4, lng: 103.2 },
      { text: "Sahel & Lake Chad Basin (Sub-Saharan Africa)", lang: "Proto-Nilo-Saharan", minorityChance: 0.05, modernLifeExpectancy: 60, lat: 13.0, lng: 14.0 },
      { text: "Ethiopian Highlands (Early Teff & Enset Farmers)", lang: "Proto-Cushitic", minorityChance: 0.06, modernLifeExpectancy: 66, lat: 9.0, lng: 38.7 },
      { text: "West African Forest (Early Yam Cultivators)", lang: "Proto-Niger-Congo", minorityChance: 0.04, modernLifeExpectancy: 59, lat: 6.5, lng: 3.0 },
      { text: "New Guinea Highlands (Kuk Early Agriculture)", lang: "a Trans-New Guinea language", minorityChance: 0.02, modernLifeExpectancy: 65, lat: -5.8, lng: 144.3 },
      { text: "Mesoamerican Highlands (Tehuacán Valley / Early Maize)", lang: "Proto-Oto-Manguean", minorityChance: 0.04, modernLifeExpectancy: 75, lat: 18.4, lng: -97.4 },
      { text: "Central Andes (Caral-Supe / Norte Chico Civilization, Peru)", lang: "an ancient Proto-Andean language", minorityChance: 0.04, modernLifeExpectancy: 73, lat: -10.9, lng: -77.5 }
    ],
    classes: [{ name: "Early Farmer", chance: 0.88 }, { name: "Pastoral Herder", chance: 0.09 }, { name: "Settlement Chieftain/Elder", chance: 0.03 }]
  },
  {
    id: 'BRONZE_IRON', name: 'Bronze & Iron Age', startYear: -3000, endYear: -500, weight: 15,
    infantMortality: 0.08, childMortality: 0.07, maternalMortality: 0.05, survivingAdultMean: 60, exposureRate: 0.30,
    regions: [
      { text: "Sumer & Akkad (Ur / Babylon / Uruk, Mesopotamia)", lang: "Sumerian or Akkadian", minorityChance: 0.20, modernLifeExpectancy: 73, lat: 31.5, lng: 45.6 },
      { text: "Assyrian Empire (Nineveh / Assur)", lang: "Akkadian (Assyrian dialect)", minorityChance: 0.22, modernLifeExpectancy: 72, lat: 36.3, lng: 43.1 },
      { text: "New Kingdom Egypt (Thebes / Luxor / Memphis)", lang: "Middle / Late Egyptian", minorityChance: 0.14, modernLifeExpectancy: 71, lat: 25.7, lng: 32.6 },
      { text: "Kingdom of Kush / Nubia (Kerma / Napata / Meroë)", lang: "Meroitic", minorityChance: 0.12, modernLifeExpectancy: 65, lat: 18.5, lng: 31.8 },
      { text: "Hittite Empire (Hattusa, Anatolia)", lang: "Hittite or Luwian", minorityChance: 0.16, modernLifeExpectancy: 76, lat: 40.0, lng: 34.6 },
      { text: "Phoenician City-States (Tyre / Sidon / Byblos)", lang: "Phoenician", minorityChance: 0.18, modernLifeExpectancy: 76, lat: 33.2, lng: 35.2 },
      { text: "Minoan & Mycenaean Greece (Knossos / Mycenae)", lang: "Mycenaean Greek or Minoan", minorityChance: 0.12, modernLifeExpectancy: 81, lat: 35.3, lng: 25.1 },
      { text: "Elamite Empire (Susa, Ancient Iran)", lang: "Elamite", minorityChance: 0.15, modernLifeExpectancy: 74, lat: 32.2, lng: 48.2 },
      { text: "Shang & Western Zhou Dynasties (Anyang / Luoyang, China)", lang: "Old Chinese", minorityChance: 0.08, modernLifeExpectancy: 76, lat: 36.1, lng: 114.3 },
      { text: "Sanxingdui Culture (Sichuan Basin, China)", lang: "an ancient Shu-Ba language", minorityChance: 0.06, modernLifeExpectancy: 76, lat: 31.0, lng: 104.2 },
      { text: "Vedic Northern India (Kuru-Panchala Kingdoms)", lang: "Vedic Sanskrit", minorityChance: 0.14, modernLifeExpectancy: 70, lat: 28.5, lng: 77.0 },
      { text: "Indus River Valley (Late Harappan Settlements)", lang: "Harappan / Dravidian", minorityChance: 0.12, modernLifeExpectancy: 70, lat: 27.3, lng: 68.1 },
      { text: "Megalithic South India (Early Tamil / Chera realm)", lang: "Old Tamil / Dravidian", minorityChance: 0.08, modernLifeExpectancy: 72, lat: 11.0, lng: 78.0 },
      { text: "Celtic & Hallstatt Tribes (Central / Western Europe)", lang: "Proto-Celtic", minorityChance: 0.06, modernLifeExpectancy: 81, lat: 47.6, lng: 13.6 },
      { text: "Nuragic Sardinia & Etruscan Italy", lang: "Etruscan or Paleo-Sardinian", minorityChance: 0.10, modernLifeExpectancy: 83, lat: 40.1, lng: 9.0 },
      { text: "Scythian Nomads (Pontic-Caspian Steppe)", lang: "Scythian (Eastern Iranian)", minorityChance: 0.08, modernLifeExpectancy: 72, lat: 47.0, lng: 35.0 },
      { text: "Nok Culture (Central Nigeria, West Africa)", lang: "Early Niger-Congo", minorityChance: 0.05, modernLifeExpectancy: 58, lat: 9.5, lng: 8.0 },
      { text: "Kingdom of Saba (Ancient Yemen / South Arabia)", lang: "Sabaean / Old South Arabian", minorityChance: 0.10, modernLifeExpectancy: 67, lat: 15.4, lng: 45.3 },
      { text: "Olmec Heartlands (La Venta / San Lorenzo, Mexico)", lang: "Mixe-Zoquean", minorityChance: 0.06, modernLifeExpectancy: 75, lat: 18.1, lng: -94.0 },
      { text: "Chavín Civilization (Andean Peru)", lang: "an ancient Andean language", minorityChance: 0.05, modernLifeExpectancy: 73, lat: -9.6, lng: -77.2 },
      { text: "Lapita Seafarers (Bismarck Archipelago / Vanuatu / Fiji)", lang: "Proto-Oceanic", minorityChance: 0.02, modernLifeExpectancy: 73, lat: -17.7, lng: 168.3 },
      { text: "Gojoseon Kingdom (Ancient Korea & Liaoning)", lang: "Old Koreanic", minorityChance: 0.04, modernLifeExpectancy: 83, lat: 39.0, lng: 125.7 }
    ],
    classes: [{ name: "Agricultural Peasant", chance: 0.82 }, { name: "Indentured Servant/Slave", chance: 0.12 }, { name: "Artisan/Smith", chance: 0.04 }, { name: "Palace Elite/Priest", chance: 0.02 }]
  },
  {
    id: 'CLASSICAL', name: 'Classical Antiquity', startYear: -500, endYear: 500, weight: 22,
    infantMortality: 0.08, childMortality: 0.07, maternalMortality: 0.05, survivingAdultMean: 62, exposureRate: 0.20,
    regions: [
      { text: "City of Rome & Italian Peninsula", lang: "Latin", minorityChance: 0.40, modernLifeExpectancy: 83, lat: 41.9, lng: 12.5 },
      { text: "Roman Gaul (France & Belgium)", lang: "Vulgar Latin and Gaulish", minorityChance: 0.25, modernLifeExpectancy: 82, lat: 47.0, lng: 3.0 },
      { text: "Roman Hispania (Iberian Peninsula)", lang: "Vulgar Latin and Iberian", minorityChance: 0.22, modernLifeExpectancy: 83, lat: 40.0, lng: -4.0 },
      { text: "Roman Britannia", lang: "Common Brittonic and Vulgar Latin", minorityChance: 0.15, modernLifeExpectancy: 81, lat: 51.5, lng: -0.1 },
      { text: "Classical Athens & Greek City-States", lang: "Ancient Greek (Attic/Doric)", minorityChance: 0.35, modernLifeExpectancy: 81, lat: 37.97, lng: 23.73 },
      { text: "Ptolemaic & Roman Alexandria (Egypt)", lang: "Koine Greek and Demotic Egyptian", minorityChance: 0.42, modernLifeExpectancy: 71, lat: 31.2, lng: 29.9 },
      { text: "Punic Carthage & Roman Africa Proconsularis", lang: "Punic and Latin", minorityChance: 0.30, modernLifeExpectancy: 76, lat: 36.8, lng: 10.3 },
      { text: "Achaemenid, Parthian & Sasanian Persia (Iran)", lang: "Middle Persian (Pahlavi)", minorityChance: 0.26, modernLifeExpectancy: 74, lat: 29.9, lng: 52.9 },
      { text: "Levant & Judea (Jerusalem / Antioch)", lang: "Aramaic and Greek", minorityChance: 0.38, modernLifeExpectancy: 76, lat: 31.8, lng: 35.2 },
      { text: "Kingdom of Armenia & Caucasus", lang: "Classical Armenian", minorityChance: 0.18, modernLifeExpectancy: 75, lat: 40.2, lng: 44.5 },
      { text: "Aksumite Empire (Ethiopia & Eritrea)", lang: "Ge'ez", minorityChance: 0.18, modernLifeExpectancy: 66, lat: 14.1, lng: 38.7 },
      { text: "Han Dynasty China (Chang'an / Luoyang)", lang: "Middle Chinese", minorityChance: 0.14, modernLifeExpectancy: 76, lat: 34.3, lng: 108.9 },
      { text: "Kingdom of Nanyue / Lingnan (Southern China & Vietnam)", lang: "Old Yue & Old Chinese", minorityChance: 0.20, modernLifeExpectancy: 75, lat: 23.1, lng: 113.3 },
      { text: "Three Kingdoms of Korea (Goguryeo / Silla / Baekje)", lang: "Old Korean", minorityChance: 0.05, modernLifeExpectancy: 83, lat: 37.5, lng: 127.0 },
      { text: "Yayoi & Kofun Japan (Yamato Realm)", lang: "Old Japanese", minorityChance: 0.04, modernLifeExpectancy: 84, lat: 34.5, lng: 135.8 },
      { text: "Maurya & Gupta Empires (Pataliputra, North India)", lang: "Sanskrit and Magadhi Prakrit", minorityChance: 0.22, modernLifeExpectancy: 70, lat: 25.6, lng: 85.1 },
      { text: "Sangam Tamil Kingdoms (Madurai / Chola, South India)", lang: "Old Tamil", minorityChance: 0.12, modernLifeExpectancy: 72, lat: 9.9, lng: 78.1 },
      { text: "Funan & Champa Kingdoms (Southeast Asia)", lang: "Old Mon-Khmer and Cham", minorityChance: 0.15, modernLifeExpectancy: 73, lat: 11.5, lng: 105.0 },
      { text: "Silk Road Oasis Kingdoms (Khotan / Sogdia, Central Asia)", lang: "Sogdian / Saka", minorityChance: 0.35, modernLifeExpectancy: 71, lat: 39.5, lng: 67.0 },
      { text: "Xiongnu & Xianbei Steppe Confederations (Mongolia)", lang: "Proto-Turkic / Mongolic", minorityChance: 0.10, modernLifeExpectancy: 70, lat: 47.0, lng: 103.0 },
      { text: "Germania Magna (Rhine-Danube Germanic Tribes)", lang: "Proto-Germanic", minorityChance: 0.08, modernLifeExpectancy: 80, lat: 52.0, lng: 10.0 },
      { text: "Classic Maya Kingdoms (Tikal / Calakmul / Copán)", lang: "Classic Maya (Ch'olan)", minorityChance: 0.08, modernLifeExpectancy: 75, lat: 17.2, lng: -89.6 },
      { text: "Teotihuacan Metropolis (Central Valley of Mexico)", lang: "Nahuatl / Otomanguean substrate", minorityChance: 0.18, modernLifeExpectancy: 75, lat: 19.7, lng: -98.8 },
      { text: "Moche & Nazca Civilizations (Coastal Peru)", lang: "Mochica / Puquina", minorityChance: 0.08, modernLifeExpectancy: 73, lat: -8.1, lng: -79.0 },
      { text: "Polynesian Voyaging Settlements (Samoa / Tonga)", lang: "Proto-Polynesian", minorityChance: 0.03, modernLifeExpectancy: 75, lat: -14.0, lng: -172.0 }
    ],
    classes: [{ name: "Plebeian/Peasant", chance: 0.78 }, { name: "Enslaved Person", chance: 0.16 }, { name: "Merchant/Artisan", chance: 0.04 }, { name: "Patrician/Aristocrat", chance: 0.02 }]
  },
  {
    id: 'MEDIEVAL', name: 'Medieval & Post-Classical', startYear: 500, endYear: 1500, weight: 25,
    infantMortality: 0.07, childMortality: 0.06, maternalMortality: 0.04, survivingAdultMean: 64, exposureRate: 0.05,
    regions: [
      { text: "Medieval England (London / York)", lang: "Middle English & Anglo-Norman", minorityChance: 0.08, modernLifeExpectancy: 81, lat: 52.0, lng: -1.5 },
      { text: "Kingdom of France (Paris / Île-de-France)", lang: "Old French / Langue d'oïl", minorityChance: 0.08, modernLifeExpectancy: 82, lat: 48.8, lng: 2.3 },
      { text: "Holy Roman Empire (Rhineland / Bavaria / Bohemia)", lang: "Middle High German & Czech", minorityChance: 0.12, modernLifeExpectancy: 81, lat: 50.1, lng: 8.6 },
      { text: "Al-Andalus & Islamic Iberia (Cordoba / Granada)", lang: "Andalusi Arabic & Mozarabic Romance", minorityChance: 0.35, modernLifeExpectancy: 83, lat: 37.2, lng: -3.6 },
      { text: "Crown of Castile & Aragon (Spain)", lang: "Old Castilian & Catalan", minorityChance: 0.18, modernLifeExpectancy: 83, lat: 40.4, lng: -3.7 },
      { text: "Italian City-Republics (Venice / Florence / Genoa)", lang: "Venetian / Tuscan Italian", minorityChance: 0.15, modernLifeExpectancy: 83, lat: 45.4, lng: 12.3 },
      { text: "Byzantine Empire (Constantinople / Thessalonica)", lang: "Medieval Greek", minorityChance: 0.28, modernLifeExpectancy: 78, lat: 41.0, lng: 28.9 },
      { text: "Kievan Rus & Novgorod Republic (Ukraine / Russia)", lang: "Old East Slavic", minorityChance: 0.12, modernLifeExpectancy: 72, lat: 50.5, lng: 30.5 },
      { text: "Viking Scandinavia (Norway / Denmark / Sweden / Iceland)", lang: "Old Norse", minorityChance: 0.06, modernLifeExpectancy: 82, lat: 59.9, lng: 10.7 },
      { text: "Kingdom of Poland & Grand Duchy of Lithuania", lang: "Old Polish & Ruthenian", minorityChance: 0.20, modernLifeExpectancy: 78, lat: 52.2, lng: 21.0 },
      { text: "Kingdom of Hungary & Balkans", lang: "Old Hungarian & South Slavic", minorityChance: 0.22, modernLifeExpectancy: 77, lat: 47.5, lng: 19.0 },
      { text: "Abbasid & Fatimid Caliphates (Baghdad / Cairo / Damascus)", lang: "Classical Arabic", minorityChance: 0.35, modernLifeExpectancy: 74, lat: 33.3, lng: 44.4 },
      { text: "Seljuk & Ilkhanate Persia (Isfahan / Tabriz / Nishapur)", lang: "Persian & Turkic", minorityChance: 0.25, modernLifeExpectancy: 74, lat: 32.6, lng: 51.7 },
      { text: "Tang & Song Dynasties (Kaifeng / Hangzhou / Chang'an, China)", lang: "Middle Chinese", minorityChance: 0.09, modernLifeExpectancy: 76, lat: 30.3, lng: 120.2 },
      { text: "Yuan Dynasty (Dadu / Beijing, Mongol China)", lang: "Middle Chinese & Middle Mongol", minorityChance: 0.22, modernLifeExpectancy: 76, lat: 39.9, lng: 116.4 },
      { text: "Heian & Kamakura Shogunate (Kyoto / Kamakura, Japan)", lang: "Classical Japanese", minorityChance: 0.04, modernLifeExpectancy: 84, lat: 35.0, lng: 135.7 },
      { text: "Goryeo Dynasty (Kaesong, Korea)", lang: "Middle Korean", minorityChance: 0.04, modernLifeExpectancy: 83, lat: 38.0, lng: 126.5 },
      { text: "Delhi Sultanate (Northern India)", lang: "Hindustani, Persian, and Punjabi", minorityChance: 0.25, modernLifeExpectancy: 70, lat: 28.6, lng: 77.2 },
      { text: "Chola & Vijayanagara Empires (South India)", lang: "Tamil, Kannada, and Telugu", minorityChance: 0.14, modernLifeExpectancy: 72, lat: 10.8, lng: 79.1 },
      { text: "Khmer Empire (Angkor Wat, Cambodia)", lang: "Old Khmer", minorityChance: 0.12, modernLifeExpectancy: 73, lat: 13.4, lng: 103.9 },
      { text: "Srivijaya & Majapahit Empires (Java & Sumatra, Indonesia)", lang: "Old Javanese & Classical Malay", minorityChance: 0.16, modernLifeExpectancy: 72, lat: -7.5, lng: 110.4 },
      { text: "Dai Viet (Thang Long / Hanoi, Vietnam)", lang: "Middle Vietnamese", minorityChance: 0.08, modernLifeExpectancy: 75, lat: 21.0, lng: 105.8 },
      { text: "Mongol Steppe Homeland & Golden Horde", lang: "Middle Mongol & Kipchak Turkic", minorityChance: 0.15, modernLifeExpectancy: 70, lat: 47.2, lng: 102.8 },
      { text: "Mali & Songhai Empires (Timbuktu / Gao / Niani)", lang: "Mandinka & Songhai", minorityChance: 0.18, modernLifeExpectancy: 59, lat: 16.8, lng: -3.0 },
      { text: "Kingdom of Benin & Yoruba City-States (Nigeria)", lang: "Edo & Old Yoruba", minorityChance: 0.08, modernLifeExpectancy: 58, lat: 6.3, lng: 5.6 },
      { text: "Swahili Coast City-States (Kilwa / Mombasa / Zanzibar)", lang: "Swahili", minorityChance: 0.22, modernLifeExpectancy: 64, lat: -8.9, lng: 39.5 },
      { text: "Solomonic Empire of Ethiopia (Lalibela / Gondar)", lang: "Ge'ez & Old Amharic", minorityChance: 0.18, modernLifeExpectancy: 66, lat: 12.0, lng: 39.0 },
      { text: "Kingdom of Great Zimbabwe (Southern Africa)", lang: "Old Shona", minorityChance: 0.06, modernLifeExpectancy: 62, lat: -20.3, lng: 30.9 },
      { text: "Aztec Empire (Tenochtitlan, Mexico)", lang: "Classical Nahuatl", minorityChance: 0.20, modernLifeExpectancy: 75, lat: 19.4, lng: -99.1 },
      { text: "Inca Empire (Tahuantinsuyo - Cusco / Quito)", lang: "Classical Quechua", minorityChance: 0.25, modernLifeExpectancy: 73, lat: -13.5, lng: -72.0 },
      { text: "Mississippian Civilization (Cahokia / Moundbuilders, North America)", lang: "an ancient Muskogean or Siouan language", minorityChance: 0.08, modernLifeExpectancy: 77, lat: 38.6, lng: -90.0 },
      { text: "Haudenosaunee & Eastern Woodlands (North America)", lang: "Iroquoian & Algonquian languages", minorityChance: 0.06, modernLifeExpectancy: 77, lat: 43.0, lng: -76.0 },
      { text: "Aotearoa & Polynesian Realm (Māori / Tahiti / Hawaii)", lang: "Māori & Eastern Polynesian dialects", minorityChance: 0.03, modernLifeExpectancy: 78, lat: -38.0, lng: 176.0 }
    ],
    classes: [{ name: "Serf/Peasant", chance: 0.84 }, { name: "Guild Artisan/Merchant", chance: 0.10 }, { name: "Soldier/Mercenary", chance: 0.04 }, { name: "Nobility/Clergy", chance: 0.02 }]
  },
  {
    id: 'EARLY_MODERN', name: 'Early Modern', startYear: 1500, endYear: 1850, weight: 12,
    infantMortality: 0.06, childMortality: 0.05, maternalMortality: 0.03, survivingAdultMean: 66, exposureRate: 0.01,
    regions: [
      { text: "Kingdom of Great Britain & Ireland (London / Edinburgh / Dublin, modern-day UK & Ireland)", lang: "Early Modern English, Scots, and Irish Gaelic", minorityChance: 0.12, modernLifeExpectancy: 81, lat: 51.5, lng: -0.13 },
      { text: "Kingdom of France (Paris / Versailles / Lyon, modern-day France)", lang: "French & Occitan", minorityChance: 0.10, modernLifeExpectancy: 82, lat: 48.8, lng: 2.3 },
      { text: "Habsburg Spain & Empire (Madrid / Seville / Toledo, modern-day Spain)", lang: "Spanish (Castilian)", minorityChance: 0.16, modernLifeExpectancy: 83, lat: 40.4, lng: -3.7 },
      { text: "Holy Roman Empire & German States (Vienna / Berlin / Frankfurt, modern-day Germany & Austria)", lang: "German", minorityChance: 0.15, modernLifeExpectancy: 81, lat: 48.2, lng: 16.4 },
      { text: "Dutch Republic & Low Countries (Amsterdam / Antwerp, modern-day Netherlands & Belgium)", lang: "Dutch / Flemish", minorityChance: 0.14, modernLifeExpectancy: 82, lat: 52.37, lng: 4.9 },
      { text: "Italian States (Papal States / Naples / Venice / Milan, modern-day Italy)", lang: "Italian dialects (Neapolitan, Venetian, Tuscan)", minorityChance: 0.12, modernLifeExpectancy: 83, lat: 41.9, lng: 12.5 },
      { text: "Tsardom & Empire of Russia (Moscow / St. Petersburg, modern-day Russia)", lang: "Russian", minorityChance: 0.22, modernLifeExpectancy: 72, lat: 59.9, lng: 30.3 },
      { text: "Polish-Lithuanian Commonwealth (Warsaw / Vilnius / Krakow, modern-day Poland & Lithuania)", lang: "Polish, Ruthenian, and Yiddish", minorityChance: 0.32, modernLifeExpectancy: 78, lat: 52.2, lng: 21.0 },
      { text: "Scandinavian Kingdoms (Stockholm / Copenhagen, modern-day Sweden & Denmark)", lang: "Swedish & Danish", minorityChance: 0.06, modernLifeExpectancy: 83, lat: 59.3, lng: 18.0 },
      { text: "Ottoman Empire (Istanbul / Cairo / Damascus / Balkans, modern-day Turkey & Middle East)", lang: "Ottoman Turkish, Arabic, and Greek", minorityChance: 0.45, modernLifeExpectancy: 77, lat: 41.0, lng: 29.0 },
      { text: "Safavid & Qajar Persia (Isfahan / Tehran, modern-day Iran)", lang: "Persian and Azerbaijani", minorityChance: 0.24, modernLifeExpectancy: 74, lat: 32.6, lng: 51.7 },
      { text: "Ming & Qing Dynasties (Beijing / Guangzhou / Nanjing, modern-day China)", lang: "Mandarin Chinese, Cantonese, and Manchu", minorityChance: 0.12, modernLifeExpectancy: 76, lat: 39.9, lng: 116.4 },
      { text: "Tokugawa Shogunate (Edo / Kyoto / Osaka, modern-day Japan)", lang: "Early Modern Japanese", minorityChance: 0.03, modernLifeExpectancy: 84, lat: 35.7, lng: 139.7 },
      { text: "Joseon Dynasty (Hanyang / Seoul, modern-day Korea)", lang: "Early Modern Korean", minorityChance: 0.03, modernLifeExpectancy: 83, lat: 37.5, lng: 127.0 },
      { text: "Mughal Empire (Delhi / Agra / Lahore, modern-day India & Pakistan)", lang: "Hindustani, Urdu, and Persian", minorityChance: 0.28, modernLifeExpectancy: 70, lat: 28.6, lng: 77.2 },
      { text: "Maratha Empire & Deccan Kingdoms (Pune / Hyderabad, modern-day India)", lang: "Marathi and Telugu", minorityChance: 0.18, modernLifeExpectancy: 71, lat: 18.5, lng: 73.8 },
      { text: "Kingdom of Ayutthaya & Siam (Bangkok / Ayutthaya, modern-day Thailand)", lang: "Thai", minorityChance: 0.12, modernLifeExpectancy: 75, lat: 14.3, lng: 100.5 },
      { text: "Maritime Southeast Asia (Batavia / Malacca / Manila, modern-day Indonesia & Philippines)", lang: "Malay, Tagalog, and Javanese", minorityChance: 0.25, modernLifeExpectancy: 72, lat: -6.2, lng: 106.8 },
      { text: "Viceroyalty of New Spain (Mexico City / Guadalajara / Puebla, modern-day Mexico)", lang: "Spanish, Nahuatl, and Zapotec", minorityChance: 0.55, modernLifeExpectancy: 75, lat: 19.4, lng: -99.1 },
      { text: "Viceroyalty of Peru & Alto Peru (Lima / Cusco / Potosí, modern-day Peru & Bolivia)", lang: "Spanish, Quechua, and Aymara", minorityChance: 0.60, modernLifeExpectancy: 73, lat: -12.0, lng: -77.0 },
      { text: "Colonial Brazil (Salvador da Bahia / Rio de Janeiro, modern-day Brazil)", lang: "Portuguese, Tupi, and Yoruba dialects", minorityChance: 0.50, modernLifeExpectancy: 74, lat: -12.9, lng: -38.5 },
      { text: "British North America & Early USA (Boston / Virginia / New York, modern-day United States)", lang: "English", minorityChance: 0.22, modernLifeExpectancy: 78, lat: 40.7, lng: -74.0 },
      { text: "French Canada & Acadia (Quebec / Montreal, modern-day Canada)", lang: "French", minorityChance: 0.15, modernLifeExpectancy: 82, lat: 46.8, lng: -71.2 },
      { text: "Caribbean Sugar Colonies (Jamaica / Saint-Domingue / Cuba, modern-day Caribbean)", lang: "Creole, English, French, and Spanish", minorityChance: 0.75, modernLifeExpectancy: 73, lat: 18.1, lng: -77.3 },
      { text: "Kingdom of Dahomey & Ashanti Empire (West Africa, modern-day Ghana & Benin)", lang: "Fon & Twi", minorityChance: 0.10, modernLifeExpectancy: 59, lat: 6.7, lng: -1.6 },
      { text: "Kingdom of Kongo & Ndongo (Central Africa, modern-day Angola & DR Congo)", lang: "Kikongo & Kimbundu", minorityChance: 0.10, modernLifeExpectancy: 58, lat: -6.2, lng: 14.2 },
      { text: "Zulu Kingdom & Cape Colony (modern-day South Africa)", lang: "isiZulu, Dutch/Afrikaans, and Xhosa", minorityChance: 0.30, modernLifeExpectancy: 64, lat: -29.0, lng: 31.0 },
      { text: "Kingdom of Madagascar (Merina Kingdom, modern-day Madagascar)", lang: "Malagasy", minorityChance: 0.08, modernLifeExpectancy: 65, lat: -18.9, lng: 47.5 },
      { text: "Kingdom of Hawaii & Polynesian Islands (modern-day Hawaii / Polynesia)", lang: "Hawaiian and Polynesian languages", minorityChance: 0.04, modernLifeExpectancy: 81, lat: 21.3, lng: -157.8 },
      { text: "Aotearoa / New Zealand (Māori Iwi, modern-day New Zealand)", lang: "Māori language", minorityChance: 0.03, modernLifeExpectancy: 82, lat: -36.8, lng: 174.7 }
    ],
    classes: [{ name: "Lower Class/Peasant/Laborer", chance: 0.74 }, { name: "Middle Class/Merchant/Artisan", chance: 0.20 }, { name: "Upper Class/Aristocracy", chance: 0.06 }]
  },
  {
    id: 'MODERN', name: 'Modern Era', startYear: 1850, endYear: 2000, weight: 14,
    infantMortality: 0.02, childMortality: 0.01, maternalMortality: 0.002, survivingAdultMean: 76, exposureRate: 0.001,
    regions: [], // MODERN uses MODERN_COUNTRIES for location
    classes: [{ name: "Working Class", chance: 0.50 }, { name: "Middle Class", chance: 0.40 }, { name: "Upper Class", chance: 0.10 }]
  }
];
