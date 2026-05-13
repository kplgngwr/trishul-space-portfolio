import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPressReleasePostById } from "@/entities/pressRelease";
import { Button, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@/shared/ui";
import { useReducedMotion, useNewsletterForm } from "@/shared/lib";
import styles from "./pressRelease.module.css";

function normalizeYouTubeVideoId(value?: string): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Accept a raw YouTube video ID directly.
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const watchId = url.searchParams.get("v");
      if (watchId && /^[A-Za-z0-9_-]{11}$/.test(watchId)) {
        return watchId;
      }

      const segments = url.pathname.split("/").filter(Boolean);
      const embedId = segments[1];

      if (
        (segments[0] === "embed" || segments[0] === "shorts") &&
        embedId &&
        /^[A-Za-z0-9_-]{11}$/.test(embedId)
      ) {
        return embedId;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeYouTubeVideoIds(values?: string[]): string[] {
  if (!values?.length) return [];

  return Array.from(
    new Set(values.map((value) => normalizeYouTubeVideoId(value)).filter((value): value is string => Boolean(value))),
  );
}

/**
 * PressReleasePostPage Component
 * @description Individual press release/article page with content and newsletter subscription
 */
export function PressReleasePostPage(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const prefersReducedMotion = useReducedMotion();
  const [carouselState, setCarouselState] = useState({
    postId: id ?? "",
    index: 0,
  });

  // Use custom hook for newsletter form - eliminates boilerplate
  const {
    email,
    isSubmitting,
    submitStatus,
    statusMessage,
    handleEmailChange,
    handleSubmit,
  } = useNewsletterForm(`press_release_${id}`);

  // O(1) lookup using Map instead of Array.find()
  const post = useMemo(() => getPressReleasePostById(id), [id]);

  const carouselImages = useMemo(() => {
    if (!post) return [];

    const images = [post.image, ...(post.gallery ?? [])].filter(Boolean);
    return Array.from(new Set(images));
  }, [post]);

  useEffect(() => {
    if (post?.type === "external" && post.externalUrl) {
      window.location.assign(post.externalUrl);
    }
  }, [post?.externalUrl, post?.type]);

  // Handle post not found or external posts (should redirect)
  if (!post) {
    return (
      <div
        className={styles.blogsPage}
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className={styles.headerTitle}>Post Not Found</h1>
        <p className={styles.footerText} style={{ marginBottom: "2rem" }}>
          The content you're looking for doesn't exist.
        </p>
        <Link to="/pressRelease">
          <Button variant="primary">Back to Updates</Button>
        </Link>
      </div>
    );
  }

  // Redirect external posts to their source
  if (post.type === "external" && post.externalUrl) {
    return (
      <div
        className={styles.blogsPage}
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className={styles.footerText}>
          Redirecting to {post.source || "external source"}...
        </p>
      </div>
    );
  }

  const animDuration = prefersReducedMotion ? 0.01 : 0.5;

  const hasMultipleImages = carouselImages.length > 1;
  const currentImageIndex =
    carouselState.postId === post.id ? carouselState.index : 0;
  const currentImage = carouselImages[currentImageIndex] ?? post.image;
  const youtubeEmbedId = normalizeYouTubeVideoId(post.youtubeVideoId);
  const youtubeEmbedIds = normalizeYouTubeVideoIds(post.youtubeVideoIds);
  const videoIds = Array.from(new Set([youtubeEmbedId, ...youtubeEmbedIds].filter(Boolean)));

  const handlePrevImage = () => {
    if (!hasMultipleImages) return;
    setCarouselState((prev) => {
      const activeIndex = prev.postId === post.id ? prev.index : 0;
      return {
        postId: post.id,
        index: activeIndex === 0 ? carouselImages.length - 1 : activeIndex - 1,
      };
    });
  };

  const handleNextImage = () => {
    if (!hasMultipleImages) return;
    setCarouselState((prev) => {
      const activeIndex = prev.postId === post.id ? prev.index : 0;
      return {
        postId: post.id,
        index: (activeIndex + 1) % carouselImages.length,
      };
    });
  };

  return (
    <div className={styles.blogsPage}>
      <article className={styles.articleContainer}>
        <div className={styles.backLinkWrapper}>
          <Link to="/pressRelease" className={styles.backLink}>
            <ArrowLeftIcon size={16} />
            Back to Updates
          </Link>
        </div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animDuration }}
          className={styles.header}
        >
          <div className={`${styles.meta} ${styles.headerMeta}`}>
            <span className={`${styles.category} ${styles.headerCategory}`}>
              {post.category}
            </span>
            <span className={styles.date}>{post.date}</span>
            {post.readTime && (
              <span className={styles.readTime}>{post.readTime}</span>
            )}
          </div>

          <h1 className={styles.headerTitle}>{post.title}</h1>

          <p className={styles.headerExcerpt}>{post.excerpt}</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: animDuration, delay: 0.2 }}
          className={styles.articleImageWrapper}
        >
          <img
            src={currentImage}
            alt={`${post.title} - image ${currentImageIndex + 1}`}
            className={styles.image}
            loading="eager" // Above the fold, load immediately
          />
          {hasMultipleImages && (
            <>
              <button
                type="button"
                className={`${styles.carouselNav} ${styles.carouselNavLeft}`}
                onClick={handlePrevImage}
                aria-label="Show previous image"
              >
                <ArrowLeftIcon size={18} />
              </button>
              <button
                type="button"
                className={`${styles.carouselNav} ${styles.carouselNavRight}`}
                onClick={handleNextImage}
                aria-label="Show next image"
              >
                <ArrowRightIcon size={18} />
              </button>
            </>
          )}
        </motion.div>

        {post.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animDuration, delay: 0.3 }}
            className={styles.articleContent}
          >
            {post.content.map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </motion.div>
        )}

        {/* Gallery Grid Section - displays additional images from gallery */}
        {carouselImages.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animDuration, delay: 0.4 }}
          >
            <div className={styles.galleryGrid}>
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={styles.galleryItem}
                  onClick={() =>
                    setCarouselState({ postId: post.id, index })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setCarouselState({ postId: post.id, index });
                    }
                  }}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className={styles.galleryImage}
                    loading="lazy"
                  />
                  {index === currentImageIndex && (
                    <div className={styles.galleryTitle}>
                      {index + 1} / {carouselImages.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* YouTube Video Section */}
        {videoIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animDuration, delay: 0.5 }}
            className={styles.videoContainer}
          >
            {videoIds.map((videoId, index) => (
              <div key={`${videoId}-${index}`} className={styles.videoWrapper}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title={`${post.title} Video ${index + 1}`}
                  className={styles.videoPlayer}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </motion.div>
        )}

        <section
          className={styles.footerSection}
          aria-labelledby="newsletter-heading"
        >
          <h3 id="newsletter-heading" className={styles.footerTitle}>
            Enjoyed this article?
          </h3>
          <p className={styles.footerText}>
            Subscribe to our newsletter for more updates.
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
      </article>
    </div>
  );
}

// Export with legacy name for compatibility
export { PressReleasePostPage as BlogPostPage };
