const header = document.querySelector("[data-header]");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

const puzzleLinks = document.querySelectorAll(".puzzle-label[href^='#']");
const specialtyCards = document.querySelectorAll(".specialty-card");
const specialtiesHeading = document.querySelector(
  ".specialties .section-heading",
);
let highlightTimer;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

const scrollPuzzleTargetIntoView = (targetCard) => {
  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  const isCompactLayout = window.innerWidth <= 900;
  const viewportGap = isCompactLayout ? 16 : 24;
  const cardTop = targetCard.getBoundingClientRect().top + window.scrollY;
  const cardScrollTop = Math.max(0, cardTop - headerHeight - viewportGap);

  if (!specialtiesHeading) {
    window.scrollTo({
      top: cardScrollTop,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
    return;
  }

  if (!isCompactLayout) {
    const headingTop = specialtiesHeading.getBoundingClientRect().top + window.scrollY;
    const sectionScrollTop = Math.max(0, headingTop - headerHeight - 48);

    window.scrollTo({
      top: sectionScrollTop,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
    return;
  }

  window.scrollTo({
    top: cardScrollTop,
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
  });
};

puzzleLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = decodeURIComponent(link.getAttribute("href").slice(1));
    const targetCard = document.getElementById(targetId);

    if (!targetCard) return;

    event.preventDefault();
    scrollPuzzleTargetIntoView(targetCard);

    window.clearTimeout(highlightTimer);
    specialtyCards.forEach((card) => card.classList.remove("is-highlighted"));

    requestAnimationFrame(() => {
      void targetCard.offsetWidth;
      targetCard.classList.add("is-highlighted");
      highlightTimer = window.setTimeout(() => {
        targetCard.classList.remove("is-highlighted");
      }, 2600);
    });
  });
});
