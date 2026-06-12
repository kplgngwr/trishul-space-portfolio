export interface PressReleasePost {
  id: string;
  title: string;
  excerpt: string;
  category:
    | "Technology"
    | "Company"
    | "Engineering"
    | "Education"
    | "Funding"
    | "Test Updates"
    | "Press Coverage";
  date: string;
  image: string;

  // Content type determines behavior
  type: "internal" | "external";

  // For internal content (full articles hosted on site)
  content?: string[]; // Array of paragraphs
  gallery?: string[]; // Optional detail-page image gallery
  youtubeVideoId?: string; // Optional YouTube video ID (e.g., "dQw4w9WgXcQ")
  youtubeVideoIds?: string[]; // Optional additional YouTube video IDs
  readTime?: string; // Only for internal content

  // For external content (press mentions, external articles)
  externalUrl?: string;
  source?: string; // e.g., "Economic Times", "IAN Group"

  // Optional metadata
  tags?: string[];
  featured?: boolean;
}

export const pressReleasePosts: PressReleasePost[] = [
  // ============================================================================
  // EXTERNAL - Press Coverage & Funding News
  // ============================================================================
  {
    id: "economic-times-funding-announcement",
    type: "external",
    title: "Trishul Space Raises ₹4 Crore in Pre-Seed Funding",
    excerpt:
      "Spacetech startup Trishul Space raises Rs 4 crore in round led by IAN Angel Fund to advance indigenous rocket engine technology.",
    category: "Press Coverage",
    date: "Nov 13, 2025",
    image: "/press",
    externalUrl:
      "https://economictimes.indiatimes.com/tech/funding/spacetech-startup-trishul-space-raises-rs-4-crore-in-round-led-by-ian-angel-fund/articleshow/125302683.cms",
    source: "The Economic Times",
    tags: ["Funding", "Press", "Milestone"],
    featured: true,
  },
  {
    id: "ian-group-funding-press-release",
    type: "external",
    title: "IAN Angel Fund Leads ₹4 Cr Investment in Trishul Space",
    excerpt:
      "Indian Angel Network announces strategic investment in IIT Delhi-incubated rocket propulsion startup building India's next-generation launch vehicles.",
    category: "Press Coverage",
    date: "Nov 10, 2025",
    image: "/pressRelease/IANfund.png",
    externalUrl:
      "https://iangroup.vc/2025/11/10/trishul-space-raises-%E2%82%B94-crore-in-pre-seed-funding-round-led-by-ian-angel-fund/",
    source: "IAN Group",
    tags: ["Funding", "Investment", "Partnership"],
    featured: true,
  },
  {
    id: "Defence, space-tech startups move beyond metros for testing, manufacturing",
    type: "external",
    title: "Defence, space-tech startups move beyond metros for testing, manufacturing",
    excerpt:
      "Space-tech startup Trishul Space, which is based out of IIT Delhi, operates a testing facility in Muradnagar, UP.",
    category: "Press Coverage",
    date: "June 2, 2026",
    image: "/pressRelease/Business-Standard.png",
    externalUrl:
      "https://www.business-standard.com/companies/start-ups/defence-space-tech-startups-move-beyond-metros-for-testing-manufacturing-126061001187_1.html",
    source: "Business Standard",
    tags: ["Funding", "Investment", "Partnership"],
    featured: true,
  },

  // ============================================================================
  // INTERNAL - Test Updates & Engineering Milestones
  // ============================================================================
  {
    id: "early-engine-programs",
    type: "internal",
    title: "Early Engine Programs: Sharv & Amulya-1",
    excerpt:
      "Foundation of our propulsion expertise: how Sharv and Amulya-1 demonstrators established core competencies in liquid rocket engine design and testing.",
    category: "Engineering",
    date: "2023",
    readTime: "10 min read",
    image: "/updates/sharv-1.jpg",
    content: [
      "As part of their undergraduate studies in Aerospace Engineering, the co-founders of Trishul Space: Divyam Kashyap, Aditya Singh, and Rajat Choudhary along with their college team, initiated and executed a series of liquid rocket engine projects to build hands-on expertise in propulsion system design and testing. These early engine programs, Amulya-1 and Sharv, served as technology demonstrators, laying the foundation for Trishul Space's current propulsion developments.",
      "Amulya-1 was developed as a lower-thrust engine to explore propulsion characteristics at a smaller scale. The engine operates on a pressure-fed cycle and utilizes a butane and compressed oxygen propellant combination. During testing, Amulya-1 successfully demonstrated stable combustion and reliable system performance. The project enabled detailed exploration of injector design, combustion behavior, and feed system dynamics in a controlled, low-thrust configuration. Amulya-1 is not a commercial product; it serves as a technology demonstrator to validate design methodologies and build practical engineering experience.",
      "The Sharv engine was developed as a higher-thrust demonstrator to validate core green liquid propulsion capabilities at a meaningful scale. Designed as a pressure-fed liquid rocket engine, Sharv utilizes an ethanol and nitrous oxide propellant combination. During testing, the engine successfully produced 5 kN of thrust and achieved a vacuum specific impulse (Isp) of 280 seconds. The project involved end-to-end execution, including conceptual design, analysis, fabrication, system integration, and hot-fire testing. It serves as a proof of capability, demonstrating the team's ability to design and operate a complete liquid propulsion system.",
      "Together, Sharv and Amulya-1 represent critical milestones in Trishul Space's early development. These programs established core competencies in liquid rocket engine design and analysis, propellant feed system development, combustion and injector design, hardware fabrication and integration, and hot-fire testing and data acquisition. The insights gained from these demonstrators continue to inform the design and development of more advanced propulsion systems currently under development.",
    ],
    gallery: [
      "/updates/sharv-1.jpg",
      "/updates/sharv-2.jpg",
      "/updates/sharv-injector.jpg",
      // "/updates/Amulya-1.png",
    ],
    youtubeVideoId: "YP8ublmVvQo", // Replace with your actual YouTube Video ID
    youtubeVideoIds: ["YP8ublmVvQo", "fp-dmjOpsko"],
    tags: ["Amulya-1", "Sharv", "Early Development", "Foundation", "Engineering"],
    featured: true,
  },
  {
    id: "torch-ignitor-test-success",
    type: "internal",
    title: "Torch Ignitor Test: Achieving Reliable Ignition",
    excerpt:
      "Successful demonstration of our proprietary torch ignitor system, a critical component for reliable engine starts in flight conditions.",
    category: "Test Updates",
    date: "Feb 02, 2026",
    readTime: "6 min read",
    image: "/pressRelease/feb2026.png",
    content: [
      "Achieving reliable ignition in a rocket engine is one of the most critical—and often underestimated—challenges in propulsion development. At Trishul Space, we've successfully tested our torch ignitor system, a key milestone on our path to flight-ready engines.",
      "A torch ignitor is a small combustion device that creates a stable, high-energy flame to initiate combustion in the main chamber. Unlike ground-test igniters that use external power, our torch ignitor must work reliably in the harsh environment of flight: at altitude, in vacuum, and with cryogenic propellants.",
      "Our test campaign validated multiple design aspects: the injector pattern ensures proper mixing of igniter propellants, the combustion chamber geometry maintains stable flame propagation, and the thermal management keeps critical components within operating limits. We achieved 100% ignition success across 25 consecutive test firings.",
      "This seemingly simple component required months of iterative development. We experimented with different propellant combinations, optimized chamber pressures, and fine-tuned the timing sequences. The data from these tests directly feeds into our engine control algorithms, ensuring first-time ignition reliability when it matters most—during flight.",
    ],
    gallery: [
      "/pressRelease/feb2026.png",
    ],
    tags: ["Torch Ignitor", "Testing", "Ignition System"],
    featured: false,
  },  
  
];

/**
 * Pre-computed Map for O(1) press release lookup by ID
 * @description Use this instead of Array.find() for better performance
 */
export const pressReleasePostsMap = new Map<string, PressReleasePost>(
  pressReleasePosts.map((post) => [post.id, post]),
);

/**
 * Get a press release post by ID with O(1) lookup
 * @param id - The press release post ID
 * @returns The press release post or undefined if not found
 */
export function getPressReleasePostById(
  id: string | undefined,
): PressReleasePost | undefined {
  if (!id) return undefined;
  const post = pressReleasePostsMap.get(id);
  if (!post) {
    console.warn(`[PressRelease] Post not found: ${id}`);
  }
  return post;
}

// Legacy exports for backward compatibility during migration
export type BlogPost = PressReleasePost;
export const blogPosts = pressReleasePosts;
export const blogPostsMap = pressReleasePostsMap;
export const getBlogPostById = getPressReleasePostById;
