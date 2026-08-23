import React, { useState, useEffect } from 'react';
import {
  RefreshCw, ScrollText, Skull, Heart, Star, Clock, Globe2,
  Sparkles, BookOpen, Loader2, Link as LinkIcon, Calendar, MapPin, Medal,
  X, Lock, Crown, Landmark, Users, User, Share2, Check, AlertTriangle, Briefcase
} from 'lucide-react';
import { PERSONALITY_TRAITS, DISABILITY_POOL, MODERN_COUNTRIES, ERAS } from './gameData.js';
import { BADGE_DEFINITIONS, evaluateBadges } from './badgeData.js';
import WorldMap from './components/WorldMap.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import { playUiSound } from './utils/audio.js';

// --- UTILITIES ---
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const formatYear = (y) => y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
const randomGaussian = (mean, stdev) => Math.floor(Math.max(1, Math.min(120, (Math.sqrt(-2.0 * Math.log(1 - Math.random())) * Math.cos(2.0 * Math.PI * Math.random())) * stdev + mean)));
// Weighted random pick — pool items must have a numeric `weight` property
const pickWeighted = (pool) => {
  const total = pool.reduce((s, item) => s + item.weight, 0);
  let rand = Math.random() * total;
  for (const item of pool) { rand -= item.weight; if (rand <= 0) return item; }
  return pool[pool.length - 1];
};

// Epidemiologically weighted cause of death picker
const pickWeightedCause = (pool) => {
  const total = pool.reduce((s, item) => s + (item.weight != null ? item.weight : 1), 0);
  let rand = Math.random() * total;
  for (const item of pool) {
    const w = item.weight != null ? item.weight : 1;
    rand -= w;
    if (rand <= 0) return typeof item === 'object' && item.name ? item.name : item;
  }
  const last = pool[pool.length - 1];
  return typeof last === 'object' && last.name ? last.name : last;
};

const cleanRegionName = (region) => {
  if (!region) return '';
  if (region.includes("Polynesia") || region.includes("Polynesian") || region.includes("Samoa") || region.includes("Tonga") || region.includes("Hawaii")) return "Polynesia & Pacific";
  if (region.includes("Aotearoa") || region.includes("Māori")) return "New Zealand (Aotearoa)";
  if (region.includes("China") || region.includes("Shang") || region.includes("Zhou") || region.includes("Han Dynasty") || region.includes("Song") || region.includes("Tang") || region.includes("Ming") || region.includes("Qing") || region.includes("Yuan") || region.includes("Sanxingdui") || region.includes("Yangshao") || region.includes("Liangzhu")) return "China";
  if (region.includes("India") || region.includes("Vedic") || region.includes("Maurya") || region.includes("Gupta") || region.includes("Mughal") || region.includes("Maratha") || region.includes("Delhi Sultanate") || region.includes("Chola") || region.includes("Mehrgarh") || region.includes("Harappan") || region.includes("Ganges")) return "India";
  if (region.includes("Japan") || region.includes("Jomon") || region.includes("Yayoi") || region.includes("Kamakura") || region.includes("Tokugawa") || region.includes("Heian") || region.includes("Edo") || region.includes("Yamato")) return "Japan";
  if (region.includes("Korea") || region.includes("Goryeo") || region.includes("Joseon") || region.includes("Gojoseon") || region.includes("Silla") || region.includes("Goguryeo") || region.includes("Jeulmun")) return "Korea";
  if (region.includes("Egypt") || region.includes("Alexandria") || region.includes("Kush") || region.includes("Nubia") || region.includes("Nile")) return "Egypt & Nile";
  if (region.includes("Mesopotamia") || region.includes("Sumer") || region.includes("Akkad") || region.includes("Assyrian") || region.includes("Babylon") || region.includes("Ur ") || region.includes("Nineveh")) return "Mesopotamia";
  if (region.includes("Persia") || region.includes("Iran") || region.includes("Elamite") || region.includes("Sasanian") || region.includes("Safavid") || region.includes("Qajar") || region.includes("Parthian")) return "Persia (Iran)";
  if (region.includes("Rome") || region.includes("Roman") || region.includes("Italian") || region.includes("Venice") || region.includes("Florence") || region.includes("Genoa") || region.includes("Naples") || region.includes("Etruscan")) return "Italy / Roman World";
  if (region.includes("Greece") || region.includes("Athens") || region.includes("Minoan") || region.includes("Mycenaean") || region.includes("Byzantine") || region.includes("Constantinople")) return "Greece / Byzantine World";
  if (region.includes("France") || region.includes("Gaul") || region.includes("French") || region.includes("Franco-Cantabria")) return "France";
  if (region.includes("England") || region.includes("Britain") || region.includes("Britannia") || region.includes("Scotland") || region.includes("Ireland") || region.includes("Stonehenge")) return "British Isles";
  if (region.includes("Spain") || region.includes("Iberia") || region.includes("Hispania") || region.includes("Al-Andalus") || region.includes("Castile") || region.includes("Cordoba") || region.includes("Granada")) return "Spain";
  if (region.includes("Holy Roman") || region.includes("German") || region.includes("Germania") || region.includes("Danubian") || region.includes("Vinča") || region.includes("Hallstatt")) return "Germany & Central Europe";
  if (region.includes("Russia") || region.includes("Rus") || region.includes("Novgorod") || region.includes("Siberian") || region.includes("Baikal")) return "Russia & Eastern Europe";
  if (region.includes("Poland") || region.includes("Lithuania")) return "Poland-Lithuania";
  if (region.includes("Ottoman") || region.includes("Turkey") || region.includes("Istanbul") || region.includes("Anatolia") || region.includes("Hittite") || region.includes("Göbekli")) return "Ottoman / Anatolia";
  if (region.includes("Levant") || region.includes("Fertile Crescent") || region.includes("Jericho") || region.includes("Judea") || region.includes("Phoenician") || region.includes("Tyre") || region.includes("Carthage") || region.includes("Caliphate") || region.includes("Arabia") || region.includes("Saba")) return "Middle East & Levant";
  if (region.includes("Ethiopia") || region.includes("Aksumite") || region.includes("Solomonic") || region.includes("Eritrea")) return "Ethiopia & Horn of Africa";
  if (region.includes("Maya") || region.includes("Aztec") || region.includes("Teotihuacan") || region.includes("Olmec") || region.includes("Mexico") || region.includes("New Spain") || region.includes("Tehuacán")) return "Mexico & Mesoamerica";
  if (region.includes("Inca") || region.includes("Peru") || region.includes("Andes") || region.includes("Chavín") || region.includes("Moche") || region.includes("Nazca") || region.includes("Caral")) return "Andean South America";
  if (region.includes("Brazil")) return "Brazil";
  if (region.includes("Caribbean") || region.includes("Cuba") || region.includes("Jamaica") || region.includes("Haiti") || region.includes("Saint-Domingue")) return "Caribbean";
  if (region.includes("Mali") || region.includes("Songhai") || region.includes("Benin") || region.includes("Yoruba") || region.includes("Dahomey") || region.includes("Ashanti") || region.includes("Nok") || region.includes("West Africa")) return "West Africa";
  if (region.includes("Kongo") || region.includes("Ndongo") || region.includes("Central Africa")) return "Central Africa";
  if (region.includes("Swahili") || region.includes("Kilwa") || region.includes("East Africa") || region.includes("Rift")) return "East Africa";
  if (region.includes("Zimbabwe") || region.includes("Zulu") || region.includes("Cape Colony") || region.includes("Southern Africa") || region.includes("Kalahari") || region.includes("Madagascar")) return "Southern Africa";
  if (region.includes("Steppe") || region.includes("Mongol") || region.includes("Xiongnu") || region.includes("Scythian") || region.includes("Central Asia") || region.includes("Sogdia") || region.includes("Altai")) return "Eurasian Steppe & Central Asia";
  if (region.includes("Khmer") || region.includes("Cambodia") || region.includes("Vietnam") || region.includes("Dai Viet") || region.includes("Siam") || region.includes("Ayutthaya") || region.includes("Thailand") || region.includes("Southeast Asia") || region.includes("Sundaland") || region.includes("Java") || region.includes("Majapahit") || region.includes("Srivijaya") || region.includes("Batavia") || region.includes("Manila") || region.includes("Ban Chiang") || region.includes("Funan") || region.includes("Champa")) return "Southeast Asia";
  if (region.includes("Papua") || region.includes("New Guinea") || region.includes("Lapita") || region.includes("Melanesia")) return "Melanesia & Pacific";
  if (region.includes("Australia") || region.includes("Sahul") || region.includes("Mungo")) return "Indigenous Australia";
  if (region.includes("North America") || region.includes("United States") || region.includes("Thirteen Colonies") || region.includes("Cahokia") || region.includes("Haudenosaunee") || region.includes("Woodlands") || region.includes("Canada") || region.includes("Acadia") || region.includes("Early Americas") || region.includes("Monte Verde") || region.includes("Patagonia")) return "The Americas";

  return region.replace(/\s*\(.*?\)/g, '').trim();
};

const formatFullLocation = (specificLocation, rawRegion) => {
  const cleanRegion = cleanRegionName(rawRegion);
  if (!specificLocation) return cleanRegion || rawRegion || 'Unknown Location';

  const specLower = specificLocation.toLowerCase();
  const regionLower = cleanRegion.toLowerCase();

  if (specLower.includes(regionLower)) {
    return specificLocation;
  }
  return `${specificLocation}, ${cleanRegion}`;
};

// ── HISTORICAL CATASTROPHE & MASS EVENT MATCHER ────────────────────────
const checkHistoricalCatastropheDeath = (region, deathYear, isFemale, socialClass) => {
  const regLower = (region || '').toLowerCase();
  const isUpper = (socialClass || '').toLowerCase().includes('upper') || (socialClass || '').toLowerCase().includes('nobility') || (socialClass || '').toLowerCase().includes('patrician') || (socialClass || '').toLowerCase().includes('aristocrat') || (socialClass || '').toLowerCase().includes('clergy');

  // France: Reign of Terror (1793-1794)
  if ((regLower.includes('france') || regLower.includes('paris')) && (deathYear === 1793 || deathYear === 1794)) {
    if (isUpper) return "Guillotined at the Place de la Révolution as a noble class enemy during the Reign of Terror";
    return "Executed by guillotine on charges of treason and counter-revolutionary conspiracy during the Reign of Terror";
  }

  // St. Bartholomew's Day Massacre (1572 France)
  if ((regLower.includes('france') || regLower.includes('paris')) && deathYear === 1572) {
    return "Assassinated in the streets during the St. Bartholomew's Day massacre of Huguenots";
  }

  // Visigothic Sack of Rome (410 CE)
  if ((regLower.includes('rome') || regLower.includes('italy')) && (deathYear >= 408 && deathYear <= 410)) {
    return "Slain in the streets during the Visigothic Sack of Rome under King Alaric";
  }

  // Great Fire of Rome (64 CE)
  if ((regLower.includes('rome') || regLower.includes('italy')) && deathYear === 64) {
    return "Died in the raging inferno of the Great Fire of Rome under Emperor Nero";
  }

  // Mount Vesuvius Eruption (79 CE)
  if ((regLower.includes('rome') || regLower.includes('italy') || regLower.includes('naples')) && deathYear === 79) {
    return "Suffocated by the volcanic ash and pyroclastic surge of Mount Vesuvius in Pompeii/Herculaneum";
  }

  // Fourth Crusade Sack of Constantinople (1204 CE)
  if ((regLower.includes('byzant') || regLower.includes('constantinople') || regLower.includes('greece')) && (deathYear >= 1203 && deathYear <= 1204)) {
    return "Slain during the sacking and burning of Constantinople by Crusaders during the Fourth Crusade";
  }

  // Fall of Constantinople (1453 CE)
  if ((regLower.includes('byzant') || regLower.includes('constantinople') || regLower.includes('greece')) && deathYear === 1453) {
    return "Killed defending the breach in the Theodosian walls during the Ottoman Fall of Constantinople";
  }

  // Mongol Sack of Baghdad (1258 CE)
  if ((regLower.includes('baghdad') || regLower.includes('mesopotamia') || regLower.includes('iraq') || regLower.includes('caliphate')) && deathYear === 1258) {
    return "Massacred during the Mongol siege and sack of Baghdad by Hulagu Khan";
  }

  // Siege of Tenochtitlan (1521 CE)
  if ((regLower.includes('mexico') || regLower.includes('aztec') || regLower.includes('mesoamerica')) && (deathYear >= 1520 && deathYear <= 1521)) {
    return "Fell defending the causeways and temples during the Spanish Siege of Tenochtitlan by Hernán Cortés";
  }

  // Conquest of Inca Empire / Siege of Cusco (1533-1536 CE)
  if ((regLower.includes('inca') || regLower.includes('peru') || regLower.includes('andean')) && (deathYear >= 1532 && deathYear <= 1536)) {
    return "Killed during the Spanish conquest of the Inca Empire / Siege of Cusco";
  }

  // Taiping Rebellion (1850-1864 CE)
  if (regLower.includes('china') && (deathYear >= 1851 && deathYear <= 1864)) {
    return "Perished amidst the warfare and starvation of the Taiping Rebellion";
  }

  // Red Terror / Russian Civil War (1918-1922 CE)
  if ((regLower.includes('russia') || regLower.includes('soviet')) && (deathYear >= 1918 && deathYear <= 1922)) {
    if (isUpper) return "Executed by the Bolshevik Cheka as a bourgeois class enemy during the Red Terror";
    return "Killed during the fighting and famine of the Russian Civil War";
  }

  // Thirty Years' War (1618-1648 CE Germany / Central Europe)
  if ((regLower.includes('german') || regLower.includes('holy roman') || regLower.includes('danubian')) && (deathYear >= 1618 && deathYear <= 1648)) {
    return "Slain by marauding mercenary soldiers during the Thirty Years' War";
  }

  // Peasants' Revolt (1381 CE England)
  if ((regLower.includes('england') || regLower.includes('britain')) && deathYear === 1381) {
    return "Killed in the chaotic street fighting of the Peasants' Revolt in London";
  }

  // English Civil War (1642-1649 CE England)
  if ((regLower.includes('england') || regLower.includes('britain')) && (deathYear >= 1642 && deathYear <= 1649)) {
    return "Fell in combat during the English Civil War (Parliamentarians vs Royalists)";
  }

  return null;
};

// --- EXHAUSTIVE CAUSE OF DEATH GENERATOR ---
const determineExhaustiveCauseOfDeath = (era, birthYear, age, sex, socialClass, conditions) => {
  const isFemale = sex === 'Female';
  const deathYear = birthYear + age;
  const isWorkingClass = socialClass.includes("Working") || socialClass.includes("Laborer") || socialClass.includes("Serf") || socialClass.includes("Peasant") || socialClass.includes("Slave");

  // Check for specific monumental historical disasters/events
  const catastropheDeath = checkHistoricalCatastropheDeath(conditions.region, deathYear, isFemale, socialClass);
  if (catastropheDeath) return catastropheDeath;

  if (conditions.suicide) return "Suicide (driven by untreated severe melancholia/depression and crushing social or personal circumstances)";

  if (age === 0) {
    if (conditions.wasExposed) return "Exposure / Infanticide at birth due to visible structural deformity present at delivery";
    if (conditions.isHeartDefect) return "Congenital heart defect (infant cardiac failure)";
    return pickWeightedCause([
      { name: "acute bronchopneumonia in winter", weight: 28 },
      { name: "gastrointestinal infection (infantile dysentery/diarrhea)", weight: 26 },
      { name: "neonatal tetanus ('seven-day sickness')", weight: 20 },
      { name: "puerperal or neonatal infection", weight: 18 },
      { name: "infantile wasting / failure to thrive", weight: 15 },
      { name: "sudden infant fever of unknown origin", weight: 12 },
      { name: "congenital respiratory failure", weight: 8 },
      { name: "congenital biliary atresia", weight: 1 }
    ]);
  }
  if (age < 15) {
    if (conditions.isHeartDefect) return "Sudden cardiac failure resulting from untreated congenital heart defect";
    const childRoll = Math.random();
    // 90% of early childhood deaths are infectious illness, respiratory, waterborne, or epidemics
    if (childRoll < 0.90) {
      if (era.id === 'MODERN' && deathYear > 1950) {
        return pickWeightedCause([
          { name: "acute lymphoblastic leukemia (childhood cancer)", weight: 22 },
          { name: "bacterial meningitis (meningococcal infection)", weight: 18 },
          { name: "congenital metabolic crisis", weight: 15 },
          { name: "type 1 diabetes", weight: 12 },
          { name: "severe viral myocarditis", weight: 8 },
          { name: "severe acute asthma exacerbation", weight: 8 },
          { name: "fulminant peritonitis from a ruptured appendix", weight: 6 }
        ]);
      }
      return pickWeightedCause([
        { name: "acute dysentery / waterborne gastrointestinal infection", weight: 28 },
        { name: "pulmonary infection / severe lobar pneumonia", weight: 25 },
        { name: "measles complicated by secondary bacterial bronchopneumonia or encephalitis", weight: 20 },
        { name: "smallpox epidemic with fulminant pustular fever", weight: 18 },
        { name: "diphtheria ('the strangling angel') causing severe airway obstruction", weight: 16 },
        { name: "whooping cough (pertussis) with acute respiratory exhaustion", weight: 15 },
        { name: "cholera", weight: 12 },
        { name: "scarlet fever with severe streptococcal complications", weight: 12 },
        { name: "tuberculous meningitis (the white plague in youth)", weight: 10 },
        { name: "malaria (tertian ague) causing severe anemia and high-fever convulsion", weight: 10 },
        { name: "epidemic typhus fever transmitted by lice in winter quarters", weight: 8 },
        { name: "severe enteric fever (typhoid) from contaminated drinking water", weight: 8 },
        { name: "acute infantile convulsions brought on by high febrile illness", weight: 8 },
        { name: "severe nutritional deficiency and scurvy during a harsh winter famine", weight: 6 },
        { name: "acute tonsillitis leading to sepsis", weight: 4 }
      ]);
    } else if (childRoll < 0.97) {
      // Accidents / Trauma (very rare compared to disease)
      if (era.id === 'MODERN') {
        return pickRandomItem([
          "fatal road traffic accident / vehicle collision",
          "accidental drowning during a swimming excursion",
          "severe domestic dwelling fire / smoke inhalation",
          "accidental ingestion of a toxic household substance"
        ]);
      }
      return pickRandomItem([
        "accidental drowning in a village millpond, well, or river",
        "fatal skull fracture from an accidental fall from a tree, haystack, or rooftop",
        "severe dwelling fire / fatal smoke inhalation and thermal burns",
        "accidental scalding from an overturned boiling cooking cauldron",
        "asphyxiation / smothering during winter sleep in cramped, unventilated quarters",
        "accidental kick from a spooked draft animal in the barn"
      ]);
    } else {
      // Wartime / Famine / Extreme Weather
      return pickRandomItem([
        "starvation and acute exposure during a regional wartime siege or localized crop famine",
        "fatal injuries sustained as an innocent bystander during an enemy raid and settlement sacking",
        "severe hypothermia and frostbite after getting lost during an unseasonal blizzard"
      ]);
    }
  }

  if (isFemale && age >= 15 && age <= 40 && conditions.maternalRoll) {
    return pickRandomItem(["massive postpartum hemorrhage following grueling labor", "puerperal sepsis (childbed fever) days after delivery", "severe obstructed labor / uterine rupture"]);
  }

  if (conditions.isHeartDefect && era.id !== 'MODERN') return "Sudden cardiac failure secondary to an uncorrected congenital heart defect";

  if (era.id === 'MODERN') {
    if (age >= 85) return "peaceful decline of extreme old age";
    if (age >= 75) {
      return pickWeightedCause([
        { name: "congestive heart failure", weight: 30 },
        { name: "massive ischemic cerebral infarction (ischemic stroke)", weight: 26 },
        { name: "bacterial pneumonia (the old person's friend)", weight: 20 },
        { name: "advanced Alzheimer's disease / neurodegenerative decline", weight: 15 },
        { name: "hospital complications following a severe fall and fractured hip in old age", weight: 10 }
      ]);
    }

    const modernRoll = Math.random();
    if (age >= 55) {
      if (modernRoll < 0.85) {
        if (isFemale) {
          return pickWeightedCause([
            { name: "acute heart attack (coronary thrombosis)", weight: 28 },
            { name: "massive ischemic stroke", weight: 22 },
            { name: "congestive heart failure", weight: 18 },
            { name: "lung cancer", weight: 15 },
            { name: "breast cancer", weight: 14 },
            { name: "bowel / colon cancer", weight: 10 },
            { name: "pancreatic cancer", weight: 5 },
            { name: "ovarian cancer", weight: 4 },
            { name: "stomach cancer", weight: 4 },
            { name: "cervical cancer", weight: 3 },
            { name: "liver cancer", weight: 3 },
            { name: "ruptured brain aneurysm", weight: 1.5 },
            { name: "motor neuron disease (ALS)", weight: 0.5 },
            { name: "advanced multiple sclerosis (MS) with secondary respiratory complications", weight: 0.5 }
          ]);
        }
        return pickWeightedCause([
          { name: "acute heart attack", weight: 32 },
          { name: "massive ischemic stroke", weight: 20 },
          { name: "lung cancer", weight: 18 },
          { name: "congestive heart failure", weight: 16 },
          { name: "prostate cancer", weight: 12 },
          { name: "bowel / colon cancer", weight: 10 },
          { name: "pancreatic cancer", weight: 5 },
          { name: "stomach cancer", weight: 4 },
          { name: "liver cancer", weight: 4 },
          { name: "esophageal cancer", weight: 3 },
          { name: "ruptured brain aneurysm", weight: 1.5 },
          { name: "motor neuron disease (ALS)", weight: 0.5 },
          { name: "advanced multiple sclerosis (MS) with secondary complications", weight: 0.5 }
        ]);
      }
      return pickWeightedCause([
        { name: "complications of type 2 diabetes", weight: 22 },
        { name: "acute respiratory distress syndrome (ARDS)", weight: 16 },
        { name: "postoperative pulmonary embolism", weight: 6 },
        { name: "fatal motor vehicle collision", weight: 4 }
      ]);
    } else {
      // Young adults / early middle age (15 - 54)
      // HIV/AIDS Epidemic (1980 - 2005): Peak Era of HIV/AIDS Crisis for gay/bisexual men before widely available HAART
      if (!isFemale && (conditions.orientation === 'Homosexual' || (conditions.orientation === 'Bisexual' && conditions.actedOnBi)) && deathYear >= 1980 && deathYear <= 2005 && age >= 20) {
        if (Math.random() < 0.60) {
          return "complications of HIV/AIDS during the epidemic";
        }
      }

      if (!isFemale && ((deathYear >= 1914 && deathYear <= 1918) || (deathYear >= 1939 && deathYear <= 1945))) {
        return pickRandomItem(["fatal artillery shrapnel wound on the front lines", "combat gunshot wound sustained in battle"]);
      }
      if (deathYear >= 1918 && deathYear <= 1920 && Math.random() < 0.35) {
        return "Spanish influenza";
      }

      if (modernRoll < 0.40) {
        return pickWeightedCause([
          { name: "sudden cardiac arrest secondary to an undiagnosed arrhythmia", weight: 24 },
          { name: "pulmonary embolism (blood clot traveling to the lungs)", weight: 16 },
          { name: "ruptured brain aneurysm (sudden fatal brain hemorrhage)", weight: 12 },
          { name: "acute bacterial endocarditis stemming from childhood rheumatic fever", weight: 4 },
          { name: "complications of muscular dystrophy causing progressive respiratory failure", weight: 1.5 },
          { name: "motor neuron disease (ALS)", weight: 1.0 }
        ]);
      } else if (modernRoll < 0.70) {
        if (isFemale) {
          return pickWeightedCause([
            { name: "breast cancer", weight: 26 },
            { name: "pulmonary tuberculosis", weight: 16 },
            { name: "cervical cancer", weight: 14 },
            { name: "acute leukemia", weight: 9 },
            { name: "ovarian cancer", weight: 7 },
            { name: "brain tumor (glioblastoma)", weight: 7 },
            { name: "acute peritonitis secondary to a ruptured appendix", weight: 6 },
            { name: "systemic lupus erythematosus with severe kidney failure", weight: 3 }
          ]);
        }
        return pickWeightedCause([
          { name: "pulmonary tuberculosis", weight: 24 },
          { name: "stomach cancer", weight: 12 },
          { name: "brain tumor (glioblastoma)", weight: 9 },
          { name: "acute leukemia", weight: 9 },
          { name: "lymphoma", weight: 8 },
          { name: "acute peritonitis secondary to a ruptured appendix", weight: 8 },
          { name: "severe acute pancreatitis", weight: 5 }
        ]);
      } else if (modernRoll < 0.88) {
        if (isWorkingClass && !isFemale) return "industrial machinery entanglement / crushing workplace trauma";
        return pickWeightedCause([
          { name: "fatal motor vehicle collision", weight: 35 },
          { name: "accidental drowning during a recreational excursion", weight: 8 },
          { name: "severe dwelling fire / fatal smoke inhalation and thermal burns", weight: 6 }
        ]);
      } else if (modernRoll < 0.95) {
        // Interpersonal violence
        if (isFemale) {
          return pickRandomItem([
            "fatal blunt head trauma and internal hemorrhage sustained in a severe episode of intimate partner domestic violence",
            "fatal gunshot trauma inflicted by an abusive domestic partner"
          ]);
        }
        return pickRandomItem([
          "fatal firearm trauma sustained during an armed robbery",
          "fatal blunt trauma during an aggravated street assault"
        ]);
      } else {
        return pickRandomItem([
          "fatal injuries sustained in a wartime aerial bombardment",
          "fatal structural collapse following a severe regional earthquake"
        ]);
      }
    }
  }

  if (age >= 85) return "peaceful decline of extreme old age";
  if (age >= 70) {
    return pickWeightedCause([
      { name: "pneumonia", weight: 30 },
      { name: "congestive heart failure", weight: 25 },
      { name: "a debilitating stroke", weight: 22 },
      { name: "natural decline exacerbated by harsh winter conditions", weight: 15 },
      { name: "complications from a severe fall or fracture", weight: 8 }
    ]);
  }

  // Syphilis Pandemic (1495 - 1945): Peak Era of Syphilis / Great Pox (Prevalent in Europe, Americas, Ottoman/Mediterranean, Asian & African maritime port cities)
  if (deathYear >= 1495 && deathYear <= 1945 && age >= 22) {
    const regLower = (conditions.region || '').toLowerCase();
    const hasSyphilisExposure = regLower.includes('europe') || regLower.includes('spain') || regLower.includes('portugal') ||
      regLower.includes('france') || regLower.includes('britain') || regLower.includes('england') || regLower.includes('germany') ||
      regLower.includes('italy') || regLower.includes('rome') || regLower.includes('russia') || regLower.includes('poland') ||
      regLower.includes('ottoman') || regLower.includes('turk') || regLower.includes('levant') || regLower.includes('egypt') ||
      regLower.includes('america') || regLower.includes('mexico') || regLower.includes('peru') || regLower.includes('brazil') ||
      regLower.includes('caribbean') || regLower.includes('cuba') || regLower.includes('haiti') || regLower.includes('china') ||
      regLower.includes('japan') || regLower.includes('india') || regLower.includes('philippines') || regLower.includes('africa') || regLower.includes('ghana') || regLower.includes('nigeria') || regLower.includes('senegal') ||
      (deathYear >= 1800);

    if (hasSyphilisExposure) {
      const syphilisRisk = conditions.isSexWorker ? 0.45 : (conditions.hadAffair ? 0.35 : 0.08);
      if (Math.random() < syphilisRisk) {
        return "syphilis";
      }
    }
  }

  const historicalRoll = Math.random();
  // 75% Disease / Epidemic / Internal illness
  if (historicalRoll < 0.75) {
    return pickWeightedCause([
      { name: "consumption (pulmonary tuberculosis) with severe wasting and coughing of blood", weight: 28 },
      { name: "pneumonia following exposure to damp, freezing cold", weight: 20 },
      { name: "acute dysentery / severe waterborne enteric illness", weight: 18 },
      { name: "bubonic plague / regional epidemic pestilence", weight: 14 },
      { name: "typhus fever transmitted by lice during winter quarters", weight: 12 },
      { name: "summer cholera epidemic with rapid dehydration", weight: 10 },
      { name: "malaria (severe ague) causing chronic chills, anemia, and weakness", weight: 10 },
      { name: "gangrenous sepsis stemming from a laceration", weight: 8 },
      { name: "smallpox epidemic with secondary bacterial infection", weight: 8 },
      { name: "acute peritonitis from an undiagnosed internal rupture", weight: 5 },
      { name: "a progressive, painful internal abdominal tumor (Today, we would call this stomach cancer)", weight: 3.5 },
      { name: "a painful ulcerating breast tumor and severe wasting (Today, we would call this breast cancer)", weight: 3.0 },
      { name: "a painful, bleeding bowel tumor (Today, we would call this colon / bowel cancer)", weight: 2.5 },
      { name: "a mysterious, exhausting illness of the blood causing severe pallor and bruising (Today, we would call this leukemia)", weight: 1.5 },
      { name: "a ruptured brain aneurysm", weight: 1.5 },
      { name: "a creeping, debilitating paralysis with loss of speech and muscle control (Today, we would call this motor neuron disease / ALS)", weight: 0.5 },
      { name: "a chronic, progressive nerve illness causing tremors, loss of vision, and numbness (Today, we would call this multiple sclerosis)", weight: 0.5 },
      { name: "a progressive muscle-wasting condition causing weakness in the limbs from youth (Today, we would call this muscular dystrophy)", weight: 0.5 }
    ]);
  }
  // 12% Accidents / Workplace & Domestic trauma
  if (historicalRoll < 0.87) {
    if (isFemale) {
      return pickRandomItem([
        "severe third-degree burns after clothing caught flame from an open cooking hearth",
        "accidental drowning while washing linens or drawing water at a steep riverbank or deep well",
        "fatal smoke inhalation and severe burns when a timber and thatch dwelling ignited in the night",
        "fatal skull fracture from an accidental fall down steep, unlit stone cellar stairs",
        "tetanus infection following a deep puncture wound while processing agricultural flax and wool"
      ]);
    }
    return pickRandomItem([
      "crushed beneath the timber collapse of a dwelling or barn, due to causes you decide",
      "suffocation and crush trauma during a mine, trench, or stone quarry collapse",
      "fatal fall from high scaffolding, church masonry, or a steep mountain trail",
      "trampled and crushed by a runaway ox-cart or spooked team of heavy draft horses",
      "shipwreck and drowning in freezing waters during a coastal or oceanic trade voyage",
      "fatal burn shock after a timber workshop caught fire during the night"
    ]);
  }
  // 8% War & Invasion Violence
  if (historicalRoll < 0.95) {
    if (!isFemale) {
      if (age > 45) {
        return pickRandomItem([
          "fatal injuries sustained defending your homestead during a violent settlement raid by invading marauders",
          "fatal injuries sustained during the sacking, arson, and pillaging of your village by enemy troops",
          "severe smoke inhalation and fatal thermal burns when raiders torched your dwelling in the night",
          "starvation and acute exposure during an extended, grueling city or fortress siege",
          "fatal blunt force trauma sustained during an opportunistic border raid on your rural community"
        ]);
      }
      return pickRandomItem([
        "slaughtered in the chaotic crush of a shield wall or infantry clash",
        "fatal spear thrust / thrusting sword wound sustained in pitched battle",
        "fatal arrow wound piercing the lungs or neck in combat",
        "succumbing to gangrenous wound sepsis days after a military engagement",
        "fatal cavalry trampling or sword strike on the battlefield"
      ]);
    }
    if (age >= 40) {
      return pickRandomItem([
        "fatal blunt head trauma and internal injuries sustained defending your homestead during a violent settlement raid",
        "fatal injuries sustained during the sacking, arson, and pillaging of your village by enemy troops",
        "severe smoke inhalation and fatal thermal burns when raiders torched your dwelling",
        "starvation and acute exposure during an extended, grueling city or fortress siege",
        "fatal blunt force trauma sustained during an opportunistic border raid on your rural village"
      ]);
    }
    return pickRandomItem([
      "fatal trauma and systemic shock sustained during the violent sacking and predatory pillaging of your settlement by invading troops",
      "fatal injuries sustained resisting predatory violence and pillaging during an enemy military raid",
      "starvation and acute exposure during an extended, grueling city or fortress siege",
      "blunt force trauma sustained during an opportunistic border raid on your rural village"
    ]);
  }
  // 5% Interpersonal Violence, Domestic Abuse & Crime (rare)
  if (isFemale) {
    if (era.id === 'EARLY_MODERN' && Math.random() < 0.30) {
      return "condemned and executed following an accusation of witchcraft during a regional moral hysteria";
    }
    return pickRandomItem([
      "fatal blunt head trauma and internal injuries sustained in a brutal domestic assault by an abusive husband",
      "fatal injuries sustained during a violent nighttime home intrusion by thieves",
      "strangulation and fatal domestic violence following an escalating household dispute",
      "fatal injuries sustained in a retaliatory attack during a bitter localized clan blood feud"
    ]);
  } else {
    if (!isWorkingClass && (era.id === 'EARLY_MODERN' || era.id === 'MEDIEVAL') && Math.random() < 0.40) {
      return "fatal rapier thrust through the chest during an honorable formal duel";
    }
    return pickRandomItem([
      "stabbing to the abdomen during a violent tavern or marketplace brawl over gambling debts",
      "fatal bludgeoning during an armed robbery on a secluded trade road",
      "assassination orchestrated by local political, guild, or commercial rivals",
      "fatal ambush during an ongoing regional clan blood feud"
    ]);
  }
};

// --- GEMINI API INTEGRATION ---
const DEFAULT_API_KEY = [65, 81, 46, 65, 98, 56, 82, 78, 54, 76, 73, 86, 72, 54, 95, 66, 80, 71, 99, 79, 98, 118, 54, 51, 120, 57, 107, 116, 81, 73, 83, 56, 111, 85, 112, 107, 73, 113, 109, 77, 85, 54, 73, 79, 106, 67, 49, 95, 100, 84, 45, 57, 65].map(c => String.fromCharCode(c)).join("");

const generateNarrativeWithAI = async (lifeData) => {
  const apiKey = (import.meta.env?.VITE_GEMINI_API_KEY || DEFAULT_API_KEY).trim();

  const showTraits = lifeData.age >= 4;
  const showEarlyCrushes = lifeData.age >= 8;
  const showAdult = lifeData.age >= 15;

  const systemPrompt = `You are a brilliant historian and storyteller running a reincarnation simulation of humans across time. 
I will provide you with the raw, rolled statistics of a human life. 

CRITICAL RULES:
1. STRICT SECOND PERSON POV & OPENING SENTENCE: You MUST write exclusively in the second person ("You were born...", "You grew up...", "Your choices..."). NEVER use third person ("He lived...", "She survived...").
   - MANDATORY FIRST SENTENCE: Your very first sentence of the story's first paragraph MUST explicitly begin with either "You were born a male..." or "You were born a female..." based on the assigned birth sex (e.g. "You were born a male to peasant farmers in...", "You were born a female in a drafty timber house in...").
2. TONE, PROSE & INSTITUTIONAL SPECIFICITY:
   - Use clear, grounded, and engaging historical language. AVOID excessively flowery, melodramatic, or unnecessary adjectives. Write like a straightforward, insightful historical biographer.
   - HISTORICAL INSTITUTIONAL & POLITICAL SPECIFICITY (MANDATORY): NEVER rely on vague, generic abstractions like "a bureaucrat", "government agency", "military unit", "provincial administration", or "regional supply bureau". Name real, specific historical institutions, ministries, work units (*danwei*), state enterprises, guilds, regiments, councils, or municipal organs appropriate for that exact country and decade (e.g. *Hebei Provincial Supply and Marketing Cooperative*, *State Planning Commission*, *Ministry of Metallurgical Industry*, *Danwei work unit*, *London County Council*, *British East India Company Board of Control*, *Roman Prefect of the Annona*, *Gosplan*).
3. NATURAL, ACCESSIBLE LANGUAGE FOR MEDICAL CONDITIONS, ILLNESSES & CANCERS (CRUCIAL):
   - AVOID dense, clinical, Latinate textbook jargon or hyper-specific anatomical terms (e.g. NEVER write "femoral neck", "patella", "lung adenocarcinoma", "invasive ductal carcinoma", "gastric adenocarcinoma", or "talipes equinovarus").
   - ALWAYS use plain, natural, accessible English terms (e.g. "a severe fall resulting in a fractured hip and fatal hospital complications", "lung cancer", "breast cancer", "stomach cancer", "bowel cancer", "pancreatic cancer", "leukemia", "heart attack", "heart failure", "motor neuron disease / ALS", "a ruptured brain aneurysm", "muscular dystrophy", "multiple sclerosis", "a clubfoot", "a hunchback", "a cleft palate").
   - MODERN MEDICAL REALITIES (20th–21st CENTURY): Depict medical realities accurately for modern eras: an elderly person suffering a severe fall, stroke, or heart event receives hospital care, surgery, or hospice treatment, and fatal outcomes are contextualized within hospital or post-surgical recovery complications rather than dying untreated at home.
   - PREMODERN MEDICAL FRAMING (CRITICAL): If someone in a premodern era (before 1850) suffers or dies from modern complex diagnoses (specifically cancers, motor neuron disease / ALS, multiple sclerosis, muscular dystrophy, or a ruptured brain aneurysm), describe their progressive symptoms through the lens of historical peers (e.g. creeping paralysis, sudden unheralded stroke, progressive muscle wasting, or a deep lingering internal mass), and follow it with: "Today, we would call this [cancer / ALS / a brain aneurysm / muscular dystrophy / multiple sclerosis]."
   - STRICT BAN ON META-COMMENTARY FOR COMMON HISTORICAL DISEASES: NEVER use "Today, we would call this..." for well-known historical diseases (malaria, ague, dysentery, tuberculosis / consumption, cholera, smallpox, typhus, yellow fever, syphilis, or bubonic plague). Call them directly by their natural historical names (e.g. simply "malaria" or "the ague") without any anachronistic modern commentary.
   - AUTISM & NEURODIVERGENCE (BE EXPLICIT & CLEAR): If the character has an autism spectrum condition, be EXPLICIT about their neurodivergence. In the modern era, explicitly identify it as autism. In premodern eras, vividly depict their distinct autistic traits: their intense hyperfocus on specialized interests, deep sensory sensitivities (to sounds, touch, crowded markets), literal communication style, strong preference for predictable routines, and difficulty navigating unspoken social cues or diplomatic subtext, while explaining how peers perceived their unique mind (e.g. an eccentric solitary savant, singularly gifted craftsperson, or misunderstood thinker).
   - HOBBIES OBSESSIVENESS RULE: Hobbies and pastimes MUST NOT be described as "obsessive" or "all-consuming" UNLESS the character is specifically autistic / neurodivergent. For neurotypical characters, pastimes must be depicted as enjoyable, relaxing, communal, creative, or casual recreational pursuits.
   - SCOLIOSIS & SPINAL CURVATURE ONSET: Idiopathic scoliosis develops during childhood or adolescent growth spurts (ages 10–14) or from adult physical toll, rather than being evident at birth. Describe its gradual development as they grow.
4. TRANSGENDER & GENDER DIVERGENCE: If rolled as Transgender, authentically reflect their experience according to their era, culture, and personality. In premodern/early modern eras, people navigating this often lived in disguise, assumed alternate societal roles (e.g. military enlistment, monastic life, sailors like Catalina de Erauso), joined culturally recognized roles (Two-Spirit, Hijra, Galli, Public Universal Friend, Chevalier d'Éon), or repressed it depending on bravery and fear. In the 20th/21st century, reflect the emergence of medical transition (like Lili Elbe) or underground communities.
5. MODERN MEDICAL CANCER SURVIVAL: If flagged as a "Cancer Survivor" in a modern era, describe their harrowing but successful battle with modern oncology (surgery/radiation/chemo) and how it shifted their perspective before returning to remission.
6. CAUSE OF DEATH & CONTEMPORARY LIVES (STILL ALIVE IN 2026):
   - FOR DECEASED CHARACTERS: Weave their assigned Primary Cause of Death seamlessly into their final paragraph. Cancer was extremely rare in premodern eras; rely only on the provided premodern diseases. If they died of old age, vividly describe the historical realities of advanced age (e.g., loss of teeth, dimming eyesight, severe joint pain, physical frailty) rather than a sterile modern "passing peacefully in their sleep."
   - BATTLEFIELD & CAVALRY CHARGE AGE LIMIT (AGE <= 45): Active frontline infantry clashes, shield wall melee, and battlefield cavalry charges MUST ONLY happen to combatants aged 15 to 45. Characters over age 45 who die in wartime MUST be depicted as civilian casualties of sieges, village sackings, burning of dwellings, starvation during military blockades, or defense against invading raiders—NEVER as aging elders actively fighting in frontline cavalry charges.
   - WARTIME RAIDS & OLDER ADULTS (AGE 40+): For mature women (age 40+) who perish or suffer trauma in settlement raids or warfare, depict the tragedy realistically as defending their homestead, family protection, arson, or collateral violence (NEVER frame violence against mature women past 40 as sexual assault/attempted violation).
   - FOR LIVING CHARACTERS (STILL ALIVE IN 2026): NEVER say they are "forgotten by history" or speak of their life in past tense as a closed ancient chapter. Write about their ongoing daily life today in the year 2026, their contemporary routine, reflections on modern times, family/community, and how they navigate life today.
7. PREMODERN MARRIAGE & UNMARRIED WOMEN (STRICT HISTORICAL AGENCY CONSTRAINT):
   - In premodern eras (before 1900), marriage was a near-universal economic survival institution; women did NOT have the societal or economic independence to casually "choose" lifelong spinsterhood.
   - A PREMODERN WOMAN COULD ONLY VOLUNTARILY REFUSE / EVADE MARRIAGE IF:
     a) She was BORN NOBLE / UPPER CLASS AND was INDEPENDENT (possessing the wealth, private inheritance, or family station to resist arranged matches), OR
     b) She was HOMOSEXUAL / LESBIAN (actively resisting male marriage, taking holy vows in a convent, adopting male dress, or living in secret female companionhood).
   - FOR ALL OTHER PREMODERN COMMONER WOMEN WHO REMAINED UNWED, IT WAS NOT A FREE "CHOICE": It must be driven by external hardship (e.g. extreme family destitution / unable to afford a dowry, lifelong enslavement/bondage, monastic nunnery devotion, severe physical impairment, or unpaid lifelong labor dependence in her father's/brother's household).
8. FAME & HOBBIES / PASTIMES: Incorporate their assigned Fame level. Even for commoners and poor folk, incorporate their natural casual pastimes (e.g. folk songs, storytelling, dice games, tavern banter, communal dancing, whittling, foraging, fishing, local sports) based on their personality. Ensure hobbies match their social class—a working-class peasant should NEVER be described enjoying expensive, elite hobbies like falconry, collecting antiquities, or attending grand operas.
9. SIBLINGS & FAMILY: ONLY mention exact sibling survival numbers if it is narratively crucial (e.g. sole survivor). Do NOT mechanically list "4 of 6 siblings survived" as a robotic fact.
10. SEXUAL ORIENTATION & BISEXUALITY (CRUCIAL):
    - BISEXUALITY: Clearly articulate that the character experiences genuine romantic/sexual attraction to BOTH men and women. If they marry or take a primary partner, describe how they navigate their bisexual desires.
    - SAME-SEX EXTRAMARITAL AFFAIRS: If a Homosexual or Bisexual character is married and has an extramarital affair, explicitly depict whether their clandestine lover is of the same sex (e.g. a married gay/bisexual man harboring a secret male lover, or a married woman carrying on a secret female romance) and the emotional stakes and secrecy involved.
    - HOMOSEXUALITY: Reflect their orientation with historical nuance. For those who stayed in the closet, highlight the burden of concealment. For those who were open, highlight their community and relationships.
11. CHRONOLOGY OF EVENTS (TIMELINE): For the 'timeline' array, provide 3 to 6 major milestones (e.g. birth, adolescence, marriage/career/migration, mid-life turning point, death/survival).
    - "year": MUST strictly contain ONLY the calendar year with its era indicator (e.g. "1908 CE", "1926 CE", "450 BCE"). Do NOT put location or story narrative inside the "year" string.
    - "event": MUST contain a clear, descriptive 1-2 sentence summary of what occurred in that year (e.g. "Born in a hillside village in Basilicata, Italy to an impoverished agricultural family.").
12. HISTORICAL FIGURES & EYEWITNESS EVENTS (EXHAUSTIVE & AUTHENTIC):
    - INFANT / CHILD MORTALITY LIFESPAN RULES (CRITICAL): If the character passed away in infancy or childhood (age < 12), they MUST NOT be given adult careers, adult upward mobility, adult marriages, or historical encounters that occurred after their year of death.
    - HISTORICAL ENCOUNTERS: Carefully evaluate the character's exact lifespan (birth year to death year), region/city, and class. If real historical figures (monarchs, artists, philosophers, generals, revolutionaries, scientists—e.g. Richard II, Van Gogh, Leonardo da Vinci, Socrates, Joan of Arc, Marie Antoinette, Napoleon, Abraham Lincoln, Mansa Musa, Caravaggio, Tokugawa Ieyasu, Confucius, etc.) lived or operated in that area during their lifetime:
      - Provide an authentic encounter or observation (e.g. catching a glimpse during a royal progress, hearing them speak, drinking in the same tavern, observing their public works, serving in their unit, or direct acquaintance).
      - If an encounter occurs, populate the historicalEncounters array with figure, year, and context. If no plausible figure exists in that exact time and place, return an empty array.
    - MANDATORY INTEGRATION OF EPOCHAL HISTORICAL MILESTONES IN THE LIFE STORY:
      * Do NOT merely list historical milestones in the timeline array while ignoring them in the narrative. If the character lived through monumental historical events (e.g. the Cultural Revolution, the Great Leap Forward, WWII, the Partition of India, the Fall of the Soviet Union, the French Revolution, the Meiji Restoration, the American Civil War, the Great Depression, the Taiping Rebellion), you MUST explicitly weave how they personally experienced, navigated, suffered under, or participated in these monumental events directly into the narrative paragraphs.
    - HISTORICAL EVENTS LIVED THROUGH ARRAY: Provide an exhaustive list (1 to 4 major milestones) of monumental historical events, wars, revolutions, plagues, cultural shifts, colonization events, or civilization collapses that occurred during their lifespan in or near their region:
      - BRITISH COLONIZATION / CONQUEST: If they lived in a region colonized or invaded by the British Empire during their lifetime (e.g. India under the East India Company / British Raj, New Zealand Treaty of Waitangi, Australian colonization, Irish plantations/Famine, Opium Wars in China, Scramble for Africa in Nigeria/Kenya/Egypt/Sudan/South Africa, North American colonial wars), make sure to include this.
      - CIVILIZATION COLLAPSE / CONQUEST: If they witnessed the fall, sacking, collapse, or conquest of their empire/dynasty (e.g. Fall of Rome in 476 CE, Fall of Constantinople in 1453 CE, Spanish conquest of the Inca or Aztec Empires, Sacking of Baghdad in 1258 CE, Bronze Age Collapse ~1200 BCE, Fall of the Ming/Song/Qin Dynasties, Fall of Carthage in 146 BCE), prominently feature it.
      - Populate historicalEventsLivedThrough array with event, year, and impact.
13. PHYSICAL APPEARANCE & BEAUTY (FOR ATTRACTIVE PEOPLE):
    - When describing an attractive female character (Beauty > 75), you may freely use the word "beautiful", and describe specifically how others in her community or station perceived her appearance, graceful carriage, or features, and the attention or suitors she drew.
    - When describing an attractive male character (Beauty > 75), you may use words like "handsome", "striking", and "well-formed", and be specific about his distinct features (e.g. sharp facial features, commanding height, athletic build, clear eyes) and the notice, social regard, or romantic attention he commanded.
14. ROYALTY & HISTORICAL FIGURES (REAL BIOGRAPHY & MANDATORY WIKIPEDIA LINKS):
    - When the character is 'Royalty / Reigning Dynasty' or 'Royalty / Imperial Dynasty' (or any historical monarch/dynasty):
      a) REAL HISTORICAL PERSON: You MUST base the life on a real historical monarch, prince/princess, emperor/empress, or royal dynasty figure who was born in that region/country around that era.
      b) FACT-BASED NARRATIVE: Ground the story, dynastic house, reign, marriages, and events in real historical facts.
      c) REAL WIKIPEDIA LINKS (MANDATORY): You MUST provide 1 to 4 authentic, real Wikipedia articles directly related to their life.
15. PSYCHOPATHY & ABERRANT PSYCHOLOGY (IF ROLLED AS PSYCHOPATH):
    - If flagged with Psychopathy (approx 1% of the population):
      - EMOTIONAL & COGNITIVE PROFILE: They possess an innate, lifelong neurological deficit in emotional empathy, remorse, guilt, and genuine moral attachment. They view other humans instrumentally—as pawns, tools, obstacles, or sources of personal gratification.
      - BEHAVIORAL MANIFESTATION (HISTORICAL & AI DISCRETION): Whether their psychopathy manifests as violent predatory cruelty / extreme historical atrocities (e.g. historical parallels like Gilles de Rais, ruthless warlords, or predatory serial bandits), calculated political/mercantile cunning, manipulative charisma, or simply a cold, detached, self-interested survivor navigating their social station is up to YOUR historical judgement based on their era, social class, station, intelligence, and opportunities.
      - CONSTRAINTS: They CANNOT feel genuine remorse, heartfelt guilt, or emotional empathy. Even in marriages, parentage, or positions of religious piety, their outward warmth or devotion is transactional, performative, power-seeking, or self-preserving.
16. HIGHLY SPECIFIC, PERIOD-AUTHENTIC PROFESSION & VOCATION (CRITICAL RULES & CONSTRAINTS):
    - For all characters reaching working age (age 12+), generate a concise, historically authentic title in the 'profession' field that reflects their exact era, culture, station, intelligence, and personality:
      a) SEX WORK OVERRIDE: If flagged as 'isSexWorker' / Prostitute, her primary profession MUST explicitly be designated as sex work / prostitute tailored to her era (e.g. 'Victorian brothel sex worker', 'Roman lupanar courtesan', 'Medieval tavern sex worker', '1970s nightlife sex worker').
      b) PREMODERN NOBILITY & ARISTOCRACY (NO COMMERCIAL/COMMON PROFESSION): In premodern eras (before 1900), members of the landed nobility, aristocracy, patricians, or wealthy gentry did NOT hold commercial trades or common jobs. Their station was living off land rents, family estates, court offices, or dynastic affairs. Return 'None (Landed Aristocracy / Gentleman of Leisure)', 'None (Noble Lady of the Estate)', or high court/military commissions like 'Imperial Court Magistrate' / 'Regimental Officer'.
      c) PREMODERN RURAL COMMONERS & PEASANTS (FARMING SPECIFIC TO REGION): The vast majority (80–90%) of premodern rural folk were agricultural laborers or farmers cultivating crops specific to their region and climate (e.g. 'Nile Valley emmer wheat & barley cultivator', 'Mesoamerican milpa maize farmer', 'Yangtze Delta wetland rice grower', 'Castilian dryland wheat & olive farmer', 'Andean highland potato & quinoa cultivator', 'Scottish tenant crofter', 'West African yam & oil palm farmer').
      d) URBAN WORKING CLASS & STREET TRADES (MAYHEW'S LONDON LABOUR & HISTORICAL CITY TRADES): For urban poor and working classes, draw on rich specific historical livelihoods: costermongers (fruit/nut street-sellers), mudlarks, knocker-ups, chimney sweeps, watercress sellers, laundresses, coal-whippers, scullery maids, tanners, dockers, nightsoil carters.
      e) SCHOLARS, SCRIBES, ARTISANS & CRAFTS: Cuneiform scribes (*tupsharru*) in Mesopotamia, hieroglyphic scribes/embalmers in Egypt, Roman *argentarii* (bankers) / *tonsores* (barbers), medieval apothecaries, fullers, coopers, fletchers, chandlers, clockmakers, silversmiths.
      f) 20th-21st CENTURY (MODERN TRADES): Factory assembly line workers, switchboard operators, radiologists, telegraphists, locomotive engineers, nurses, software developers, postal clerks, bus drivers.
      g) INFANTS & CHILDREN (Age < 12): Must return 'None (Passed away in childhood)'.
17. MATERIAL CULTURE, ECONOMIC REALISM & ASYNCHRONOUS TECHNOLOGICAL DEVELOPMENT:
    - CRITICAL HISTORICAL PRINCIPLE: Technological breakthroughs, trade infrastructure, metallurgy, writing systems, monetization, and social institutions developed asynchronously at vastly different paces across different civilizations and continents.
    - ALWAYS EVALUATE THE EXACT TIME AND GEOGRAPHY:
      * METALLURGY: Only incorporate bronze, iron, or steel if that specific culture and region had developed or adopted metallurgy by that exact century (e.g. bronze emerged early in the Near East ~3300 BCE, but centuries/millennia later across other parts of Eurasia, and was not present in pre-Columbian North America or Australia).
      * TRADE & ECONOMIC SYSTEMS: Commercial merchant markets, currency, and trade networks arose much earlier in some civilizations than others. In tribal, kinship, or early agrarian societies where merchant networks had not yet developed, economic life consisted of reciprocal gift exchange, barter, seasonal foraging, and communal storage—NEVER commercial investments, merchant gentry, loans, or peddler businesses.
      * WRITING, RECORD-KEEPING & BUREAUCRACY: Do NOT mention written ledgers, bookkeeping, written decrees, civil magistrates, or imperial bureaucracy in any society before writing and formal state administration were actually established in that region.
      * TEXTILES & LUXURY GOODS: Only feature silk, woven wool, dyed garments, or glass beads where those materials and trade routes were historically active at that date. In simpler or earlier societies, clothing consisted of animal hides, woven plant fibers, or hemp.
      * UPWARD SOCIAL MOBILITY IN TRIBAL & EARLY CULTURES: In non-monetized or pre-bureaucratic societies, upward mobility was social, cultural, and communal (e.g. rising to become a respected village elder, master artisan, shaman/healer, renowned hunter, or clan matriarch through prestige and alliances)—NEVER commercial wealth or financial entrepreneurship.
18. JSON OUTPUT ONLY. Adhere strictly to the requested schema.`;

  const userPrompt = `
Generate a structured life profile based strictly on these parameters:
- Era: ${lifeData.eraName}
- Birth Year: ${formatYear(lifeData.birthYear)}
- ${lifeData.isModernEra
      ? `Country: ${lifeData.region} | Setting: ${lifeData.isUrban ? 'Urban (city dweller)' : 'Rural (village or countryside)'}\n- Language: ${lifeData.lang}\n- Specific Location (YOUR CHOICE — put in specificLocation field): Invent the most realistic specific ${lifeData.isUrban ? 'city district, neighbourhood, or city name' : 'village, small town, or rural region'} within ${lifeData.region} for ${formatYear(lifeData.birthYear)}. Be specific — vary your answer, never just use the capital.`
      : `Region: ${lifeData.region} (Primary Language: ${lifeData.lang})\n- Specific Location (YOUR CHOICE — put in specificLocation field): Invent a realistic specific settlement, town, village, or district within this region appropriate for the era and class.`
    }
- Sex: ${lifeData.sex} (REMINDER: First sentence MUST start with "You were born a ${lifeData.sex.toLowerCase()}...")
- Ethnicity / Ancestry (EXPLICIT): ${lifeData.ethnicity || 'Native local lineage'}. CRITICAL RULE: Explicitly state and weave the character's exact ethnicity and ancestry (${lifeData.ethnicity || 'local ancestry'}) into the narrative, reflecting their lived reality and cultural station in this society.
- Gender Identity: ${lifeData.isTransgender ? `Transgender (${lifeData.transgenderDetails})` : 'Cisgender (aligns with birth sex)'}
- Social Class: ${lifeData.socialClass}
${lifeData.isRoyaltyOrHistoric ? `- REAL HISTORICAL ROYALTY / MONARCH: This soul is born into Royalty / Imperial Dynasty in ${lifeData.region} around ${formatYear(lifeData.birthYear)}. You MUST identify an actual real historical royal, prince/princess, monarch, or dynasty member of this land, narrate their factual life story, and include their exact Wikipedia article URL in the wikiLinks array.` : ''}
- Identity Group: ${lifeData.isMinority
      ? `Minority member — specifically ${lifeData.minorityGroupHint || lifeData.ethnicity || 'a demographically significant ethnic or religious minority for this location and era'}. Weave their minority identity authentically into the narrative.`
      : 'Majority / Dominant Group'}
- Migration / Emigration: ${lifeData.isEmigrant
      ? `EMIGRATED AT AGE ${lifeData.emigrationAge}: You were born in ${lifeData.region}, but at age ${lifeData.emigrationAge} you emigrated/relocated to ${lifeData.deathRegion}, where you lived out your adult life and eventually died. Provide a realistic specific location in ${lifeData.deathRegion} for where you lived and died in the deathSpecificLocation field.`
      : (lifeData.isImmigrant ? 'Immigrant/Migrant ancestry in birth region' : 'Native resident in birth region')}
- Congenital / Physical Condition: ${lifeData.disabilityCategory
      ? `Specific Condition: ${lifeData.disabilityExamples} (${lifeData.disabilityCategory}). Focus only on this specific condition and describe it in natural, accessible, plain English terms.`
      : 'None'}
- Exposed / Left to Die at Birth: ${lifeData.wasExposed ? 'YES (Parents/Tribe abandoned infant at birth)' : 'NO'}
- Family: Mother died in childbirth: ${lifeData.motherDied}. ${lifeData.siblingsSurvived} of ${lifeData.totalSiblings} siblings survived childhood.
${showEarlyCrushes ? `- Orientation: ${lifeData.orientation} ${lifeData.orientation === 'Homosexual'
      ? (lifeData.isOpenlyGay
        ? '(Lived openly in their same-sex relationships / out and proud in their community)'
        : '(Kept same-sex attraction strictly secret / in the closet due to social, religious, or familial danger)')
      : (lifeData.orientation === 'Bisexual'
        ? `(Attracted to both men and women. ${lifeData.actedOnBi ? (lifeData.isOpenlyGay ? 'Acted openly on same-sex attractions.' : 'Pursued same-sex encounters in strict secrecy.') : 'Suppressed same-sex desires and conformed to heterosexual expectations.'})`
        : '')
      }` : ''}
${showTraits ? `- Personality: ${lifeData.personality.join(' and ')}` : ''}
${showAdult ? `- Pastimes & Leisure: ${lifeData.hobbyData} (CRITICAL: Do NOT describe hobbies as obsessive or compulsive unless the person is autistic).` : ''}
${showAdult ? `- Marriage / Structure: ${lifeData.isMarried
      ? `Married/Bonded at age ${lifeData.marriageAge}`
      : `Never Married/Bonded (PREMODERN AGENCY RULE: ${lifeData.sex === 'Female' && !lifeData.isModernEra
        ? (lifeData.orientation === 'Homosexual'
          ? 'Refused/avoided male marriage due to homosexuality'
          : (lifeData.socialClass.includes('Nobility') || lifeData.socialClass.includes('Upper') || lifeData.socialClass.includes('Patrician')
            ? 'Noble/Upper-class independence and private wealth allowing autonomous refusal of suitors'
            : 'Unwed due to poverty, lack of dowry, family labor dependence, severe disability, or monastic life — NOT a casual modern lifestyle choice'))
        : 'Dedicated to trade, labor, military, or kin'})`}. ${lifeData.hadAffair ? `Had an extramarital affair / clandestine lover ${lifeData.sameSexAffair ? '(specifically with someone of the same sex)' : '(with an opposite-sex partner)'}.` : ''}` : ''}
${showAdult ? `- Children: ${lifeData.effectiveInfertility ? '0 children (Infertile)' : `${lifeData.childrenCount} children`} ${lifeData.hasUnmarriedPartnerChildren
      ? (lifeData.orientation === 'Homosexual' ? '(Modern adoption or donor parenthood with long-term partner)' : '(Had children with an unmarried long-term cohabiting partner / outside formal marriage)')
      : (lifeData.outOfWedlock ? '(Includes child/children born out of wedlock / outside primary union)' : '')
      }` : ''}
${showAdult ? `- Fame/Legacy: ${lifeData.fame}` : ''}
${lifeData.survivedCancer ? `- Medical History: Diagnosed with cancer at age ${lifeData.cancerAge}, but successfully underwent modern medical treatments and survived into remission.` : ''}
${lifeData.isMaimed ? `- Violent Encounter & Trauma: At age ${lifeData.maimedAge}, you survived a near-fatal event: ${lifeData.maimedDetails}. Severity: ${lifeData.maimedSeverity}. ${lifeData.maimedContributedToDeath ? 'This chronic injury and physical impairment plagued your health and contributed to your physical decline later in life.' : 'You adapted to your scars/disfigurement and lived on.'} Weave this landmark event vividly into the story and chronology.` : ''}
${lifeData.isRoyaltyOrHistoric ? `- ROYAL / HISTORICAL PERSON INCARNATION (SPECIAL): This soul is born as a real historical monarch, emperor, prince/princess, or close relative of a renowned ruler in ${lifeData.region} around ${formatYear(lifeData.birthYear)}.
  * Tell their REAL, historically authentic life story based on historical facts.
  * If from ancient antiquity or prehistory where records are incomplete, reconstruct their life and reign faithfully using the best available archaeological and historical facts.
  * Align their lifespan, reign, key battles, court intrigues, and legacy with real history.` : ''}
${lifeData.isJewish ? `- JEWISH IDENTITY & HISTORICAL REALITIES: This soul is Jewish (${lifeData.minorityGroupHint || 'Jewish identity'}). Antisemitism / Historical Experience: ${lifeData.antisemitismExperience ? `${lifeData.antisemitismExperience.level}: ${lifeData.antisemitismExperience.details}` : 'Lived peacefully without overt persecution'}. Weave their Jewish cultural, communal, and historical reality authentically and respectfully into their life story and timeline.` : ''}
${lifeData.minorityPersecution ? `- MINORITY HISTORICAL EXPERIENCE: As a member of ${lifeData.minorityGroupHint}, historical context: ${lifeData.minorityPersecution.level}: ${lifeData.minorityPersecution.details}. Weave this authentic context respectfully into the narrative.` : ''}
${lifeData.isInterfaithMarriage ? `- INTERFAITH JEWISH-CHRISTIAN MARRIAGE: This character entered into an interfaith marriage with a ${lifeData.interfaithSpouse} partner: ${lifeData.interfaithDetails}. CRUCIAL: Specifically explore the cultural, religious, and familial dynamics (family reactions, syncretism, holidays, conversion, or social navigation) in the story.` : ''}
${lifeData.modelingCareer ? `- MODELING INDUSTRY OPPORTUNITY (BEAUTY 90+ IN MODERN ERA): ${lifeData.modelingCareer.offered ? (lifeData.modelingCareer.accepted ? `Offered a modeling career due to extraordinary beauty and ACCEPTED: ${lifeData.modelingCareer.details}` : `Offered a modeling career due to extraordinary beauty but DECLINED based on personality: ${lifeData.modelingCareer.details}`) : ''}. Reflect their personality and choices in the story.` : ''}
${lifeData.wasEnslavedLater && lifeData.age >= 6 ? `- ENSLAVEMENT / CAPTIVE SERVITUDE: Not born enslaved, but at age ${lifeData.enslavedAge} was captured and enslaved: ${lifeData.enslavementDetails}. Explicitly chronicle this turning point, the reality of their captive servitude, and its lifelong impact in the narrative and timeline.` : ''}
${lifeData.escapedSlavery && lifeData.age >= 12 ? `- ESCAPED / EMANCIPATED FROM SLAVERY: At age ${lifeData.escapeAge}, this soul successfully broke the chains of enslavement: ${lifeData.escapeMethod}. Explicitly chronicle this escape / emancipation milestone, their journey to freedom, and their life as a free person in the narrative and timeline.` : ''}
${showAdult && lifeData.hasUpwardMobility ? `- UPWARD SOCIAL MOBILITY: Born into ${lifeData.birthSocialClass}, but achieved notable upward mobility in adulthood: ${lifeData.mobilityDetails}. Their attained station is ${lifeData.socialClass}. Explicitly chronicle their rise from humble beginnings to their elevated station in the narrative and timeline.` : ''}
${showTraits ? `- Base Intelligence (1-100): ${lifeData.intelligence}` : ''}
${showTraits ? `- Physical Appearance (1-100, score: ${lifeData.beauty}): ${lifeData.beauty >= 80
      ? (lifeData.sex === 'Female'
        ? `Exceptionally beautiful (Score ${lifeData.beauty}/100). Use the word 'beautiful', describe specific features, and depict how others perceived her appearance and the attention/suitors she drew.`
        : `Exceptionally handsome / striking (Score ${lifeData.beauty}/100). Use words like 'handsome', 'striking', describe his distinct physical features/physique, and the notice and attention he received.`)
      : (lifeData.beauty >= 60
        ? `Pleasant and good-looking (Score ${lifeData.beauty}/100).`
        : (lifeData.beauty <= 20
          ? `Notably plain, rough-hewn, or unadorned in appearance (Score ${lifeData.beauty}/100).`
          : `Average, typical appearance for their era and class (Score ${lifeData.beauty}/100).`))
      }` : ''}
${showTraits && lifeData.isPsychopath ? `- Psychological Profile: Psychopathic traits (1% of population). Innate absence of emotional empathy, guilt, or remorse. Whether this manifests as violent/predatory cruelty (e.g. historical figures like Gilles de Rais), calculated manipulative cunning, cold ambition, or transactional self-interest is up to your judgement based on their circumstances and station.` : ''}
- Mental/Physical Health: ${[lifeData.isPsychopath && showTraits ? 'Psychopathy' : '', lifeData.schizophrenia && showAdult ? 'Schizophrenia' : '', lifeData.depression && showAdult ? 'Clinical Depression' : '', lifeData.suicide ? 'Suicide' : ''].filter(Boolean).join(', ') || 'No major anomalies'}
- Age at Death: ${lifeData.age} ${lifeData.isAlive ? '(Currently still alive in the year 2026!)' : ''}
- Primary Cause of Death: ${lifeData.causeOfDeath || 'N/A'}`;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          specificLocation: { type: "STRING", description: "A specific realistic place name (1-4 words): a city district, neighbourhood, village name, or rural region within the character's country/region. Never just the country name itself." },
          deathSpecificLocation: { type: "STRING", description: "If the character emigrated, the specific place/city name in their destination land where they lived and died. If they did not emigrate, return null or empty string." },
          profession: { type: "STRING", description: "A specific, period-authentic vocation or livelihood (e.g. 'Mesopotamian cuneiform temple scribe', 'Victorian costermonger (street fruit seller)', 'Castilian dryland olive & wheat farmer', 'None (Landed Aristocracy / Gentleman of Leisure)', 'Roman lupanar courtesan'). If passed away in childhood (age < 12), return 'None (Passed away in childhood)'." },
          narrative: { type: "ARRAY", items: { type: "STRING" }, description: "3 to 5 paragraphs of the life story." },
          timeline: {
            type: "ARRAY",
            description: "3 to 6 major chronological milestones in this life. Each entry MUST have a year and an event description.",
            items: {
              type: "OBJECT",
              properties: {
                year: { type: "STRING", description: "The exact year and era ONLY (e.g. '1908 CE' or '340 BCE'). Never include event text here." },
                event: { type: "STRING", description: "A detailed 1-2 sentence description of the key life event occurring in this year." }
              },
              required: ["year", "event"]
            }
          },
          historicalEncounters: {
            type: "ARRAY",
            description: "Famous historical figures they encountered, met, or witnessed in their lifetime in their region. Return empty array if none.",
            items: {
              type: "OBJECT",
              properties: {
                figure: { type: "STRING", description: "Name of the historical figure (e.g. 'Vincent van Gogh', 'King Richard II')." },
                year: { type: "STRING", description: "Year of encounter (e.g. '1888 CE')." },
                context: { type: "STRING", description: "1-2 sentence description of how their paths crossed." }
              },
              required: ["figure", "year", "context"]
            }
          },
          historicalEventsLivedThrough: {
            type: "ARRAY",
            description: "Exhaustive list of notable historical events, wars, plagues, or milestones that occurred during their lifespan.",
            items: {
              type: "OBJECT",
              properties: {
                event: { type: "STRING", description: "Name of the historical event." },
                year: { type: "STRING", description: "Year or date range (e.g. '1348–1350 CE')." },
                impact: { type: "STRING", description: "1-2 sentence description of the impact on their life or region." }
              },
              required: ["event", "year", "impact"]
            }
          },
          wikiLinks: {
            type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, url: { type: "STRING" }, description: { type: "STRING" } } }
          }
        },
        required: ["specificLocation", "narrative", "timeline", "historicalEncounters", "historicalEventsLivedThrough", "wikiLinks"]
      }
    }
  };

  const candidateModels = [
    import.meta.env?.VITE_GEMINI_MODEL,
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-flash-latest"
  ].filter(Boolean);
  const modelsToTry = Array.from(new Set(candidateModels));

  let lastError = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // Generous 20.0s timeout

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        throw new Error(`Model ${model} returned HTTP ${response.status}: ${errBody}`);
      }

      const data = await response.json();
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        const finishReason = data?.candidates?.[0]?.finishReason || 'NO_CANDIDATES';
        throw new Error(`Gemini API returned no content (Finish Reason: ${finishReason})`);
      }

      const parsed = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
      if (!parsed || (!Array.isArray(parsed.narrative) && typeof parsed.narrative !== 'string')) {
        throw new Error("Failed to parse valid narrative array from Gemini response JSON");
      }

      if (typeof parsed.narrative === 'string') {
        parsed.narrative = parsed.narrative.split('\n\n').filter(Boolean);
      }
      if (!parsed.specificLocation) parsed.specificLocation = lifeData.region;
      if (!parsed.profession) {
        if (lifeData.age < 12) parsed.profession = "None (Childhood)";
        else if (lifeData.isSexWorker) parsed.profession = "Sex Worker / Courtesan";
        else if (lifeData.socialClass.includes('Nobility') || lifeData.socialClass.includes('Aristocra')) parsed.profession = "None (Landed Aristocracy / Noble Leisure)";
        else if (lifeData.socialClass.includes('Peasant') || lifeData.socialClass.includes('Agricultural')) parsed.profession = "Agricultural Farmer / Peasant";
        else parsed.profession = lifeData.socialClass;
      }
      if (!Array.isArray(parsed.timeline)) parsed.timeline = [];
      if (!Array.isArray(parsed.historicalEncounters)) parsed.historicalEncounters = [];
      if (!Array.isArray(parsed.historicalEventsLivedThrough)) parsed.historicalEventsLivedThrough = [];
      if (!Array.isArray(parsed.wikiLinks)) parsed.wikiLinks = [];
      parsed.wikiLinks = parsed.wikiLinks.map(link => {
        if (!link || (!link.title && !link.url)) return null;
        let title = (link.title || 'Historical Reference').trim();
        let url = (link.url || '').trim();
        if (!url.startsWith('http')) {
          url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
        }
        return {
          title,
          url,
          description: (link.description || 'Encyclopedia reference.').trim()
        };
      }).filter(Boolean);

      // If royal but AI returned no wiki links, provide default dynasty link
      if (lifeData.isRoyaltyOrHistoric && parsed.wikiLinks.length === 0) {
        parsed.wikiLinks.push({
          title: `Monarchy of ${lifeData.region}`,
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(lifeData.region + ' royal dynasty')}`,
          description: `Historical royal house and dynasty of ${lifeData.region}.`
        });
      }

      if (parsed.narrative.length === 0) {
        throw new Error("Gemini returned an empty narrative array");
      }

      return parsed;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      console.warn(`Model ${model} failed, trying next candidate:`, err.message);
    }
  }

  throw lastError || new Error("All Gemini candidate models failed to respond.");
};

export default function App() {
  const [currentLife, setCurrentLife] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalLived: 0, highestAge: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('incarnationBadges')) || []; }
    catch { return []; }
  });
  const [badgeModalQueue, setBadgeModalQueue] = useState([]);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShareStory = () => {
    if (!currentLife) return;
    playUiSound('click');

    const fullLocation = formatFullLocation(currentLife.specificLocation, currentLife.region);
    const badgesEarned = (currentLife.badges || []).map(bId => {
      const b = BADGE_DEFINITIONS.find(def => def.id === bId);
      return b ? b.name : bId;
    }).join(', ');

    const shareText = `📜 An Incarnation Chronicle
━━━━━━━━━━━━━━━━━━━━━
👤 ${currentLife.sex} • Born ${formatYear(currentLife.birthYear)} in ${fullLocation} (${currentLife.eraName})
⚡ Station: ${currentLife.socialClass}
⏳ Lifespan: ${currentLife.isAlive ? `Still alive in 2026! (Age ${currentLife.age})` : `${currentLife.age} Years`}
${badgesEarned ? `🏆 Badges Earned: ${badgesEarned}\n` : ''}
📖 Life Story:
${(currentLife.narrative || []).join('\n\n')}

✨ Experience human history through random rebirth: Incarnation Game`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  };

  const getWeightedEmigrationDestination = (originName, eraId) => {
    const oName = (originName || '').toLowerCase();

    if (eraId === 'MODERN') {
      // 1. Italy
      if (oName.includes('italy') || oName.includes('italian')) {
        return pickWeighted([
          { name: "Argentina", weight: 35, lat: -34.60, lng: -58.38 },
          { name: "USA", weight: 28, lat: 37.09, lng: -95.71 },
          { name: "Brazil", weight: 18, lat: -14.23, lng: -51.92 },
          { name: "France", weight: 8, lat: 46.22, lng: 2.21 },
          { name: "Germany", weight: 4, lat: 51.16, lng: 10.45 },
          { name: "United Kingdom", weight: 3, lat: 55.37, lng: -3.43 },
          { name: "India", weight: 2, lat: 20.59, lng: 78.96 }, // Historic Suez/Bombay mercantile corridor
          { name: "Australia", weight: 2, lat: -25.27, lng: 133.77 }
        ]);
      }
      // 2. United Kingdom & Ireland
      if (oName.includes('united kingdom') || oName.includes('britain') || oName.includes('ireland') || oName.includes('scotland') || oName.includes('england')) {
        return pickWeighted([
          { name: "USA", weight: 45, lat: 37.09, lng: -95.71 },
          { name: "Canada", weight: 20, lat: 56.13, lng: -106.34 },
          { name: "Australia", weight: 15, lat: -25.27, lng: 133.77 },
          { name: "India", weight: 6, lat: 20.59, lng: 78.96 },
          { name: "South Africa", weight: 5, lat: -30.55, lng: 22.93 },
          { name: "France", weight: 4, lat: 46.22, lng: 2.21 },
          { name: "Argentina", weight: 3, lat: -34.60, lng: -58.38 },
          { name: "Germany", weight: 2, lat: 51.16, lng: 10.45 }
        ]);
      }
      // 3. Germany & Austria
      if (oName.includes('germany') || oName.includes('austria') || oName.includes('prussia')) {
        return pickWeighted([
          { name: "USA", weight: 52, lat: 37.09, lng: -95.71 },
          { name: "Brazil", weight: 14, lat: -14.23, lng: -51.92 },
          { name: "Argentina", weight: 12, lat: -34.60, lng: -58.38 },
          { name: "Russia / Soviet Union", weight: 8, lat: 61.52, lng: 105.31 },
          { name: "United Kingdom", weight: 5, lat: 55.37, lng: -3.43 },
          { name: "France", weight: 4, lat: 46.22, lng: 2.21 },
          { name: "China", weight: 3, lat: 35.86, lng: 104.19 },
          { name: "Australia", weight: 2, lat: -25.27, lng: 133.77 }
        ]);
      }
      // 4. Spain & Portugal
      if (oName.includes('spain') || oName.includes('portugal') || oName.includes('iberia')) {
        return pickWeighted([
          { name: "Argentina", weight: 38, lat: -34.60, lng: -58.38 },
          { name: "Brazil", weight: 22, lat: -14.23, lng: -51.92 },
          { name: "Mexico", weight: 15, lat: 23.63, lng: -102.55 },
          { name: "Cuba", weight: 12, lat: 21.52, lng: -77.78 },
          { name: "France", weight: 7, lat: 46.22, lng: 2.21 },
          { name: "USA", weight: 4, lat: 37.09, lng: -95.71 },
          { name: "Philippines", weight: 2, lat: 12.87, lng: 121.77 }
        ]);
      }
      // 5. China
      if (oName.includes('china')) {
        return pickWeighted([
          { name: "Indonesia / Southeast Asia", weight: 38, lat: -0.78, lng: 113.92 },
          { name: "Malaysia / Singapore", weight: 25, lat: 4.21, lng: 101.97 },
          { name: "USA", weight: 18, lat: 37.09, lng: -95.71 },
          { name: "Thailand / Indochina", weight: 8, lat: 15.87, lng: 100.99 },
          { name: "Australia", weight: 5, lat: -25.27, lng: 133.77 },
          { name: "Peru / Latin America", weight: 4, lat: -9.19, lng: -75.01 },
          { name: "United Kingdom / Europe", weight: 2, lat: 55.37, lng: -3.43 }
        ]);
      }
      // 6. India
      if (oName.includes('india')) {
        return pickWeighted([
          { name: "United Kingdom", weight: 32, lat: 55.37, lng: -3.43 },
          { name: "South Africa / East Africa", weight: 24, lat: -30.55, lng: 22.93 },
          { name: "Malaysia / Singapore", weight: 18, lat: 4.21, lng: 101.97 },
          { name: "Caribbean (Trinidad/Guyana)", weight: 12, lat: 10.69, lng: -61.22 },
          { name: "Middle East / Persian Gulf", weight: 8, lat: 23.42, lng: 53.84 },
          { name: "USA / Canada", weight: 4, lat: 37.09, lng: -95.71 },
          { name: "Fiji / Pacific", weight: 2, lat: -17.71, lng: 178.06 }
        ]);
      }
      // 7. Russia, Poland, Ukraine & Eastern Europe
      if (oName.includes('russia') || oName.includes('soviet') || oName.includes('poland') || oName.includes('ukraine') || oName.includes('belarus') || oName.includes('lithuania')) {
        return pickWeighted([
          { name: "USA", weight: 46, lat: 37.09, lng: -95.71 },
          { name: "France", weight: 16, lat: 46.22, lng: 2.21 },
          { name: "Germany", weight: 14, lat: 51.16, lng: 10.45 },
          { name: "Argentina / Brazil", weight: 10, lat: -34.60, lng: -58.38 },
          { name: "United Kingdom", weight: 8, lat: 55.37, lng: -3.43 },
          { name: "Israel / Palestine", weight: 4, lat: 31.76, lng: 35.21 },
          { name: "China (Harbin/Shanghai)", weight: 2, lat: 35.86, lng: 104.19 }
        ]);
      }
      // 8. France
      if (oName.includes('france')) {
        return pickWeighted([
          { name: "Algeria / North Africa", weight: 38, lat: 28.03, lng: 1.65 },
          { name: "USA", weight: 22, lat: 37.09, lng: -95.71 },
          { name: "Argentina / Latin America", weight: 16, lat: -34.60, lng: -58.38 },
          { name: "Vietnam / Indochina", weight: 10, lat: 14.05, lng: 108.27 },
          { name: "United Kingdom", weight: 8, lat: 55.37, lng: -3.43 },
          { name: "Senegal / West Africa", weight: 4, lat: 14.49, lng: -14.45 },
          { name: "India (Pondicherry)", weight: 2, lat: 11.94, lng: 79.80 }
        ]);
      }
      // 9. Japan
      if (oName.includes('japan')) {
        return pickWeighted([
          { name: "Brazil", weight: 42, lat: -14.23, lng: -51.92 },
          { name: "USA (Hawaii / California)", weight: 35, lat: 37.09, lng: -95.71 },
          { name: "Peru", weight: 12, lat: -9.19, lng: -75.01 },
          { name: "Manchuria / China", weight: 8, lat: 41.80, lng: 123.43 },
          { name: "Europe", weight: 3, lat: 48.85, lng: 2.35 }
        ]);
      }
      // 10. Mexico, Latin America & Caribbean
      if (oName.includes('mexico') || oName.includes('brazil') || oName.includes('argentina') || oName.includes('colombia') || oName.includes('cuba')) {
        return pickWeighted([
          { name: "USA", weight: 65, lat: 37.09, lng: -95.71 },
          { name: "Spain", weight: 16, lat: 40.46, lng: -3.74 },
          { name: "Argentina", weight: 8, lat: -34.60, lng: -58.38 },
          { name: "France / Europe", weight: 6, lat: 46.22, lng: 2.21 },
          { name: "Brazil", weight: 5, lat: -14.23, lng: -51.92 }
        ]);
      }
      // 11. Middle East & Ottoman
      if (oName.includes('ottoman') || oName.includes('turkey') || oName.includes('egypt') || oName.includes('syria') || oName.includes('lebanon') || oName.includes('arabia') || oName.includes('iran') || oName.includes('persia')) {
        return pickWeighted([
          { name: "Brazil / Argentina", weight: 32, lat: -14.23, lng: -51.92 },
          { name: "USA", weight: 28, lat: 37.09, lng: -95.71 },
          { name: "France", weight: 18, lat: 46.22, lng: 2.21 },
          { name: "Egypt", weight: 12, lat: 26.82, lng: 30.80 },
          { name: "United Kingdom", weight: 6, lat: 55.37, lng: -3.43 },
          { name: "India", weight: 4, lat: 20.59, lng: 78.96 }
        ]);
      }
      // 12. African Nations
      if (oName.includes('nigeria') || oName.includes('africa') || oName.includes('congo') || oName.includes('ghana') || oName.includes('kenya') || oName.includes('ethiopia')) {
        return pickWeighted([
          { name: "United Kingdom", weight: 36, lat: 55.37, lng: -3.43 },
          { name: "France", weight: 28, lat: 46.22, lng: 2.21 },
          { name: "USA", weight: 20, lat: 37.09, lng: -95.71 },
          { name: "South Africa", weight: 10, lat: -30.55, lng: 22.93 },
          { name: "Germany / Europe", weight: 4, lat: 51.16, lng: 10.45 },
          { name: "India", weight: 2, lat: 20.59, lng: 78.96 }
        ]);
      }
      // 13. USA
      if (oName.includes('usa') || oName.includes('united states') || oName.includes('america')) {
        return pickWeighted([
          { name: "United Kingdom / Europe", weight: 35, lat: 55.37, lng: -3.43 },
          { name: "Canada", weight: 28, lat: 56.13, lng: -106.34 },
          { name: "France", weight: 15, lat: 46.22, lng: 2.21 },
          { name: "Mexico / Latin America", weight: 12, lat: 23.63, lng: -102.55 },
          { name: "Japan / Philippines", weight: 6, lat: 36.20, lng: 138.25 },
          { name: "India", weight: 4, lat: 20.59, lng: 78.96 }
        ]);
      }

      // Default modern fallback
      const destPool = MODERN_COUNTRIES.filter(c => c.name !== originName);
      return destPool.length > 0 ? pickWeighted(destPool) : MODERN_COUNTRIES[0];
    }

    return null;
  };

  const determineDetailedEthnicity = (eraId, regionName, isMinority, minorityHint, socialClass) => {
    const r = (regionName || '').toLowerCase();

    if (isMinority && minorityHint) {
      return minorityHint;
    }

    // Early Modern & Colonial Societies
    if (r.includes('new spain') || r.includes('mexico')) {
      if (socialClass && (socialClass.includes('Upper') || socialClass.includes('Aristocra'))) {
        return pickRandomItem(["Criollo (Spanish-descended American-born elite)", "Peninsular Spanish (European-born colonial official)"]);
      }
      const rRoll = Math.random();
      if (rRoll < 0.55) return "Indigenous (Nahua / Mixtec / Zapotec / Otomi)";
      if (rRoll < 0.85) return "Mestizo (Mixed Indigenous and Spanish ancestry)";
      if (rRoll < 0.95) return "Criollo (Spanish-descended)";
      return "Afro-Mexican / Afromestizo";
    }

    if (r.includes('peru') || r.includes('potosí') || r.includes('cusco') || r.includes('lima')) {
      if (socialClass && (socialClass.includes('Upper') || socialClass.includes('Aristocra'))) {
        return pickRandomItem(["Criollo (Spanish aristocracy)", "Indigenous Incan Nobility (Curaca elite)"]);
      }
      const rRoll = Math.random();
      if (rRoll < 0.65) return "Indigenous (Quechua or Aymara)";
      if (rRoll < 0.90) return "Mestizo (Mixed Quechua and Spanish ancestry)";
      return "Criollo (Spanish ancestry)";
    }

    if (r.includes('brazil')) {
      if (socialClass && (socialClass.includes('Upper') || socialClass.includes('Aristocra'))) {
        return "Luso-Brazilian (Portuguese sugar/coffee aristocracy)";
      }
      const rRoll = Math.random();
      if (rRoll < 0.45) return "Afro-Brazilian (Yoruba / Angolan enslaved or freed lineage)";
      if (rRoll < 0.70) return "Mestiço / Pardo (Mixed Portuguese, African, and Indigenous)";
      if (rRoll < 0.85) return "Indigenous Brazilian (Tupi-Guarani)";
      return "Portuguese / Luso-Brazilian Settler";
    }

    if (r.includes('caribbean') || r.includes('haiti') || r.includes('saint-domingue') || r.includes('jamaica') || r.includes('cuba')) {
      if (socialClass && (socialClass.includes('Upper') || socialClass.includes('Planter'))) {
        return "French / British / Spanish Colonial Planter Class";
      }
      const rRoll = Math.random();
      if (rRoll < 0.82) return "Afro-Caribbean (West African lineage)";
      if (rRoll < 0.95) return "Mulatto / Mixed Afro-European Creole";
      return "European Creole Settler";
    }

    if (r.includes('thirteen colonies') || r.includes('north america') || r.includes('boston') || r.includes('virginia')) {
      if (socialClass && (socialClass.toLowerCase().includes('slave') || isMinority)) return "Black American (African-descendant)";
      const rRoll = Math.random();
      if (rRoll < 0.70) return "Anglo-American (English ancestry)";
      if (rRoll < 0.85) return "Scots-Irish / Scottish Settler";
      if (rRoll < 0.95) return "German Settler (Pennsylvania Dutch)";
      return "Indigenous (Eastern Woodlands / Powhatan / Haudenosaunee)";
    }

    if (r.includes('ottoman') || r.includes('istanbul') || r.includes('balkans')) {
      const rRoll = Math.random();
      if (rRoll < 0.48) return "Ottoman Turk";
      if (rRoll < 0.68) return "Greek (Rum Orthodox)";
      if (rRoll < 0.82) return "Arab (Levantine / Egyptian)";
      if (rRoll < 0.92) return "Armenian (Christian minority)";
      return "South Slavic (Serb / Bosnian / Bulgarian)";
    }

    if (r.includes('mughal') || r.includes('india')) {
      if (socialClass && (socialClass.includes('Upper') || socialClass.includes('Nobility'))) {
        return pickRandomItem(["Mughal / Indo-Persian Aristocracy", "Rajput / Kshatriya Hindu Aristocracy"]);
      }
      const rRoll = Math.random();
      if (rRoll < 0.70) return "Indo-Aryan (North Indian)";
      if (rRoll < 0.90) return "Dravidian (South Indian)";
      return "Adivasi (Indigenous tribal lineage)";
    }

    if (r.includes('rome') || r.includes('roman') || r.includes('italy')) {
      if (eraId === 'CLASSICAL') {
        const rRoll = Math.random();
        if (rRoll < 0.55) return "Roman / Latin Citizen";
        if (rRoll < 0.75) return "Italic (Samnite / Etruscan / Oscan)";
        if (rRoll < 0.90) return "Greek / Magna Graecia lineage";
        return "Gallo-Roman or Levantine provincial migrant";
      }
      return "Italian / Local regional lineage";
    }

    if (r.includes('gaul')) {
      return Math.random() < 0.75 ? "Celtic Gaul (Arverni / Aedui tribal lineage)" : "Gallo-Roman";
    }

    if (r.includes('china') || r.includes('ming') || r.includes('qing') || r.includes('han') || r.includes('tang') || r.includes('song')) {
      return Math.random() < 0.92 ? "Han Chinese" : "Manchu / Jurchen / Northern minority";
    }

    if (r.includes('japan') || r.includes('tokugawa') || r.includes('edo') || r.includes('heian')) {
      return Math.random() < 0.97 ? "Yamato Japanese" : "Ainu / Emishi lineage";
    }

    if (r.includes('dahomey') || r.includes('ashanti') || r.includes('benin') || r.includes('ghana') || r.includes('west africa') || r.includes('mali') || r.includes('songhai') || r.includes('yoruba')) {
      if (isMinority) {
        return pickRandomItem([
          "Hausa trans-Saharan trader / merchant enclave",
          "Fulani pastoralist / migrant lineage",
          "Mossi caravan merchant",
          "Nupe / Ewe trade minority",
          "Portuguese / Luso-African coastal trader"
        ]);
      }
      if (r.includes('dahomey')) return pickRandomItem(["Fon (Dahomey lineage)", "Gbe / Allada lineage"]);
      if (r.includes('ashanti') || r.includes('ghana')) return pickRandomItem(["Ashanti / Akan lineage", "Fante coastal lineage"]);
      if (r.includes('benin')) return "Edo / Bini lineage (Kingdom of Benin)";
      if (r.includes('mali') || r.includes('songhai')) return pickRandomItem(["Mandinka / Malinke lineage", "Songhai lineage", "Soninke lineage"]);
      if (r.includes('yoruba') || r.includes('oyo')) return "Yoruba (Oyo Empire lineage)";
      return "Native West African lineage (Fon, Akan, or Yoruba)";
    }

    if (r.includes('ethiopia') || r.includes('abyssinia') || r.includes('axum') || r.includes('horn of africa')) {
      if (isMinority) return pickRandomItem(["Beta Israel (Ethiopian Jewish minority)", "Afar pastoralist", "Oromo lineage"]);
      return Math.random() < 0.65 ? "Habesha / Amhara (Ethiopian Orthodox)" : "Tigrayan lineage";
    }

    if (r.includes('swahili') || r.includes('zanzibar') || r.includes('kilwa') || r.includes('east africa')) {
      if (isMinority) return pickRandomItem(["Omani / Arab merchant settler", "Shirazi Persian coastal merchant", "Indian Ocean trader"]);
      return "Swahili (Bantu coastal trade lineage)";
    }

    if (r.includes('kongo') || r.includes('angola') || r.includes('central africa')) {
      if (isMinority) return "Portuguese / Luso-Kongolese mestizo or trader";
      return "Bakongo / Bantu lineage";
    }

    // Modern Era:
    if (eraId === 'MODERN') {
      if (r.includes('usa')) return Math.random() < 0.75 ? "White American (Euro-American)" : "Black American";
      if (r.includes('brazil')) return pickRandomItem(["Pardo / Mixed Afro-European-Indigenous", "White Brazilian (Portuguese/Italian descent)", "Afro-Brazilian"]);
      if (r.includes('mexico')) return pickRandomItem(["Mestizo (Mixed Indigenous and European)", "Indigenous Mexican", "White Mexican"]);
      if (r.includes('india')) return "Indo-Aryan or Dravidian (Indian)";
      if (r.includes('china')) return "Han Chinese";
      if (r.includes('france')) return "French (European lineage)";
      if (r.includes('germany')) return "German";
      if (r.includes('united kingdom') || r.includes('britain')) return "British (English/Scottish/Welsh/Irish)";
      if (r.includes('japan')) return "Japanese";
      if (r.includes('nigeria')) return pickRandomItem(["Yoruba", "Hausa-Fulani", "Igbo"]);
    }

    // Default general lineage
    return `Native ${regionName.split('(')[0].trim()} lineage`;
  };

  const simulateLife = async () => {
    if (isGenerating) return;
    setGenerationError(null);
    setBadgeModalQueue([]); // Clear any open badge celebration so it never blocks the view or clicks
    try { playUiSound('incarnate'); } catch (e) { }
    setIsGenerating(true);

    // Yield to the browser render loop so the button immediately transitions to "Weaving Timeline..."
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      // 1. Era selection (weighted)
      let selectedEra = ERAS[0];
      const eraRoll = Math.random() * ERAS.reduce((s, e) => s + e.weight, 0);
      let cumEra = 0;
      for (const era of ERAS) { cumEra += era.weight; if (eraRoll <= cumEra) { selectedEra = era; break; } }

      const birthYear = randomInt(selectedEra.startYear, selectedEra.endYear);
      const sex = Math.random() < 0.5 ? 'Male' : 'Female';

      // 2. Location & Migration Tracking
      let regionText, lang, lat, lng, baseLifeExpectancy;
      let selectedCountry = null;
      let regionObj = null;
      let isUrban = false;
      let isMinority = false;
      let minorityGroupHint = null;

      let isEmigrant = false;
      let emigrationAge = null;
      let deathRegion = null;
      let deathLat = null;
      let deathLng = null;

      const modernProgress = selectedEra.id === 'MODERN' ? Math.max(0, (birthYear - 1850) / 150) : 0;

      if (selectedEra.id === 'MODERN') {
        selectedCountry = pickWeighted(MODERN_COUNTRIES);
        const urbanRate = selectedCountry.urbanStart + (selectedCountry.urbanEnd - selectedCountry.urbanStart) * modernProgress;
        isUrban = Math.random() < urbanRate;
        regionText = selectedCountry.name;
        lang = selectedCountry.lang;
        lat = selectedCountry.lat;
        lng = selectedCountry.lng;
        baseLifeExpectancy = selectedCountry.lifeExpectancy;
        // Minority determined from country-specific chance
        isMinority = Math.random() < selectedCountry.minorityChance;
        if (isMinority && selectedCountry.minorities.length > 0) {
          minorityGroupHint = pickRandomItem(selectedCountry.minorities);
        }
      } else {
        regionObj = pickRandomItem(selectedEra.regions);
        regionText = regionObj.text;
        lang = regionObj.lang;
        lat = regionObj.lat;
        lng = regionObj.lng;
        baseLifeExpectancy = regionObj.modernLifeExpectancy || selectedEra.survivingAdultMean;
        isMinority = Math.random() < regionObj.minorityChance;
      }

      // 3. Social Class Roll
      let classPool = selectedEra.classes;
      if (selectedEra.id === 'MODERN' && isMinority && selectedCountry?.minorityClassBias) {
        const b = selectedCountry.minorityClassBias;
        const raw = classPool.map(c => ({
          ...c,
          chance: c.chance * (c.name.includes('Working') ? b.working : c.name.includes('Middle') ? b.middle : b.upper)
        }));
        const total = raw.reduce((s, c) => s + c.chance, 0);
        classPool = raw.map(c => ({ ...c, chance: c.chance / total }));
      }
      let socialClass = classPool[0].name;
      const classRoll = Math.random();
      let cumClass = 0;
      for (const cls of classPool) { cumClass += cls.chance; if (classRoll <= cumClass) { socialClass = cls.name; break; } }

      // Royalty / Historic Ruling Dynasty sub-roll (conditioned on Upper Class / Nobility)
      const isEliteClass = socialClass.includes('Nobility') || socialClass.includes('Patrician') ||
        socialClass.includes('Palace Elite') || socialClass.includes('Aristocra') ||
        socialClass.includes('Upper Class') || socialClass.includes('Chieftain');

      // In premodern eras, royalty is ~8.0% of the upper class / nobility (~1% of all births).
      // In modern era, royalty/dynasty is ~2.0% of the upper class (~0.2% of all births).
      const royalSubChance = selectedEra.id === 'MODERN' ? 0.02 : 0.08;
      const isRoyaltyOrHistoric = isEliteClass && Math.random() < royalSubChance;

      if (isRoyaltyOrHistoric) {
        socialClass = selectedEra.id === 'MODERN' ? 'Royalty / Reigning Dynasty' : 'Royalty / Imperial Dynasty';
      }

      // 3b. Detailed Ethnicity & Ancestry Determination
      const ethnicity = determineDetailedEthnicity(selectedEra.id, regionText, isMinority, minorityGroupHint, socialClass);
      if (isMinority && !minorityGroupHint) {
        minorityGroupHint = ethnicity;
      }

      // 2b. Base Genetics
      const intelligence = randomGaussian(50, 15);
      const beauty = randomGaussian(50, 15);

      // 3. Mortality Setup
      let baseInfantMortality = selectedEra.infantMortality;
      let baseChildMortality = selectedEra.childMortality;
      const eraRange = selectedEra.endYear - selectedEra.startYear;
      const progress = eraRange > 0 ? (birthYear - selectedEra.startYear) / eraRange : 0;
      let baselineAdultLifespan = baseLifeExpectancy;

      if (selectedEra.id === 'MODERN') {
        const startExpectancy = 60;
        baselineAdultLifespan = Math.floor(startExpectancy + (baseLifeExpectancy - startExpectancy) * modernProgress);
        if (sex === 'Female') baselineAdultLifespan += 4;
        baseInfantMortality = 0.04 * Math.pow(0.015, modernProgress);
        baseChildMortality = 0.02 * Math.pow(0.02, modernProgress);
      } else if (selectedEra.id === 'EARLY_MODERN') {
        baseInfantMortality = 0.08 - (progress * 0.03);
      }

      let classMultiplier = 1.0;
      if (socialClass.includes('Upper') || socialClass.includes('Patrician') || socialClass.includes('Nobility') || socialClass.includes('Aristocrat')) classMultiplier = 0.25;
      else if (socialClass.includes('Middle') || socialClass.includes('Merchant') || socialClass.includes('Artisan')) classMultiplier = 0.45;
      else if (socialClass.includes('Slave') || socialClass.includes('Indentured') || socialClass.includes('Serf')) classMultiplier = 1.25;

      let adjustedInfantMortality = Math.max(0.001, baseInfantMortality * classMultiplier);
      let adjustedChildMortality = Math.max(0.001, baseChildMortality * classMultiplier);

      // 4. Disability (prevalence-weighted — AI picks specific condition within category)
      let disabilityCategory = null;
      let disabilityExamples = null;
      let isVisibleAtBirth = false;
      let wasExposed = false;
      let isHeartDefect = false;

      if (Math.random() < 0.10) {
        const picked = pickWeighted(DISABILITY_POOL);
        disabilityCategory = picked.category;
        disabilityExamples = Array.isArray(picked.examples) ? pickRandomItem(picked.examples) : picked.examples;
        isVisibleAtBirth = picked.visibleAtBirth;
        isHeartDefect = picked.heartDefect;
      }
      if (isVisibleAtBirth && Math.random() < selectedEra.exposureRate) wasExposed = true;

      // 5. Identity & Personality
      const isImmigrant = Math.random() < (selectedEra.id === 'MODERN' ? 0.15 : 0.02);

      let orientation = 'Heterosexual';
      let actedOnBi = false;
      const orientationRoll = Math.random();
      if (sex === 'Male') {
        if (orientationRoll < 0.01) orientation = 'Asexual';
        else if (orientationRoll < 0.06) orientation = 'Homosexual';
        else if (orientationRoll < 0.03) { orientation = 'Bisexual'; actedOnBi = Math.random() < 0.3; }
      } else {
        if (orientationRoll < 0.01) orientation = 'Asexual';
        else if (orientationRoll < 0.03) orientation = 'Homosexual';
        else if (orientationRoll < 0.08) { orientation = 'Bisexual'; actedOnBi = Math.random() < 0.3; }
      }

      // Transgender demographic roll: 1.0% for homosexuals, 0.3% for other orientations
      const transChance = orientation === 'Homosexual' ? 0.010 : 0.003;
      const isTransgender = Math.random() < transChance;

      // Psychopathy demographic roll (1% of population)
      const isPsychopath = Math.random() < 0.01;

      // Psychopathy strictly precludes emotional empathy, selfless generosity, and familial devotion
      const NON_PSYCHOPATHIC_TRAITS = [
        "deeply empathetic",
        "generous to a fault",
        "devoted to family",
        "idealistic"
      ];
      const availableTraits = isPsychopath
        ? PERSONALITY_TRAITS.filter(t => !NON_PSYCHOPATHIC_TRAITS.includes(t))
        : PERSONALITY_TRAITS;

      const personality1 = pickRandomItem(availableTraits);
      let personality2 = pickRandomItem(availableTraits);
      while (personality1 === personality2) personality2 = pickRandomItem(availableTraits);

      // Orientation Openness Engine: determines whether a queer character lives openly or stays in the closet
      let isOpenlyGay = false;
      let isInTheCloset = false;

      if (orientation === 'Homosexual' || (orientation === 'Bisexual' && actedOnBi)) {
        const isBold = [personality1, personality2].some(p =>
          p.includes('brave') || p.includes('independent') || p.includes('stubborn') || p.includes('rebellious') || p.includes('ambitious') || p.includes('curious')
        );

        if (selectedEra.id === 'MODERN') {
          if (birthYear >= 1980) {
            isOpenlyGay = isBold || Math.random() < 0.65;
          } else if (birthYear >= 1950) {
            isOpenlyGay = isBold && Math.random() < 0.35;
          } else {
            isOpenlyGay = isBold && Math.random() < 0.08;
          }
        } else {
          isOpenlyGay = isBold && Math.random() < 0.02;
        }
        isInTheCloset = !isOpenlyGay;
      }

      let transgenderDetails = null;
      if (isTransgender) {
        const isBold = [personality1, personality2].some(p =>
          p.includes('brave') || p.includes('independent') || p.includes('stubborn') || p.includes('curious') || p.includes('ambitious')
        );
        if (selectedEra.id === 'MODERN' && birthYear >= 1930) {
          transgenderDetails = isBold
            ? "Deeply conscious of their true gender; pursued medical/social transition or lived openly in counter-cultural/underground communities (pioneering historical parallels like Lili Elbe)."
            : "Felt profound disconnect between assigned sex and true gender; navigated dysphoria with quiet resilience in private or within trusted circles.";
        } else {
          transgenderDetails = isBold
            ? "Lived authentically as their true gender through disguise, assuming a new name/identity in military, sailor, monastic, or frontier life (historical parallels like Catalina de Erauso / Lieutenant Nun, Public Universal Friend, or Chevalier d'Éon)."
            : "Felt deeply alienated from their assigned gender roles; harbored their true identity in secret throughout their life.";
        }
      }

      // 6. Fame & Legacy
      let fameMod = 1.0;
      if (intelligence > 80) fameMod = 0.5;
      if (intelligence > 90) fameMod = 0.3;

      const fameRoll = Math.random() * fameMod;
      let fame = "Ordinary / Forgotten by history";

      if (isRoyaltyOrHistoric) {
        fame = "Properly Famous (Historical Monarch / Royal Dynasty Figure)";
      } else if (fameRoll < 0.02) {
        if (selectedEra.id === 'PALEOLITHIC' || selectedEra.id === 'NEOLITHIC') {
          fame = "Archaeological Discovery (Your remarkably preserved remains were unearthed in the 20th/21st century).";
        } else if ((selectedEra.id === 'BRONZE_IRON' || selectedEra.id === 'CLASSICAL' || selectedEra.id === 'MEDIEVAL') && !socialClass.includes('Upper') && !socialClass.includes('Patrician') && !socialClass.includes('Nobility') && !socialClass.includes('Elite')) {
          fame = "Archaeological Discovery (As a commoner, your name was lost to time, but your remarkably preserved burial site was discovered by modern archaeologists).";
        } else {
          fame = "Properly Famous (Your name, deeds, or creations are permanently etched into global history).";
        }
      } else if (fameRoll < 0.06) {
        if (selectedEra.id !== 'PALEOLITHIC' && selectedEra.id !== 'NEOLITHIC') {
          fame = "Mildly Infamous (You committed a scandalous act, notorious crime, or localized rebellion; fading into obscurity after a generation).";
        }
      } else if (fameRoll < 0.12) {
        if (selectedEra.id !== 'PALEOLITHIC' && selectedEra.id !== 'NEOLITHIC') {
          fame = "Mildly Famous (You did something notable and were celebrated for a while before history forgot you).";
        }
      }

      // 7. Hobby & Pastimes Engine (Rich casual pastimes for ordinary & working classes)
      const isAutistic = disabilityCategory === "Neurodivergent condition" && (disabilityExamples || '').toLowerCase().includes('autism');
      const isNeurodivergent = disabilityCategory === "Neurodivergent condition";
      const isUpperClass = socialClass.includes("Upper") || socialClass.includes("Nobility") || socialClass.includes("Aristocrat") || socialClass.includes("Patrician");
      const isSocialOrCurious = [personality1, personality2].some(p =>
        p.includes("social") || p.includes("curious") || p.includes("empathetic") || p.includes("creative") || p.includes("garrulous") || p.includes("contemplative")
      );

      let hobbyData = "No formal hobbies (daily life centered on labor and sustenance).";

      // Casual pastimes pool for commoners/poor
      const commonPastimes = [
        "folk singing and learning traditional ballads",
        "communal folk dancing at village feasts and seasonal festivals",
        "storytelling and recounting local folklore by the hearth or town fountain",
        "dice, knucklebone, or coin-tossing games in taverns and public squares",
        "fishing along local rivers and coastal waters",
        "whittling decorative wood figurines, utensils, or whistles",
        "playing a handmade pipe, reed flute, or drum",
        "foraging for wild herbs, berries, and medicinal plants",
        "casual wrestling, footraces, or traditional stone-lifting games",
        "stargazing and tracking the constellations",
        "gardening a small patch of flowers, herbs, or vegetables"
      ];

      if (isAutistic) {
        hobbyData = "a dedicated, absorbing focus on a specific manual craft or technical pursuit";
      } else if (isUpperClass) {
        hobbyData = pickRandomItem([
          "formal equestrian riding, hunting, or falconry",
          "patronage of fine arts, collecting ancient coins or curiosities",
          "scholarly reading, poetry composition, and philosophical correspondence",
          "fencing, music composition, or playing the lute/harpsichord/guqin",
          "botanical cultivation and ornate estate gardening"
        ]);
      } else {
        // 80% of commoners/poor have enjoyable casual pastimes, especially if personality is compatible
        const commonPastimeChance = isSocialOrCurious ? 0.88 : 0.70;
        if (Math.random() < commonPastimeChance) {
          hobbyData = `a casual, relaxing pastime: ${pickRandomItem(commonPastimes)}`;
        }
      }

      if (intelligence > 75 && Math.random() < 0.22) {
        hobbyData += " Through sharp intellect and skill, they eventually turned this pastime into an auxiliary trade or respected community renown.";
      }

      // 8. Actuarial Survival Engine (Year-by-Year Loop)
      let age = 0;
      let isAlive = true;
      let causeOfDeath = null;
      let suicide = false;
      let maternalRoll = false;
      let survivedCancer = false;
      let cancerAge = null;

      if (wasExposed) {
        age = 0; isAlive = false;
      } else if (Math.random() < adjustedInfantMortality) {
        age = 0; isAlive = false;
      } else if (Math.random() < adjustedChildMortality) {
        age = randomInt(1, 14); isAlive = false;
      } else {
        age = 15;
        while (isAlive && age < 120) {
          let currentYearCounter = birthYear + age;
          if (currentYearCounter >= 2026) {
            causeOfDeath = "Still Alive";
            break;
          }

          let baseYearly = selectedEra.id === 'MODERN' ? 0.0005 : 0.005;
          let ageFactor = Math.exp((age - baselineAdultLifespan) / (selectedEra.id === 'MODERN' ? 9 : 14));
          let currentRisk = baseYearly + (0.10 * ageFactor);

          if (sex === 'Female' && age >= 15 && age <= 40) {
            let yearlyMaternal = (selectedEra.maternalMortality * classMultiplier) / 25;
            if (Math.random() < yearlyMaternal) { maternalRoll = true; isAlive = false; break; }
          }
          if (age >= 15 && age <= 50) {
            if (Math.random() < 0.0005) { suicide = true; isAlive = false; break; }
          }
          if (isHeartDefect && selectedEra.id !== 'MODERN') {
            currentRisk += 0.05;
          }

          if (selectedEra.id === 'MODERN' && age > 35 && !survivedCancer) {
            if (Math.random() < 0.002) { survivedCancer = true; cancerAge = age; }
          }

          if (Math.random() < currentRisk) { isAlive = false; break; }
          age++;
        }
      }

      // 3e. Jewish Identity & Antisemitism Spectrum Engine
      let isJewish = false;
      let antisemitismExperience = null;

      if (isMinority && selectedEra.id !== 'PALEOLITHIC' && selectedEra.id !== 'NEOLITHIC') {
        isJewish = (minorityGroupHint || '').toLowerCase().includes('jewish');
        if (!isJewish) {
          const reg = (regionText || '').toLowerCase();
          if (reg.includes('judea') || reg.includes('jerusalem') || reg.includes('levant')) {
            isJewish = true;
            minorityGroupHint = 'Jewish (Judean)';
          } else if (reg.includes('andalus') || reg.includes('spain') || reg.includes('iberia') || reg.includes('portugal')) {
            if (Math.random() < 0.22) { isJewish = true; minorityGroupHint = 'Jewish (Sephardic)'; }
          } else if (reg.includes('poland') || reg.includes('lithuania') || reg.includes('rus') || reg.includes('rhineland') || reg.includes('germany') || reg.includes('holy roman')) {
            if (Math.random() < 0.28) { isJewish = true; minorityGroupHint = 'Jewish (Ashkenazi)'; }
          } else if (reg.includes('caliphate') || reg.includes('egypt') || reg.includes('baghdad') || reg.includes('ottoman') || reg.includes('constantinople')) {
            if (Math.random() < 0.20) { isJewish = true; minorityGroupHint = 'Jewish (Mizrahi/Sephardic)'; }
          } else if (reg.includes('rome') || reg.includes('italy') || reg.includes('byzantine') || reg.includes('greece')) {
            if (Math.random() < 0.16) { isJewish = true; minorityGroupHint = 'Jewish (Romaniote/Italki)'; }
          }
        }

        if (isJewish && age >= 4 && !wasExposed) {
          const by = birthYear;
          const dy = birthYear + age;
          const rName = (regionText || '').toLowerCase();
          const isEurope = rName.includes('germany') || rName.includes('poland') || rName.includes('russia') || rName.includes('ukraine') || rName.includes('france') || rName.includes('netherlands') || rName.includes('austria') || rName.includes('czech') || rName.includes('hungary') || rName.includes('italy') || rName.includes('greece') || rName.includes('lithuania') || rName.includes('latvia') || rName.includes('belarus') || rName.includes('romania');

          // 1. THE HOLOCAUST (1933-1945 in Nazi Europe)
          if (selectedEra.id === 'MODERN' && isEurope && by <= 1944 && dy >= 1933) {
            if (by <= 1928 && Math.random() < 0.28) {
              isEmigrant = true;
              emigrationAge = Math.min(age, Math.max(8, 1938 - by));
              const refugeDests = [
                { name: "United States", lat: 40.71, lng: -74.00 },
                { name: "United Kingdom", lat: 51.50, lng: -0.12 },
                { name: "Mandatory Palestine", lat: 31.76, lng: 35.21 },
                { name: "Argentina", lat: -34.60, lng: -58.38 }
              ];
              const chosenDest = pickRandomItem(refugeDests);
              deathRegion = chosenDest.name;
              deathLat = chosenDest.lat;
              deathLng = chosenDest.lng;
              antisemitismExperience = {
                level: "Holocaust Refugee",
                details: `Fled escalating Nazi persecution, Nuremberg racial laws, and antisemitic violence in the 1930s, successfully emigrating as a refugee to ${deathRegion}.`
              };
            } else if (dy >= 1939) {
              if (Math.random() < 0.68) {
                const deathY = Math.min(1945, Math.max(1941, by + Math.min(age, 45)));
                age = Math.max(0, deathY - by);
                isAlive = false;
                causeOfDeath = pickRandomItem([
                  "murdered in the extermination camps during the Holocaust in Nazi-occupied Europe (Auschwitz-Birkenau)",
                  "murdered in the gas chambers during the Holocaust (Treblinka / Sobibor)",
                  "murdered in a mass shooting by Nazi Einsatzgruppen mobile killing squads",
                  "starvation, typhus, and brutal exhaustion inside an enclosed Nazi ghetto (Warsaw / Lodz Ghetto)"
                ]);
                antisemitismExperience = {
                  level: "The Holocaust (Victim)",
                  details: "Perished in the Holocaust during the Nazi genocide of European Jewry."
                };
              } else {
                antisemitismExperience = {
                  level: "The Holocaust (Survivor)",
                  details: pickRandomItem([
                    "Endured the horrors of the Holocaust, surviving in hiding with underground partisans in the forests and emerging after liberation in 1945.",
                    "Survived the Holocaust through the courage of righteous neighbors who sheltered your family in hidden quarters until liberation.",
                    "Survived imprisonment in Nazi concentration camps, enduring until Allied liberation in 1945 and rebuilding your life in the post-war era."
                  ])
                };
                if (Math.random() < 0.65) {
                  isEmigrant = true;
                  emigrationAge = Math.min(age, Math.max(16, 1947 - by));
                  const dest = pickRandomItem([
                    { name: "Israel", lat: 31.76, lng: 35.21 },
                    { name: "United States", lat: 40.71, lng: -74.00 },
                    { name: "Canada", lat: 45.50, lng: -73.56 }
                  ]);
                  deathRegion = dest.name;
                  deathLat = dest.lat;
                  deathLng = dest.lng;
                  antisemitismExperience.details += ` Emigrated after the war to build a new life in ${deathRegion}.`;
                }
              }
            }
          }

          // 2. PREMODERN & GENERAL ANTISEMITISM SPECTRUM
          if (!antisemitismExperience) {
            const roll = Math.random();

            if (roll < 0.25) {
              antisemitismExperience = {
                level: "Peaceful Coexistence",
                details: "Lived in an era and community of cultural coexistence, religious autonomy, and peace with neighboring populations."
              };
            } else if (roll < 0.50) {
              antisemitismExperience = {
                level: "Social Prejudice",
                details: "Navigated quiet social prejudice, exclusionary social barriers, and subtle neighborly disdain while maintaining vibrant Jewish communal and family traditions."
              };
            } else if (roll < 0.75) {
              antisemitismExperience = {
                level: "Institutional Discrimination",
                details: pickRandomItem([
                  "Subjected to municipal residency restrictions, confined to live within the locked gates of the Jewish quarter / ghetto (such as the Venetian Ghetto or Mellah).",
                  "Subjected to special sumptuary clothing codes (yellow badge / distinctive hat) and special protection taxes (Leibzoll / Jizya) imposed on religious minorities.",
                  "Barred by law from owning agricultural land or entering trade guilds, channeling your livelihood into permitted mercantile and artisan trades."
                ])
              };
            } else {
              let persecutionScenario = "Faced acute anti-Jewish hostility and localized unrest, relying on community solidarity to endure.";
              let causesFlight = false;

              if ((rName.includes('spain') || rName.includes('iberia') || rName.includes('andalus')) && by <= 1492 && dy >= 1492) {
                persecutionScenario = "Confronted by the 1492 Alhambra Decree expelling all practicing Jews from Spain upon pain of death.";
                causesFlight = true;
              } else if ((rName.includes('russia') || rName.includes('ukraine') || rName.includes('poland')) && by >= 1860 && dy >= 1881) {
                persecutionScenario = "Survived violent Tsarist pogroms in the Pale of Settlement where armed mobs attacked Jewish homes and shops.";
                causesFlight = true;
              } else if (selectedEra.id === 'MEDIEVAL' && by <= 1350 && dy >= 1348) {
                persecutionScenario = "Narrowly escaped violent mob massacres and scapegoating during the Black Death hysteria in 1348–1349.";
                causesFlight = true;
              } else if (by <= 136 && dy >= 66 && (rName.includes('judea') || rName.includes('levant') || rName.includes('rome'))) {
                persecutionScenario = "Lived through the devastating Roman siege and destruction of Jerusalem during the Jewish-Roman wars.";
                causesFlight = true;
              } else {
                persecutionScenario = pickRandomItem([
                  "Faced escalating localized anti-Jewish riots and violent mob intimidation targeting the Jewish quarter.",
                  "Threatened with arbitrary arrest and confiscation of property during an outbreak of religious hysteria."
                ]);
                causesFlight = Math.random() < 0.55;
              }

              antisemitismExperience = {
                level: "Pogrom & Persecution",
                details: persecutionScenario
              };

              if (causesFlight && age >= 14 && !isEmigrant) {
                isEmigrant = true;
                emigrationAge = randomInt(14, Math.min(age, 38));

                if (rName.includes('spain') || rName.includes('iberia') || rName.includes('andalus')) {
                  const dest = pickRandomItem([
                    { name: "Ottoman Empire (Salonica / Constantinople)", lat: 40.64, lng: 22.94 },
                    { name: "North Africa (Morocco / Tunisia)", lat: 34.03, lng: -5.00 },
                    { name: "Netherlands (Amsterdam)", lat: 52.37, lng: 4.89 }
                  ]);
                  deathRegion = dest.name; deathLat = dest.lat; deathLng = dest.lng;
                } else if (rName.includes('russia') || rName.includes('ukraine') || rName.includes('poland')) {
                  const dest = pickRandomItem([
                    { name: "United States (New York Lower East Side)", lat: 40.71, lng: -73.99 },
                    { name: "United Kingdom (London East End)", lat: 51.52, lng: -0.06 },
                    { name: "Argentina (Buenos Aires)", lat: -34.60, lng: -58.38 }
                  ]);
                  deathRegion = dest.name; deathLat = dest.lat; deathLng = dest.lng;
                } else {
                  const destPool = selectedEra.regions.filter(r => r.text !== regionText);
                  const dest = destPool.length > 0 ? pickRandomItem(destPool) : selectedEra.regions[0];
                  deathRegion = dest.text; deathLat = dest.lat; deathLng = dest.lng;
                }
                antisemitismExperience.details += ` To escape persecution, emigrated to find safety and rebuild in ${deathRegion}.`;
              }
            }
          }
        }
      }

      // 3f. Universal Minority Persecution Engine
      let minorityPersecution = null;

      if (isMinority && !isJewish && minorityGroupHint && age >= 5 && !wasExposed) {
        const minHint = minorityGroupHint.toLowerCase();
        const rName = (regionText || '').toLowerCase();
        const by = birthYear;

        if (minHint.includes('black') || minHint.includes('afro')) {
          if (rName.includes('usa') || rName.includes('united states') || rName.includes('north america')) {
            if (by >= 1865 && by <= 1965) {
              if (Math.random() < 0.70) {
                minorityPersecution = {
                  level: "Segregation & Civil Rights Struggle",
                  details: "Navigated the harsh barriers of Jim Crow segregation, racial redlining, and disenfranchisement while building community solidarity through church and family."
                };
                if (Math.random() < 0.40 && !isEmigrant && age >= 18) {
                  isEmigrant = true;
                  emigrationAge = randomInt(18, Math.min(age, 35));
                  deathRegion = "Northern Urban Centers (Chicago / New York / Detroit)";
                  deathLat = 41.87; deathLng = -87.62;
                  minorityPersecution.details += " Joined the Great Migration to northern industrial centers seeking economic opportunity and dignity.";
                }
              }
            }
          }
        } else if (minHint.includes('indigenous') || minHint.includes('native') || minHint.includes('māori') || minHint.includes('aboriginal') || minHint.includes('quechua') || minHint.includes('mapuche')) {
          if (selectedEra.id === 'MODERN' || selectedEra.id === 'EARLY_MODERN') {
            if (Math.random() < 0.60) {
              minorityPersecution = {
                level: "Colonial Dispossession & Assimilation",
                details: "Resisted colonial land encroachment and aggressive state assimilation policies (including forced boarding schools), keeping tribal lore and songs alive."
              };
            }
          }
        } else if (minHint.includes('romani') || minHint.includes('sinti')) {
          if (selectedEra.id === 'MODERN' && by <= 1945 && by + age >= 1939 && (rName.includes('germany') || rName.includes('poland') || rName.includes('europe') || rName.includes('france') || rName.includes('hungary') || rName.includes('italy'))) {
            if (Math.random() < 0.55) {
              const deathY = Math.min(1945, Math.max(1941, by + Math.min(age, 40)));
              age = Math.max(0, deathY - by);
              isAlive = false;
              causeOfDeath = "murdered during the Romani genocide (Porajmos) in Nazi-occupied Europe";
              minorityPersecution = { level: "Porajmos / Genocide", details: "Perished during the Nazi genocide of Romani and Sinti people (Porajmos)." };
            } else {
              minorityPersecution = { level: "Genocide Survivor", details: "Survived the Porajmos (Romani genocide) during WWII, evading deportation and preserving clan traditions." };
            }
          } else {
            minorityPersecution = { level: "Marginalization & Wandering Bans", details: "Faced persistent municipal wandering bans, police harassment, and social exclusion, relying on close family caravans." };
          }
        } else if (minHint.includes('chinese') || minHint.includes('asian')) {
          if (rName.includes('usa') || rName.includes('america') || rName.includes('australia')) {
            if (by >= 1850 && by <= 1943) {
              minorityPersecution = { level: "Exclusion Laws & Nativist Bias", details: "Endured the era of the Chinese Exclusion Act and nativist anti-Asian hostility, finding safety in tight-knit chinatowns and mutual-aid merchant associations." };
            }
          }
        } else if (minHint.includes('armenian') && by >= 1880 && by <= 1915) {
          if (Math.random() < 0.65) {
            isEmigrant = true;
            emigrationAge = Math.min(age, Math.max(12, 1915 - by));
            deathRegion = pickRandomItem(["France (Marseille/Paris)", "United States (California/Boston)", "Lebanon (Beirut)"]);
            deathLat = 43.29; deathLng = 5.36;
            minorityPersecution = { level: "Genocide Refugee", details: `Fled the 1915 Armenian Genocide in the Ottoman Empire, emigrating as a displaced refugee to rebuild life in ${deathRegion}.` };
          }
        } else if ((minHint.includes('chechen') || minHint.includes('tatar')) && by <= 1944 && by + age >= 1944) {
          minorityPersecution = { level: "Forced Mass Deportation", details: "Survived the brutal 1944 Stalinist deportation to Central Asia in cattle cars, enduring harsh exile before returning home decades later." };
        }
      }

      // 3b. Upward Social Mobility Engine
      // Driven by high intelligence (especially for men/scholars) or extreme beauty (especially for women/courtesans/spouses)
      let hasUpwardMobility = false;
      let mobilityDetails = null;
      let birthSocialClass = socialClass;

      if (!isRoyaltyOrHistoric && age >= 18 && !wasExposed && !socialClass.includes('Royalt') && !socialClass.includes('Nobility') && !socialClass.includes('Patrician')) {
        let mobilityChance = 0.08; // baseline lucky break (up from 0.02)

        // Intellectual advancement
        if (intelligence >= 85) mobilityChance += 0.55;
        else if (intelligence >= 75) mobilityChance += 0.35;
        else if (intelligence >= 65) mobilityChance += 0.20;

        // Aesthetic & social advancement
        if (sex === 'Female') {
          if (beauty >= 85) mobilityChance += 0.55;
          else if (beauty >= 75) mobilityChance += 0.35;
          else if (beauty >= 65) mobilityChance += 0.18;
        }

        if (Math.random() < Math.min(0.85, mobilityChance)) {
          hasUpwardMobility = true;
          const isTribalOrPreUrban = selectedEra.id === 'PALEOLITHIC' || selectedEra.id === 'NEOLITHIC' || (selectedEra.id === 'BRONZE_IRON' && birthYear < -1500) || socialClass.includes('Tribal') || socialClass.includes('Chieftain') || socialClass.includes('Forager') || socialClass.includes('Hunter') || socialClass.includes('Herder');

          if (birthSocialClass.includes('Slave') || birthSocialClass.includes('Enslaved') || birthSocialClass.includes('Bondservant') || birthSocialClass.includes('Indentured')) {
            mobilityDetails = pickRandomItem([
              "Achieved rare social elevation by securing manumission and establishing a prosperous free livelihood",
              "Rose from bondage through exceptional talent, legally purchasing freedom and accumulating modest independent wealth"
            ]);
            socialClass = selectedEra.id === 'MODERN' ? "Freed Citizen / Self-Made" : (selectedEra.id === 'CLASSICAL' ? "Wealthy Freedman (Libertus)" : "Manumitted Freedperson / Free Artisan");
          } else if (isTribalOrPreUrban) {
            if (sex === 'Male' && intelligence >= 75) {
              mobilityDetails = "Gained high communal prestige and council influence as a renowned elder, master artisan, and wise negotiator among neighboring settlements";
              socialClass = "Respected Settlement Elder / Council Leader";
            } else if (sex === 'Female' && beauty >= 75) {
              mobilityDetails = "Elevated from humble subsistence through marriage into the lineage of a prominent village chieftain and clan matriarch";
              socialClass = "Chieftain's Household / Clan Matriarch";
            } else {
              mobilityDetails = "Rose in tribal stature through exceptional craftsmanship, bountiful food harvests, and extensive kinship alliances";
              socialClass = "Master Artisan / Prosperous Kinship Lineage";
            }
          } else if (selectedEra.id === 'MODERN') {
            if (sex === 'Male' && intelligence >= 75) {
              mobilityDetails = "Elevated through formidable intellect, education, and professional acumen into the upper-middle class elite";
              socialClass = "Upper Middle Class (Self-Made Professional / Executive)";
            } else if (sex === 'Female' && beauty >= 80) {
              mobilityDetails = "Rose from humble origins into high society and affluent circles through extraordinary grace and advantageous marriage";
              socialClass = "High Society / Affluent Elite";
            } else {
              mobilityDetails = "Rose from working poverty through exceptional diligence, shrewd business ventures, and commercial success";
              socialClass = "Upper Middle Class / Self-Made Entrepreneur";
            }
          } else {
            // Classical, Medieval, Early Modern historic civilizations
            if (sex === 'Male' && intelligence >= 75) {
              mobilityDetails = pickRandomItem([
                "Elevated through scholarship, civil acumen, and trade into the prosperous merchant and administrative circles",
                "Rose from humble beginnings through military distinction, tactical brilliance, and officer command",
                "Advanced through guild mastery, skilled craftsmanship, and trade ingenuity into the prosperous artisan elite"
              ]);
              socialClass = "Wealthy Guild Master / Scholar-Official / Trade Elite";
            } else if (sex === 'Female' && beauty >= 80) {
              mobilityDetails = pickRandomItem([
                "Elevated from poverty through stunning beauty and grace into an advantageous marriage with landed gentry / nobility",
                "Rose from humble origins into an influential high-society courtesan and cultural tastemaker",
                "Secured elite court favor and wealth as an esteemed aristocratic companion"
              ]);
              socialClass = "Gentry Spouse / Court Favorite";
            } else {
              mobilityDetails = "Rose from working poverty through exceptional diligence, prudent trade, and fortunate patronage into prosperous merchant circles";
              socialClass = "Prosperous Merchant / Gentry";
            }
          }
        }
      }

      // 3c. Later Enslavement / Captive Servitude Engine (if not born into slavery)
      let wasEnslavedLater = false;
      let enslavedAge = null;
      let enslavementDetails = null;

      const isAlreadySlave = socialClass.toLowerCase().includes('slave') || socialClass.toLowerCase().includes('enslaved') || socialClass.toLowerCase().includes('serf');

      if (!isAlreadySlave && !isRoyaltyOrHistoric && age >= 5 && !wasExposed) {
        let enslavementRisk = 0;
        const eraId = selectedEra.id;
        const rName = (regionText || '').toLowerCase();
        const minText = (minorityGroupHint || '').toLowerCase();

        if (eraId === 'BRONZE' || eraId === 'CLASSICAL') {
          // Captive slavery in antiquity (Roman conquests, Greek piracy, debt bondage)
          enslavementRisk = 0.05;
          if (rName.includes('rome') || rName.includes('gaul') || rName.includes('hispania') || rName.includes('britannia') || rName.includes('greece') || rName.includes('levant') || rName.includes('carthage')) {
            enslavementRisk = 0.08;
          }
        } else if (eraId === 'MEDIEVAL') {
          // Viking thralls, Mongol conquests, Barbary corsairs, Arab slave trade
          enslavementRisk = 0.04;
          if (rName.includes('viking') || rName.includes('rus') || rName.includes('england') || rName.includes('poland') || rName.includes('balkans') || rName.includes('mongol') || rName.includes('andalus') || rName.includes('caliphate')) {
            enslavementRisk = 0.07;
          }
        } else if (eraId === 'EARLY_MODERN') {
          // Transatlantic slave trade, Barbary captures, colonial indenture
          if (rName.includes('dahomey') || rName.includes('ashanti') || rName.includes('kongo') || rName.includes('west africa') || rName.includes('central africa')) {
            enslavementRisk = 0.28; // High risk during peak of transatlantic slave trade
          } else if (rName.includes('caribbean') || rName.includes('brazil') || rName.includes('north america') || rName.includes('viceroyalty')) {
            if (isMinority && (minText.includes('afro') || minText.includes('black') || minText.includes('indigenous') || minText.includes('tupi') || minText.includes('yoruba'))) {
              enslavementRisk = 0.35;
            } else {
              enslavementRisk = 0.02;
            }
          } else if (rName.includes('mediterranean') || rName.includes('spain') || rName.includes('italy') || rName.includes('ottoman') || rName.includes('balkans')) {
            // Barbary corsair captures / Ottoman devshirme
            enslavementRisk = 0.04;
          } else {
            enslavementRisk = 0.015;
          }
        } else if (eraId === 'MODERN') {
          // 20th century forced labor (Gulag, wartime forced labor) or bonded labor
          if (rName.includes('russia') || rName.includes('soviet')) {
            if (birthYear >= 1900 && birthYear <= 1945 && isMinority) enslavementRisk = 0.06;
          } else if (isMinority && (rName.includes('india') || rName.includes('africa'))) {
            enslavementRisk = 0.02;
          }
        }

        if (socialClass.toLowerCase().includes('patrician') || socialClass.toLowerCase().includes('aristocrat') || socialClass.toLowerCase().includes('upper')) {
          enslavementRisk *= 0.25;
        } else if (socialClass.toLowerCase().includes('peasant') || socialClass.toLowerCase().includes('plebeian') || socialClass.toLowerCase().includes('working') || socialClass.toLowerCase().includes('laborer')) {
          enslavementRisk *= 1.3;
        }

        if (Math.random() < Math.min(0.65, enslavementRisk)) {
          wasEnslavedLater = true;
          enslavedAge = randomInt(5, Math.min(age, 38));

          // 1. Transatlantic Slave Trade: Forced transoceanic migration from West / Central Africa to the Americas
          if (eraId === 'EARLY_MODERN' && (rName.includes('africa') || rName.includes('kongo') || rName.includes('dahomey') || rName.includes('ashanti') || rName.includes('bight') || rName.includes('senegambia') || rName.includes('guinea') || rName.includes('yoruba') || rName.includes('angola') || rName.includes('gold coast') || (isMinority && (minText.includes('afro') || minText.includes('black'))))) {
            isEmigrant = true;
            emigrationAge = enslavedAge;

            const transatlanticDests = [
              { name: "Colonial Brazil (Bahia / Salvador / Rio de Janeiro)", weight: 42, lat: -12.97, lng: -38.51 },
              { name: "Caribbean (Saint-Domingue / Haiti)", weight: 22, lat: 18.53, lng: -72.33 },
              { name: "Caribbean (Jamaica)", weight: 12, lat: 18.10, lng: -77.29 },
              { name: "Caribbean (Cuba / Spanish Antilles)", weight: 10, lat: 21.52, lng: -77.78 },
              { name: "Spanish South America (Viceroyalty of Peru / New Granada)", weight: 8, lat: -12.04, lng: -77.04 },
              { name: "North America (Virginia / Carolinas)", weight: 6, lat: 37.43, lng: -78.65 }
            ];
            const dest = pickWeighted(transatlanticDests);
            deathRegion = dest.name;
            deathLat = dest.lat;
            deathLng = dest.lng;

            enslavementDetails = `Captured in an interior slave raid and marched to the coast; forcibly transported across the Atlantic via the harrowing Middle Passage to ${deathRegion} into chattel plantation slavery`;
          }
          // 2. Mediterranean & Barbary Slave Trade: Captives transported to North Africa / Ottoman galleys
          else if (eraId === 'EARLY_MODERN' && (rName.includes('mediterranean') || rName.includes('spain') || rName.includes('italy') || rName.includes('england') || rName.includes('france') || rName.includes('balkans'))) {
            isEmigrant = true;
            emigrationAge = enslavedAge;
            const barbaryDests = [
              { name: "Barbary Coast (Algiers)", lat: 36.75, lng: 3.05 },
              { name: "Barbary Coast (Tripoli)", lat: 32.88, lng: 13.19 },
              { name: "Barbary Coast (Tunis)", lat: 36.80, lng: 10.18 },
              { name: "Ottoman Empire (Constantinople / Galley Servitude)", lat: 41.00, lng: 28.97 }
            ];
            const dest = pickRandomItem(barbaryDests);
            deathRegion = dest.name; deathLat = dest.lat; deathLng = dest.lng;
            enslavementDetails = `Captured at sea or in a coastal raid by Barbary corsairs and forcibly transported to ${deathRegion}, enduring grueling galley and domestic servitude`;
          }
          // 3. Classical Antiquity: Roman Conquest Captives marched to Italy
          else if (eraId === 'CLASSICAL' || eraId === 'BRONZE') {
            if (!rName.includes('rome') && !rName.includes('italy')) {
              isEmigrant = true;
              emigrationAge = enslavedAge;
              deathRegion = "Roman Italy (Rome / Campanian Latifundia)";
              deathLat = 41.90; deathLng = 12.49;
              enslavementDetails = `Captured as a prisoner of war during Roman military campaigns and marched across the empire in chains to ${deathRegion} as an enslaved captive (servus)`;
            } else {
              enslavementDetails = pickRandomItem([
                "Captured following a regional provincial revolt and sold on the block into Roman quarry and agricultural slave labor",
                "Sold into legal debt bondage (nexum) to work off insurmountable liabilities on a patrician estate"
              ]);
            }
          }
          // 4. Medieval Thrall & Steppe Trade
          else if (eraId === 'MEDIEVAL') {
            if (rName.includes('england') || rName.includes('ireland') || rName.includes('scotland') || rName.includes('france')) {
              isEmigrant = true;
              emigrationAge = enslavedAge;
              deathRegion = "Scandinavia (Viking settlement)";
              deathLat = 59.32; deathLng = 18.06;
              enslavementDetails = `Captured during a Viking coastal raid and forcibly transported across the sea to ${deathRegion} as an enslaved thrall`;
            } else {
              enslavementDetails = pickRandomItem([
                "Captured during a violent frontier raid and traded along medieval slave routes into forced servitude",
                "Seized during the sacking of your town and held in captive servitude on an aristocratic estate"
              ]);
            }
          } else {
            enslavementDetails = pickRandomItem([
              "Captured during a military raid and forced into involuntary servitude and manual labor",
              "Trapped in coercive debt bondage on an exploitative frontier estate"
            ]);
          }
        }
      }

      // 3d. Escape & Historical Emancipation Engine for Enslaved Souls
      let escapedSlavery = false;
      let escapeAge = null;
      let escapeMethod = null;

      const isEnslaved = wasEnslavedLater || socialClass.toLowerCase().includes('slave') || socialClass.toLowerCase().includes('enslaved');

      if (isEnslaved && age >= 12 && !wasExposed) {
        const minEscapeAge = wasEnslavedLater ? Math.min(age, (enslavedAge || 10) + randomInt(1, 4)) : randomInt(14, Math.min(age, 45));
        const birthY = birthYear;
        const deathY = birthYear + age;
        const rName = ((deathRegion || regionText) || '').toLowerCase();
        const eraId = selectedEra.id;

        let escapeChance = 0.08; // baseline daring escape / manumission chance

        // 1. Historical Emancipation & Abolition Milestones
        // Haitian Revolution (1791–1804)
        if ((rName.includes('haiti') || rName.includes('saint-domingue') || rName.includes('caribbean')) && birthY <= 1804 && deathY >= 1791) {
          escapeChance = 0.70;
          escapeAge = Math.max(minEscapeAge, Math.min(age, 1791 - birthY + randomInt(0, 5)));
          escapeMethod = "Fought in the victorious Haitian Revolution (1791–1804), defeating French colonial forces to secure sovereign freedom";
        }
        // British Slavery Abolition Act (1833-1838)
        else if ((rName.includes('jamaica') || rName.includes('barbados') || rName.includes('guyana') || rName.includes('caribbean') || rName.includes('cape colony')) && birthY <= 1838 && deathY >= 1834) {
          escapeChance = 0.85;
          escapeAge = Math.max(minEscapeAge, Math.min(age, 1834 - birthY + randomInt(0, 4)));
          escapeMethod = "Emancipated upon the enactment of the British Slavery Abolition Act (1833–1838), gaining full legal freedom";
        }
        // American Civil War & Emancipation Proclamation (1863-1865)
        else if ((rName.includes('north america') || rName.includes('united states') || rName.includes('thirteen colonies') || rName.includes('virginia') || rName.includes('carolina') || rName.includes('georgia')) && birthY <= 1865 && deathY >= 1863) {
          escapeChance = 0.85;
          escapeAge = Math.max(minEscapeAge, Math.min(age, 1863 - birthY + randomInt(0, 2)));
          escapeMethod = "Liberated following the Emancipation Proclamation (1863) and Union victory in the American Civil War, establishing a free life";
        }
        // Underground Railroad (1830-1860) in North America
        else if ((rName.includes('north america') || rName.includes('united states') || rName.includes('thirteen colonies')) && birthY >= 1790 && birthY <= 1845 && age >= 18) {
          escapeChance += 0.22;
          if (Math.random() < 0.45) {
            escapeMethod = "Made a daring nocturnal escape via the secret safehouse network of the Underground Railroad, securing freedom in the North / Canada";
          }
        }
        // Brazil Abolition / Lei Áurea (1888)
        else if (rName.includes('brazil') && birthY <= 1888 && deathY >= 1888) {
          escapeChance = 0.85;
          escapeAge = Math.max(minEscapeAge, Math.min(age, 1888 - birthY));
          escapeMethod = "Achieved universal legal emancipation with the signing of the Lei Áurea (Golden Law) in Brazil in 1888";
        }
        // Spanish Abolition in Cuba (1886) / Puerto Rico (1873)
        else if ((rName.includes('cuba') || rName.includes('puerto rico')) && birthY <= 1886 && deathY >= 1873) {
          escapeChance = 0.80;
          escapeAge = Math.max(minEscapeAge, Math.min(age, 1880 - birthY));
          escapeMethod = "Emancipated with the legal abolition of slavery in the Spanish Antilles in the 1870s–1880s";
        }
        // Classical Roman / Greek Manumission or Revolt
        else if (eraId === 'CLASSICAL' || eraId === 'BRONZE') {
          if (intelligence >= 70) escapeChance += 0.25;
          escapeMethod = pickRandomItem([
            "Purchased legal manumission (libertus) through personal savings (peculium) accumulated as a skilled urban artisan / clerk",
            "Granted formal manumission in their master's testamentary will in recognition of faithful service",
            "Escaped estate confinement during the chaos of civil war and assumed a free identity in a distant province"
          ]);
        }
        // Medieval / Barbary / Steppe
        else if (eraId === 'MEDIEVAL') {
          escapeMethod = pickRandomItem([
            "Ransomed from Barbary galley captivity by Mercedarian friars and returned across the Mediterranean",
            "Staged a daring nocturnal escape while docked at a trading harbor and melted into the free populace of a charter city",
            "Manumitted by decree after long loyal service to the estate"
          ]);
        }
        // Early Modern Maroons / Fugitives
        else if (eraId === 'EARLY_MODERN') {
          if (!escapeMethod) {
            escapeMethod = pickRandomItem([
              "Escaped into the dense mountain hinterlands to join a self-governing Maroon / Quilombo community of free self-emancipated people",
              "Slipped away on an outbound merchant vessel under forged seaman papers, securing a free life in a maritime port",
              "Accumulated wages from market days to legally purchase their certificate of manumission"
            ]);
          }
        }

        if (Math.random() < Math.min(0.90, escapeChance)) {
          escapedSlavery = true;
          if (!escapeAge) escapeAge = randomInt(minEscapeAge, Math.min(age, minEscapeAge + 10));
          if (!escapeMethod) {
            escapeMethod = "Daringly escaped bondage and established a hidden free life in a distant community";
          }
          socialClass = selectedEra.id === 'MODERN' ? 'Freed Citizen / Laborer' : (eraId === 'CLASSICAL' ? 'Freedman (Libertus) / Artisan' : 'Free Maroon / Tradesperson');
        }
      }

      // 9. Family & Marriage Math (Rolled early so cause of death can factor in extramarital affairs)
      let isMarried = false;
      let marriageAge = null;
      let hadAffair = false;
      let outOfWedlock = false;
      let hasUnmarriedPartnerChildren = false;

      if (age >= 16 && !wasExposed) {
        let marriageChance = selectedEra.id === 'MODERN' ? (birthYear >= 1975 ? 0.65 : 0.85) : 0.92;
        if (socialClass.includes('Slave')) marriageChance = 0.60;
        if (orientation === 'Asexual') marriageChance *= 0.3;
        if (orientation === 'Homosexual' && selectedEra.id !== 'MODERN') marriageChance *= 0.85;
        if (orientation === 'Homosexual' && selectedEra.id === 'MODERN') marriageChance *= 0.50;
        if (["Craniofacial anomaly", "Limb or digit malformation", "Intellectual disability", "Neurodivergent developmental condition", "Skeletal dysplasia or short stature condition"].includes(disabilityCategory)) {
          marriageChance *= 0.3;
        }

        if (Math.random() < marriageChance) {
          isMarried = true;
          if (selectedEra.id === 'MODERN') {
            // Modern era: later marriage and first birth ages for women and men
            const minAge = sex === 'Female' ? (birthYear >= 1970 ? 24 : 19) : (birthYear >= 1970 ? 26 : 21);
            const maxAge = sex === 'Female' ? 39 : 44;
            marriageAge = randomInt(minAge, Math.min(maxAge, age));
          } else {
            // Pre-modern: young marriage ages
            const minAge = sex === 'Female' ? 14 : 17;
            const maxAge = sex === 'Female' ? 24 : 30;
            marriageAge = randomInt(minAge, Math.min(maxAge, age));
          }
          if (Math.random() < 0.20) hadAffair = true;
        } else {
          if (Math.random() < 0.15) outOfWedlock = true;
        }
      }

      // 9a2. Interfaith Jewish-Christian Marriage Roll
      let isInterfaithMarriage = false;
      let interfaithSpouse = null;
      let interfaithDetails = null;

      if (isMarried) {
        const reg = (regionText || '').toLowerCase();
        const isWesternOrChristianMajority = selectedEra.id === 'MODERN' || reg.includes('europe') || reg.includes('america') || reg.includes('britain') || reg.includes('france') || reg.includes('germany') || reg.includes('spain') || reg.includes('italy') || reg.includes('russia') || reg.includes('poland') || reg.includes('byzantine');

        if (isJewish && isWesternOrChristianMajority) {
          const interfaithRate = selectedEra.id === 'MODERN' ? (birthYear >= 1960 ? 0.35 : (birthYear >= 1900 ? 0.14 : 0.06)) : 0.03;
          if (Math.random() < interfaithRate) {
            isInterfaithMarriage = true;
            interfaithSpouse = "Christian";
            if (selectedEra.id === 'MODERN') {
              interfaithDetails = "Married a Christian spouse. Together you navigated differing religious heritages, celebrating both Jewish and Christian traditions, and raised children in an accepting interfaith home.";
            } else if (selectedEra.id === 'EARLY_MODERN') {
              interfaithDetails = "Contracted a controversial interfaith marriage with a Christian partner, prompting community scrutiny, civil legal complexities, and a thoughtful blending of private and public faiths.";
            } else {
              interfaithDetails = "Entered into an interfaith union with a Christian spouse, which required formal conversion to Christianity to avoid harsh legal bans, creating painful estrangement from your ancestral community.";
            }
          }
        } else if (!isJewish && isWesternOrChristianMajority && selectedEra.id === 'MODERN') {
          const interfaithRate = birthYear >= 1950 ? 0.03 : 0.01;
          if (Math.random() < interfaithRate) {
            isInterfaithMarriage = true;
            interfaithSpouse = "Jewish";
            interfaithDetails = "Married a Jewish spouse. You embraced the rich cultural and holiday traditions of your spouse's family alongside your own background.";
          }
        }
      }

      let sameSexAffair = false;
      if (hadAffair) {
        if (orientation === 'Homosexual') {
          sameSexAffair = true;
        } else if (orientation === 'Bisexual') {
          sameSexAffair = Math.random() < 0.65;
        }
      }

      if (!isAlive) {
        causeOfDeath = determineExhaustiveCauseOfDeath(selectedEra, birthYear, age, sex, socialClass, { wasExposed, isHeartDefect, suicide, maternalRoll, hadAffair, orientation, actedOnBi, region: regionText });
      } else {
        // Living in 2026: calibrate fame description
        if (fame.includes("Properly Famous")) {
          fame = "Properly Famous (A recognized public figure / celebrated creator in contemporary society).";
        } else if (fame.includes("Mildly Famous")) {
          fame = "Mildly Famous (Known within your industry, local community, or region today).";
        } else if (fame.includes("Mildly Infamous")) {
          fame = "Mildly Infamous (Involved in a notable local controversy or publicized dispute).";
        } else {
          fame = "An ordinary contemporary citizen living your daily life today in the 21st century.";
        }
      }

      const totalSiblings = randomInt(0, birthYear > 1950 ? 3 : 6);
      let siblingsSurvived = 0;
      for (let i = 0; i < totalSiblings; i++) {
        if (Math.random() > (adjustedInfantMortality + adjustedChildMortality)) siblingsSurvived++;
      }

      const biologicalInfertility = Math.random() < 0.05;
      const partnerInfertility = !biologicalInfertility && isMarried && Math.random() < 0.04;
      const effectiveInfertility = biologicalInfertility || partnerInfertility;

      let childrenCount = 0;

      // Country-specific unmarried / cohabiting birth rates in the modern era
      let unmarriedChildbirthChance = 0.10;
      if (selectedEra.id === 'MODERN') {
        const cName = regionText || '';
        if (cName === 'France' || cName === 'United Kingdom' || cName === 'Germany' || cName.includes('Europe') || cName.includes('Scandinav')) {
          unmarriedChildbirthChance = birthYear >= 1970 ? 0.60 : 0.20;
        } else if (cName === 'Brazil' || cName === 'Mexico' || cName.includes('Latin') || cName.includes('Caribbean')) {
          unmarriedChildbirthChance = birthYear >= 1950 ? 0.65 : 0.35;
        } else if (cName === 'USA') {
          unmarriedChildbirthChance = birthYear >= 1970 ? 0.42 : 0.16;
        } else if (cName === 'Russia / Soviet Union') {
          unmarriedChildbirthChance = birthYear >= 1970 ? 0.30 : 0.12;
        } else if (cName.includes('Africa') || cName === 'Nigeria') {
          unmarriedChildbirthChance = 0.50;
        } else if (cName === 'Japan' || cName === 'China' || cName === 'India' || cName.includes('Asia') || cName.includes('Middle East')) {
          unmarriedChildbirthChance = 0.03;
        }
      }

      if (!effectiveInfertility && age > 18 && !wasExposed) {
        if (isMarried) {
          const reproductiveYears = Math.min(age, 45) - marriageAge;
          if (reproductiveYears > 0) {
            const divisor = selectedEra.id === 'MODERN' ? (birthYear >= 1970 ? 6 : 4) : 3;
            childrenCount = randomInt(1, Math.floor(reproductiveYears / divisor) + 1);
          }
        } else if (age >= 21) {
          // Unmarried individual: roll for children with a cohabiting partner or out of wedlock
          if (orientation === 'Homosexual') {
            // Homosexual unmarried individuals in pre-modern eras did not reproduce biologically with same-sex partners
            if (selectedEra.id === 'MODERN' && birthYear >= 1975 && Math.random() < 0.12) {
              hasUnmarriedPartnerChildren = true;
              childrenCount = 1; // modern donor / adoption
            } else {
              hasUnmarriedPartnerChildren = false;
              childrenCount = 0;
            }
          } else if (Math.random() < unmarriedChildbirthChance) {
            hasUnmarriedPartnerChildren = true;
            outOfWedlock = true;
            childrenCount = randomInt(1, selectedEra.id === 'MODERN' ? (birthYear >= 1975 ? 2 : 3) : 2);
          }
        }
      }

      // 3g. High Beauty Modeling Career Engine (Modern World, Beauty >= 90)
      let modelingCareer = null;

      if (selectedEra.id === 'MODERN' && birthYear >= 1890 && beauty >= 90 && age >= 16 && !wasExposed) {
        const isMale = sex === 'Male';
        const getsOffered = !isMale || (Math.random() < 0.33);

        if (getsOffered) {
          const pStr = (personality1 + ' ' + personality2).toLowerCase();
          const isAmbitiousOrSocial = pStr.includes('ambitious') || pStr.includes('creative') || pStr.includes('charismatic') || pStr.includes('bold') || pStr.includes('adventurous') || pStr.includes('proud') || pStr.includes('social') || pStr.includes('garrulous');
          const isIntrovertedOrModest = pStr.includes('introverted') || pStr.includes('reclusive') || pStr.includes('devout') || pStr.includes('modest') || pStr.includes('anxious') || pStr.includes('stoic');

          if (isAmbitiousOrSocial) {
            modelingCareer = {
              offered: true,
              accepted: true,
              success: isMale ? "Celebrated Runway & Editorial Male Model" : "High-Fashion Supermodel & Runway Icon",
              details: isMale
                ? "Scouted in your youth for striking facial structure and athletic physique; achieved renown in luxury fashion campaigns, runway shows, and magazine spreads."
                : "Discovered in your late teens for breathtaking, arresting beauty; became a celebrated fashion model and runway icon, featured in major international fashion houses and magazines."
            };
            if (!isRoyaltyOrHistoric && !socialClass.includes('Upper')) {
              socialClass = "High Fashion Model / Celebrity Elite";
              hasUpwardMobility = true;
              mobilityDetails = "Elevated from humble origins into international acclaim, luxury fashion campaigns, and affluent cultural circles through iconic modeling work.";
            }
          } else if (isIntrovertedOrModest) {
            modelingCareer = {
              offered: true,
              accepted: false,
              details: "Scouted by prestigious fashion agencies in your youth due to extraordinary physical beauty, but chose to decline the offers, prioritizing personal privacy, family, and a grounded life away from the commercial lens."
            };
          } else {
            modelingCareer = {
              offered: true,
              accepted: true,
              success: "Commercial & Catalog Print Model",
              details: "Worked steadily for several years in your twenties as a successful commercial and catalog model, earning good income before transitioning into other business and family pursuits."
            };
          }
        }
      }

      // 9b. Lifetime Voluntary Emigration / Migration (Only if not already forcibly migrated via slavery or expulsion)
      if (!isEmigrant && age >= 16 && !wasExposed && !antisemitismExperience?.details?.includes('emigrated') && !wasEnslavedLater) {
        const emigrateChance = selectedEra.id === 'MODERN' ? 0.16 : (selectedEra.id === 'EARLY_MODERN' ? 0.09 : 0.04);
        if (Math.random() < emigrateChance) {
          isEmigrant = true;
          emigrationAge = randomInt(16, Math.min(age, 45));

          if (selectedEra.id === 'MODERN') {
            const dest = getWeightedEmigrationDestination(regionText, selectedEra.id);
            deathRegion = dest.name;
            deathLat = dest.lat;
            deathLng = dest.lng;
          } else {
            const destPool = selectedEra.regions.filter(r => r.text !== regionText);
            const dest = destPool.length > 0 ? pickRandomItem(destPool) : selectedEra.regions[0];
            deathRegion = dest.text;
            deathLat = dest.lat;
            deathLng = dest.lng;
          }
        }
      }

      // 9c. Violent Encounter & Maiming / Scarring Engine (Occurs prior to death age)
      let isMaimed = false;
      let maimedAge = null;
      let maimedSeverity = null;
      let maimedDetails = null;
      let maimedContributedToDeath = false;

      if (age >= 10 && !wasExposed) {
        const traumaChance = selectedEra.id === 'MODERN' ? 0.015 : (selectedEra.id === 'PALEOLITHIC' ? 0.06 : 0.035);
        if (Math.random() < traumaChance) {
          isMaimed = true;
          maimedAge = randomInt(6, Math.min(age - 2, 55));

          const severities = [
            { level: "mild scarring", desc: "prominent facial or bodily scars" },
            { level: "moderate disfigurement", desc: "a permanently misaligned limb bone resulting in a limp" },
            { level: "severe impairment", desc: "the loss of an eye and chronic mobility impairment" }
          ];
          const pickedSeverity = pickRandomItem(severities);
          maimedSeverity = pickedSeverity.level;

          const eventScenarios = [
            "a brutal hand-to-hand skirmish where comrades were slain",
            "a violent tavern brawl or roadside assault with a blade",
            "a terrifying wild predator attack during a hunt",
            "a catastrophic domestic fire with extensive burns",
            "a runaway draft animal trampling accident",
            "a crushing industrial gear collapse"
          ];
          maimedDetails = `${pickRandomItem(eventScenarios)} (left with ${pickedSeverity.desc})`;
          maimedContributedToDeath = Math.random() < 0.35 && age > 40;
        }
      }

      const rawLifeData = {
        eraName: selectedEra.name, birthYear,
        isModernEra: selectedEra.id === 'MODERN',
        region: regionText, lang, sex, socialClass, ethnicity,
        isMinority, minorityGroupHint, isImmigrant, isUrban,
        isEmigrant, emigrationAge, deathRegion, deathLat, deathLng,
        isMaimed, maimedAge, maimedSeverity, maimedDetails, maimedContributedToDeath,
        isRoyaltyOrHistoric, hasUpwardMobility, birthSocialClass, mobilityDetails,
        wasEnslavedLater, enslavedAge, enslavementDetails,
        escapedSlavery, escapeAge, escapeMethod,
        isJewish, antisemitismExperience, minorityPersecution,
        isInterfaithMarriage, interfaithSpouse, interfaithDetails,
        modelingCareer,
        disabilityCategory, disabilityExamples, wasExposed,
        orientation, actedOnBi, isOpenlyGay, isInTheCloset,
        isTransgender, transgenderDetails,
        fame, hobbyData, personality: [personality1, personality2],
        motherDied: Math.random() < (selectedEra.maternalMortality * classMultiplier),
        totalSiblings, siblingsSurvived, isMarried, marriageAge, hadAffair, sameSexAffair, outOfWedlock, hasUnmarriedPartnerChildren, effectiveInfertility, childrenCount,
        age, isAlive, causeOfDeath, suicide, survivedCancer, cancerAge, regionalExpectancy: baselineAdultLifespan,
        intelligence, beauty, isPsychopath, schizophrenia: Math.random() < 0.01, depression: Math.random() < 0.06
      };

      // 10. GENERATE & SET DATA
      let generatedData = null;
      try {
        generatedData = await generateNarrativeWithAI(rawLifeData);
      } catch (err) {
        console.error("AI Generation Error:", err);
        if (import.meta.env.DEV) {
          setGenerationError(`[DEV ERROR] Gemini API Generation Failed:\n${err.message || err}\n\nRegion: ${rawLifeData.region} (${formatYear(rawLifeData.birthYear)})\nClass: ${rawLifeData.socialClass}`);
        } else {
          setGenerationError("The Akashic connection was interrupted. Please tap 'Incarnate' to weave your thread of fate again.");
        }
        setIsGenerating(false);
        return;
      }

      const lifeDataWithEncounters = {
        ...rawLifeData,
        historicalEncounters: generatedData?.historicalEncounters || []
      };

      const earnedBadges = evaluateBadges(lifeDataWithEncounters);
      const newlyEarned = earnedBadges.filter(b => !unlockedBadges.includes(b));
      if (newlyEarned.length > 0) {
        const newBadgeObjects = newlyEarned.map(id => BADGE_DEFINITIONS.find(b => b.id === id)).filter(Boolean);
        setUnlockedBadges(prev => {
          const next = [...prev, ...newlyEarned];
          localStorage.setItem('incarnationBadges', JSON.stringify(next));
          return next;
        });
        setBadgeModalQueue(newBadgeObjects);
        setTimeout(() => playUiSound('badge'), 600);
      }

      const newLife = {
        id: Date.now(),
        birthYear, region: regionText, lat, lng,
        specificLocation: generatedData?.specificLocation || rawLifeData.region,
        deathRegion: rawLifeData.deathRegion || null,
        deathLat: rawLifeData.deathLat || null,
        deathLng: rawLifeData.deathLng || null,
        deathSpecificLocation: generatedData?.deathSpecificLocation || null,
        isEmigrant: rawLifeData.isEmigrant || false,
        emigrationAge: rawLifeData.emigrationAge || null,
        isMaimed: rawLifeData.isMaimed || false,
        maimedAge: rawLifeData.maimedAge || null,
        maimedSeverity: rawLifeData.maimedSeverity || null,
        maimedDetails: rawLifeData.maimedDetails || null,
        isRoyaltyOrHistoric: rawLifeData.isRoyaltyOrHistoric || false,
        wasEnslavedLater: rawLifeData.wasEnslavedLater || false,
        enslavedAge: rawLifeData.enslavedAge || null,
        enslavementDetails: rawLifeData.enslavementDetails || null,
        escapedSlavery: rawLifeData.escapedSlavery || false,
        escapeAge: rawLifeData.escapeAge || null,
        escapeMethod: rawLifeData.escapeMethod || null,
        isJewish: rawLifeData.isJewish || false,
        antisemitismExperience: rawLifeData.antisemitismExperience || null,
        minorityPersecution: rawLifeData.minorityPersecution || null,
        isInterfaithMarriage: rawLifeData.isInterfaithMarriage || false,
        interfaithSpouse: rawLifeData.interfaithSpouse || null,
        interfaithDetails: rawLifeData.interfaithDetails || null,
        modelingCareer: rawLifeData.modelingCareer || null,
        hasUpwardMobility: rawLifeData.hasUpwardMobility || false,
        birthSocialClass: rawLifeData.birthSocialClass || socialClass,
        mobilityDetails: rawLifeData.mobilityDetails || null,
        orientation: rawLifeData.orientation,
        sameSexAffair: rawLifeData.sameSexAffair || false,
        hasUnmarriedPartnerChildren: rawLifeData.hasUnmarriedPartnerChildren || false,
        isOpenlyGay: rawLifeData.isOpenlyGay || false,
        isInTheCloset: rawLifeData.isInTheCloset || false,
        isPsychopath: rawLifeData.isPsychopath || false,
        sex, socialClass, age, isAlive, ethnicity,
        profession: generatedData?.profession || (rawLifeData.age < 12 ? 'None (Childhood)' : rawLifeData.socialClass),
        isTransgender, transgenderDetails,
        badges: earnedBadges,
        historicalEncounters: generatedData?.historicalEncounters || [],
        historicalEventsLivedThrough: generatedData?.historicalEventsLivedThrough || [],
        narrative: Array.isArray(generatedData?.narrative)
          ? generatedData.narrative
          : (typeof generatedData?.narrative === 'string' ? generatedData.narrative.split('\n\n').filter(Boolean) : ["An ancient life recorded in the threads of time."]),
        timeline: Array.isArray(generatedData?.timeline) ? generatedData.timeline : [],
        wikiLinks: Array.isArray(generatedData?.wikiLinks) ? generatedData.wikiLinks : [],
        eraName: selectedEra.name
      };

      setCurrentLife(newLife);
      setHistory(prev => [newLife, ...prev]);
      setStats(prev => ({ totalLived: prev.totalLived + 1, highestAge: Math.max(prev.highestAge, age) }));
    } catch (criticalErr) {
      console.error("Critical simulation error:", criticalErr);
      setGenerationError(import.meta.env.DEV ? `[DEV ERROR] Simulation error:\n${criticalErr.stack || criticalErr.message}` : "An unexpected error occurred. Please tap 'Incarnate' again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] bg-cosmic-radial text-slate-200 font-serif p-4 md:p-8 flex flex-col items-center selection:bg-indigo-900/50">

      {/* Badge Unlock Celebration Pop-up */}
      {badgeModalQueue.length > 0 && badgeModalQueue[0] && (
        <div
          onClick={() => { playUiSound('click'); setBadgeModalQueue(prev => prev.slice(1)); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/95 border-2 border-amber-500/60 rounded-3xl p-8 shadow-[0_0_60px_rgba(245,158,11,0.35)] text-center animate-fade-in-scale cursor-default"
          >

            {/* Close button */}
            <button
              onClick={() => { playUiSound('click'); setBadgeModalQueue([]); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 p-2 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon Header */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400/80 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce">
                  {React.createElement(badgeModalQueue[0].icon, { className: "w-10 h-10 text-amber-300" })}
                </div>
                <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-spin" />
              </div>
            </div>

            <span className="text-[11px] font-sans uppercase tracking-widest font-extrabold text-amber-400 bg-amber-950/70 border border-amber-500/40 px-3.5 py-1 rounded-full inline-block mb-3">
              Badge Unlocked
            </span>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 mb-2">
              {badgeModalQueue[0].name}
            </h2>

            <p className="text-slate-300 font-sans text-sm md:text-base leading-relaxed mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              {badgeModalQueue[0].description}
            </p>

            {badgeModalQueue.length > 1 && (
              <p className="text-xs text-indigo-300 mb-4 font-sans font-medium">
                +{badgeModalQueue.length - 1} more badge{badgeModalQueue.length > 2 ? 's' : ''} unlocked!
              </p>
            )}

            <button
              onClick={() => {
                playUiSound('click');
                setBadgeModalQueue(prev => prev.slice(1));
              }}
              className="w-full py-3.5 px-6 font-sans font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform active:scale-95 cursor-pointer"
            >
              {badgeModalQueue.length > 1 ? "Next Badge →" : "Claim Legacy"}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-3xl w-full text-center mb-8 space-y-4 pt-4">
        <div className="flex justify-center mb-4 relative">
          <Sparkles className="w-6 h-6 text-indigo-400 absolute -top-2 -right-4 animate-pulse" />
          <BookOpen className="w-12 h-12 text-indigo-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-indigo-50 drop-shadow-sm">
          The Thread of Fate
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto font-sans text-sm md:text-base leading-relaxed">
          The math determines the stark demographic probabilities of your birth. An AI neural network dreams the contextual reality of your life.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <button
            onClick={simulateLife}
            disabled={isGenerating}
            className={`group relative inline-flex items-center justify-center px-9 py-4 font-sans font-semibold text-white transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-950 shadow-[0_0_25px_rgba(99,102,241,0.4)] ${isGenerating
              ? 'bg-indigo-700/80 cursor-wait'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] active:scale-[0.98] cursor-pointer'
              }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin text-indigo-200" />
                <span className="tracking-wide text-base">Weaving Timeline...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-700 text-indigo-200" />
                <span className="tracking-wide text-base">Incarnate</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

        {/* Main Display: Timeline & Narrative */}
        <section className="lg:col-span-2 space-y-6" aria-label="Life Chronicle">
          {generationError && (
            <div className="p-6 bg-red-950/80 border-2 border-red-500/80 rounded-2xl text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-red-300 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{import.meta.env.DEV ? '[DEV ERROR] Gemini AI Generation Failed' : 'Akashic Connection Issue'}</span>
              </div>
              <p className="font-mono text-xs text-red-200 mb-4 whitespace-pre-wrap leading-relaxed">{generationError}</p>
              {import.meta.env.DEV && (
                <p className="text-[11px] text-slate-400 mb-4">
                  Procedural fallback generator has been disabled. Inspect your browser console or network tab for detailed payload/response diagnostics.
                </p>
              )}
              <button
                onClick={simulateLife}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-red-800 hover:bg-red-700 active:scale-95 text-white font-sans text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Retry Incarnation
              </button>
            </div>
          )}

          {isGenerating ? (
            <div className="h-96 flex flex-col items-center justify-center border border-indigo-500/20 bg-indigo-950/20 backdrop-blur-md rounded-2xl text-indigo-300 shadow-2xl p-8 text-center animate-pulse">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin"></div>
                <Sparkles className="w-6 h-6 text-indigo-300 absolute inset-0 m-auto animate-ping opacity-75" />
              </div>
              <p className="font-sans text-sm font-semibold tracking-widest uppercase text-indigo-200">Consulting the Akashic Records...</p>
              <p className="font-sans text-xs text-slate-400 mt-2 max-w-sm">Synthesizing historical demographic data, personal chronology, and life story...</p>
            </div>
          ) : currentLife ? (
            <article className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-md animate-fade-in-scale">

              {/* Profile Card Header */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8 font-sans">
                <div className="bg-slate-800/40 hover:bg-slate-800/60 transition-colors p-4 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                  <Clock className="w-5 h-5 text-indigo-400 mb-2" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Era</span>
                  <span className="text-sm font-semibold text-slate-200 mt-1">{currentLife.eraName}</span>
                </div>
                <div className="bg-slate-800/40 hover:bg-slate-800/60 transition-colors p-4 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                  <MapPin className="w-5 h-5 text-sky-400 mb-2" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Location</span>
                  <span className="text-sm font-semibold text-slate-200 mt-1 text-center leading-tight">
                    {formatFullLocation(currentLife.specificLocation, currentLife.region)}
                  </span>
                </div>
                <div className="bg-slate-800/40 hover:bg-slate-800/60 transition-colors p-4 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                  <User className="w-5 h-5 text-amber-400 mb-2" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Ethnicity</span>
                  <span className="text-xs font-semibold text-slate-200 mt-1 text-center leading-tight">
                    {currentLife.ethnicity || 'Native Lineage'}
                  </span>
                </div>
                <div className="bg-slate-800/40 hover:bg-slate-800/60 transition-colors p-4 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                  <Star className="w-5 h-5 text-purple-400 mb-2" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Station</span>
                  <span className="text-xs font-semibold text-slate-200 mt-1 text-center leading-tight">{currentLife.socialClass}</span>
                </div>
                <div className="bg-slate-800/40 hover:bg-slate-800/60 transition-colors p-4 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                  <Briefcase className="w-5 h-5 text-teal-400 mb-2" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Vocation</span>
                  <span className="text-xs font-semibold text-slate-200 mt-1 text-center leading-tight">{currentLife.profession || 'Laborer'}</span>
                </div>
                <div className="bg-slate-800/40 hover:bg-slate-800/60 transition-colors p-4 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                  {currentLife.isAlive ? <Heart className="w-5 h-5 text-emerald-400 mb-2 animate-pulse" /> : <Skull className="w-5 h-5 text-rose-400/80 mb-2" />}
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Lifespan</span>
                  <span className="text-sm font-semibold text-slate-200 mt-1">{currentLife.age} Years</span>
                </div>
              </div>

              {/* World Map — Birth & Migration Location */}
              {currentLife.lat != null && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      {currentLife.isEmigrant ? 'Journey of Fate • Migration & Settlement' : 'Birth Location'}
                    </span>
                  </div>
                  <WorldMap
                    lat={currentLife.lat}
                    lng={currentLife.lng}
                    locationLabel={formatFullLocation(currentLife.specificLocation, currentLife.region)}
                    deathLat={currentLife.deathLat}
                    deathLng={currentLife.deathLng}
                    deathLocationLabel={formatFullLocation(currentLife.deathSpecificLocation, currentLife.deathRegion)}
                    isEmigrant={currentLife.isEmigrant}
                  />
                </div>
              )}

              {/* Graphical Timeline */}
              {currentLife.timeline && currentLife.timeline.length > 0 && (
                <section className="mb-8 p-6 bg-slate-950/70 rounded-xl border border-slate-800/80">
                  <h3 className="text-xs font-sans font-bold text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    Chronology of Events
                  </h3>
                  <div className="relative border-l-2 border-indigo-900/60 ml-3 space-y-6">
                    {currentLife.timeline.map((item, idx) => {
                      let yearDisplay = (item.year || '').trim();
                      let eventDisplay = (item.event || '').trim();

                      // Defensive recovery: if the AI accidentally embedded narrative in the year field
                      if (!eventDisplay && yearDisplay.length > 10) {
                        const match = yearDisplay.match(/^(\d+\s*(?:BCE|CE|BC|AD)?)\s*[:\-—,]?\s*(.*)$/i);
                        if (match) {
                          yearDisplay = match[1].trim();
                          eventDisplay = match[2].trim();
                        }
                      }

                      return (
                        <div key={idx} className="relative pl-6 group">
                          <div className="absolute w-3.5 h-3.5 bg-indigo-500 rounded-full -left-[8px] top-1 shadow-[0_0_12px_rgba(99,102,241,0.9)] border-2 border-slate-950 group-hover:scale-125 transition-transform"></div>
                          <span className="font-mono text-indigo-300 text-sm font-bold block mb-1">
                            {yearDisplay || `Phase ${idx + 1}`}
                          </span>
                          <p className="text-slate-300 text-sm font-sans leading-relaxed">
                            {eventDisplay || "Major milestone recorded in the chronicler's ledger."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Historical Figure Encounters (Brush with Greatness) */}
              {currentLife.historicalEncounters && currentLife.historicalEncounters.length > 0 && (
                <section className="mb-8 p-5 bg-gradient-to-r from-amber-950/40 via-slate-900/70 to-amber-950/30 rounded-xl border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-fade-in">
                  <h3 className="text-xs font-sans font-bold text-amber-300 mb-3.5 uppercase tracking-widest flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Brush with Greatness • Historical Encounter
                  </h3>
                  <div className="space-y-3">
                    {currentLife.historicalEncounters.map((enc, idx) => (
                      <div key={idx} className="bg-slate-900/70 border border-amber-500/25 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-amber-200 font-bold text-sm flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-400" />
                            {enc.figure}
                          </h4>
                          <span className="font-mono text-amber-400/90 text-xs px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">{enc.year}</span>
                        </div>
                        <p className="text-slate-300 text-xs font-sans leading-relaxed">
                          {enc.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Narrative Story */}
              <section className="space-y-6 text-[1.15rem] md:text-[1.2rem] leading-relaxed text-slate-200" aria-label="Life Narrative">
                {(Array.isArray(currentLife?.narrative) ? currentLife.narrative : [currentLife?.narrative || '']).filter(Boolean).map((p, idx) => (
                  <p key={idx} className={idx === 0 ? "first-letter:text-5xl md:first-letter:text-6xl first-letter:font-bold first-letter:text-indigo-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none" : ""}>
                    {typeof p === 'string' ? p : JSON.stringify(p)}
                  </p>
                ))}
              </section>

              {/* Share / Copy Chronicle Action */}
              <div className="flex justify-end pt-6 mt-8 border-t border-slate-800/80">
                <button
                  onClick={handleShareStory}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 hover:border-indigo-400 text-indigo-200 hover:text-white rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] active:scale-95"
                  title="Copy formatted life story to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Chronicle Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-indigo-400" />
                      <span>Share Chronicle</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500 bg-slate-900/30 backdrop-blur-sm p-8 text-center">
              <ScrollText className="w-12 h-12 mb-4 opacity-40 text-indigo-300" />
              <h2 className="font-sans text-base font-medium text-slate-400 mb-1">Awaiting a Soul to Chronicle</h2>
              <p className="font-sans text-xs text-slate-500 max-w-sm">Press the "Incarnate" button above to simulate a new lifetime across human history.</p>
            </div>
          )}
        </section>

        {/* Sidebar: Historical Context & History */}
        <aside className="space-y-6 font-sans">

          {/* Badges Section */}
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg animate-fade-in-scale">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><Medal className="w-4 h-4 text-amber-400" /> Badges</span>
              <span className="text-slate-400 font-mono text-xs">{unlockedBadges.length} / {BADGE_DEFINITIONS.length} Unlocked</span>
            </h3>

            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {BADGE_DEFINITIONS.map(badge => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                const Icon = badge.icon;
                const isSelected = hoveredBadge?.id === badge.id;

                return (
                  <div
                    key={badge.id}
                    onMouseEnter={() => setHoveredBadge(badge)}
                    onMouseLeave={() => setHoveredBadge(null)}
                    onClick={() => { playUiSound('click'); setHoveredBadge(badge); }}
                    className={`relative aspect-square rounded-xl border flex items-center justify-center transition-all cursor-pointer group ${isUnlocked
                      ? `${badge.colorClass} shadow-sm hover:scale-105 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]`
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-600 opacity-40 hover:opacity-80 hover:border-slate-700'
                      } ${isSelected ? 'ring-2 ring-indigo-400 scale-105 opacity-100' : ''}`}
                  >
                    <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isUnlocked ? '' : 'text-slate-600'}`} />
                    {!isUnlocked && (
                      <Lock className="w-2.5 h-2.5 text-slate-500 absolute bottom-1 right-1" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rich Hover/Selection Details Card */}
            <div className="min-h-[76px] p-3.5 bg-slate-800/40 border border-slate-700/40 rounded-xl transition-all font-sans">
              {hoveredBadge ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block bg-amber-400"></span>
                      {hoveredBadge.name}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${unlockedBadges.includes(hoveredBadge.id)
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                      {unlockedBadges.includes(hoveredBadge.id) ? '✓ Unlocked' : '🔒 Locked'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {hoveredBadge.description}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs text-center italic">
                  Hover over or tap any badge to inspect details
                </div>
              )}
            </div>
          </section>

          {/* Historical Events Witnessed */}
          {currentLife && currentLife.historicalEventsLivedThrough && currentLife.historicalEventsLivedThrough.length > 0 && (
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg animate-fade-in-scale">
              <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-400" />
                Historical Era Milestones
              </h3>
              <div className="space-y-3">
                {currentLife.historicalEventsLivedThrough.map((evt, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-800/40 border border-slate-700/40 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-indigo-200 font-semibold text-xs">{evt.event}</h4>
                      <span className="font-mono text-[11px] text-slate-400">{evt.year}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{evt.impact}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentLife && currentLife.wikiLinks && currentLife.wikiLinks.length > 0 && (
            <section className="bg-slate-900/80 border border-indigo-900/40 rounded-2xl p-6 backdrop-blur-md shadow-lg animate-fade-in-scale">
              <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-400" />
                Historical Context
              </h3>
              <div className="space-y-3">
                {currentLife.wikiLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playUiSound('click')}
                    className="block p-3.5 bg-slate-800/40 border border-slate-700/40 rounded-xl hover:bg-slate-800 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all group"
                  >
                    <h4 className="text-indigo-300 font-semibold text-sm group-hover:text-indigo-200 mb-1 flex items-center justify-between">
                      <span>{link.title}</span>
                      <span className="text-xs text-slate-500 group-hover:text-indigo-400">↗</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-snug">{link.description}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Statistics Card */}
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-indigo-400" />
              Soul Statistics
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Lifetimes Lived</span>
                <span className="font-mono text-indigo-300 font-bold text-lg">{stats.totalLived}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Longest Journey</span>
                <span className="font-mono text-indigo-300 font-bold text-lg">{stats.highestAge} <span className="text-xs text-slate-500 font-normal">yrs</span></span>
              </div>
            </div>
          </section>

          {/* Past Incarnations History */}
          <section className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 max-h-[420px] overflow-y-auto backdrop-blur-md shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2 sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
              <ScrollText className="w-4 h-4 text-indigo-400" />
              Past Incarnations
            </h3>

            {history.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-2">The tapestry is blank.</p>
            ) : (
              <div className="space-y-3">
                {history.map((life) => {
                  const isCurrent = currentLife && currentLife.id === life.id;
                  return (
                    <div
                      key={life.id}
                      onClick={() => {
                        playUiSound('click');
                        setCurrentLife(life);
                      }}
                      title="Click to view this soul's story"
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${isCurrent
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-800/40 border-slate-700/30 hover:border-indigo-500/40 hover:bg-slate-800/80'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-slate-200 text-sm font-sans">{formatYear(life.birthYear)}</span>
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold ${life.isAlive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                          {life.age} YRS
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium">
                        {life.sex} • {life.socialClass}
                      </p>
                      <p className="text-slate-400 mt-1 truncate text-[11px]">
                        {formatFullLocation(life.specificLocation, life.region)} ({life.eraName})
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </aside>

      </main>
      <MusicPlayer />
    </div>
  );
}
