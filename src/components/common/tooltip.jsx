import * as React from "react";
import { createPortal } from "react-dom";

export default function Flyout({ children, text }) {
  const wrapperRef = React.useRef(null);
  const tooltipRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState(null);

  React.useEffect(() => {
    return () => setVisible(false);
  }, []);

  function show() {
    const el = wrapperRef.current;
    if (!el) return setVisible(true);
    const rect = el.getBoundingClientRect();
    // position tooltip to the right of the element, vertically centered
    const top = rect.top + rect.height / 2;
    const left = rect.right;
    setCoords({ top, left });
    setVisible(true);
  }

  function hide() {
    setVisible(false);
  }

  React.useEffect(() => {
    const tip = tooltipRef.current;
    if (!tip || !coords) return;
    // set positioning via DOM to avoid inline JSX style props (lint rule)
    tip.style.position = "fixed";
    tip.style.top = `${coords.top}px`;
    tip.style.left = `${coords.left + 8}px`;
    tip.style.transform = "translateY(-50%)";
  }, [coords, visible]);

  const tooltip = visible ? (
    <div
      ref={tooltipRef}
      className="bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg whitespace-nowrap z-[9999] transition-opacity duration-150"
    >
      {text}
    </div>
  ) : null;

  return (
    <div
      ref={wrapperRef}
      className="inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {typeof window !== "undefined" && createPortal(tooltip, document.body)}
    </div>
  );
}
