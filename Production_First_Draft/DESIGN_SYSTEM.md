# Conny Berggren Design System

Updated: 2026-04-24

Scope: `Production_First_Draft` documentation only. This file defines the visual system and records current inconsistencies. It does not make any design changes by itself.

## Purpose

This website should feel like a lean, trustworthy, senior professional presence.

It is not meant to feel like:

- a large consultancy
- a startup landing page
- a heavily animated brand experience
- a CV dump

The design system should support a simple one-page credibility site where visitors quickly understand:

1. who Conny Berggren is
2. what he helps with
3. why he is credible
4. how to contact him

## Current Design Direction

The current draft already points in a useful direction:

- dark blue and off-white create a professional, technical tone
- cards and panels support a credibility-first layout
- the portrait, CV link, and membership strip reinforce trust signals
- the page tries to separate service overview from proof and contact

That direction is worth keeping. The issue is not lack of direction. The issue is that the direction is only partially systematized.

## Inconsistency Audit

### 1. Brand hierarchy is split

Observed:

- The project brief says the site should primarily present `Conny Berggren`, not `CBU` as the main brand.
- The current header, hero, and footer visually lead with `CBU Management` and the CBU logo.
- References: `index.html:16-39`, `index.html:76-99`, `index.html:208-223`

System decision:

- `Conny Berggren` is the primary identity.
- `CBU AB` or `CBU Management` is supporting company context, not the main headline brand.
- The person should visually lead. The company can support credibility and legal clarity.

### 2. The site is visually richer than the brief calls for

Observed:

- The brief calls for a very lean, static, professional one-page site.
- The current draft uses a complex hero composition, glass-like panel styling, animated card highlighting, and a dramatic puzzle treatment.
- References: `05_Website_Brief.md`, `styles.css:157-202`, `styles.css:373-389`, `styles.css:553-679`, `script.js:11-55`

System decision:

- Keep visual character, but bias toward clarity over spectacle.
- Motion should be subtle and functional.
- Decorative complexity must never compete with the message or make the site feel overbuilt.

### 3. CTA styles are not yet a defined system

Observed:

- There are several action patterns: large pill buttons, a small pill CV link, an underlined text link, and clickable cards.
- `secondary` and `ghost` buttons currently render the same way.
- References: `index.html:96-100`, `index.html:113-115`, `index.html:127-146`, `index.html:195`, `styles.css:347-370`, `styles.css:417-429`, `styles.css:467-503`, `styles.css:716-723`

System decision:

- Use a three-level action hierarchy only:
- primary action
- secondary action
- text action

Each level must be visually distinct and semantically consistent across the site.

### 4. Section anatomy changes from block to block

Observed:

- The specialties section uses a kicker plus heading pattern.
- The credential strip uses only a kicker.
- The service band uses only a heading.
- The quote section uses only a heading and body copy.
- References: `index.html:124-205`

System decision:

- Standardize section anatomy.
- Most sections should use: kicker, heading, short supporting text, then content.
- Intentional exceptions are allowed for the hero and footer only.

### 5. Typography scale and font weights are close, but not disciplined

Observed:

- Type sizes are expressive, but several near-adjacent values are used without a formal scale.
- Font weights include `750`, `800`, and `850`, which creates avoidable variation.
- References: `styles.css:258-339`, `styles.css:347-359`, `styles.css:486-495`, `styles.css:748-752`

System decision:

- Use a smaller, fixed type scale.
- Use only a limited set of font weights.
- Prioritize calm hierarchy over hyper-stylized contrast.

### 6. Spacing rhythm is inconsistent

Observed:

- The draft uses many one-off values: `14`, `16`, `18`, `22`, `26`, `28`, `30`, `32`, `34`, `36`, `42`, `46`, `48`, `52`, `68`, `70`, `72`, `110`, `130`.
- The page has general consistency, but the spacing system is not formalized.
- References: throughout `styles.css`

System decision:

- Move to a defined spacing scale and reuse it everywhere.
- Section padding, card padding, inter-element gap, and control height should all map to shared tokens.

### 7. Radius, border, and elevation are not fully standardized

Observed:

- Rounded corners use `4`, `6`, `8`, and `999`.
- Shadows are handled partly with a token and partly with custom values.
- References: `styles.css:79-112`, `styles.css:313`, `styles.css:353`, `styles.css:385`, `styles.css:473`, `styles.css:538`

System decision:

- Define small, medium, and pill radii only.
- Define elevation tokens and assign them by component role.
- Do not invent new corner sizes or shadow recipes unless the system expands.

### 8. Color is close to coherent, but too many surface values are ad hoc

Observed:

- The core palette is good.
- Surface treatments rely on multiple one-off opacity values and a few untokenized accent colors inside gradients.
- References: `styles.css:1-11`, `styles.css:64-68`, `styles.css:157-163`, `styles.css:337`, `styles.css:384-387`, `styles.css:472-477`, `styles.css:539`

System decision:

- Keep the current blue-led palette.
- Formalize text, background, surface, border, and accent roles.
- Avoid introducing extra accent colors unless they are named tokens with a clear job.

### 9. Interaction states are inconsistent

Observed:

- Puzzle labels have hover and focus-visible states.
- Credential cards have hover but no clearly defined focus styling.
- Buttons do not yet have a full hover and focus system.
- Text links rely mostly on underline styling.
- References: `styles.css:209-218`, `styles.css:498-503`

System decision:

- Every interactive element must define default, hover, focus-visible, and disabled or inactive behavior where relevant.
- Focus states must be equally intentional as hover states.

### 10. Content presentation quality is inconsistent

Observed:

- Several Swedish characters render incorrectly in the current HTML-based copy.
- Navigation naming and section naming do not always align cleanly.
- References: `index.html:7-10`, `index.html:42-45`, `index.html:72-75`, `index.html:188-205`

System decision:

- Correct Swedish rendering is part of the presentation system, not a minor copy issue.
- Navigation labels should match visible section intent.
- CTA labels should be concrete and specific.

## Brand Principles

The site should feel:

- senior
- clear
- independent
- professional
- calm
- trustworthy
- precise

The site should not feel:

- flashy
- trendy for its own sake
- corporate and impersonal
- crowded
- sales-heavy
- over-animated

## Identity Hierarchy

Primary identity:

- `Conny Berggren`

Supporting identity:

- `CBU AB`
- `CBU Management`
- SBR and certification affiliations

Usage rule:

- Lead with the person.
- Support with company and affiliation.
- Legal or company metadata belongs in supporting placements such as the footer, credential strip, or compact secondary brand areas.

## Visual Principles

### 1. Person First

The site should present an experienced specialist, not an abstract company.

### 2. Credibility Over Showmanship

Trust signals, legibility, and clarity matter more than dramatic effects.

### 3. Calm Hierarchy

Large type and strong contrast are allowed, but the page should feel composed rather than aggressive.

### 4. Equal Respect For Services

No single service should visually dominate unless the content strategy changes later.

### 5. Direct Contact

The path to calling, emailing, viewing the CV, or opening LinkedIn should remain obvious at all times.

## Color System

Base palette drawn from the current draft:

```txt
Ink / primary text        #17201C
Muted text                #617184
Page background           #F4F7FB
Surface / light           #FFFDF8
Brand blue                #2F68C9
Brand blue dark           #102B58
Brand blue deep           #07192F
Support steel             #8FA8C8
Border subtle             rgba(23, 32, 28, 0.16)
Shadow                    0 24px 70px rgba(7, 25, 47, 0.24)
```

Recommended semantic token layer for later implementation:

```txt
--color-text
--color-text-muted
--color-page
--color-surface
--color-surface-dark
--color-brand
--color-brand-strong
--color-brand-deep
--color-border-subtle
--color-border-inverse
--color-focus
--shadow-soft
--shadow-panel
```

Usage rules:

- Use dark blue backgrounds for hero, service emphasis, and footer.
- Use off-white or paper surfaces for reading-heavy sections.
- Keep blue as the main accent and action color.
- Use the steel tone sparingly as a supporting accent, not as a second brand.
- Avoid adding warm highlight colors unless they are explicitly tokenized.

## Typography System

Recommended typeface for v1:

- `Inter`

Reason:

- It is already used.
- It suits a clean, credible, modern professional site.
- It avoids unnecessary change while the structure is still in flux.

Recommended font weights:

- `400` regular
- `500` medium
- `700` bold
- `800` extra bold

Do not use:

- `750`
- `850`
- additional custom weight steps unless there is a strong reason

Recommended type scale:

```txt
Display      56-72px
H1           44-56px
H2           32-40px
H3           22-26px
Lead         20-24px
Body         16-18px
Small        14px
Meta         12-13px
```

Typography rules:

- Headings should be compact and confident.
- Body copy should favor readability over density.
- Kicker text may be uppercase, but only in small doses.
- Avoid using too many adjacent sizes that feel nearly identical.
- Keep line length around `60-70ch` for longer paragraphs.

## Spacing System

Recommended spacing scale:

```txt
4px
8px
12px
16px
24px
32px
48px
64px
96px
```

Usage guidelines:

- Use `8-16px` for tight internal spacing.
- Use `24-32px` for card padding and medium component gaps.
- Use `48-64px` for section spacing on small screens.
- Use `64-96px` for section spacing on larger screens.

Implementation rule:

- New spacing values should map to this scale whenever possible.
- One-off numbers should be the exception, not the default.

## Layout System

### Content Width

- Use a consistent page container width.
- Keep horizontal padding aligned across sections.
- Keep text content narrower than layout content.

Recommended layout rules:

```txt
Page max width:         1200-1280px
Horizontal padding:     clamp(18px, 5vw, 72px)
Readable text width:    60-70ch
Dense panel width:      320-520px
```

### Section Structure

Default section recipe:

1. kicker
2. heading
3. one short supporting paragraph
4. content grid, list, or actions

Exceptions:

- hero
- footer

### Grid Rules

- Use even grids for service cards and credibility cards.
- Prefer `16px` or `24px` gaps, not many near-duplicates.
- Service cards should carry equal visual weight.

## Radius, Border, And Elevation

Recommended radius scale:

```txt
Small    6px
Medium   8px
Pill     999px
```

Usage:

- `6px` for media frames and logo containers
- `8px` for cards, panels, and section surfaces
- `999px` only for buttons, badges, and compact action chips

Recommended border usage:

- Light surfaces: subtle ink border
- Dark surfaces: low-opacity white border
- Do not mix multiple border strengths inside the same component unless hierarchy requires it

Recommended elevation scale:

```txt
Elevation 0   none
Elevation 1   0 10px 28px rgba(7, 25, 47, 0.12)
Elevation 2   0 24px 70px rgba(7, 25, 47, 0.24)
```

Rule:

- Use shadows only when something is truly elevated.
- Do not stack heavy shadow, strong border, blur, and motion on the same element unless it has a strong reason to exist.

## Component System

### Header

Role:

- persistent orientation
- immediate trust and contact access

Rules:

- The main identity should be the person first.
- Supporting affiliations should remain visually secondary.
- Header nav labels should match the actual section language.
- Scrolled and unscrolled states should feel like the same component, not two different brands.

### Hero

Role:

- communicate identity, role, and first action

Must contain:

- primary name
- short professional descriptor
- one concise value statement
- one or two primary actions
- portrait or personal credibility cue

May contain:

- supporting logo
- supporting service visualization

Rule:

- If a graphic competes with the main message, the message wins.

### Buttons And Links

Button hierarchy:

1. Primary button
2. Secondary button
3. Text link

Rules:

- Primary button is the main conversion action.
- Secondary button is visually quieter but still button-shaped.
- Text links are for lower-priority actions and supporting navigation.
- `ghost` and `secondary` must not remain visually identical.
- Small pill links should inherit from the same CTA system, not become a separate ad hoc component.

### Service Cards

Role:

- explain services with equal weight and quick scanning

Rules:

- consistent card height strategy
- consistent padding
- consistent title and body spacing
- equal emphasis across services
- index labels are optional, but if used they must follow a shared spacing rule

### Credential Cards

Role:

- reinforce trust through proof, certification, membership, and experience

Rules:

- keep copy compact
- use strong headings and subdued detail text
- treat them as proof modules, not feature cards

### Profile Panel

Role:

- quickly humanize the expert behind the page

Rules:

- portrait, name, and short credibility statement should feel tightly grouped
- if the panel uses elevation, other adjacent components should not compete with equal visual drama

### Footer

Role:

- direct contact and legal clarity

Rules:

- keep it structured and compact
- contact methods should be obvious
- company metadata should read as support information

## Interaction And Motion

Recommended rules:

- default transitions: `150-200ms`
- hover motion: minimal
- vertical hover offset: maximum `-2px`
- focus-visible must be explicit and high contrast
- respect `prefers-reduced-motion`

Do not use by default:

- decorative sweep animations on core information cards
- long entrance animations
- motion that changes layout meaningfully

Motion principle:

- feedback, not spectacle

## Responsive Rules

Current draft breakpoints:

- `900px`
- `620px`

These are acceptable for v1 if kept consistent.

Responsive behavior rules:

- The hero must preserve message clarity before preserving visual composition.
- Card grids may collapse from 4 to 2 to 1 columns.
- CTA groups should stack cleanly on small screens.
- If the main nav disappears, there must still be a clear orientation path through the page.

## Content Presentation Rules

### Naming

- Use `Conny Berggren` as the main public-facing name.
- Use `CBU AB` where legal or company context is needed.
- Use Swedish labels consistently.

### CTA Copy

Prefer:

- specific and direct verbs
- clear destinations
- compact wording

Avoid:

- vague labels
- multiple labels that mean the same thing

### Text Tone

The copy should sound:

- senior
- factual
- calm
- helpful
- confident without exaggeration

The copy should not sound:

- salesy
- inflated
- corporate-generic
- over-technical when a simpler phrase works

### Encoding

- All Swedish characters must render correctly.
- Encoding problems are presentation defects and should be fixed before launch.

## Accessibility Rules

- All interactive elements need visible focus states.
- Color contrast must remain strong on dark and light surfaces.
- Link purpose should be understandable without surrounding context.
- Headings should describe section content clearly.
- Logo images must not replace critical accessible naming.

## Recommended Page Pattern For This Project

1. Hero / intro
2. Short profile section
3. Services
4. Credibility or certifications
5. CV and external links
6. Contact footer

This order reflects the brief and keeps the page lean.

## Practical Rules For Future Design Changes

- Do not introduce new colors unless they become tokens.
- Do not introduce new spacing values unless the scale expands intentionally.
- Do not create new CTA styles when an existing one can be reused.
- Do not let supporting company branding outrank the person.
- Do not add motion unless it improves comprehension or feedback.
- Do not make one service feel disproportionately important unless the content strategy changes.

## Summary

The current draft has a strong foundation: professional color, clear trust cues, and a useful single-page structure.

The next step is not reinvention. It is discipline.

The visual system for this project should be:

- person-led
- lean
- credible
- blue-led
- typographically calm
- spacing-consistent
- interaction-consistent
- easy to maintain
