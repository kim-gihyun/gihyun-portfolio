export type Place = {
  name: string;
  kind: "now" | "lived" | "visited";
  lat: number;
  lon: number;
  years?: string;
  stat: string;
  quip: string;
};

// Coordinates are real; quips are not load-bearing.
export const places: Place[] = [
  {
    name: "Hong Kong",
    kind: "now",
    lat: 22.3193,
    lon: 114.1694,
    years: "2025 — now",
    stat: "Current base · HKU",
    quip: "Humidity 90%, ambition 100%. The workshop is a five-minute walk and the trams are louder than my keyboard.",
  },
  {
    name: "Seoul",
    kind: "lived",
    lat: 37.5665,
    lon: 126.978,
    years: "home base since 2006",
    stat: "Home base",
    quip: "Where the dog (뭉이) lives and the Wi-Fi never blinks. Default value of 'home' in every form I fill out.",
  },
  {
    name: "Istanbul",
    kind: "lived",
    lat: 41.0082,
    lon: 28.9784,
    years: "gr. 5 · 4.5 yrs",
    stat: "4.5 years",
    quip: "Two continents, one commute. Learned that 'five minutes away' is a unit of hope, not distance.",
  },
  {
    name: "London",
    kind: "lived",
    lat: 51.5074,
    lon: -0.1278,
    years: "age 3 · 1 yr",
    stat: "1 year",
    quip: "Aged three. Remember approximately one (1) pigeon, vividly. Foundational, clearly.",
  },
  {
    name: "Singapore",
    kind: "visited",
    lat: 1.3521,
    lon: 103.8198,
    stat: "2 weeks",
    quip: "Air-conditioned to perfection. Ate my body weight in chili crab and regret nothing.",
  },
  {
    name: "Osaka",
    kind: "visited",
    lat: 34.6937,
    lon: 135.5023,
    stat: "4 days",
    quip: "Neon, takoyaki, and a grip-machine habit I do not wish to discuss with my dentist.",
  },
  {
    name: "Prague",
    kind: "visited",
    lat: 50.0755,
    lon: 14.4378,
    stat: "3 days",
    quip: "Every building looks like a problem set in projective geometry. Astronomical clock: surprisingly punctual.",
  },
  {
    name: "Vienna",
    kind: "visited",
    lat: 48.2082,
    lon: 16.3738,
    stat: "2 days",
    quip: "Coffee priced like a research grant. Worth it. Probably.",
  },
  {
    name: "Shenzhen",
    kind: "visited",
    lat: 22.5431,
    lon: 114.0579,
    stat: "2 days",
    quip: "Component heaven. Walked in for one connector, left with a parts bin and a plan.",
  },
];

export const travelStats = [
  { k: "Cities lived", v: "4" },
  { k: "Continents", v: "3" },
  { k: "Longest stint", v: "Seoul" },
  { k: "Shortest", v: "Vienna · 2d" },
];
