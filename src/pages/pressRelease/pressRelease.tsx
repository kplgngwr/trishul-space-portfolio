import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, ArrowRightIcon, CheckIcon } from "@/shared/ui";
import {
  useReducedMotion,
  EASE_OUT_EXPO,
  useNewsletterForm,
} from "@/shared/lib";
import { pressReleasePosts } from "@/entities/pressRelease";
import styles from "./pressRelease.module.css";

type SortOrder = "newest" | "oldest";

const SOURCE_LOGOS: Record<string, string> = {
  "IAN Group": "/pressRelease/IANfund.png",
};

function toTimestamp(date: string): number {
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// ============================================================================
// Animation Variants (defined outside component to prevent recreation)
// ============================================================================

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const CONTAINER_VARIANTS_REDUCED = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0 },
  },
} as const;

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
} as const;

const CARD_VARIANTS_REDUCED = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.01, ease: EASE_OUT_EXPO },
  },
} as const;

// ============================================================================
// External Link Icon Component
// ============================================================================

function ExternalLinkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ============================================================================
// Component
// ============================================================================

/**
 * PressReleasePage Component
 * @description Press releases, test updates, and external press coverage listing
 */
export function PressReleasePage(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<"all" | "internal" | "external">("all");

  // Use custom hook for newsletter form - eliminates boilerplate
  const {
    email,
    isSubmitting,
    submitStatus,
    statusMessage,
    handleEmailChange,
    handleSubmit,
  } = useNewsletterForm("press_release_page");

  // Memoized animation variants
  const containerVariants = useMemo(
    () =>
      prefersReducedMotion ? CONTAINER_VARIANTS_REDUCED : CONTAINER_VARIANTS,
    [prefersReducedMotion],
  );

  const cardVariants = useMemo(
    () => (prefersReducedMotion ? CARD_VARIANTS_REDUCED : CARD_VARIANTS),
    [prefersReducedMotion],
  );

  const animDuration = prefersReducedMotion ? 0.01 : 0.5;

  const categoryOptions = useMemo(() => {
    const categories = new Set(pressReleasePosts.map((post) => post.category));
    return ["All", ...Array.from(categories).sort((a, b) => a.localeCompare(b))];
  }, []);

  const visiblePosts = useMemo(() => {
    const normalizedSelectedType = selectedType.trim().toLowerCase();

    const filtered = pressReleasePosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const postType = post.type.trim().toLowerCase();
      const matchesType =
        normalizedSelectedType === "all" || postType === normalizedSelectedType;
      return matchesCategory && matchesType;
    });

    const direction = sortOrder === "newest" ? -1 : 1;

    return [...filtered].sort((a, b) => {
      const dateDiff = (toTimestamp(a.date) - toTimestamp(b.date)) * direction;
      if (dateDiff !== 0) return dateDiff;
      return a.id.localeCompare(b.id);
    });
  }, [selectedCategory, selectedType, sortOrder]);

  return (
    <div className={styles.blogsPage}>
      <section className={styles.hero}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animDuration }}
        >
          Updates & Press Coverage
        </motion.span>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animDuration, delay: 0.2 }}
        >
          Latest test milestones, engineering insights, press coverage, and
          industry recognition — tracking Trishul Space's journey to orbit.
        </motion.p>
      </section>

      <section className={styles.controls} aria-label="Sort and filter updates">
        <label className={styles.control}>
          <span className={styles.controlLabel}>Sort by date</span>
          <select
            className={styles.select}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>

        <label className={styles.control}>
          <span className={styles.controlLabel}>Category</span>
          <select
            className={styles.select}
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.control}>
          <span className={styles.controlLabel}>Type</span>
          <select
            className={styles.select}
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value as "all" | "internal" | "external")
            }
          >
            <option value="all">All types</option>
            <option value="internal">Internal updates</option>
            <option value="external">External coverage</option>
          </select>
        </label>
      </section>

      {visiblePosts.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No updates available</h3>
          <p className={styles.emptyText}>
            No updates match this filter right now. Try a different selection.
          </p>
        </div>
      ) : (
        <motion.div
          key={`${sortOrder}-${selectedCategory}-${selectedType}`}
          className={styles.blogGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {visiblePosts.map((post) => {
            const isExternal = post.type === "external";
            const sourceName = post.source ?? "Publisher";
            const sourceLogo = isExternal ? SOURCE_LOGOS[sourceName] : undefined;

            const hasCoverImage = post.image &&
              post.image !== "/press" &&
              post.image !== "/pressRelease" &&
              post.image.trim() !== "";

            // Card content (reused in both internal and external)
            const cardContent = (
              <>
                <div className={styles.imageWrapper}>
                  {isExternal && !hasCoverImage ? (
                    <div className={styles.externalMedia}>
                      {sourceLogo ? (
                        <div className={styles.sourceLogoPlate}>
                          <img
                            src={sourceLogo}
                            alt={sourceName}
                            className={styles.sourceLogo}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className={styles.sourceLogoPlate}>
                          <span className={styles.sourceText}>{sourceName}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={post.image}
                      alt={post.title}
                      className={isExternal ? styles.externalCoverImage : styles.image}
                      loading="lazy"
                    />
                  )}
                  <span className={styles.category}>
                    {isExternal && post.source
                      ? `Press Coverage • ${post.source}`
                      : post.category}
                  </span>
                </div>
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span className={styles.date}>{post.date}</span>
                    {post.readTime && (
                      <span className={styles.readTime}>{post.readTime}</span>
                    )}
                  </div>
                  <h2 className={styles.blogTitle}>
                    {post.title}
                    {isExternal && (
                      <span style={{ marginLeft: "0.5rem", opacity: 0.7 }}>
                        <ExternalLinkIcon size={16} />
                      </span>
                    )}
                  </h2>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <span className={styles.readMore} aria-hidden="true">
                    {isExternal && post.source
                      ? `Read on ${post.source}`
                      : "Read Article"}
                    {isExternal ? (
                      <ExternalLinkIcon size={14} />
                    ) : (
                      <ArrowRightIcon size={14} />
                    )}
                  </span>
                </div>
              </>
            );

            return (
              <motion.article
                key={post.id}
                className={styles.blogCard}
                variants={cardVariants}
              >
                {isExternal ? (
                  // External link - opens in new tab
                  <a
                    href={post.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    {cardContent}
                  </a>
                ) : (
                  // Internal link - uses React Router
                  <Link
                    to={`/pressRelease/${post.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    {cardContent}
                  </Link>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      )}

      <section className={styles.newsletter}>
        <h2 className={styles.newsletterTitle}>Stay in the Loop</h2>
        <p className={styles.newsletterText}>
          Subscribe to our newsletter for the latest updates on our technology
          and journey.
        </p>

        {submitStatus === "success" ? (
          <div className={styles.successMessage} role="status">
            <CheckIcon size={20} />
            <span>{statusMessage}</span>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {submitStatus === "error" && (
              <div className={styles.errorMessage} role="alert">
                {statusMessage}
              </div>
            )}
            <div className={styles.formRow}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.emailInput}
                aria-label="Email address for newsletter"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                maxLength={254}
              />
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

// Export with legacy name for compatibility
export { PressReleasePage as BlogsPage };
