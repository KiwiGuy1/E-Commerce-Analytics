"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ContentTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animate on first mount
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, []);

  // Animate on route change (pathname updates)
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const tl = gsap.timeline();
    tl.to(el, { autoAlpha: 0, y: 6, duration: 0.18, ease: "power1.out" }).to(
      el,
      { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }
    );
    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div ref={containerRef} className="space-y-6">
      {children}
    </div>
  );
}
