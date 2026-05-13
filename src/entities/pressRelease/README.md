# Press Release & Updates Section - Documentation

## 📋 Overview

This section showcases **two types of content**:

1. **Internal Content** - Full articles hosted on Trishul Space website (test updates, engineering insights, company milestones)
2. **External Content** - Links to press coverage and articles published on external media (Economic Times, IAN Group, etc.)

## 🏗️ Architecture

```
src/entities/pressRelease/
├── model/
│   └── pressRelease-data.ts   # All content data
└── index.ts                     # Public exports

src/pages/pressRelease/
├── pressRelease.tsx             # Main listing page
├── pressReleasePost.tsx         # Individual article page (internal only)
├── pressRelease.module.css      # Styles
└── index.ts                     # Page exports
```

## 📝 Data Structure

### Interface Definition

```typescript
export interface PressReleasePost {
  id: string;                    // Unique identifier (kebab-case)
  title: string;                 // Article title
  excerpt: string;               // Brief description (1-2 sentences)
  category: Category;            // One of the predefined categories
  date: string;                  // Display date (e.g., "Jan 15, 2025")
  image: string;                 // Path to image (e.g., "/tests/torch.png")
  
  // Content type determines behavior
  type: "internal" | "external";
  
  // For INTERNAL content only
  content?: string[];            // Array of paragraphs
  readTime?: string;             // e.g., "5 min read"
  
  // For EXTERNAL content only
  externalUrl?: string;          // Full URL to external article
  source?: string;               // e.g., "Economic Times", "IAN Group"
  
  // Optional metadata
  tags?: string[];               // For future filtering
  featured?: boolean;            // Highlight important posts
}
```

## 📂 Categories

| Category | Use Case | Examples |
|----------|----------|----------|
| **Test Updates** | Internal testing milestones | Torch ignitor test, Static fire, Component validation |
| **Engineering** | Technical deep-dives | Reusability design, Turbopump development |
| **Technology** | Propulsion tech insights | Methalox advantages, Staged combustion |
| **Company** | Company milestones | Funding, partnerships, team growth |
| **Press Coverage** | External media mentions | News articles, interviews, features |
| **Funding** | Investment announcements | Seed rounds, investor updates |
| **Education** | Educational content | How rockets work, engine cycles |

## ✨ Adding New Content

### Adding an INTERNAL Post (Test Update, Blog Post)

```typescript
{
  id: "your-test-name-here",
  type: "internal",
  title: "Your Test/Article Title",
  excerpt: "A compelling 1-2 sentence summary that appears on the card.",
  category: "Test Updates",
  date: "Jan 25, 2025",
  readTime: "5 min read",
  image: "/tests/your-image.png",
  content: [
    "First paragraph of your article goes here...",
    "Second paragraph continues the story...",
    "Each string in this array is a separate paragraph.",
  ],
  tags: ["Tag1", "Tag2", "Tag3"],
  featured: true, // Set to true for important updates
}
```

**Behavior:**
- Clicking the card navigates to `/press-release/your-test-name-here`
- Full article is displayed on internal page
- "Read Article" button with arrow icon

### Adding an EXTERNAL Post (Press Coverage)

```typescript
{
  id: "media-outlet-article-title",
  type: "external",
  title: "Article Title from External Source",
  excerpt: "Brief description of what the article covers.",
  category: "Press Coverage",
  date: "Nov 10, 2024",
  image: "/press/outlet-name.png",
  externalUrl: "https://full-url-to-article.com/path",
  source: "Economic Times", // Shows in category badge
  tags: ["Press", "Funding"],
  featured: true,
}
```

**Behavior:**
- Clicking the card opens external URL in new tab
- "Read on [Source Name]" button with external link icon
- Orange category badge with source name
- No internal article page

## 🖼️ Image Guidelines

### Image Locations

```
public/
├── tests/                    # Test milestone images
│   ├── torch-ignitor.png
│   ├── sharv-engine.png
│   └── harpy-engine.png
├── press/                    # Press coverage images
│   ├── et-funding.png
│   └── ian-funding.png
└── blog-*.png               # Legacy blog images
```

### Image Specifications

- **Aspect Ratio:** 16:9 (recommended)
- **Dimensions:** Minimum 1280x720px, Maximum 1920x1080px
- **Format:** PNG or JPG
- **File Size:** < 500KB (optimize for web)
- **Naming:** Use kebab-case, descriptive names

### Creating Test Update Images

**Recommended Content:**
- Test hardware photos
- Engine firing shots
- Test stand setups
- Data visualization overlays
- Team photos at test site

**Tips:**
- Add Trishul Space branding/logo
- Use high-quality, professional images
- Consider adding text overlay with test name/date
- Ensure good lighting and composition

## 🎨 Visual Differentiation

### Internal Posts
- Blue accent colors
- "Read Article" button
- Arrow right icon (→)
- Shows read time in meta

### External Posts
- Orange accent colors
- "Read on [Source]" button
- External link icon (↗)
- Source name in category badge
- Opens in new tab

## 📊 Example: Complete Test Update

```typescript
{
  id: "amulya-1-hotfire-success",
  type: "internal",
  title: "Amulya-1 Achieves Full-Duration Hot Fire",
  excerpt: "Our first-generation methalox engine completed a flawless 30-second burn, validating thermal models and combustion stability under flight conditions.",
  category: "Test Updates",
  date: "Feb 1, 2025",
  readTime: "7 min read",
  image: "/tests/amulya-hotfire-feb2025.png",
  content: [
    "February 1, 2025 marked a historic day for Trishul Space. At 0900 hours IST, our Amulya-1 engine roared to life for a full-duration hot fire test, sustaining stable combustion for 30 seconds at 100% rated thrust.",
    
    "The test objectives were ambitious: validate our regenerative cooling design, confirm injector performance across the throttle range, and collect high-fidelity data for CFD model correlation. Every objective was met with flying colors.",
    
    "During the burn, our instrumentation captured over 100 channels of data at 1000Hz. Chamber pressure remained stable at 95 bar with less than 2% oscillation. Nozzle wall temperatures stayed within predicted limits, confirming our thermal analysis. Most importantly, we observed no signs of combustion instability.",
    
    "This test represents months of iterative design work. Our team optimized the injector pattern through dozens of cold flow tests, refined the chamber geometry using CFD, and manufactured components in-house using advanced machining techniques.",
    
    "With this milestone achieved, we're accelerating towards our next phase: integrated stage testing. Amulya-1 will soon fire as part of a complete vehicle stack, bringing us one step closer to orbit.",
  ],
  tags: ["Amulya-1", "Hot Fire", "Methalox", "Testing"],
  featured: true,
}
```

## 📊 Example: Press Coverage

```typescript
{
  id: "techcrunch-india-space-race",
  type: "external",
  title: "Indian Space Startups Join Global Launch Vehicle Race",
  excerpt: "TechCrunch features Trishul Space among the emerging players developing indigenous orbital launch capabilities with methalox propulsion.",
  category: "Press Coverage",
  date: "Jan 18, 2025",
  image: "/press/techcrunch-feature.png",
  externalUrl: "https://techcrunch.com/2025/01/18/india-space-startups",
  source: "TechCrunch",
  tags: ["Press", "Industry", "Global"],
  featured: false,
}
```

## 🎯 Content Strategy Guidelines

### Test Updates
- **When to publish:** After successful test milestones
- **Tone:** Technical but accessible, data-driven
- **Include:** Test objectives, results, data highlights, next steps
- **Length:** 4-8 paragraphs (600-1200 words)

### Engineering Insights
- **When to publish:** Monthly technical deep-dives
- **Tone:** Educational, detailed, expert-level
- **Include:** Technical explanations, design decisions, CAD/diagrams
- **Length:** 6-10 paragraphs (1000-2000 words)

### Press Coverage
- **When to publish:** Immediately when mentioned in media
- **Tone:** Professional, factual (use original article title)
- **Include:** Accurate link, publication date, brief context
- **Length:** Excerpt only (1-2 sentences)

## 🔄 Workflow for Adding New Content

### For Internal Content:
1. Write full article content (4-8 paragraphs)
2. Create/select hero image (16:9, optimized)
3. Place image in `/public/tests/` or relevant folder
4. Add entry to `pressRelease-data.ts`
5. Set `type: "internal"`
6. Add full `content` array
7. Test locally at `/press-release/your-id`

### For External Content:
1. Find the full article URL
2. Create thumbnail/screenshot of article (or use outlet logo)
3. Place image in `/public/press/`
4. Add entry to `pressRelease-data.ts`
5. Set `type: "external"`
6. Add `externalUrl` and `source`
7. Test that link opens correctly in new tab

## 🚀 Quick Reference

### Internal Post Checklist
- [ ] Unique `id` (kebab-case)
- [ ] `type: "internal"`
- [ ] Full `title` and `excerpt`
- [ ] Appropriate `category`
- [ ] Current `date`
- [ ] `readTime` estimate
- [ ] Hero `image` path
- [ ] Complete `content` array (4+ paragraphs)
- [ ] Relevant `tags`
- [ ] Test navigation works

### External Post Checklist
- [ ] Unique `id`
- [ ] `type: "external"`
- [ ] Accurate `title` (from source)
- [ ] Brief `excerpt`
- [ ] Category: usually "Press Coverage"
- [ ] Publication `date`
- [ ] `image` (screenshot or logo)
- [ ] Valid `externalUrl`
- [ ] `source` name
- [ ] Test link opens correctly

## 💡 Pro Tips

1. **Featured Posts:** Set `featured: true` for major milestones (funding, first tests, media features)
2. **Tags:** Use consistent tag naming for future filtering features
3. **Images:** Always optimize images before uploading (use tinypng.com or similar)
4. **SEO:** Write clear, descriptive titles and excerpts
5. **Order:** Posts appear in the order they're defined in the array (newest first recommended)
6. **Testing:** Always test both mobile and desktop views
7. **Analytics:** Consider adding UTM parameters to external URLs for tracking

## 🔗 Related Files

- **Data:** `src/entities/pressRelease/model/pressRelease-data.ts`
- **Main Page:** `src/pages/pressRelease/pressRelease.tsx`
- **Detail Page:** `src/pages/pressRelease/pressReleasePost.tsx`
- **Styles:** `src/pages/pressRelease/pressRelease.module.css`
- **Routing:** Update routes in your main router file

---

**Last Updated:** January 2025  
**Maintained by:** Trishul Space Engineering Team