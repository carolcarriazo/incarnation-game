import {
  Award, ShieldAlert, Baby, Sparkles, Ghost,
  Swords, Droplets, HeartHandshake, Brain,
  DoorClosed, Rainbow, UserX, Crown, Compass,
  Bone, Flag, Hourglass, PersonStanding, HeartCrack, Sun, Unlock,
  Skull, Moon
} from 'lucide-react';

export const BADGE_DEFINITIONS = [
  {
    id: 'queen_of_the_night',
    name: 'Queen of the Night',
    icon: Moon,
    description: 'Elevated from sex work through beauty and intelligence to become a wealthy mistress or celebrated courtesan to someone rich, powerful, or famous.',
    colorClass: 'bg-purple-950/60 border-purple-400/70 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.35)]',
    condition: (life) => life.becameEliteMistress === true
  },
  {
    id: 'mask_of_sanity',
    name: 'Mask of Sanity',
    icon: Skull,
    description: 'Born without the faculty of emotional empathy, remorse, or guilt — navigating humanity behind a calculated mask.',
    colorClass: 'bg-zinc-950/60 border-zinc-400/60 text-zinc-200 shadow-[0_0_12px_rgba(161,161,170,0.25)]',
    condition: (life) => life.isPsychopath === true
  },
  {
    id: 'bye_baby',
    name: 'Bye, Baby',
    icon: Baby,
    description: 'Died in infancy at 0 years old before reaching your first birthday.',
    colorClass: 'bg-indigo-950/50 border-indigo-500/60 text-indigo-300',
    condition: (life) => life.age === 0
  },
  {
    id: 'in_chains',
    name: 'In Chains',
    icon: ShieldAlert,
    description: 'Enslaved or captured into forced servitude during your lifetime.',
    colorClass: 'bg-red-950/40 border-red-600/50 text-red-300',
    condition: (life) => life.wasEnslavedLater === true || life.socialClass?.toLowerCase().includes('slave') || life.socialClass?.toLowerCase().includes('enslaved')
  },
  {
    id: 'unbroken',
    name: 'Unbroken',
    icon: Unlock,
    description: 'Escaped captivity, fled via abolitionist networks, or achieved freedom from enslavement.',
    colorClass: 'bg-amber-500/25 border-amber-400/60 text-amber-300',
    condition: (life) => life.escapedSlavery === true
  },
  {
    id: 'the_diaspora',
    name: 'The Diaspora',
    icon: Compass,
    description: 'Navigated the heritage, traditions, or resilience of the Jewish diaspora across world history.',
    colorClass: 'bg-blue-950/40 border-blue-500/60 text-blue-300',
    condition: (life) => life.isJewish === true
  },
  {
    id: 'haute_couture',
    name: 'Haute Couture',
    icon: Sparkles,
    description: 'Pursued a career in fashion or commercial modeling in the modern era due to extraordinary physical beauty.',
    colorClass: 'bg-pink-950/40 border-pink-500/60 text-pink-300',
    condition: (life) => life.modelingCareer?.accepted === true
  },
  {
    id: 'your_highness',
    name: 'Your Highness',
    icon: Crown,
    description: 'Born into royalty or as a member of a historical ruling dynasty.',
    colorClass: 'bg-amber-400/30 border-yellow-400/70 text-yellow-200',
    condition: (life) => life.isRoyaltyOrHistoric === true || life.socialClass?.toLowerCase().includes('royalt') || life.socialClass?.toLowerCase().includes('monarch') || life.socialClass?.toLowerCase().includes('emperor') || life.socialClass?.toLowerCase().includes('dynasty')
  },
  {
    id: 'stayin_alive',
    name: "Stayin' Alive",
    icon: Sun,
    description: 'Still alive and walking the earth in the present day.',
    colorClass: 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300',
    condition: (life) => life.isAlive === true
  },
  {
    id: 'encino_man',
    name: 'Encino Man',
    icon: Bone,
    description: 'Lived before 9000 BCE in the deep prehistoric past.',
    colorClass: 'bg-stone-500/25 border-stone-400/60 text-stone-300',
    condition: (life) => life.birthYear < -9000
  },
  {
    id: 'the_british_are_coming',
    name: 'The British Are Coming',
    icon: Flag,
    description: 'Witnessed the British Empire colonize, conquer, or subjugate their homeland.',
    colorClass: 'bg-red-800/30 border-red-500/60 text-red-300',
    condition: (life) => {
      // 1. Check historical events
      if (life.historicalEventsLivedThrough && life.historicalEventsLivedThrough.length > 0) {
        const match = life.historicalEventsLivedThrough.some(e => {
          const text = ((e.event || '') + ' ' + (e.impact || '')).toLowerCase();
          return (text.includes('british') || text.includes('east india company') || text.includes('crown colony') || text.includes('treaty of waitangi') || text.includes('treaty of nanking') || text.includes('opium war') || text.includes('raj') || text.includes('scramble for africa')) &&
            (text.includes('colon') || text.includes('conquest') || text.includes('invasi') || text.includes('rule') || text.includes('annex') || text.includes('occup') || text.includes('war') || text.includes('treaty') || text.includes('company rule') || text.includes('subjugat'));
        });
        if (match) return true;
      }
      // 2. Era & Region heuristics for British colonization period
      if (!life.region) return false;
      const reg = life.region.toLowerCase();
      const isBritishColonyEra = life.birthYear >= 1600 && life.birthYear <= 1947;
      const isColonizedRegion = reg.includes('india') || reg.includes('mughal') || reg.includes('maratha') || reg.includes('aotearoa') || reg.includes('māori') || reg.includes('australia') || reg.includes('sahul') || reg.includes('thirteen colonies') || reg.includes('north america') || reg.includes('ireland') || reg.includes('ashanti') || reg.includes('benin') || reg.includes('nigeria') || reg.includes('zulu') || reg.includes('cape colony') || reg.includes('swahili') || reg.includes('kenya') || reg.includes('egypt') || reg.includes('burma') || reg.includes('jamaica');
      return isBritishColonyEra && isColonizedRegion && (life.isMinority || (!reg.includes('britain') && !reg.includes('england')));
    }
  },
  {
    id: 'the_end_of_time',
    name: 'The End of Time',
    icon: Hourglass,
    description: 'Witnessed the collapse, sacking, or fall of their empire or civilization.',
    colorClass: 'bg-purple-950/40 border-purple-500/60 text-purple-300',
    condition: (life) => {
      // 1. Check historical events
      if (life.historicalEventsLivedThrough && life.historicalEventsLivedThrough.length > 0) {
        const match = life.historicalEventsLivedThrough.some(e => {
          const text = ((e.event || '') + ' ' + (e.impact || '')).toLowerCase();
          return text.includes('fall of') || text.includes('collapse of') || text.includes('sack of') ||
            text.includes('destruction of') || text.includes('conquest of') || text.includes('end of the') ||
            text.includes('spanish conquest') || text.includes('mongol invasion') || text.includes('bronze age collapse');
        });
        if (match) return true;
      }
      // 2. Specific landmark civilization collapses by year & region
      const by = life.birthYear;
      const dy = life.birthYear + (life.age || 0);
      const reg = (life.region || '').toLowerCase();
      // Fall of Western Rome (476 CE)
      if ((reg.includes('rome') || reg.includes('roman') || reg.includes('gaul') || reg.includes('hispania')) && by <= 476 && dy >= 476) return true;
      // Fall of Constantinople / Byzantium (1453 CE)
      if ((reg.includes('byzantine') || reg.includes('constantinople')) && by <= 1453 && dy >= 1453) return true;
      // Fall of Inca Empire (1532-1572 CE)
      if ((reg.includes('inca') || reg.includes('cusco') || reg.includes('tahuantinsuyo')) && by <= 1572 && dy >= 1532) return true;
      // Fall of Aztec Empire (1519-1521 CE)
      if ((reg.includes('aztec') || reg.includes('tenochtitlan') || reg.includes('mexica')) && by <= 1521 && dy >= 1519) return true;
      // Sacking of Baghdad (1258 CE)
      if ((reg.includes('baghdad') || reg.includes('abbasid')) && by <= 1258 && dy >= 1258) return true;
      // Bronze Age Collapse (~1200-1150 BCE)
      if ((reg.includes('mycenae') || reg.includes('hittite') || reg.includes('ugarit') || reg.includes('knossos')) && by <= -1150 && dy >= -1200) return true;
      // Fall of Shang Dynasty (~1046 BCE)
      if (reg.includes('shang') && by <= -1046 && dy >= -1046) return true;
      // Fall of Qin Dynasty (206 BCE)
      if (reg.includes('qin') && by <= -206 && dy >= -206) return true;
      // Fall of Carthage (146 BCE)
      if (reg.includes('carthage') && by <= -146 && dy >= -146) return true;
      return false;
    }
  },
  {
    id: 'maimed',
    name: 'Maimed',
    icon: HeartCrack,
    description: 'Survived a violent encounter or traumatic disaster with permanent scarring or disfigurement.',
    colorClass: 'bg-rose-950/50 border-rose-600/60 text-rose-300',
    condition: (life) => life.isMaimed === true
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    icon: PersonStanding,
    description: 'Born with dwarfism (achondroplasia) or disproportionate short stature.',
    colorClass: 'bg-emerald-900/40 border-emerald-500/60 text-emerald-300',
    condition: (life) => life.disabilityCategory === "Skeletal dysplasia or short stature condition" || (life.disabilityExamples && life.disabilityExamples.toLowerCase().includes('dwarf'))
  },
  {
    id: 'emigre',
    name: 'Émigré',
    icon: Compass,
    description: 'Emigrated to a distant land and lived out their days far from where they were born.',
    colorClass: 'bg-teal-500/20 border-teal-500/50 text-teal-300',
    condition: (life) => life.isEmigrant === true || (life.deathLat != null && life.lat != null && (life.deathLat !== life.lat || life.deathLng !== life.lng))
  },
  {
    id: 'brush_with_greatness',
    name: 'Brush with Greatness',
    icon: Crown,
    description: 'Crossed paths with, witnessed, or met a famous historical figure.',
    colorClass: 'bg-amber-400/25 border-amber-400/60 text-amber-300',
    condition: (life) => life.historicalEncounters && life.historicalEncounters.length > 0
  },
  {
    id: 'centenarian',
    name: 'Centenarian',
    icon: Award,
    description: 'Lived to be 100 or older.',
    colorClass: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    condition: (life) => life.age >= 100
  },
  {
    id: 'fallen_in_battle',
    name: 'Fallen in Battle',
    icon: ShieldAlert,
    description: 'Died in combat or war.',
    colorClass: 'bg-red-900/40 border-red-500/50 text-red-400',
    condition: (life) => {
      if (!life.causeOfDeath) return false;
      const death = life.causeOfDeath.toLowerCase();
      return death.includes('battle') || death.includes('combat') ||
        death.includes('shrapnel') || death.includes('artillery') ||
        death.includes('shield wall') || death.includes('spear thrust') ||
        death.includes('cavalry');
    }
  },
  {
    id: 'died_in_childbirth',
    name: 'Died in Childbirth',
    icon: Baby,
    description: 'Died due to complications during childbirth.',
    colorClass: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
    condition: (life) => {
      if (life.maternalRoll) return true;
      if (!life.causeOfDeath) return false;
      const death = life.causeOfDeath.toLowerCase();
      return death.includes('postpartum') || death.includes('childbed') || death.includes('obstructed labor');
    }
  },
  {
    id: 'legendary',
    name: 'Legendary',
    icon: Sparkles,
    description: 'Achieved the highest level of fame and is remembered forever.',
    colorClass: 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300',
    condition: (life) => life.fame && life.fame.includes('Properly Famous')
  },
  {
    id: 'cut_short',
    name: 'Cut Short',
    icon: Ghost,
    description: 'Died between the ages of 5 and 15.',
    colorClass: 'bg-slate-700/40 border-slate-500/50 text-slate-300',
    condition: (life) => life.age >= 5 && life.age <= 15
  },
  {
    id: 'by_the_sword',
    name: 'By the Sword',
    icon: Swords,
    description: 'Met a violent end outside of war (assassination, murder, domestic violence, or duel).',
    colorClass: 'bg-orange-600/20 border-orange-500/50 text-orange-400',
    condition: (life) => {
      if (!life.causeOfDeath) return false;
      const death = life.causeOfDeath.toLowerCase();
      const isWar = death.includes('battle') || death.includes('combat') || death.includes('shrapnel') || death.includes('siege') || death.includes('bombardment') || death.includes('sacking') || death.includes('military raid');
      if (isWar) return false;
      return death.includes('assassination') || death.includes('murder') ||
        death.includes('stabbing') || death.includes('homicide') ||
        death.includes('duel') || death.includes('assault') || death.includes('firearm trauma') ||
        death.includes('domestic violence') || death.includes('domestic assault') || death.includes('strangulation') ||
        death.includes('witchcraft');
    }
  },
  {
    id: 'strong_swimmers',
    name: 'Strong Swimmers',
    icon: Droplets,
    description: 'Fathered 8 or more children.',
    colorClass: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    condition: (life) => life.sex === 'Male' && life.childrenCount >= 8
  },
  {
    id: 'goddess_mother',
    name: 'Goddess Mother',
    icon: HeartHandshake,
    description: 'Gave birth to 8 or more children.',
    colorClass: 'bg-pink-500/20 border-pink-500/50 text-pink-400',
    condition: (life) => life.sex === 'Female' && life.childrenCount >= 8
  },
  {
    id: 'genius',
    name: 'Genius',
    icon: Brain,
    description: 'Possessed an extraordinarily high intellect (90+).',
    colorClass: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    condition: (life) => life.intelligence >= 90
  },
  {
    id: 'in_the_closet',
    name: 'In the Closet',
    icon: DoorClosed,
    description: 'A homosexual or bisexual character who kept their same-sex desires secret from society.',
    colorClass: 'bg-stone-600/30 border-stone-500/50 text-stone-300',
    condition: (life) => (life.orientation === 'Homosexual' || life.orientation === 'Bisexual') && life.isInTheCloset === true && life.age >= 16
  },
  {
    id: 'out_and_proud',
    name: 'Out and Proud',
    icon: Rainbow,
    description: 'A homosexual or bisexual character who lived openly in their same-sex relationships.',
    colorClass: 'bg-gradient-to-r from-red-500/20 via-green-500/20 to-blue-500/20 border-indigo-400/50 text-white',
    condition: (life) => (life.orientation === 'Homosexual' || life.orientation === 'Bisexual') && life.isOpenlyGay === true && life.age >= 16
  },
  {
    id: 'spinster',
    name: 'Spinster',
    icon: UserX,
    description: 'A woman in the pre-modern age who remained childless.',
    colorClass: 'bg-zinc-500/20 border-zinc-400/50 text-zinc-300',
    condition: (life) => life.sex === 'Female' && !life.isModernEra && life.childrenCount === 0 && life.age >= 30
  }
];

export const evaluateBadges = (lifeData) => {
  const earned = [];
  for (const badge of BADGE_DEFINITIONS) {
    if (badge.condition(lifeData)) {
      earned.push(badge.id);
    }
  }
  return earned;
};
