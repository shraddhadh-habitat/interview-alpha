const NAMES = [
  // Indian — less common
  'Aanya', 'Ishaan', 'Zara', 'Vihaan', 'Kiara',
  'Advait', 'Tara', 'Rehan', 'Myra', 'Aryan',
  'Noor', 'Kabir', 'Ira', 'Dhruv', 'Saira',
  // Global
  'Sofia', 'Liam', 'Mia', 'Ethan', 'Chloe',
  'Lucas', 'Aria', 'Noah', 'Luna', 'Marcus',
  'Leila', 'James', 'Nina', 'Omar', 'Elena',
  'Wei', 'Sara', 'Alex', 'Yuki', 'Ryan'
];

const PM_ACTIONS = [
  'answered a Product Sense question',
  'practiced a Metrics question',
  'completed a Strategy question',
  'answered a Behavioral question',
  'practiced an Estimation question',
  'scored 8/10 on a PM question',
  'just finished a Google PM question',
  'completed an Amazon Leadership question',
];

const DS_ACTIONS = [
  'answered a Statistics question',
  'practiced an ML Concepts question',
  'completed a SQL question',
  'answered a Probability question',
  'practiced a Case Study question',
  'scored 9/10 on a DS question',
  'just finished a Python question',
  'completed a Data Analysis question',
];

// Generates a fresh random time on every call
export function getRandomTime(): string {
  const times = [
    'just now',
    '1 min ago',
    '2 mins ago',
    '3 mins ago',
    '4 mins ago',
    '5 mins ago',
    '6 mins ago',
    '8 mins ago',
    '10 mins ago',
    '12 mins ago',
  ];
  return times[Math.floor(Math.random() * times.length)];
}

export function getRandomActivity(): string {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const actions = Math.random() > 0.5 ? PM_ACTIONS : DS_ACTIONS;
  const action = actions[Math.floor(Math.random() * actions.length)];
  const time = getRandomTime(); // fresh time on every call
  return `${name} ${action} · ${time}`;
}
