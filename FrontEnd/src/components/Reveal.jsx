import { useEffect, useRef, useState } from "react";

/** Fade-up wrapper that triggers once when scrolled into view. */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` }}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Splits text into words that rise one-by-one on load. */
export function AnimatedWords({ text, baseDelay = 0, step = 130 }) {
  const words = text.split(" ");
  return (
    <span aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            <span className="word-mask">
              <span className="word-inner" style={{ "--word-delay": `${baseDelay + i * step}ms` }}>
                {word}
              </span>
            </span>
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </span>
    </span>
  );
}
