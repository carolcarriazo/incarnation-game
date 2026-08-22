import React, { useState } from 'react';
import {
  RefreshCw, ScrollText, Skull, Heart, Star, Clock, Globe2,
  Sparkles, BookOpen, Loader2, Link as LinkIcon, Calendar, MapPin, Medal,
  X, Lock, Crown, Landmark, Users, Share2, Check
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
    return "Perished in the raging inferno of the Great Fire of Rome under Emperor Nero";
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
    return "Massacred during the catastrophic Mongol siege and sack of Baghdad by Hulagu Khan";
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
    return "Perished amidst the devastating warfare and starvation of the Taiping Rebellion";
  }

  // Red Terror / Russian Civil War (1918-1922 CE)
  if ((regLower.includes('russia') || regLower.includes('soviet')) && (deathYear >= 1918 && deathYear <= 1922)) {
    if (isUpper) return "Executed by the Bolshevik Cheka as a bourgeois class enemy during the Red Terror";
    return "Killed during the brutal clashes and famine of the Russian Civil War";
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
    return pickRandomItem([
      "sudden infant fever of unknown origin",
      "puerperal or neonatal infection",
      "congenital respiratory failure",
      "gastrointestinal infection (infantile dysentery/diarrhea)",
      "neonatal tetanus ('seven-day sickness')",
      "infantile wasting / failure to thrive",
      "acute bronchopneumonia in winter",
      "congenital biliary atresia"
    ]);
  }
  if (age < 15) {
    if (conditions.isHeartDefect) return "Sudden cardiac failure resulting from untreated congenital heart defect";
    const childRoll = Math.random();
    // 90% of early childhood deaths are infectious illness, respiratory, waterborne, or epidemics
    if (childRoll < 0.90) {
      if (era.id === 'MODERN' && deathYear > 1950) {
        return pickRandomItem([
          "acute lymphoblastic leukemia (childhood cancer)",
          "severe viral myocarditis",
          "bacterial meningitis (meningococcal infection)",
          "congenital metabolic crisis",
          "severe acute asthma exacerbation",
          "fulminant peritonitis from a ruptured appendix"
        ]);
      }
      return pickRandomItem([
        "acute dysentery / waterborne gastrointestinal infection",
        "pulmonary infection / severe lobar pneumonia",
        "smallpox epidemic with fulminant pustular fever",
        "scarlet fever with severe streptococcal complications",
        "measles complicated by secondary bacterial bronchopneumonia or encephalitis",
        "diphtheria ('the strangling angel') causing severe airway obstruction",
        "whooping cough (pertussis) with acute respiratory exhaustion",
        "epidemic typhus fever transmitted by lice in winter quarters",
        "severe childhood cholera outbreak with rapid dehydration",
        "tuberculous meningitis (the white plague in youth)",
        "summer diarrheal disease / cholera infantum",
        "malaria (tertian ague) causing severe anemia and high-fever convulsion",
        "acute tonsillitis leading to quinsy and systemic septicemia",
        "severe nutritional deficiency and scurvy during a harsh winter famine",
        "severe enteric fever (typhoid) from contaminated drinking water",
        "acute infantile convulsions brought on by high febrile illness"
      ]);
    } else if (childRoll < 0.97) {
      // Accidents / Trauma (very rare compared to disease; animal kicks are just one of many rare accidents)
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
        "fatal asphyxiation / smothering during winter sleep in cramped, unventilated quarters",
        "accidental kick from a spooked draft animal in the barn"
      ]);
    } else {
      // Wartime / Famine / Extreme Weather
      return pickRandomItem([
        "starvation and acute exposure during a regional wartime siege or localized crop famine",
        "civilian fatality during a regional military raid or settlement sacking",
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
    if (age >= 75) return pickRandomItem(["bacterial pneumonia (the old person's friend)", "congestive heart failure", "massive ischemic cerebral infarction (ischemic stroke)", "complications following a severe fall with a fractured femoral neck", "advanced Alzheimer's disease / neurodegenerative decline"]);

    const modernRoll = Math.random();
    if (age >= 55) {
      if (modernRoll < 0.85) {
        if (isFemale) {
          return pickRandomItem([
            "metastatic invasive ductal breast carcinoma",
            "advanced ovarian adenocarcinoma",
            "metastatic colorectal adenocarcinoma",
            "acute transmural myocardial infarction (coronary thrombosis)",
            "massive ischemic cerebral stroke",
            "severe congestive cardiomyopathy",
            "bronchogenic lung adenocarcinoma",
            "advanced pancreatic adenocarcinoma"
          ]);
        }
        return pickRandomItem([
          "metastatic bronchogenic lung cancer",
          "pancreatic adenocarcinoma",
          "metastatic colorectal adenocarcinoma",
          "metastatic prostate carcinoma",
          "advanced gastric carcinoma",
          "acute massive ischemic stroke",
          "acute transmural myocardial infarction (fatal coronary thrombosis)",
          "severe congestive cardiomyopathy"
        ]);
      }
      return pickRandomItem([
        "fatal motor vehicle collision",
        "acute respiratory distress syndrome (ARDS)",
        "postoperative acute pulmonary embolism",
        "complications of poorly controlled type 2 diabetes mellitus"
      ]);
    } else {
      // Young adults / early middle age (15 - 54)
      // HIV/AIDS Epidemic (1980 - 2005): Peak Era of HIV/AIDS Crisis for gay/bisexual men before widely available HAART
      if (!isFemale && (conditions.orientation === 'Homosexual' || (conditions.orientation === 'Bisexual' && conditions.actedOnBi)) && deathYear >= 1980 && deathYear <= 2005 && age >= 20) {
        if (Math.random() < 0.60) {
          return pickRandomItem([
            "complications of HIV/AIDS (fulminant Pneumocystis carinii pneumonia during the peak of the AIDS epidemic)",
            "AIDS-related Kaposi's sarcoma and systemic opportunistic infections during the height of the AIDS crisis",
            "severe immunosuppression and wasting syndrome from HIV/AIDS in the pre-HAART era",
            "cryptococcal meningitis and systemic collapse secondary to advanced HIV/AIDS"
          ]);
        }
      }

      if (!isFemale && ((deathYear >= 1914 && deathYear <= 1918) || (deathYear >= 1939 && deathYear <= 1945))) {
        return pickRandomItem(["fatal artillery shrapnel wound on the front lines", "combat gunshot wound sustained in battle"]);
      }
      if (deathYear >= 1918 && deathYear <= 1920 && Math.random() < 0.35) {
        return "fulminant Spanish influenza with acute bilateral secondary bacterial bronchopneumonia";
      }

      if (modernRoll < 0.40) {
        return pickRandomItem([
          "acute massive pulmonary embolism (sudden fatal deep-vein thrombosis clot traveling to the lungs)",
          "sudden fatal cardiac arrest secondary to undiagnosed hypertrophic cardiomyopathy / cardiac arrhythmia",
          "ruptured cerebral berry aneurysm (fatal spontaneous subarachnoid hemorrhage)",
          "acute bacterial endocarditis stemming from unrecognized childhood rheumatic fever"
        ]);
      } else if (modernRoll < 0.70) {
        if (isFemale) {
          return pickRandomItem([
            "metastatic breast carcinoma",
            "invasive cervical cancer",
            "acute peritonitis secondary to a ruptured appendix",
            "fulminant cavitary pulmonary tuberculosis with massive hemoptysis",
            "acute myeloid leukemia",
            "systemic lupus erythematosus with severe renal failure"
          ]);
        }
        return pickRandomItem([
          "acute peritonitis secondary to a ruptured appendix",
          "fulminant cavitary pulmonary tuberculosis with massive hemoptysis",
          "acute myeloid leukemia",
          "advanced gastric carcinoma",
          "severe acute hemorrhagic pancreatitis"
        ]);
      } else if (modernRoll < 0.88) {
        if (isWorkingClass && !isFemale) return "industrial machinery entanglement / crushing workplace trauma";
        return pickRandomItem([
          "fatal motor vehicle collision",
          "accidental drowning during a recreational excursion",
          "severe dwelling fire / fatal smoke inhalation and thermal burns"
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
          "civilian casualty during wartime aerial bombardment",
          "fatal structural collapse following a severe regional earthquake"
        ]);
      }
    }
  }

  if (age >= 85) return "peaceful decline of extreme old age";
  if (age >= 70) return pickRandomItem(["pneumonia", "congestive heart failure", "a debilitating stroke", "complications from a severe fall or fracture", "natural decline exacerbated by harsh winter conditions"]);

  // Syphilis Pandemic (1495 - 1945): Peak Era of Syphilis / Great Pox
  if (deathYear >= 1495 && deathYear <= 1945 && age >= 22) {
    const syphilisRisk = conditions.hadAffair ? 0.35 : 0.08;
    if (Math.random() < syphilisRisk) {
      return pickRandomItem([
        "tertiary neurosyphilis (general paresis of the insane) resulting in dementia and full motor paralysis",
        "the Great Pox (chronic tertiary syphilis with cardiovascular aneurysm and destructive tissue lesions)",
        "syphilitic aortitis (fatal rupture of a thoracic aortic aneurysm caused by untreated syphilis)",
        "tabes dorsalis (advanced neurosyphilis with progressive paralysis, blindness, and organ failure)"
      ]);
    }
  }

  const historicalRoll = Math.random();
  // 75% Disease / Epidemic / Internal organ failure (vast majority of premodern adult deaths)
  if (historicalRoll < 0.75) {
    return pickRandomItem([
      "consumption (pulmonary tuberculosis) with severe wasting and hemoptysis",
      "bubonic plague / regional epidemic pestilence",
      "typhus fever transmitted by lice during winter quarters",
      "acute dysentery / severe waterborne enteric illness",
      "dropsy (congestive heart failure / severe fluid retention)",
      "gangrenous sepsis stemming from a farm tool laceration",
      "lobar pneumonia following exposure to damp, freezing cold",
      "summer cholera epidemic with rapid dehydration",
      "malaria (severe ague) causing chronic anemia and splenic rupture",
      "a mysterious, lingering internal wasting illness",
      "smallpox epidemic with secondary bacterial infection",
      "acute peritonitis from an undiagnosed internal rupture"
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
      "crushed beneath the timber collapse of a dwelling or barn during a violent storm",
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
      return pickRandomItem([
        "slaughtered in the chaotic crush of a shield wall or infantry clash",
        "fatal spear thrust / thrusting sword wound sustained in pitched battle",
        "fatal arrow wound piercing the lungs or neck in combat",
        "succumbing to gangrenous wound sepsis days after a military engagement",
        "fatal cavalry trampling / sword strike on the battlefield"
      ]);
    }
    return pickRandomItem([
      "fatal trauma and systemic shock sustained during the violent sacking and predatory pillaging of your settlement by invading troops",
      "fatal injuries sustained resisting sexual violence and pillaging during an enemy military raid",
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

const generateFallbackNarrative = (lifeData) => {
  const isMale = lifeData.sex === 'Male';
  const year = formatYear(lifeData.birthYear);
  const loc = lifeData.region;
  const cls = lifeData.socialClass;

  const p1 = `You were born a ${lifeData.sex.toLowerCase()} in ${year} in ${loc} into the ${cls} tier of society. ` +
    (lifeData.wasExposed ? `Abandoned at birth in accordance with local customs, you were miraculously discovered and raised by compassionate neighbors. ` : `Your early years were shaped by the daily subsistence and customs of your region. `) +
    (lifeData.disabilityCategory ? `From your youth, you lived with a physical condition—specifically ${lifeData.disabilityExamples || lifeData.disabilityCategory}—which you learned to manage over time. ` : '') +
    (lifeData.beauty >= 80 ? (isMale ? `You grew into a handsome, striking young man whose appearance drew frequent notice from peers. ` : `You were widely regarded as an exceptionally beautiful young woman in your community. `) : '') +
    (lifeData.personality ? `Those around you knew you as someone of ${lifeData.personality.join(' and ')} temperament.` : '');

  const p2 = lifeData.age >= 15 ? (
    `As you came of age, you took up the responsibilities expected of your station. ` +
    (lifeData.hasUpwardMobility ? `Through diligence and fortune, you achieved notable social mobility (${lifeData.mobilityDetails || 'rising into a more prosperous tier'}). ` : '') +
    (lifeData.isMarried ? `You married at age ${lifeData.marriageAge}, establishing a household. ` : `You remained unmarried, dedicating yourself to your trade and kin. `) +
    (lifeData.childrenCount > 0 ? (lifeData.hasUnmarriedPartnerChildren ? `You raised ${lifeData.childrenCount} children with a long-term partner outside formal marriage. ` : `In time, you were blessed with ${lifeData.childrenCount} children. `) : '') +
    (lifeData.orientation === 'Homosexual' ? (lifeData.isOpenlyGay ? `You lived openly in your same-sex relationships within your circle.` : `You harbored deep romantic feelings for the same sex, kept secret due to the dangers of your era.`) : '')
  ) : `Your childhood was marked by innocence, though your journey was destined to be brief.`;

  const p3 = lifeData.isAlive ? (
    `Today, in the year 2026, you are ${lifeData.age} years old and continue living your daily life in ${loc}, reflecting on your journey and private memories.`
  ) : (
    `At age ${lifeData.age}, your mortal journey reached its conclusion in ${lifeData.deathRegion || loc}, succumbing to ${lifeData.causeOfDeath || 'natural causes'}. Your legacy lived on in the memories of those who shared your life.`
  );

  const narrative = [p1, p2, p3].filter(Boolean);

  const timeline = [
    { year: `${year}`, event: `Born a ${lifeData.sex.toLowerCase()} in ${loc} into the ${cls} tier.` },
    lifeData.isMarried ? { year: `${formatYear(lifeData.birthYear + lifeData.marriageAge)}`, event: `Married at age ${lifeData.marriageAge}.` } : null,
    lifeData.hasUpwardMobility ? { year: `${formatYear(lifeData.birthYear + 25)}`, event: `Achieved upward social mobility into the ${lifeData.socialClass} class.` } : null,
    lifeData.isMaimed ? { year: `${formatYear(lifeData.birthYear + lifeData.maimedAge)}`, event: `Survived a severe violent encounter: ${lifeData.maimedDetails}.` } : null,
    lifeData.isAlive ? { year: `2026 CE`, event: `Living today at age ${lifeData.age}.` } : { year: `${formatYear(lifeData.birthYear + lifeData.age)}`, event: `Passed away at age ${lifeData.age} from ${lifeData.causeOfDeath}.` }
  ].filter(Boolean);

  return {
    specificLocation: lifeData.region,
    deathSpecificLocation: lifeData.deathRegion || null,
    narrative,
    timeline,
    historicalEncounters: [],
    historicalEventsLivedThrough: [],
    wikiLinks: []
  };
};

const generateNarrativeWithAI = async (lifeData) => {
  const apiKey = (import.meta.env?.VITE_GEMINI_API_KEY || DEFAULT_API_KEY).trim();
  
  // Active, ultra-fast Gemini 3.x models with fallbacks
  const candidateModels = [
    import.meta.env?.VITE_GEMINI_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.6-flash"
  ].filter(Boolean);
  const modelsToTry = Array.from(new Set(candidateModels));

  const showTraits = lifeData.age >= 4; 
  const showEarlyCrushes = lifeData.age >= 8; 
  const showAdult = lifeData.age >= 15; 

  const systemPrompt = `You are a brilliant historian and storyteller running a reincarnation simulation of anatomically modern Homo sapiens. 
I will provide you with the raw, rolled statistics of a human life. 

CRITICAL RULES:
1. STRICT SECOND PERSON POV & OPENING SENTENCE: You MUST write exclusively in the second person ("You were born...", "You grew up...", "Your choices..."). NEVER use third person ("He lived...", "She survived...").
   - MANDATORY FIRST SENTENCE: Your very first sentence of the story's first paragraph MUST explicitly begin with either "You were born a male..." or "You were born a female..." based on the assigned birth sex (e.g. "You were born a male to peasant farmers in...", "You were born a female in a drafty timber house in...").
2. TONE & PROSE: Use clear, grounded, and engaging historical language. AVOID excessively flowery, melodramatic, or poetic adjectives. Write like a straightforward, insightful historical biographer.
3. NATURAL, ACCESSIBLE LANGUAGE FOR MEDICAL CONDITIONS & ILLNESSES (CRUCIAL):
   - AVOID dense, clinical, Latinate textbook jargon that hinders readability or player immersion (e.g. NEVER write "severe congenital amblyopia combined with high astigmatism" or "talipes equinovarus").
   - ALWAYS use plain, natural, vivid English descriptions that any reader immediately grasps (e.g. "crossed eyes and severely impaired vision", "a clubfoot", "a severe hunchback", "a cleft palate", "shaking palsy / tremors", "a heart defect causing blue skin and chronic exhaustion", "childhood reading blindness").
   - SCOLIOSIS & SPINAL CURVATURE ONSET: Idiopathic scoliosis develops during childhood or adolescent growth spurts (ages 10–14) or from adult physical toll, rather than being evident at birth. Describe its gradual development as they grow.
   - FOR PREMODERN LIVES (Before 1850): First describe how historical peers perceived their condition (e.g. wandering eye, touched by spirits, eccentric, melancholy). If referencing modern medical understanding, keep it conversational and plain (e.g. "In today's terms, you had crossed eyes and poor vision in one eye", "In modern terms, you were born on the autism spectrum").
4. TRANSGENDER & GENDER DIVERGENCE: If rolled as Transgender, authentically reflect their experience according to their era, culture, and personality. In premodern/early modern eras, people navigating this often lived in disguise, assumed alternate societal roles (e.g. military enlistment, monastic life, sailors like Catalina de Erauso), joined culturally recognized roles (Two-Spirit, Hijra, Galli, Public Universal Friend, Chevalier d'Éon), or repressed it depending on bravery and fear. In the 20th/21st century, reflect the emergence of medical transition (like Lili Elbe) or underground communities.
5. MODERN MEDICAL CANCER SURVIVAL: If flagged as a "Cancer Survivor" in a modern era, describe their harrowing but successful battle with modern oncology (surgery/radiation/chemo) and how it shifted their perspective before returning to remission.
6. CAUSE OF DEATH & CONTEMPORARY LIVES (STILL ALIVE IN 2026):
   - FOR DECEASED CHARACTERS: Weave their assigned Primary Cause of Death seamlessly into their final paragraph. Cancer was extremely rare in premodern eras; rely only on the provided premodern diseases. If they died of old age diseases, describe the physical slowing down of their golden years.
   - FOR LIVING CHARACTERS (STILL ALIVE IN 2026): NEVER say they are "forgotten by history" or speak of their life in past tense as a closed ancient chapter. Write about their ongoing daily life today in the year 2026, their contemporary routine, reflections on modern times, family/community, and how they navigate life today.
7. PREMODERN MARRIAGE (CRUCIAL): In premodern eras, marriage was a near-universal economic survival necessity. If a premodern adult remained UNMARRIED, you MUST provide a strict historical reason (e.g. extreme poverty, joined a monastery/convent, enslaved, severe disability, or escaping to a bachelor military/sailor life to hide homosexuality/transgender/asexuality).
8. FAME & HOBBIES / PASTIMES: Incorporate their assigned Fame level. Even for commoners and poor folk, incorporate their natural casual pastimes (e.g. folk songs, storytelling, dice games, tavern banter, communal dancing, whittling, foraging, fishing, local sports) based on their personality.
9. SIBLINGS & FAMILY: ONLY mention exact sibling survival numbers if it is narratively crucial (e.g. sole survivor). Do NOT mechanically list "4 of 6 siblings survived" as a robotic fact.
10. SEXUAL ORIENTATION & BISEXUALITY (CRUCIAL):
    - BISEXUALITY: Clearly articulate that the character experiences genuine romantic/sexual attraction to BOTH men and women. If they marry or take a primary partner, describe how they navigate their bisexual desires.
    - SAME-SEX EXTRAMARITAL AFFAIRS: If a Homosexual or Bisexual character is married and has an extramarital affair, explicitly depict whether their clandestine lover is of the same sex (e.g. a married gay/bisexual man harboring a secret male lover, or a married woman carrying on a secret female romance) and the emotional stakes and secrecy involved.
    - HOMOSEXUALITY: Reflect their orientation with historical nuance. For those who stayed in the closet, highlight the burden of concealment. For those who were open, highlight their community and relationships.
11. CHRONOLOGY OF EVENTS (TIMELINE): For the 'timeline' array, provide 3 to 6 major milestones (e.g. birth, adolescence, marriage/career/migration, mid-life turning point, death/survival).
    - "year": MUST strictly contain ONLY the calendar year with its era indicator (e.g. "1908 CE", "1926 CE", "450 BCE"). Do NOT put location or story narrative inside the "year" string.
    - "event": MUST contain a clear, descriptive 1-2 sentence summary of what occurred in that year (e.g. "Born in a hillside village in Basilicata, Italy to an impoverished agricultural family.").
12. HISTORICAL FIGURES & EYEWITNESS EVENTS (EXHAUSTIVE & AUTHENTIC):
    - HISTORICAL ENCOUNTERS: Carefully evaluate the character's exact lifespan (birth year to death year), region/city, and class. If real historical figures (monarchs, artists, philosophers, generals, revolutionaries, scientists—e.g. Richard II, Van Gogh, Leonardo da Vinci, Socrates, Joan of Arc, Marie Antoinette, Napoleon, Abraham Lincoln, Mansa Musa, Caravaggio, Tokugawa Ieyasu, Confucius, etc.) lived or operated in that area during their lifetime:
      - Provide an authentic encounter or observation (e.g. catching a glimpse during a royal progress, hearing them speak, drinking in the same tavern, observing their public works, serving in their unit, or direct acquaintance).
      - If an encounter occurs, populate the historicalEncounters array with figure, year, and context. If no plausible figure exists in that exact time and place, return an empty array.
    - HISTORICAL EVENTS LIVED THROUGH: Provide an exhaustive list (1 to 4 major milestones) of monumental historical events, wars, revolutions, plagues, cultural shifts, colonization events, or civilization collapses that occurred during their lifespan in or near their region:
      - BRITISH COLONIZATION / CONQUEST: If they lived in a region colonized or invaded by the British Empire during their lifetime (e.g. India under the East India Company / British Raj, New Zealand Treaty of Waitangi, Australian colonization, Irish plantations/Famine, Opium Wars in China, Scramble for Africa in Nigeria/Kenya/Egypt/Sudan/South Africa, North American colonial wars), make sure to include this.
      - CIVILIZATION COLLAPSE / CONQUEST: If they witnessed the fall, sacking, collapse, or conquest of their empire/dynasty (e.g. Fall of Rome in 476 CE, Fall of Constantinople in 1453 CE, Spanish conquest of the Inca or Aztec Empires, Sacking of Baghdad in 1258 CE, Bronze Age Collapse ~1200 BCE, Fall of the Ming/Song/Qin Dynasties, Fall of Carthage in 146 BCE), prominently feature it.
      - Populate historicalEventsLivedThrough array with event, year, and impact.
13. PHYSICAL APPEARANCE & BEAUTY (FOR ATTRACTIVE PEOPLE):
    - When describing an attractive female character (Beauty > 75), you may freely use the word "beautiful", and describe specifically how others in her community or station perceived her appearance, graceful carriage, or features, and the attention or suitors she drew.
    - When describing an attractive male character (Beauty > 75), you may use words like "handsome", "striking", and "well-formed", and be specific about his distinct features (e.g. sharp facial features, commanding height, athletic build, clear eyes) and the notice, social regard, or romantic attention he commanded.
14. JSON OUTPUT ONLY. Adhere strictly to the requested schema.`;

  const userPrompt = `
Generate a structured life profile based strictly on these parameters:
- Era: ${lifeData.eraName}
- Birth Year: ${formatYear(lifeData.birthYear)}
- ${lifeData.isModernEra
    ? `Country: ${lifeData.region} | Setting: ${lifeData.isUrban ? 'Urban (city dweller)' : 'Rural (village or countryside)'}\n- Language: ${lifeData.lang}\n- Specific Location (YOUR CHOICE — put in specificLocation field): Invent the most realistic specific ${lifeData.isUrban ? 'city district, neighbourhood, or city name' : 'village, small town, or rural region'} within ${lifeData.region} for ${formatYear(lifeData.birthYear)}. Be specific — vary your answer, never just use the capital.`
    : `Region: ${lifeData.region} (Primary Language: ${lifeData.lang})\n- Specific Location (YOUR CHOICE — put in specificLocation field): Invent a realistic specific settlement, town, village, or district within this region appropriate for the era and class.`
  }
- Sex: ${lifeData.sex} (REMINDER: First sentence MUST start with "You were born a ${lifeData.sex.toLowerCase()}...")
- Gender Identity: ${lifeData.isTransgender ? `Transgender (${lifeData.transgenderDetails})` : 'Cisgender (aligns with birth sex)'}
- Social Class: ${lifeData.socialClass}
- Identity Group: ${lifeData.isMinority
    ? `Minority member — specifically ${lifeData.minorityGroupHint || 'a demographically significant ethnic or religious minority for this location and era'}. Weave their minority identity authentically into the narrative.`
    : 'Majority / Dominant Group'}
- Migration / Emigration: ${lifeData.isEmigrant 
    ? `EMIGRATED AT AGE ${lifeData.emigrationAge}: You were born in ${lifeData.region}, but at age ${lifeData.emigrationAge} you emigrated/relocated to ${lifeData.deathRegion}, where you lived out your adult life and eventually died. Provide a realistic specific location in ${lifeData.deathRegion} for where you lived and died in the deathSpecificLocation field.` 
    : (lifeData.isImmigrant ? 'Immigrant/Migrant ancestry in birth region' : 'Native resident in birth region')}
- Congenital / Physical Condition: ${lifeData.disabilityCategory
    ? `Category: ${lifeData.disabilityCategory}. Examples: ${lifeData.disabilityExamples}. Describe this in natural, accessible, plain English terms (e.g. 'crossed eyes and poor vision' rather than hyper-clinical jargon).`
    : 'None'}
- Exposed / Left to Die at Birth: ${lifeData.wasExposed ? 'YES (Parents/Tribe abandoned infant at birth)' : 'NO'}
- Family: Mother died in childbirth: ${lifeData.motherDied}. ${lifeData.siblingsSurvived} of ${lifeData.totalSiblings} siblings survived childhood.
${showEarlyCrushes ? `- Orientation: ${lifeData.orientation} ${
  lifeData.orientation === 'Homosexual' 
    ? (lifeData.isOpenlyGay 
        ? '(Lived openly in their same-sex relationships / out and proud in their community)' 
        : '(Kept same-sex attraction strictly secret / in the closet due to social, religious, or familial danger)')
    : (lifeData.orientation === 'Bisexual'
        ? `(Attracted to both men and women. ${lifeData.actedOnBi ? (lifeData.isOpenlyGay ? 'Acted openly on same-sex attractions.' : 'Pursued same-sex encounters in strict secrecy.') : 'Suppressed same-sex desires and conformed to heterosexual expectations.'})`
        : '')
}` : ''}
${showTraits ? `- Personality: ${lifeData.personality.join(' and ')}` : ''}
${showAdult ? `- Pastimes & Leisure: ${lifeData.hobbyData}` : ''}
${showAdult ? `- Marriage / Structure: ${lifeData.isMarried ? `Married/Bonded at age ${lifeData.marriageAge}` : 'Never Married/Bonded'}. ${lifeData.hadAffair ? `Had an extramarital affair / clandestine lover ${lifeData.sameSexAffair ? '(specifically with someone of the same sex)' : '(with an opposite-sex partner)'}.` : ''}` : ''}
${showAdult ? `- Children: ${lifeData.effectiveInfertility ? '0 children (Infertile)' : `${lifeData.childrenCount} children`} ${
  lifeData.hasUnmarriedPartnerChildren 
    ? '(Had children with an unmarried long-term cohabiting partner / outside formal marriage)' 
    : (lifeData.outOfWedlock ? '(Includes child/children born out of wedlock / outside primary union)' : '')
}` : ''}
${showAdult ? `- Fame/Legacy: ${lifeData.fame}` : ''}
${lifeData.survivedCancer ? `- Medical History: Diagnosed with cancer at age ${lifeData.cancerAge}, but successfully underwent modern medical treatments and survived into remission.` : ''}
${lifeData.isMaimed ? `- Violent Encounter & Trauma: At age ${lifeData.maimedAge}, you survived a near-fatal event: ${lifeData.maimedDetails}. Severity: ${lifeData.maimedSeverity}. ${lifeData.maimedContributedToDeath ? 'This chronic injury and physical impairment plagued your health and contributed to your physical decline later in life.' : 'You adapted to your scars/disfigurement and lived on.'} Weave this landmark event vividly into the story and chronology.` : ''}
${lifeData.isRoyaltyOrHistoric ? `- ROYAL / HISTORICAL PERSON INCARNATION (SPECIAL): This soul is born as a real historical monarch, emperor, prince/princess, or close relative of a renowned ruler in ${lifeData.region} around ${formatYear(lifeData.birthYear)}.
  * Tell their REAL, historically authentic life story based on historical facts.
  * If from ancient antiquity or prehistory where records are incomplete, reconstruct their life and reign faithfully using the best available archaeological and historical facts.
  * Align their lifespan, reign, key battles, court intrigues, and legacy with real history.` : ''}
${lifeData.hasUpwardMobility ? `- UPWARD SOCIAL MOBILITY: Born into ${lifeData.birthSocialClass}, but achieved notable upward mobility in adulthood: ${lifeData.mobilityDetails}. Their attained station is ${lifeData.socialClass}. Explicitly chronicle their rise from humble beginnings to their elevated station in the narrative and timeline.` : ''}
${showTraits ? `- Base Intelligence (1-100): ${lifeData.intelligence}` : ''}
${showTraits ? `- Physical Appearance (1-100, score: ${lifeData.beauty}): ${
  lifeData.beauty >= 80 
    ? (lifeData.sex === 'Female' 
        ? `Exceptionally beautiful (Score ${lifeData.beauty}/100). Use the word 'beautiful', describe specific features, and depict how others perceived her appearance and the attention/suitors she drew.` 
        : `Exceptionally handsome / striking (Score ${lifeData.beauty}/100). Use words like 'handsome', 'striking', describe his distinct physical features/physique, and the notice and attention he received.`)
    : (lifeData.beauty >= 60 
        ? `Pleasant and good-looking (Score ${lifeData.beauty}/100).`
        : (lifeData.beauty <= 20 
            ? `Notably plain, rough-hewn, or unadorned in appearance (Score ${lifeData.beauty}/100).`
            : `Average, typical appearance for their era and class (Score ${lifeData.beauty}/100).`))
}` : ''}
- Mental/Physical Health: ${[lifeData.schizophrenia && showAdult ? 'Schizophrenia' : '', lifeData.depression && showAdult ? 'Clinical Depression' : '', lifeData.suicide ? 'Suicide' : ''].filter(Boolean).join(', ') || 'No major anomalies'}
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

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const modelPayload = {
      ...payload,
      generationConfig: {
        ...payload.generationConfig,
        ...(model === 'gemini-3.5-flash' ? { thinkingConfig: { thinkingBudget: 0 } } : {})
      }
    };

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(url, { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify(modelPayload) 
        });

        if (response.status === 429) {
          if (attempt === 0) {
            await new Promise(r => setTimeout(r, 800));
            continue;
          }
          break;
        }

        if (!response.ok) break;

        const data = await response.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) break;

        const parsed = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
        if (parsed && (Array.isArray(parsed.narrative) || typeof parsed.narrative === 'string')) {
          if (typeof parsed.narrative === 'string') {
            parsed.narrative = parsed.narrative.split('\n\n').filter(Boolean);
          }
          if (!parsed.specificLocation) parsed.specificLocation = lifeData.region;
          if (!Array.isArray(parsed.timeline)) parsed.timeline = [];
          if (!Array.isArray(parsed.historicalEncounters)) parsed.historicalEncounters = [];
          if (!Array.isArray(parsed.historicalEventsLivedThrough)) parsed.historicalEventsLivedThrough = [];
          if (!Array.isArray(parsed.wikiLinks)) parsed.wikiLinks = [];
          if (parsed.narrative.length > 0) return parsed;
        }
      } catch (err) {
        console.warn(`Attempt error for model ${model}:`, err);
        break;
      }
    }
  }

  return generateFallbackNarrative(lifeData);
};

export default function App() {
  const [currentLife, setCurrentLife] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalLived: 0, highestAge: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
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

  const simulateLife = async () => {
    playUiSound('incarnate');
    setIsGenerating(true);
    
    // 1. Era selection (weighted)
    let selectedEra = ERAS[0];
    const eraRoll = Math.random() * ERAS.reduce((s, e) => s + e.weight, 0);
    let cumEra = 0;
    for (const era of ERAS) { cumEra += era.weight; if (eraRoll <= cumEra) { selectedEra = era; break; } }

    const birthYear = randomInt(selectedEra.startYear, selectedEra.endYear);
    const sex = Math.random() < 0.5 ? 'Male' : 'Female';

    // 2. Location (two-tier for MODERN; single-tier for all other eras)
    let regionText, lang, lat, lng, baseLifeExpectancy;
    let selectedCountry = null;
    let regionObj = null;
    let isUrban = false;
    let isMinority = false;
    let minorityGroupHint = null;

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
    
    // In premodern eras, royalty is ~2.5% of the nobility (~0.05% of all births, 1 in 2,000).
    // In modern era, royalty is ~0.2% of the upper class (~0.02% of all births).
    const royalSubChance = selectedEra.id === 'MODERN' ? 0.002 : 0.025;
    const isRoyaltyOrHistoric = isEliteClass && Math.random() < royalSubChance;

    if (isRoyaltyOrHistoric) {
      socialClass = selectedEra.id === 'MODERN' ? 'Royalty / Reigning Dynasty' : 'Royalty / Imperial Dynasty';
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
      baseInfantMortality = 0.12 * Math.pow(0.015, modernProgress);
      baseChildMortality = 0.04 * Math.pow(0.02, modernProgress);
    } else if (selectedEra.id === 'EARLY_MODERN') {
      baseInfantMortality = 0.22 - (progress * 0.06);
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
      disabilityExamples = picked.examples;
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
      else if (orientationRoll < 0.07) orientation = 'Homosexual';
      else if (orientationRoll < 0.09) { orientation = 'Bisexual'; actedOnBi = Math.random() < 0.3; }
    } else {
      if (orientationRoll < 0.01) orientation = 'Asexual';
      else if (orientationRoll < 0.05) orientation = 'Homosexual';
      else if (orientationRoll < 0.13) { orientation = 'Bisexual'; actedOnBi = Math.random() < 0.3; }
    }

    // Transgender demographic roll: 1.0% for homosexuals, 0.3% for other orientations
    const transChance = orientation === 'Homosexual' ? 0.010 : 0.003;
    const isTransgender = Math.random() < transChance;

    const personality1 = pickRandomItem(PERSONALITY_TRAITS);
    let personality2 = pickRandomItem(PERSONALITY_TRAITS);
    while (personality1 === personality2) personality2 = pickRandomItem(PERSONALITY_TRAITS);

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
    } else if (fameRoll < 0.005) { 
        if (selectedEra.id === 'PALEOLITHIC' || selectedEra.id === 'NEOLITHIC') {
             fame = "Archaeological Discovery (Your remarkably preserved remains were unearthed in the 20th/21st century).";
        } else if ((selectedEra.id === 'BRONZE_IRON' || selectedEra.id === 'CLASSICAL' || selectedEra.id === 'MEDIEVAL') && !socialClass.includes('Upper') && !socialClass.includes('Patrician') && !socialClass.includes('Nobility') && !socialClass.includes('Elite')) {
             fame = "Archaeological Discovery (As a commoner, your name was lost to time, but your remarkably preserved burial site was discovered by modern archaeologists).";
        } else {
             fame = "Properly Famous (Your name, deeds, or creations are permanently etched into global history).";
        }
    } else if (fameRoll < 0.015) { 
        if (selectedEra.id !== 'PALEOLITHIC' && selectedEra.id !== 'NEOLITHIC') {
             fame = "Mildly Infamous (You committed a scandalous act, notorious crime, or localized rebellion; fading into obscurity after a generation).";
        }
    } else if (fameRoll < 0.030) { 
        if (selectedEra.id !== 'PALEOLITHIC' && selectedEra.id !== 'NEOLITHIC') {
             fame = "Mildly Famous (You did something notable and were celebrated for a while before history forgot you).";
        }
    }

    // 7. Hobby & Pastimes Engine (Rich casual pastimes for ordinary & working classes)
    const isNeurodivergent = disabilityCategory === "Neurodivergent developmental condition";
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

    if (isNeurodivergent) {
      hobbyData = Math.random() < 0.8
        ? "an obsessive, all-consuming special interest (historically grounded in their era)"
        : "a deep, quiet, repetitive craft or specialized fascination";
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
        hobbyData = `a casual pastime: ${pickRandomItem(commonPastimes)}`;
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

    // 3b. Upward Social Mobility Engine
    // Driven by high intelligence (especially for men/scholars) or extreme beauty (especially for women/courtesans/spouses)
    let hasUpwardMobility = false;
    let mobilityDetails = null;
    let birthSocialClass = socialClass;

    if (!isRoyaltyOrHistoric && !socialClass.includes('Royalt') && !socialClass.includes('Nobility') && !socialClass.includes('Patrician')) {
      let mobilityChance = 0.02; // baseline rare luck
      
      // Intellectual advancement
      if (intelligence >= 88) mobilityChance += 0.55;
      else if (intelligence >= 78) mobilityChance += 0.30;
      else if (intelligence >= 68) mobilityChance += 0.12;

      // Aesthetic & social advancement (especially for women in premodern/early modern eras)
      if (sex === 'Female') {
        if (beauty >= 90) mobilityChance += 0.60;
        else if (beauty >= 80) mobilityChance += 0.35;
      }

      if (Math.random() < Math.min(0.85, mobilityChance)) {
        hasUpwardMobility = true;
        if (sex === 'Male' && intelligence >= 75) {
          mobilityDetails = pickRandomItem([
            "Elevated through formidable intellect, scholarship, and civil / trade acumen into the wealthy merchant and bureaucratic elite",
            "Rose from humble beginnings through military distinction, tactical brilliance, and officer command",
            "Advanced through guild mastery, financial entrepreneurship, and intellectual ingenuity into the prosperous upper-middle class"
          ]);
          socialClass = selectedEra.id === 'MODERN' ? 'Upper Middle Class (Self-Made Professional / Entrepreneur)' : 'Wealthy Guild Master / Imperial Scholar-Official';
        } else if (sex === 'Female' && beauty >= 80) {
          mobilityDetails = pickRandomItem([
            "Elevated from poverty through stunning beauty and grace into an advantageous marriage with landed gentry / high nobility",
            "Rose from humble origins into a celebrated high-society courtesan, royal favorite, and influential cultural tastemaker",
            "Secured elite imperial court favor and wealth as an esteemed concubine / high-status aristocratic companion"
          ]);
          socialClass = selectedEra.id === 'MODERN' ? 'High Society / Wealthy Elite' : 'Aristocratic Spouse / Court Favorite';
        } else {
          mobilityDetails = "Rose from working poverty through exceptional diligence, shrewd investments, and lucky patronage into prosperous merchant circles";
          socialClass = selectedEra.id === 'MODERN' ? 'Upper Middle Class' : 'Prosperous Merchant / Gentry';
        }
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
        if (["Craniofacial anomaly","Limb or digit malformation","Intellectual disability","Neurodivergent developmental condition","Skeletal dysplasia or short stature condition"].includes(disabilityCategory)) {
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
    for(let i=0; i<totalSiblings; i++) {
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
        if (Math.random() < unmarriedChildbirthChance) {
          hasUnmarriedPartnerChildren = true;
          outOfWedlock = true;
          childrenCount = randomInt(1, selectedEra.id === 'MODERN' ? (birthYear >= 1975 ? 2 : 3) : 2);
        }
      }
    }

    // 9b. Lifetime Emigration / Migration
    let isEmigrant = false;
    let emigrationAge = null;
    let deathRegion = null;
    let deathLat = null;
    let deathLng = null;

    if (age >= 16 && !wasExposed) {
      const emigrateChance = selectedEra.id === 'MODERN' ? 0.16 : (selectedEra.id === 'EARLY_MODERN' ? 0.09 : 0.04);
      if (Math.random() < emigrateChance) {
        isEmigrant = true;
        emigrationAge = randomInt(16, Math.min(age, 45));
        
        if (selectedEra.id === 'MODERN') {
          const destPool = MODERN_COUNTRIES.filter(c => c.name !== regionText);
          const dest = destPool.length > 0 ? pickWeighted(destPool) : MODERN_COUNTRIES[0];
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

    // 9c. Violent Encounter & Maiming / Scarring Engine
    let isMaimed = false;
    let maimedAge = null;
    let maimedSeverity = null;
    let maimedDetails = null;
    let maimedContributedToDeath = false;

    if (age >= 8 && !wasExposed) {
      const traumaChance = selectedEra.id === 'MODERN' ? 0.08 : (selectedEra.id === 'PALEOLITHIC' ? 0.20 : 0.14);
      if (Math.random() < traumaChance) {
        isMaimed = true;
        maimedAge = randomInt(6, Math.min(age, 55));
        
        const severities = [
          { level: "mild scarring", desc: "prominent facial or bodily scars from a blade cut, wild animal scrape, or burn" },
          { level: "moderate disfigurement", desc: "a permanently misaligned limb bone resulting in a limp, partial hearing/vision loss, or deep tissue scarring" },
          { level: "severe maiming & impairment", desc: "loss of an eye, an amputated limb/fingers, severe burn disfigurement, or chronic crippled mobility" }
        ];
        const pickedSeverity = pickRandomItem(severities);
        maimedSeverity = pickedSeverity.level;

        const eventScenarios = [
          "survived a brutal hand-to-hand skirmish / warfare encounter where comrades were slain",
          "survived a violent tavern brawl or roadside assault with a bludgeon or blade",
          "survived a terrifying wild predator attack / hunting accident",
          "survived a catastrophic domestic fire / open hearth blaze with extensive burns",
          "survived a runaway draft animal trampling or crushing wagon accident",
          "survived an industrial gear snag, quarry collapse, or naval rigging accident"
        ];
        maimedDetails = `${pickRandomItem(eventScenarios)} (left with ${pickedSeverity.desc})`;
        maimedContributedToDeath = Math.random() < 0.35 && age > 40;
      }
    }

    const rawLifeData = {
        eraName: selectedEra.name, birthYear,
        isModernEra: selectedEra.id === 'MODERN',
        region: regionText, lang, sex, socialClass,
        isMinority, minorityGroupHint, isImmigrant, isUrban,
        isEmigrant, emigrationAge, deathRegion, deathLat, deathLng,
        isMaimed, maimedAge, maimedSeverity, maimedDetails, maimedContributedToDeath,
        isRoyaltyOrHistoric, hasUpwardMobility, birthSocialClass, mobilityDetails,
        disabilityCategory, disabilityExamples, wasExposed,
        orientation, actedOnBi, isOpenlyGay, isInTheCloset,
        isTransgender, transgenderDetails,
        fame, hobbyData, personality: [personality1, personality2],
        motherDied: Math.random() < (selectedEra.maternalMortality * classMultiplier),
        totalSiblings, siblingsSurvived, isMarried, marriageAge, hadAffair, sameSexAffair, outOfWedlock, hasUnmarriedPartnerChildren, effectiveInfertility, childrenCount,
        age, isAlive, causeOfDeath, suicide, survivedCancer, cancerAge, regionalExpectancy: baselineAdultLifespan,
        intelligence, beauty, schizophrenia: Math.random() < 0.01, depression: Math.random() < 0.06
    };

    // 10. GENERATE & SET DATA
    let generatedData = null;
    try {
      generatedData = await generateNarrativeWithAI(rawLifeData);
    } catch (err) {
      console.warn("Generation error, employing local historical biographer:", err);
      generatedData = generateFallbackNarrative(rawLifeData);
    }

    if (!generatedData || !generatedData.narrative || generatedData.narrative.length === 0) {
      generatedData = generateFallbackNarrative(rawLifeData);
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
      hasUpwardMobility: rawLifeData.hasUpwardMobility || false,
      birthSocialClass: rawLifeData.birthSocialClass || socialClass,
      mobilityDetails: rawLifeData.mobilityDetails || null,
      orientation: rawLifeData.orientation,
      sameSexAffair: rawLifeData.sameSexAffair || false,
      hasUnmarriedPartnerChildren: rawLifeData.hasUnmarriedPartnerChildren || false,
      isOpenlyGay: rawLifeData.isOpenlyGay || false,
      isInTheCloset: rawLifeData.isInTheCloset || false,
      sex, socialClass, age, isAlive,
      isTransgender, transgenderDetails,
      badges: earnedBadges,
      historicalEncounters: generatedData?.historicalEncounters || [],
      historicalEventsLivedThrough: generatedData?.historicalEventsLivedThrough || [],
      narrative: generatedData?.narrative || generateFallbackNarrative(rawLifeData).narrative,
      timeline: generatedData?.timeline || generateFallbackNarrative(rawLifeData).timeline,
      wikiLinks: generatedData?.wikiLinks || [],
      eraName: selectedEra.name
    };

    setCurrentLife(newLife);
    setHistory(prev => [newLife, ...prev]);
    setStats(prev => ({ totalLived: prev.totalLived + 1, highestAge: Math.max(prev.highestAge, age) }));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] bg-cosmic-radial text-slate-200 font-serif p-4 md:p-8 flex flex-col items-center selection:bg-indigo-900/50">
      
      {/* Badge Unlock Celebration Pop-up */}
      {badgeModalQueue.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-md w-full bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/95 border-2 border-amber-500/60 rounded-3xl p-8 shadow-[0_0_60px_rgba(245,158,11,0.35)] text-center animate-fade-in-scale">
            
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
              className="group relative inline-flex items-center justify-center px-9 py-4 font-sans font-semibold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-950 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin text-indigo-200" />
              ) : (
                <RefreshCw className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-700 text-indigo-200" />
              )}
              <span className="tracking-wide text-base">
                {isGenerating ? 'Weaving Timeline...' : 'Incarnate'}
              </span>
            </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        
        {/* Main Display: Timeline & Narrative */}
        <section className="lg:col-span-2 space-y-6" aria-label="Life Chronicle">
          {isGenerating ? (
              <div className="h-96 flex flex-col items-center justify-center border border-indigo-500/20 bg-indigo-950/20 backdrop-blur-md rounded-2xl text-indigo-300 shadow-2xl p-8 text-center animate-pulse">
                 <div className="relative mb-6">
                   <div className="w-16 h-16 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin"></div>
                   <Sparkles className="w-6 h-6 text-indigo-300 absolute inset-0 m-auto animate-ping opacity-75" />
                 </div>
                 <p className="font-sans text-sm font-semibold tracking-widest uppercase text-indigo-200">Consulting the Akashic Records...</p>
                 <p className="font-sans text-xs text-slate-400 mt-2 max-w-sm">Synthesizing historical demographic data, personal chronology, and contextual narrative with Gemini Flash AI.</p>
              </div>
          ) : currentLife ? (
            <article className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-md animate-fade-in-scale">
              
              {/* Profile Card Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8 font-sans">
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
                  <Star className="w-5 h-5 text-purple-400 mb-2" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Station</span>
                  <span className="text-sm font-semibold text-slate-200 mt-1">{currentLife.socialClass}</span>
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
                {currentLife.narrative.map((p, idx) => (
                  <p key={idx} className={idx === 0 ? "first-letter:text-5xl md:first-letter:text-6xl first-letter:font-bold first-letter:text-indigo-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none" : ""}>
                    {p}
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
                    className={`relative aspect-square rounded-xl border flex items-center justify-center transition-all cursor-pointer group ${
                      isUnlocked 
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
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      unlockedBadges.includes(hoveredBadge.id)
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
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isCurrent 
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
