// ── Animal Data ─────────────────────────────────────────────
// Each animal has a name, Wikipedia image URL, difficulty, and wrong answer options.

export interface Animal {
  id: string;
  name: string;
  emoji: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wrongOptions: string[];
  funFact: string;
}

export const ANIMALS: Animal[] = [
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/640px-Lion_waiting_in_Namibia.jpg',
    difficulty: 'easy',
    wrongOptions: ['Tiger', 'Cheetah', 'Leopard'],
    funFact: 'Lions are the only cats that live in groups, called prides.',
  },
  {
    id: 'elephant',
    name: 'Elephant',
    emoji: '🐘',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg',
    difficulty: 'easy',
    wrongOptions: ['Rhinoceros', 'Hippo', 'Mammoth'],
    funFact: 'Elephants are the largest land animals and can live up to 70 years.',
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    emoji: '🦒',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/640px-Giraffe_Mikumi_National_Park.jpg',
    difficulty: 'easy',
    wrongOptions: ['Okapi', 'Camel', 'Zebra'],
    funFact: 'Giraffes have the same number of neck vertebrae as humans — just 7, but much longer!',
  },
  {
    id: 'penguin',
    name: 'Penguin',
    emoji: '🐧',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg/640px-South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg',
    difficulty: 'easy',
    wrongOptions: ['Puffin', 'Toucan', 'Flamingo'],
    funFact: 'Penguins are birds that cannot fly but are excellent swimmers.',
  },
  {
    id: 'zebra',
    name: 'Zebra',
    emoji: '🦓',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Plains_Zebra_Equus_quagga.jpg/640px-Plains_Zebra_Equus_quagga.jpg',
    difficulty: 'easy',
    wrongOptions: ['Horse', 'Donkey', 'Mule'],
    funFact: "Each zebra's stripe pattern is unique, like a human fingerprint.",
  },
  {
    id: 'flamingo',
    name: 'Flamingo',
    emoji: '🦩',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lesser_Flamingo_%28Phoeniconaias_minor%29.jpg/640px-Lesser_Flamingo_%28Phoeniconaias_minor%29.jpg',
    difficulty: 'easy',
    wrongOptions: ['Heron', 'Ibis', 'Spoonbill'],
    funFact: 'Flamingos get their pink color from the carotenoid pigments in the algae and crustaceans they eat.',
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    emoji: '🐆',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/The_Cheetah_%28Acinonyx_jubatus%29.jpg/640px-The_Cheetah_%28Acinonyx_jubatus%29.jpg',
    difficulty: 'medium',
    wrongOptions: ['Leopard', 'Jaguar', 'Ocelot'],
    funFact: 'The cheetah is the fastest land animal, reaching speeds of 112 km/h.',
  },
  {
    id: 'octopus',
    name: 'Octopus',
    emoji: '🐙',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Day_Octopus_%28Octopus_cyanea%29.jpg/640px-Day_Octopus_%28Octopus_cyanea%29.jpg',
    difficulty: 'medium',
    wrongOptions: ['Squid', 'Jellyfish', 'Cuttlefish'],
    funFact: 'Octopuses have three hearts and blue blood.',
  },
  {
    id: 'koala',
    name: 'Koala',
    emoji: '🐨',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Koala_climbing_tree.jpg/640px-Koala_climbing_tree.jpg',
    difficulty: 'medium',
    wrongOptions: ['Wombat', 'Possum', 'Quokka'],
    funFact: 'Koalas sleep up to 22 hours a day to conserve energy from their low-nutrient eucalyptus diet.',
  },
  {
    id: 'mantis',
    name: 'Mantis Shrimp',
    emoji: '🦐',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mantis_shrimp_from_front.jpg/640px-Mantis_shrimp_from_front.jpg',
    difficulty: 'medium',
    wrongOptions: ['Lobster', 'Crayfish', 'Shrimp'],
    funFact: 'Mantis shrimp can see 16 types of color receptors, compared to 3 in humans.',
  },
  {
    id: 'axolotl',
    name: 'Axolotl',
    emoji: '🦎',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/AxolotlBBG.jpg/640px-AxolotlBBG.jpg',
    difficulty: 'hard',
    wrongOptions: ['Salamander', 'Mudpuppy', 'Newt'],
    funFact: 'Axolotls can regenerate entire limbs, heart, and even parts of their brain.',
  },
  {
    id: 'pangolin',
    name: 'Pangolin',
    emoji: '🐾',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pangolin_2_%285484573836%29.jpg/640px-Pangolin_2_%285484573836%29.jpg',
    difficulty: 'hard',
    wrongOptions: ['Armadillo', 'Echidna', 'Anteater'],
    funFact: 'Pangolins are the most trafficked mammal in the world and are covered in keratin scales.',
  },
  {
    id: 'tardigrade',
    name: 'Tardigrade',
    emoji: '🔬',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png/640px-SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png',
    difficulty: 'hard',
    wrongOptions: ['Water Bear Mite', 'Dust Mite', 'Copepod'],
    funFact: 'Tardigrades can survive in space, extreme radiation, and temperatures from -272°C to 150°C.',
  },
  {
    id: 'blobfish',
    name: 'Blobfish',
    emoji: '🐡',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Psychrolutes_marcidus.jpg/640px-Psychrolutes_marcidus.jpg',
    difficulty: 'hard',
    wrongOptions: ['Anglerfish', 'Gulper Eel', 'Fangtooth Fish'],
    funFact: 'Blobfish look normal underwater at high pressure — the melted face appearance only happens when brought to the surface.',
  },
];

export function getRandomAnimals(count: number): Animal[] {
  // Stratified shuffle: try to include at least one of each difficulty
  const easy = ANIMALS.filter(a => a.difficulty === 'easy');
  const medium = ANIMALS.filter(a => a.difficulty === 'medium');
  const hard = ANIMALS.filter(a => a.difficulty === 'hard');

  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const picks: Animal[] = [
    ...shuffle(easy).slice(0, 2),
    ...shuffle(medium).slice(0, 2),
    ...shuffle(hard).slice(0, 1),
  ];

  // Fill remaining if count > 5 or above picked
  if (picks.length < count) {
    const remaining = ANIMALS.filter(a => !picks.includes(a));
    picks.push(...shuffle(remaining).slice(0, count - picks.length));
  }

  return shuffle(picks).slice(0, count);
}

export function buildChoices(correct: Animal): string[] {
  const wrong = correct.wrongOptions.slice(0, 3);
  // Safety: pad with generic options if somehow fewer than 3 wrong options exist
  const padded = [...wrong];
  while (padded.length < 3) padded.push('Unknown Animal');
  const all = [...padded, correct.name].sort(() => Math.random() - 0.5);
  return all;
}
