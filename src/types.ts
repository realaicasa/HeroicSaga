export type Genre = 
  | 'Romance' 
  | 'Thriller/Mystery' 
  | 'Fantasy/Sci-Fi' 
  | 'Young Adult' 
  | 'Literary Fiction' 
  | 'Horror/Dark' 
  | 'Cozy Mystery'
  | 'Space Opera'
  | 'Heroic Life Adventure';

export type PovFormat = 
  | '1st Present Dual' 
  | '1st Present Single' 
  | '3rd Past Multi' 
  | '3rd Past Single';

export type TargetLength = 
  | 'Short Story (15-50 pages)' 
  | 'Novella (25-120 pages)' 
  | 'Full Novel (40-320 pages)'
  | 'Interactive Storyboard (12 Hero Stages)';

export type ProjectStatus = 'Draft' | 'Blueprint' | 'Writing' | 'Complete' | 'Archived';

export interface Project {
  id: string;
  title: string;
  authorName: string;
  logline: string;
  theme: string;
  genre: Genre;
  subgenre: string;
  targetLength: TargetLength;
  povFormat: PovFormat;
  styleProfile: string;
  premise: string;
  totalChapters: number;
  status: ProjectStatus;
  creditsCost: number;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  coverStyle?: string;
  contentRightsCertId?: string;
  rightsCertHash?: string;
  isProBranching?: boolean;
  heroStoryData?: HeroStory;
}

export type CharacterRole = 'Protagonist' | 'Ally' | 'Mentor' | 'Rival' | 'Antagonist' | 'Supporting';

export interface Character {
  id: string;
  projectId: string;
  name: string;
  role: CharacterRole;
  voiceSignature: string;
  immutableFacts: string[];
  portraitPrompt?: string;
  avatarUrl?: string;
  visualAnchorPrompt?: string;
  seedNumber?: number;
}

export type ThreadStatus = 'Planted' | 'In-Progress' | 'Resolved';

export interface StoryThread {
  id: string;
  projectId: string;
  threadName: string;
  setupChapter: number;
  payoffChapter: number;
  summary: string;
  status: ThreadStatus;
  relationshipMatrix?: Record<string, string>;
}

export type ChapterStatus = 'Pending' | 'Drafting' | 'Audited' | 'Error';

export interface ChapterAudit {
  timestamp: string;
  passed: boolean;
  continuityScore: number;
  notes: string;
  twistSpoilersDetected: boolean;
}

export interface Chapter {
  id: string;
  projectId: string;
  chapterNumber: number;
  title: string;
  sceneSummary: string;
  openingTechnique: string;
  endingTechnique: string;
  activeThreads: string[];
  charactersPresent: string[];
  rawProse: string;
  wordCount: number;
  emDashCount: number;
  status: ChapterStatus;
  lexicalBlacklist: string[];
  auditLog?: ChapterAudit;
}

export interface CharacterCard {
  name: string;
  role: string;
  portraitPrompt: string;
  traits: string[];
  voiceSignature: string;
  quote: string;
  imageUrl?: string;
}

export interface AestheticQuote {
  quote: string;
  chapterNumber: number;
  backdropPrompt: string;
  styleNote: string;
  imageUrl?: string;
}

export interface TeaserExcerpt {
  title: string;
  content: string;
  wordCount: number;
  hookType: string;
  socialHashtags: string[];
}

export interface LaunchKit {
  id: string;
  projectId: string;
  characterCards: CharacterCard[];
  aestheticQuotes: AestheticQuote[];
  teaserExcerpts: TeaserExcerpt[];
  contentRightsCertId: string;
  timestamp: string;
  auditHash: string;
  socialCaptions?: string[];
}

export interface EngineMetrics {
  lexicalTokensBlocked: number;
  emDashRatePer300Words: number;
  continuityChecksPassed: number;
  totalWordsGenerated: number;
  currentChapterNumber: number;
  activeTensionPoints: number;
}

export interface PricingTier {
  id: 'lite' | 'pro' | 'platinum' | 'author';
  name: string;
  priceMXN: number;
  approxUSD: number;
  creditsMonthly: number;
  discountPercent: number;
  exports: string[];
  includesLaunchKit: boolean;
  prioritySupport: boolean;
  features: string[];
}

export interface RelationalDbConfig {
  databaseId?: string;
  isCustomConnected: boolean;
  lastSyncTimestamp?: string;
}

// HERO'S JOURNEY PWA SPECIFIC STRUCTURES
export interface HeroCharacter {
  characterId: string;
  name: string;
  role: 'Protagonist' | 'Ally' | 'Mentor' | 'Rival';
  visualAnchorPrompt: string;
  suggestedSeed: number;
  avatarImageUrl?: string;
}

export interface ComicPanel {
  panelNumber: number;
  caption: string;
  speechBubble?: string;
  speakerName?: string;
  artPrompt: string;
  imageUrl?: string;
}

export interface HeroStoryNode {
  nodeId: string;
  parentNodeId: string;
  stageNumber: number; // 1 to 12 Hero's Journey stage
  stageName: string; // e.g., "1. Ordinary World", "4. Meeting the Mentor / Crossing Threshold", "8. The Ordeal", "12. Return with Elixir"
  isChoicePoint: boolean; // True for strategic pivot points (Stages 4, 8, 12)
  choiceLabel: string; // Action text for the reader
  choiceOptionSummary?: string;
  narrativeText: string;
  imagePrompt: string;
  imageUrl?: string;
  comicPanels?: ComicPanel[];
  videoMotionScript?: {
    cameraMotion: 'Pan Right' | 'Zoom In Slow' | 'Parallax Tilt' | 'Orbit Soft';
    narrationAudioScript: string;
    ambientSoundscape: string;
    durationSeconds: number;
  };
}

export interface HeroStory {
  title: string;
  artStyleAnchor: string;
  summary: string;
  protagonistName: string;
  familyAllies: string[];
  characters: HeroCharacter[];
  storyNodes: HeroStoryNode[];
  currentNodeId: string;
}

export interface SuperAdminStats {
  totalProjects: number;
  activePwaSessions: number;
  creditsConsumedTotal: number;
  aiStudioProxyRequests: number;
  averageGenerationTimeMs: number;
  modelCostsUsd: number;
  systemHealth: 'Optimal' | 'Degraded' | 'Maintenance';
}

