import type { Module, Workshop } from './schemas';
import { isDisplayableVisualClassModule, splitWorkshops } from './workshop-catalog';
import { isExternalUrl, isUnavailableLink, sanitizeLink } from './link-utils';

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
  cta: CtaState;
}

export interface LearnQuickLink {
  title: string;
  date: string;
  href: string;
}

const MAX_PROOF_CHARS = 120;

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
  return Boolean(normalized) && !isUnavailableLink(normalized) && isExternalUrl(normalized);
};

const sortWorkshopsNewestFirst = (left: Workshop, right: Workshop) =>
  right.date.localeCompare(left.date, undefined, { numeric: true, sensitivity: 'base' });

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

export const buildWorkshopCta = (workshop: Workshop, fallbackToIndex = false): CtaState => {
  if (isValidReplayOrSlides(workshop.replayUrl)) {
    return {
      href: sanitizeLink(workshop.replayUrl || ''),
      isExternal: true,
      label: 'Replay',
    };
  }

  if (isValidReplayOrSlides(workshop.slidesUrl)) {
    return {
      href: sanitizeLink(workshop.slidesUrl || ''),
      isExternal: true,
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

  return [
    ...modules.filter(isDisplayableVisualClassModule).map((module) => ({
      title: module.title,
      meta: `${module.time} · ${module.level}`,
      proof: buildModuleProofSnippet(module),
      tags: module.topics,
      cta: buildModuleCta(module),
    })),
    ...visualClassWorkshops.map((workshop) => ({
      title: workshop.title,
      meta: workshop.date,
      proof: buildWorkshopProofSnippet(workshop),
      tags: workshop.tags,
      cta: buildWorkshopCta(workshop, true),
    })),
  ];
};

export const getCoreWorkshopCatalog = (workshops: Workshop[]): LearnCard[] => {
  const { coreWorkshops } = splitWorkshops(workshops);

  return [...coreWorkshops]
    .sort(sortWorkshopsNewestFirst)
    .map((workshop) => ({
      title: workshop.title,
      meta: workshop.date,
      proof: buildWorkshopProofSnippet(workshop),
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
