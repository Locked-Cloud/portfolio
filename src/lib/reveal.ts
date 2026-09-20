/**
 * One observer for the whole page: any element with [data-reveal]
 * gets .is-visible when it enters the viewport. Staggering is done
 * per-element via inline transitionDelay in the components.
 */
export function observeReveals(): () => void {
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return () => undefined;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  elements.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}
