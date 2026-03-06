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
    funFact: 'Lions are the only cats that live in groups, called prides.'
  },
  {
    id: 'elephant',
    name: 'Elephant',
    emoji: '🐘',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg',
    difficulty: 'easy',
    wrongOptions: ['Rhinoceros', 'Hippo', 'Mammoth'],
    funFact: 'Elephants are the largest land animals and can live up to 70 years.'
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    emoji: '🦒',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/640px-Giraffe_Mikumi_National_Park.jpg',
    difficulty: 'easy',
    wrongOptions: ['Okapi', 'Camel', 'Zebra'],
    funFact: 'Giraffes have the same number of neck vertebrae as humans — just 7, but much longer!'
  },
  {
    id: 'penguin',
    name: 'Penguin',
    emoji: '🐧',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg/640px-South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg',
    difficulty: 'easy',
    wrongOptions: ['Puffin', 'Toucan', 'Flamingo'],
    funFact: 'Penguins are birds that cannot fly but are excellent swimmers.'
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    emoji: '🐆',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/The_Cheetah_%28Acinonyx_jubatus%29.jpg/640px-The_Cheetah_%28Acinonyx_jubatus%29.jpg',
    difficulty: 'medium',
    wrongOptions: ['Leopard', 'Jaguar', 'Ocelot'],
    funFact: 'The cheetah is the fastest land animal, reaching speeds of 112 km/h.'
  },
  {
    id: 'octopus',
    name: 'Octopus',
    emoji: '🐙',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Day_Octopus_%28Octopus_cyanea%29.jpg/640px-Day_Octopus_%28Octopus_cyanea%29.jpg',
    difficulty: 'medium',
    wrongOptions: ['Squid', 'Jellyfish', 'Cuttlefish'],
    funFact: 'Octopuses have three hearts and blue blood.'
  },
  {
    id: 'axolotl',
    name: 'Axolotl',
    emoji: '🦎',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/AxolotlBBG.jpg/640px-AxolotlBBG.jpg',
    difficulty: 'hard',
    wrongOptions: ['Salamander', 'Mudpuppy', 'Newt'],
    funFact: 'Axolotls can regenerate entire limbs, heart, and even parts of their brain.'
  },
  {
    id: 'pangolin',
    name: 'Pangolin',
    emoji: '🪖',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pangolin_2_%285484573836%29.jpg/640px-Pangolin_2_%285484573836%29.jpg',
    difficulty: 'hard',
    wrongOptions: ['Armadillo', 'Echidna', 'Anteater'],
    funFact: 'Pangolins are the most trafficked mammal in the world and are covered in keratin scales.'
  },
];

export function getRandomAnimals(count: number): Animal[] {
  const shuffled = [...ANIMALS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function buildChoices(correct: Animal): string[] {
  const wrong = correct.wrongOptions.slice(0, 3);
  const all = [...wrong, correct.name].sort(() => Math.random() - 0.5);
  return all;
}
