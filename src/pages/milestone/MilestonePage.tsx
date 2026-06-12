import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { milestones } from "@/entities/milestone";
import { CheckIcon, LayersIcon } from "@/shared/ui";
import { useReducedMotion, EASE_OUT_EXPO, slideChange } from "@/shared/lib";
import styles from "./milestone.module.css";

/**
 * MilestonePage Widget
 * @description Scroll-driven timeline with milestone details and tab navigation
 */
export function MilestonePage(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerScrollerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isManualNavigation, setIsManualNavigation] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
  const totalSteps = milestones.length;

  const progressValue = useMotionValue(0);
  const { scrollYProgress } = useScroll();

  // Keep model rotation synced to scroll unless we're navigating manually
  useMotionValueEvent(scrollYProgress, "change", (latest: number): void => {
    if (isManualNavigation) return;
    progressValue.set(latest);
  });

  const [isCompactTimeline, setIsCompactTimeline] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent): void =>
      setIsCompactTimeline(event.matches);

    mediaQuery.addEventListener?.("change", handleChange);

    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);
    };
  }, []);

  const denominator = Math.max(totalSteps - 1, 1);
  const progressPercent = (activeIndex / denominator) * 100;
  const progressStyle = isCompactTimeline
    ? { width: `${progressPercent}%` }
    : { height: `${progressPercent}%` };

  const markerRefsSetter = useCallback(
    (index: number) => (node: HTMLButtonElement | null) => {
      markerRefs.current[index] = node;
    },
    [],
  );

  const cardRefsSetter = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      cardRefs.current[index] = node;
    },
    [],
  );

  const activeIndexRef = useRef(activeIndex);
  const lastScrollTime = useRef<number>(0);
  const scrollCooldown = 600; // 600ms cooldown for smooth transitions

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Desktop Scroll (wheel/swipe) Navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isCompactTimeline) return;

    const handleWheel = (e: WheelEvent): void => {
      if (isManualNavigation) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      const deltaY = e.deltaY;

      // Ignore small inputs to prevent jitter
      if (Math.abs(deltaY) < 15) return;

      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;
      const isPageScrolled = window.scrollY > 10;

      if (isScrollingDown && activeIndex < totalSteps - 1) {
        e.preventDefault();
        if (now - lastScrollTime.current > scrollCooldown) {
          setActiveIndex((prev) => Math.min(prev + 1, totalSteps - 1));
          lastScrollTime.current = now;
        }
      } else if (isScrollingUp && activeIndex > 0 && !isPageScrolled) {
        e.preventDefault();
        if (now - lastScrollTime.current > scrollCooldown) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          lastScrollTime.current = now;
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent): void => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (isManualNavigation) {
        e.preventDefault();
        return;
      }

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY; // Positive is swipe up (scroll down)

      if (Math.abs(deltaY) < 30) return;

      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;
      const isPageScrolled = window.scrollY > 10;

      if (isScrollingDown && activeIndex < totalSteps - 1) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTime.current > scrollCooldown) {
          setActiveIndex((prev) => Math.min(prev + 1, totalSteps - 1));
          lastScrollTime.current = now;
          touchStartY = touchEndY;
        }
      } else if (isScrollingUp && activeIndex > 0 && !isPageScrolled) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTime.current > scrollCooldown) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          lastScrollTime.current = now;
          touchStartY = touchEndY;
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [activeIndex, totalSteps, isCompactTimeline, isManualNavigation]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const markerScroller = markerScrollerRef.current;
    if (!scroller && !markerScroller) return;

    let frame: number | null = null;

    const computeIndex = (
      scrollLeft: number,
      containerWidth: number,
    ): number => {
      const index = Math.round(scrollLeft / Math.max(containerWidth, 1));
      return Math.min(Math.max(index, 0), milestones.length - 1);
    };

    const handleCardScroll = (): void => {
      if (!scroller) return;
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const width = scroller.offsetWidth || 1;
        const nextIndex = computeIndex(scroller.scrollLeft, width);

        if (nextIndex !== activeIndexRef.current) {
          setActiveIndex(nextIndex);
        }
      });
    };

    const handleMarkerScroll = (): void => {
      if (!markerScroller) return;
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const markerWidth = Math.max(markerScroller.clientWidth, 1);
        const nextIndex = Math.min(
          Math.max(Math.round(markerScroller.scrollLeft / markerWidth), 0),
          milestones.length - 1,
        );

        if (nextIndex !== activeIndexRef.current) {
          setActiveIndex(nextIndex);
        }
      });
    };

    scroller?.addEventListener("scroll", handleCardScroll, { passive: true });
    markerScroller?.addEventListener("scroll", handleMarkerScroll, {
      passive: true,
    });

    return () => {
      scroller?.removeEventListener("scroll", handleCardScroll);
      markerScroller?.removeEventListener("scroll", handleMarkerScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const marker = markerRefs.current[activeIndex];
    if (marker && markerScrollerRef.current) {
      const container = markerScrollerRef.current;
      const target =
        marker.offsetLeft + marker.offsetWidth / 2 - container.clientWidth / 2;
      container.scrollTo({
        left: target,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    const card = cardRefs.current[activeIndex];
    if (card && scrollerRef.current) {
      scrollerRef.current.scrollTo({
        left: card.offsetLeft,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [activeIndex, prefersReducedMotion]);

  const handleTabClick = useCallback(
    (index: number): void => {
      if (!containerRef.current) return;

      setIsManualNavigation(true);
      setActiveIndex(index);

      // Calculate scroll position for this tab
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = window.scrollY + containerRect.top;
      const scrollHeight =
        containerRef.current.scrollHeight - window.innerHeight;
      const targetProgress = (index + 0.5) / totalSteps;
      const targetScrollY = containerTop + scrollHeight * targetProgress;

      // Animate the model rotation immediately to match the selected marker
      animate(progressValue, targetProgress, {
        duration: prefersReducedMotion ? 0.01 : 0.4,
        ease: EASE_OUT_EXPO,
      });

      window.scrollTo({
        top: targetScrollY,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      // Reset manual navigation flag after scroll completes
      setTimeout(
        () => {
          setIsManualNavigation(false);
        },
        prefersReducedMotion ? 50 : 600,
      );
    },
    [prefersReducedMotion, progressValue, totalSteps],
  );

  const currentMilestone = milestones[activeIndex];

  return (
    <section
      id="roadmap"
      className={styles.wrapper}
      ref={containerRef}
      style={{ position: "relative" }}
    >
      <div className={styles.scrollHeight}>
        <div className={styles.sticky}>
          {/* Header */}
          <div className={styles.header}>
            <span className="section-eyebrow">Our Journey</span>
            <h2 className={styles.title}>Milestones</h2>
          </div>

          {isCompactTimeline ? (
            <div className={styles.mobileOnly}>
              <div className={styles.hMarkersWrap}>
                <div className={styles.hLine} />
                <motion.div
                  className={styles.hProgress}
                  style={progressStyle}
                />
                <div
                  className={styles.hMarkers}
                  ref={markerScrollerRef}
                  role="tablist"
                  aria-label="Roadmap steps"
                >
                  {milestones.map((m, i) => (
                    <button
                      key={m.id}
                      ref={markerRefsSetter(i)}
                      type="button"
                      role="tab"
                      aria-selected={i === activeIndex}
                      className={`${styles.hMarker} ${i === activeIndex ? styles.hMarkerActive : ""} ${i < activeIndex ? styles.hMarkerDone : ""}`}
                      onClick={(): void => setActiveIndex(i)}
                    >
                      <span className={styles.hDot}>{i + 1}</span>
                      <span className={styles.hDate}>{m.date}</span>
                    </button>
                  ))}

                </div>
              </div>

              <div className={styles.hScroller} ref={scrollerRef}>
                {milestones.map((m, i) => (
                  <div
                    key={m.id}
                    data-index={i}
                    ref={cardRefsSetter(i)}
                    className={`${styles.hCard} ${i === activeIndex ? styles.hCardActive : ""}`}
                  >
                    {m.image && (
                      <div className={styles.hCardMediaContainer}>
                        {m.image.endsWith('.mp4') ? (
                          <video
                            src={m.image}
                            className={styles.hCardMedia}
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={m.image}
                            alt={m.title}
                            className={styles.hCardMedia}
                          />
                        )}
                      </div>
                    )}
                    <div className={styles.detailHeader}>
                      <span
                        className={`${styles.statusBadge} ${styles[m.status]}`}
                      >
                        {m.status}
                      </span>
                      <span className={styles.detailDate}>{m.date}</span>
                    </div>
                    <h3 className={styles.detailTitle}>{m.title}</h3>
                    {m.specs && (
                      <div className={styles.detailSpecs}>
                        <span>{m.specs}</span>
                      </div>
                    )}
                    <p className={styles.detailDesc}>{m.description}</p>
                  </div>
                ))}

              </div>
            </div>
          ) : (
            <div className={styles.content}>
              {/* Left - Timeline Navigation */}
              <div
                className={styles.timelineNav}
                role="tablist"
                aria-label="Roadmap timeline"
              >
                <div className={styles.track}>
                  <motion.div
                    className={styles.progress}
                    style={progressStyle}
                  />
                </div>
                <div className={styles.markers}>
                  {milestones.map((m, i) => (
                    <button
                      type="button"
                      key={m.id}
                      role="tab"
                      aria-selected={i === activeIndex}
                      className={`${styles.markerItem} ${i === activeIndex ? styles.active : ""} ${i < activeIndex ? styles.completed : ""}`}
                      onClick={(): void => handleTabClick(i)}
                    >
                      <div
                        className={`${styles.markerDot} ${styles[m.status]}`}
                      >
                        {m.status === "completed" && i < activeIndex ? (
                          <CheckIcon size={14} />
                        ) : m.status === "current" ? (
                          <motion.div
                            className={styles.pulseInner}
                            animate={
                              prefersReducedMotion
                                ? {}
                                : { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <span className={styles.markerLabel}>{m.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Center - Details */}
              <div className={styles.details} role="tabpanel">
                <AnimatePresence mode="wait">
                  {currentMilestone && (
                    <motion.div
                      key={currentMilestone.id}
                      className={styles.detail}
                      variants={slideChange}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.4,
                        ease: EASE_OUT_EXPO,
                      }}
                    >
                      <div className={styles.detailHeader}>
                        <span
                          className={`${styles.statusBadge} ${styles[currentMilestone.status]}`}
                        >
                          {currentMilestone.status}
                        </span>
                        <span className={styles.detailDate}>
                          {currentMilestone.date}
                        </span>
                      </div>
                      <h3 className={styles.detailTitle}>
                        {currentMilestone.title}
                      </h3>
                      {currentMilestone.specs && (
                        <div className={styles.detailSpecs}>
                          <span>{currentMilestone.specs}</span>
                        </div>
                      )}
                      <p className={styles.detailDesc}>
                        {currentMilestone.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right - Milestone Image or Video */}
              <div className={styles.modelContainer}>
                <AnimatePresence mode="wait">
                  {currentMilestone?.image ? (
                    currentMilestone.image.endsWith('.mp4') ? (
                      <motion.video
                        key={currentMilestone.id}
                        src={currentMilestone.image}
                        className={styles.milestoneMedia}
                        autoPlay
                        loop
                        muted
                        playsInline
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                      />
                    ) : (
                      <motion.img
                        key={currentMilestone.id}
                        src={currentMilestone.image}
                        alt={currentMilestone.title}
                        className={styles.milestoneMedia}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                      />
                    )
                  ) : (
                    <motion.div
                      key="placeholder"
                      className={styles.visionPlaceholder}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                    >
                      <LayersIcon />
                      <p>Developing Next-Generation Tech</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
