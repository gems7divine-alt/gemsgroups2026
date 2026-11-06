import { useRef } from "react";
import { prefersReducedMotion } from "./motion";

/**
 * Tilts its content toward the mouse with a soft moving light.
 * Mouse only: touch visitors scroll past without the card moving under a finger.
 */
export default function Tilt3D({ as: Tag = "div", max = 8, className = "", children, ...rest }) {
  const ref = useRef(null);
  const box = useRef(null);
  const frame = useRef(0);

  const onPointerEnter = (e) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    box.current = ref.current.getBoundingClientRect();
    ref.current.classList.add("is-tilting");
  };

  const onPointerMove = (e) => {
    if (!box.current) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = ref.current;
      const b = box.current;
      if (!el || !b) return;
      const x = Math.min(1, Math.max(0, (clientX - b.left) / b.width));
      const y = Math.min(1, Math.max(0, (clientY - b.top) / b.height));
      el.style.setProperty("--tilt-x", `${(0.5 - y) * 2 * max}deg`);
      el.style.setProperty("--tilt-y", `${(x - 0.5) * 2 * max}deg`);
      el.style.setProperty("--glare-x", `${x * 100}%`);
      el.style.setProperty("--glare-y", `${y * 100}%`);
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    box.current = null;
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-tilting");
    el.style.removeProperty("--tilt-x");
    el.style.removeProperty("--tilt-y");
  };

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </Tag>
  );
}
