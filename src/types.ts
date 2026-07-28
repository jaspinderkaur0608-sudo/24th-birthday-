export type LetterCategory = 
  | 'dreams' 
  | 'memories' 
  | 'advice' 
  | 'funny' 
  | 'kindness' 
  | 'hope';

export type EnvelopeRarity = 
  | 'standard' 
  | 'golden' 
  | 'moonlight' 
  | 'cosmic' 
  | 'founders';

export interface LocationGeo {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Letter {
  id: string;
  name: string;
  location: string;
  lat?: number;
  lng?: number;
  country?: string;
  category: LetterCategory;
  content: string;
  archiveNumber: number;
  rarity: EnvelopeRarity;
  dateCreated: string;
  isCapsuleLetter?: boolean;
  waxColor?: string;
  sealSymbol?: string;
  paperStyle?: 'aged' | 'celestial' | 'parchment' | 'midnight';
}

export interface MuseumStats {
  lettersArchived: number;
  locationsRepresented: number;
  storiesPreserved: number;
  museumWingsOpened: number;
}

export interface CapsuleVaultStats {
  totalSealed: number;
  uniqueLocations: number;
  daysRemaining: number;
  unlockDate: string;
  status: 'sealed' | 'unlocking' | 'unlocked';
}

export type ViewTab = 'museum' | 'globe' | 'categories' | 'rare' | 'capsule' | 'constellation';
