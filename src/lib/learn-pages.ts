import type { Module, Workshop } from './schemas';
import { isDisplayableVisualClassModule, splitWorkshops } from './workshop-catalog';
import { isExternalUrl, isInternalPath, isUnavailableLink, sanitizeLink } from './link-utils';

export const LEARN_VISUAL_ROUTE_LABEL = 'Modules';
export const LEARN_VISUAL_ROUTE_NAME = 'Modules';

interface CtaState {
  href: string;
  isExternal: boolean;
  label: string;
}

export interface LearnCard {
  title: string;
  meta: string;
  proof: string;
  tags: string[];
  id?: string;
  lessonIndex?: number;
  lessonLabel?: string;
  slidesHref?: string;
  slidesLabel?: string;
  kind?: 'module' | 'workshop';
  cta: CtaState;
}

export interface LearnQuickLink {
  title: string;
  date: string;
  href: string;
}

const MAX_PROOF_CHARS = 140;

const normalizeText = (value = '') => value.replace(/\s+/g, ' ').trim();

const clampProof = (value = '', max = MAX_PROOF_CHARS, fallback = 'Proof details are available in session materials.') => {
  const normalized = normalizeText(value);
  if (!normalized) {
    return fallback;
  }

  if (normalized.length <= max) {
    return normalized;
  }

  const slice = normalized.slice(0, max - 1);
  const breakAt = slice.lastIndexOf(' ');
  const cut = breakAt > Math.floor(max * 0.55) ? slice.slice(0, breakAt) : slice;
  return `${cut.trim()}...`;
};

const isValidReplayOrSlides = (href = '') => {
  const normalized = sanitizeLink(href);
  return (
    Boolean(normalized) &&
    !isUnavailableLink(normalized) &&
    (isExternalUrl(normalized) || isInternalPath(normalized))
  );
};

const compactPreviousTitle = (title = '') => {
  const normalized = normalizeText(title);
  const maxLength = 28;
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1)}…`;
};

const withLearningProgress = (proof = '', previousTitle?: string) => {
  if (!previousTitle) {
    return proof;
  }

  return clampProof(`Builds on ${compactPreviousTitle(previousTitle)}. ${proof}`);
};

const sortWorkshopsNewestFirst = (left: Workshop, right: Workshop) =>
  right.date.localeCompare(left.date, undefined, { numeric: true, sensitivity: 'base' });

const moduleSequencePriority: Record<string, number> = {
  'adl-browser-only': 10,
  'governed-genai-rollout': 20,
  'cogsec-playbooks': 30,
};

const VISUAL_CLASS_DECK_SEQUENCE: string[] = [
  'kinetic-proof',
  'vpn-cost-lab',
  'vibe-to-pral',
  'kinetic-kitchen-2-0',
  'kitchen-x-ray',
  'ghost-machine',
  'neural-glass',
  'policy-gatekeeper',
  'ai-kitchen',
];

const workshopSequencePriority: Record<string, number> = {
  'neural-glass': 80,
  'vibe-to-pral': 30,
  'policy-gatekeeper': 60,
  'kinetic-proof': 10,
  'kinetic-kitchen-2-0': 40,
  'vpn-cost-lab': 20,
  'ghost-machine': 70,
  'kitchen-x-ray': 50,
  'ai-kitchen': 90,
};

const visualClassDeckPriority: Record<string, number> = Object.fromEntries(
  VISUAL_CLASS_DECK_SEQUENCE.map((id, index) => [id, index]),
);

const getVisualClassPriority = (entry: { id: string }): number =>
  visualClassDeckPriority[entry.id] ??
  moduleSequencePriority[entry.id] ??
  workshopSequencePriority[entry.id] ??
  200;

const sortVisualClassCatalog = <T extends { id: string }>(
  items: Array<T>,
) =>
  [...items].sort((left, right) => {
    const leftPriority = getVisualClassPriority(left);
    const rightPriority = getVisualClassPriority(right);
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.id.localeCompare(right.id);
  });

type VisualClassCardRecord = LearnCard & {
  id: string;
  kind: 'module' | 'workshop';
};

export const buildModuleProofSnippet = (module: Module): string => {
  const first = normalizeText(module.proof?.[0] ?? '');
  const second = normalizeText(module.proof?.[1] ?? '');
  const combined = second ? `${first} ${second}` : first;
  return clampProof(combined || module.title);
};

export const buildWorkshopProofSnippet = (workshop: Workshop): string => {
  const proofLine = normalizeText(workshop.proofLine ?? '');
  if (proofLine) {
    return clampProof(proofLine);
  }

  return clampProof(workshop.description || workshop.title);
};

export const buildModuleCta = (module: Module): CtaState => {
  const href = sanitizeLink(module.cta?.href || '');
  const label = sanitizeLink(module.cta?.label || '');

  return {
    href: href || '/workshops',
    isExternal: isExternalUrl(href || '/workshops'),
    label: label || 'Open class',
  };
};

const resolveSlideHref = (value = '') => {
  const href = sanitizeLink(value);
  return isValidReplayOrSlides(href) ? href : '';
};

const resolveVisualClassSlideHref = (workshop: Workshop) =>
  resolveSlideHref(workshop.slidesUrl) || resolveSlideHref(workshop.replayUrl);

const resolveVisualClassLessonLabel = (entryId: string) =>
  `Lesson ${VISUAL_CLASS_DECK_SEQUENCE.indexOf(entryId) + 1}`;

const isVisualClassDeckCard = (entry: { id: string }) =>
  visualClassDeckPriority[entry.id] != null;

export const buildWorkshopCta = (workshop: Workshop, fallbackToIndex = false): CtaState => {
  if (isValidReplayOrSlides(workshop.replayUrl)) {
    return {
      href: sanitizeLink(workshop.replayUrl || ''),
      isExternal: true,
      label: 'Replay',
    };
  }

  if (isValidReplayOrSlides(workshop.slidesUrl)) {
    const href = sanitizeLink(workshop.slidesUrl || '');
    return {
      href,
      isExternal: isExternalUrl(href),
      label: 'Slides',
    };
  }

  return {
    href: fallbackToIndex ? '/workshops' : `/workshops/${workshop.id}`,
    isExternal: false,
    label: fallbackToIndex ? 'Open class' : 'Open details',
  };
};

export const getVisualClassCatalog = (
  modules: Module[],
  workshops: Workshop[],
): LearnCard[] => {
  const { visualClassWorkshops } = splitWorkshops(workshops);
  const modulesCards: VisualClassCardRecord[] = modules
    .filter(isDisplayableVisualClassModule)
    .map((module) => ({
      id: module.id,
      kind: 'module' as const,
      title: module.title,
      meta: `${module.time} · ${module.level}`,
      proof: buildModuleProofSnippet(module),
      tags: module.topics,
      slidesHref: resolveSlideHref(module.links?.slides),
      slidesLabel: resolveSlideHref(module.links?.slides) ? 'Slides' : undefined,
      cta: buildModuleCta(module),
    }));

  const workshopCards: VisualClassCardRecord[] = visualClassWorkshops.map((workshop) => ({
    id: workshop.id,
    kind: 'workshop' as const,
    title: workshop.title,
    meta: workshop.date,
    proof: buildWorkshopProofSnippet(workshop),
    tags: workshop.tags,
    slidesHref: resolveVisualClassSlideHref(workshop),
    slidesLabel: isValidReplayOrSlides(workshop.slidesUrl)
      ? 'Slides'
      : isValidReplayOrSlides(workshop.replayUrl)
        ? 'Replay'
        : undefined,
    cta: buildWorkshopCta(workshop, true),
  }));

  const rawCards = [...modulesCards, ...workshopCards];
  const orderedCards = sortVisualClassCatalog(rawCards).filter(isVisualClassDeckCard);
  const resolvedCards = orderedCards.length > 0 ? orderedCards : sortVisualClassCatalog(rawCards);

  const visualClassDeck = resolvedCards.map(({ ...card }, index, allCards) => {
    const previousCard = index > 0 ? allCards[index - 1] : null;
    const lessonIndex = index + 1;
    return {
      ...card,
      lessonIndex,
      lessonLabel: isVisualClassDeckCard(card)
        ? resolveVisualClassLessonLabel(card.id)
        : `Lesson ${lessonIndex}`,
      proof: withLearningProgress(card.proof, previousCard?.title),
    };
  });

  return visualClassDeck;
};

export const getCoreWorkshopCatalog = (workshops: Workshop[]): LearnCard[] => {
  const { coreWorkshops } = splitWorkshops(workshops);

  return [...coreWorkshops]
    .sort(sortWorkshopsNewestFirst)
    .map((workshop) => ({
      title: workshop.title,
      meta: workshop.date,
      proof: buildWorkshopProofSnippet(workshop),
      slidesHref: resolveSlideHref(workshop.slidesUrl),
      slidesLabel: isValidReplayOrSlides(workshop.slidesUrl) ? 'Slides' : undefined,
      tags: workshop.tags,
      cta: buildWorkshopCta(workshop),
    }));
};

export const getWorkshopReplayLinks = (workshops: Workshop[]): LearnQuickLink[] =>
  [...splitWorkshops(workshops).coreWorkshops]
    .sort(sortWorkshopsNewestFirst)
    .filter((workshop) => isValidReplayOrSlides(workshop.replayUrl))
    .map((workshop) => ({
      title: workshop.title,
      date: workshop.date,
      href: sanitizeLink(workshop.replayUrl || ''),
    }));

export const getWorkshopSlideLinks = (workshops: Workshop[]): LearnQuickLink[] =>
  [...splitWorkshops(workshops).coreWorkshops]
    .sort(sortWorkshopsNewestFirst)
    .filter((workshop) => isValidReplayOrSlides(workshop.slidesUrl))
    .map((workshop) => ({
      title: workshop.title,
      date: workshop.date,
      href: sanitizeLink(workshop.slidesUrl || ''),
    }));
