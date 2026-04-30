const CONTENT_URL = "content/site-content.json";
const MAX_PUZZLE_SLOTS = 8;

const header = document.querySelector("[data-header]");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

const phonePopup = document.querySelector("[data-phone-popup]");
const phonePopupNumber = document.querySelector("[data-phone-popup-number]");
const phonePopupStatus = document.querySelector("[data-phone-popup-status]");
const phonePopupCopyButton = document.querySelector("[data-phone-popup-copy]");
const specialtyPopup = document.querySelector("[data-specialty-popup]");
const specialtyPopupIndex = document.querySelector("[data-specialty-popup-index]");
const specialtyPopupTitle =
  document.querySelector("[data-specialty-popup-title]") ||
  document.getElementById("specialty-popup-title");
const specialtyPopupBody = document.querySelector("[data-specialty-popup-body]");
const specialtyPopupFocusTarget = document.querySelector("[data-specialty-popup-focus]");

let specialtiesHeading = null;
let specialtyCards = [];
let puzzleLinks = [];
let highlightTimer;
let activePhoneTrigger = null;
let activePhoneNumber = "";
let activeSpecialtyTrigger = null;
let specialtiesBySlug = new Map();

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const queryAll = (selector) => [...document.querySelectorAll(selector)];
const hasTextContent = (value) => String(value ?? "").trim().length > 0;

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.textContent = value ?? "";
};

const setTextAll = (selector, value) => {
  queryAll(selector).forEach((element) => {
    element.textContent = value ?? "";
  });
};

const slugify = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "specialty";

const getPhoneHref = (phoneDisplay, fallbackHref) => {
  const fallback = String(fallbackHref ?? "").trim();

  if (/^tel:\+?\d+$/.test(fallback.replace(/\s+/g, ""))) {
    return fallback.replace(/\s+/g, "");
  }

  const rawPhone = String(phoneDisplay ?? "").trim();
  if (!rawPhone) {
    return fallback || "#";
  }

  const hasLeadingPlus = rawPhone.startsWith("+");
  const digitsOnly = rawPhone.replace(/\D/g, "");

  if (!digitsOnly) {
    return fallback || "#";
  }

  return `tel:${hasLeadingPlus ? "+" : ""}${digitsOnly}`;
};

const formatIndex = (value) => String(value).padStart(2, "0");

const splitParagraphs = (value) =>
  String(value ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const getSpecialtyPreview = (summary, details) =>
  summary || splitParagraphs(details)[0] || "";

const getSpecialtyPopupParagraphs = (specialty) => {
  const paragraphs = [];

  if (specialty.summary) {
    paragraphs.push(specialty.summary);
  }

  splitParagraphs(specialty.details)
    .filter((paragraph) => paragraph !== specialty.summary)
    .forEach((paragraph) => {
      paragraphs.push(paragraph);
    });

  return paragraphs;
};

const hasExtendedSpecialtyContent = (specialty) =>
  getSpecialtyPopupParagraphs(specialty).length > 1 ||
  specialty.preview.length > 140;

const normalizeSpecialties = (items) => {
  const availableSlots = Array.from(
    { length: MAX_PUZZLE_SLOTS },
    (_, index) => index + 1,
  );
  const usedSlots = new Set();
  const usedSlugs = new Set();
  const normalized = [];

  items.forEach((item, index) => {
    const preferredSlot = Number(item?.slot);
    const hasPreferredSlot =
      Number.isInteger(preferredSlot) &&
      preferredSlot >= 1 &&
      preferredSlot <= MAX_PUZZLE_SLOTS &&
      !usedSlots.has(preferredSlot);
    const slot = hasPreferredSlot
      ? preferredSlot
      : availableSlots.find((candidate) => !usedSlots.has(candidate));

    if (!slot) return;

    usedSlots.add(slot);

    const titleText = String(item?.title ?? "").trim();
    const puzzleLabelText = String(item?.puzzle_label ?? "").trim();
    const summaryText = String(item?.summary ?? "").trim();
    const detailsText = String(item?.details ?? "").trim();

    if (
      ![titleText, puzzleLabelText, summaryText, detailsText].some(
        hasTextContent,
      )
    ) {
      return;
    }

    const title = titleText || puzzleLabelText || `Kompetens ${index + 1}`;
    const baseSlug = slugify(
      item?.slug || title || puzzleLabelText || `specialty-${slot}`,
    );
    let slug = baseSlug;
    let duplicateIndex = 2;

    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedSlugs.add(slug);

    normalized.push({
      slot,
      slug,
      puzzleLabel: puzzleLabelText || title,
      title,
      summary: summaryText,
      details: detailsText,
      preview: getSpecialtyPreview(summaryText, detailsText),
      hasExtendedContent: false,
    });
  });

  return normalized
    .map((specialty) => ({
      ...specialty,
      hasExtendedContent: hasExtendedSpecialtyContent(specialty),
    }))
    .sort((left, right) => left.slot - right.slot);
};

const renderCredentialItem = (item) => {
  const element = document.createElement(item.url ? "a" : "article");
  element.className = "credential-card";

  if (item.url) {
    element.href = item.url;
    if (/^https?:\/\//.test(item.url) || item.url.endsWith(".pdf")) {
      element.target = "_blank";
      element.rel = "noopener";
    }
  }

  const title = document.createElement("strong");
  title.textContent = item.title;

  const detail = document.createElement("span");
  detail.className = "credential-detail";
  detail.textContent = item.detail;

  element.append(title, detail);
  return element;
};

const renderPuzzleLabel = (specialty) => {
  const link = document.createElement("a");
  link.className = `puzzle-label puzzle-label-${formatIndex(specialty.slot)}`;
  link.href = `#${specialty.slug}`;

  const index = document.createElement("span");
  index.className = "puzzle-index";
  index.textContent = formatIndex(specialty.slot);

  const label = document.createElement("span");
  label.textContent = specialty.puzzleLabel;

  link.append(index, label);
  return link;
};

const renderSpecialtyCard = (specialty) => {
  const card = document.createElement("article");
  card.className = "specialty-card";
  card.id = specialty.slug;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-haspopup", "dialog");
  card.setAttribute("aria-label", `Visa mer om ${specialty.title}`);

  const summary = document.createElement("div");
  summary.className = "specialty-summary";

  const index = document.createElement("p");
  index.className = "specialty-index";
  index.textContent = formatIndex(specialty.slot);

  const title = document.createElement("h3");
  title.textContent = specialty.title;

  summary.append(index, title);

  if (specialty.preview) {
    const preview = document.createElement("p");
    preview.className = "specialty-preview";
    preview.textContent = specialty.preview;
    summary.append(preview);
  }

  if (specialty.hasExtendedContent) {
    card.classList.add("has-more");

    const cta = document.createElement("p");
    cta.className = "specialty-cta";
    cta.textContent = "Tryck f\u00f6r att l\u00e4sa mer";
    summary.append(cta);
  }

  card.append(summary);
  return card;
};

const renderSpecialtyPopupContent = (specialty) => {
  const fragment = document.createDocumentFragment();
  const paragraphs = getSpecialtyPopupParagraphs(specialty);

  paragraphs.forEach((paragraph, index) => {
    const content = document.createElement("p");
    content.textContent = paragraph;

    if (index === 0 && specialty.summary) {
      content.className = "specialty-popup-summary";
    }

    fragment.append(content);
  });

  return fragment;
};

const renderSite = (data) => {
  document.title = data.meta?.title || document.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", data.meta?.description || "");

  setText("[data-brand-primary]", data.brand?.primary_name);
  setText("[data-brand-supporting]", data.brand?.supporting_name);
  setText("[data-hero-eyebrow]", data.hero?.eyebrow);
  setText("[data-hero-title]", data.hero?.title);
  setText("[data-hero-lede]", data.hero?.lede);
  setText("[data-hero-line]", data.hero?.line);
  setText("[data-profile-name]", data.profile?.name);
  setText("[data-profile-summary]", data.profile?.summary);
  setText("[data-credentials-kicker]", data.credentials?.kicker);
  setText("[data-specialties-kicker]", data.specialties_section?.kicker);
  setText("[data-specialties-title]", data.specialties_section?.title);
  setText("[data-specialties-intro]", data.specialties_section?.intro);
  setText("[data-service-band-title]", data.service_band?.title);
  setText("[data-service-band-body]", data.service_band?.body);
  setText("[data-quote-title]", data.quote?.title);
  setText("[data-quote-body]", data.quote?.body);
  setText("[data-footer-brand]", data.footer?.brand);
  setText("[data-footer-summary]", data.footer?.summary);
  setText("[data-address]", data.contact?.address);
  setText("[data-company-name]", `Firmanamn: ${data.brand?.company_name || ""}`);
  setText("[data-company-number]", data.brand?.company_number);
  setText("[data-vat-number]", data.brand?.vat_number);

  const portrait = document.querySelector("[data-profile-image]");
  if (portrait && data.assets?.portrait_image) {
    portrait.src = data.assets.portrait_image;
    portrait.alt = `Porträttfoto av ${data.profile?.name || "Conny Berggren"}`;
  }

  const cvLink = document.querySelector("[data-cv-link]");
  if (cvLink && data.assets?.cv_file) {
    cvLink.href = data.assets.cv_file;
  }

  const phoneDisplay = data.contact?.phone_display || "";
  const phoneHref = getPhoneHref(
    phoneDisplay,
    data.contact?.phone_href || "",
  );
  const email = data.contact?.email || "";
  const linkedinUrl = data.contact?.linkedin_url || "#";

  setTextAll("[data-phone-text]", phoneDisplay);
  queryAll("[data-phone-link]").forEach((link) => {
    link.href = phoneHref;
  });

  queryAll("[data-phone-trigger]").forEach((trigger) => {
    trigger.dataset.phoneNumber = phoneDisplay;
    trigger.setAttribute(
      "aria-label",
      `Visa telefonnummer till ${data.profile?.name || "Conny Berggren"}`,
    );
  });

  setTextAll("[data-email-text]", email);
  queryAll("[data-email-link]").forEach((link) => {
    link.href = `mailto:${email}`;
  });

  queryAll("[data-linkedin-link]").forEach((link) => {
    link.href = linkedinUrl;
  });

  if (phonePopupNumber) {
    phonePopupNumber.textContent = phoneDisplay;
    activePhoneNumber = phoneDisplay;
  }

  const credentialList = document.querySelector("[data-credentials-list]");
  if (credentialList) {
    credentialList.replaceChildren(
      ...(data.credentials?.items || []).map(renderCredentialItem),
    );
  }

  const specialties = normalizeSpecialties(data.specialties || []);
  specialtiesBySlug = new Map(
    specialties.map((specialty) => [specialty.slug, specialty]),
  );
  const puzzleMap = document.querySelector("[data-puzzle-map]");
  const puzzleContainer = document.querySelector("[data-puzzle-labels]");
  const specialtiesList = document.querySelector("[data-specialties-list]");

  if (puzzleMap) {
    puzzleMap.dataset.puzzleCount = String(specialties.length);
  }

  if (puzzleContainer) {
    puzzleContainer.replaceChildren(
      ...specialties.map((specialty) => renderPuzzleLabel(specialty)),
    );
  }

  if (specialtiesList) {
    specialtiesList.replaceChildren(
      ...specialties.map((specialty) => renderSpecialtyCard(specialty)),
    );
  }
};

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

const highlightSpecialtyCard = (targetCard) => {
  window.clearTimeout(highlightTimer);
  specialtyCards.forEach((card) => card.classList.remove("is-highlighted"));

  requestAnimationFrame(() => {
    void targetCard.offsetWidth;
    targetCard.classList.add("is-highlighted");
    highlightTimer = window.setTimeout(() => {
      targetCard.classList.remove("is-highlighted");
    }, 2600);
  });
};

const openSpecialtyPopup = (specialty, trigger) => {
  if (!specialtyPopup || !specialtyPopupTitle || !specialtyPopupBody) return;

  activeSpecialtyTrigger = trigger;

  if (specialtyPopupIndex) {
    specialtyPopupIndex.textContent = formatIndex(specialty.slot);
  }

  specialtyPopupTitle.textContent = specialty.title;
  specialtyPopupBody.replaceChildren(renderSpecialtyPopupContent(specialty));
  specialtyPopup.hidden = false;
  document.body.classList.add("has-specialty-popup-open");

  requestAnimationFrame(() => {
    specialtyPopupFocusTarget?.focus();
  });
};

const closeSpecialtyPopup = () => {
  if (!specialtyPopup || specialtyPopup.hidden) return;

  specialtyPopup.hidden = true;
  document.body.classList.remove("has-specialty-popup-open");
  specialtyPopupBody?.replaceChildren();
  activeSpecialtyTrigger?.focus();
  activeSpecialtyTrigger = null;
};

const openSpecialtyPopupForCard = (card, trigger = card) => {
  const specialty = specialtiesBySlug.get(card.id);
  if (!specialty) return;

  openSpecialtyPopup(specialty, trigger);
};

const initializeSpecialtyPopup = () => {
  specialtyPopup?.addEventListener("click", (event) => {
    const closeControl = event.target.closest("[data-specialty-popup-close]");
    if (!closeControl) return;

    event.preventDefault();
    closeSpecialtyPopup();
  });
};

const initializeSpecialtyInteractions = () => {
  specialtyCards = queryAll(".specialty-card");
  puzzleLinks = queryAll(".puzzle-label[href^='#']");
  specialtiesHeading = document.querySelector(".specialties .section-heading");

  specialtyCards.forEach((card) => {
    card.addEventListener("click", () => {
      highlightSpecialtyCard(card);
      openSpecialtyPopupForCard(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      highlightSpecialtyCard(card);
      openSpecialtyPopupForCard(card);
    });
  });

  puzzleLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = decodeURIComponent(link.getAttribute("href").slice(1));
      const targetCard = document.getElementById(targetId);

      if (!targetCard) return;

      event.preventDefault();
      scrollPuzzleTargetIntoView(targetCard);
      highlightSpecialtyCard(targetCard);
    });
  });

  const initialSpecialtyCard = window.location.hash
    ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
    : null;

  if (initialSpecialtyCard?.classList.contains("specialty-card")) {
    scrollPuzzleTargetIntoView(initialSpecialtyCard);
    highlightSpecialtyCard(initialSpecialtyCard);
  }
};

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

const initializePhonePopup = () => {
  queryAll("[data-phone-trigger]").forEach((trigger) => {
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
};

const renderDataError = () => {
  setText("[data-hero-eyebrow]", "Innehållet kunde inte laddas");
  setText(
    "[data-hero-title]",
    "Kontrollera att startsidan serveras via en lokal server eller GitHub Pages.",
  );
  setText(
    "[data-hero-lede]",
    "Den nya versionen läser sin text från en separat innehållsfil i stället för hårdkodad HTML.",
  );
  setText(
    "[data-hero-line]",
    "Om du öppnar filen direkt i webbläsaren via file:// stoppas normalt fetch-anropet.",
  );
};

const loadContent = async () => {
  const response = await fetch(CONTENT_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load content: ${response.status}`);
  }

  return response.json();
};

const init = async () => {
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  try {
    const content = await loadContent();
    renderSite(content);
    initializeSpecialtyPopup();
    initializeSpecialtyInteractions();
  } catch (error) {
    console.error(error);
    renderDataError();
  }

  initializePhonePopup();

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (!specialtyPopup?.hidden) {
      event.preventDefault();
      closeSpecialtyPopup();
      return;
    }

    if (phonePopup?.hidden) return;

    event.preventDefault();
    closePhonePopup();
  });
};

init();
