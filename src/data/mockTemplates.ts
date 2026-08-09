import { Genre, PovFormat, TargetLength } from '../types';

export interface PresetTemplate {
  id: string;
  title: string;
  authorName: string;
  genre: Genre;
  subgenre: string;
  targetLength: TargetLength;
  povFormat: PovFormat;
  styleProfile: string;
  premise: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'obsidian-oath',
    title: 'The Obsidian Oath',
    authorName: 'Evelyn Vance',
    genre: 'Fantasy/Sci-Fi',
    subgenre: 'Dark Romantic Fantasy & Court Intrigue',
    targetLength: 'Full Novel (40-320 pages)',
    povFormat: '1st Present Dual',
    styleProfile: 'High-tension, visceral sensory descriptions, lyrical prose, dark court atmosphere',
    premise: 'A disgraced shadow-mage is forced into a political marriage with her family\'s sworn enemy—a ruthlessly quiet general whose mind is protected by ancient obsidian wards. To save her sister, she must assassinate him before the winter Solstice, but as court conspirators launch a coup, she realizes he is the only one keeping the kingdom\'s dark gods bound.'
  },
  {
    id: 'quantum-cipher',
    title: 'The Quantum Cipher',
    authorName: 'Marcus Kane',
    genre: 'Thriller/Mystery',
    subgenre: 'Psychological Cyber Thriller',
    targetLength: 'Novella (25-120 pages)',
    povFormat: '3rd Past Single',
    styleProfile: 'Fast-paced, razor-sharp dialogue, claustrophobic suspense, technical precision',
    premise: 'A disgraced cryptographer working at an abandoned deep-sea data vault intercepts an encrypted memory file timestamped three days in the future—documenting his own murder. With a storm locking down the rig and six researchers onboard, he must untangle the cipher before midnight while deciding who among his crew is the killer.'
  },
  {
    id: 'regency-whispers',
    title: 'A Scandalous Accord',
    authorName: 'Clara Sterling',
    genre: 'Romance',
    subgenre: 'Regency Enemies-to-Lovers',
    targetLength: 'Full Novel (40-320 pages)',
    povFormat: '1st Present Dual',
    styleProfile: 'Witty banter, slow-burn emotional tension, rich period details, sharp social commentary',
    premise: 'To avoid an unwanted marriage, Lady Seraphina enters a fake engagement with the brooding Duke of Ravenscroft, a war veteran seeking to restore his family\'s ruined estate. But when a mysterious scandal-sheet threatens to reveal her secret radical pamphlets, the Duke proves willing to burn down London society to shield her.'
  },
  {
    id: 'blackwood-manor',
    title: 'Murder at Blackwood Manor',
    authorName: 'Arthur Pendelton',
    genre: 'Cozy Mystery',
    subgenre: 'British Country House Whodunit',
    targetLength: 'Novella (25-120 pages)',
    povFormat: '1st Present Single',
    styleProfile: 'Warm, observant, atmospheric, puzzle-box plot with charming local eccentrics',
    premise: 'When an infamous art collector drops dead during a stormy weekend house party in the Cotswolds, rare book restorer Penelope Finch relies on her trained eye for forgery to spot the poisoner among eight eccentric suspects—all while managing her mischievous tabby cat, Watson.'
  }
];

export const PRICING_TIERS = [
  {
    id: 'lite',
    name: 'Lite',
    priceMXN: 1090,
    approxUSD: 59,
    creditsMonthly: 50000,
    discountPercent: 80,
    exports: ['PDF'],
    includesLaunchKit: false,
    prioritySupport: false,
    features: [
      '50,000 Monthly AI Credits',
      'PDF Export Format',
      'Full Commercial Rights Ownership',
      'Basic Continuity Engine',
      '3-Pass Chapter Drafting'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMXN: 1790,
    approxUSD: 99,
    creditsMonthly: 100000,
    discountPercent: 80,
    exports: ['PDF', 'EPUB', 'DOCX'],
    includesLaunchKit: true,
    prioritySupport: false,
    features: [
      '100,000 Monthly AI Credits',
      'PDF, EPUB, & DOCX Exports',
      'Automated Author Launch Kit',
      'Full Story Thread & Lexical Engine',
      '100% Commercial Rights Certificate',
      'Plot-Twist & Spoiler Audit Pass'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    priceMXN: 3290,
    approxUSD: 179,
    creditsMonthly: 200000,
    discountPercent: 80,
    exports: ['PDF', 'EPUB', 'DOCX'],
    includesLaunchKit: true,
    prioritySupport: false,
    features: [
      '200,000 Monthly AI Credits',
      'PDF, EPUB, & DOCX Exports',
      'Automated Author Launch Kit',
      'AI Cover Art & Style Generator',
      'Multi-Character Voice Calibration',
      'Unlimited Re-Audit Passes'
    ]
  },
  {
    id: 'author',
    name: 'Author Studio',
    priceMXN: 6490,
    approxUSD: 349,
    creditsMonthly: 400000,
    discountPercent: 80,
    exports: ['PDF', 'EPUB', 'DOCX'],
    includesLaunchKit: true,
    prioritySupport: true,
    features: [
      '400,000 Monthly AI Credits',
      'PDF, EPUB, & DOCX Exports',
      'Automated Author Launch Kit',
      'Priority Queue Execution Engine',
      'Direct Relational Database Sync',
      'VIP Priority Support & KDP Setup Guide'
    ]
  }
];
