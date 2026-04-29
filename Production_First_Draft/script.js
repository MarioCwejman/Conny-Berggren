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

const setSpecialtyCardState = (card, isExpanded) => {
  card.classList.toggle("is-expanded", isExpanded);
  card.setAttribute("aria-expanded", String(isExpanded));
};

const expandSpecialtyCard = (targetCard) => {
  specialtyCards.forEach((card) => {
    setSpecialtyCardState(card, card === targetCard);
  });
};

const toggleSpecialtyCard = (targetCard) => {
  const shouldExpand = !targetCard.classList.contains("is-expanded");

  specialtyCards.forEach((card) => {
    setSpecialtyCardState(card, shouldExpand && card === targetCard);
  });
};

specialtyCards.forEach((card) => {
  card.addEventListener("click", () => {
    toggleSpecialtyCard(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    toggleSpecialtyCard(card);
  });
});

puzzleLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = decodeURIComponent(link.getAttribute("href").slice(1));
    const targetCard = document.getElementById(targetId);

    if (!targetCard) return;

    event.preventDefault();
    expandSpecialtyCard(targetCard);
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

const initialSpecialtyCard = window.location.hash
  ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
  : null;

if (initialSpecialtyCard?.classList.contains("specialty-card")) {
  expandSpecialtyCard(initialSpecialtyCard);
}

const phonePopupTriggers = document.querySelectorAll("[data-phone-trigger]");
const phonePopup = document.querySelector("[data-phone-popup]");
const phonePopupNumber = document.querySelector("[data-phone-popup-number]");
const phonePopupStatus = document.querySelector("[data-phone-popup-status]");
const phonePopupCopyButton = document.querySelector("[data-phone-popup-copy]");
let activePhoneTrigger = null;
let activePhoneNumber = phonePopupNumber?.textContent.trim() ?? "";

const copyPhoneNumber = async (phoneNumber) => {
  if (!navigator.clipboard?.writeText) return false;

  try {
    await navigator.clipboard.writeText(phoneNumber);
    return true;
  } catch {
    return false;
  }
};

const setPhonePopupStatus = (message) => {
  if (!phonePopupStatus) return;
  phonePopupStatus.textContent = message;
};

const openPhonePopup = (trigger) => {
  if (!phonePopup || !phonePopupNumber) return;

  activePhoneTrigger = trigger;
  activePhoneNumber =
    trigger.dataset.phoneNumber?.trim() || phonePopupNumber.textContent.trim();
  phonePopupNumber.textContent = activePhoneNumber;
  setPhonePopupStatus("");
  phonePopup.hidden = false;
  document.body.classList.add("has-phone-popup-open");

  requestAnimationFrame(() => {
    phonePopupCopyButton?.focus();
  });
};

const closePhonePopup = () => {
  if (!phonePopup || phonePopup.hidden) return;

  phonePopup.hidden = true;
  document.body.classList.remove("has-phone-popup-open");
  setPhonePopupStatus("");
  activePhoneTrigger?.focus();
  activePhoneTrigger = null;
};

phonePopupTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openPhonePopup(trigger);
  });
});

phonePopup?.addEventListener("click", (event) => {
  const closeControl = event.target.closest("[data-phone-popup-close]");
  if (!closeControl) return;

  event.preventDefault();
  closePhonePopup();
});

phonePopupCopyButton?.addEventListener("click", async () => {
  if (!activePhoneNumber) return;

  const didCopy = await copyPhoneNumber(activePhoneNumber);

  setPhonePopupStatus(
    didCopy
      ? "Numret är kopierat."
      : "Kunde inte kopiera automatiskt. Numret står ovan.",
  );
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || phonePopup?.hidden) return;

  event.preventDefault();
  closePhonePopup();
});
