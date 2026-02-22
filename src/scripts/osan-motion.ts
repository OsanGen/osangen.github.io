import { animate, inView, scroll } from 'motion';

// QA note: Motion is enabled only on pages with sparse, card-first layouts where subtle reveal improves scan flow.
// Enabled pages: home, workshops, gpts, resume. Reduced-motion users are always opted out below.
const ENABLED_PAGES = new Set(['home', 'workshops', 'gpts', 'resume']);
const DEFAULT_ENTER_DISTANCE_PX = 8;
const DEFAULT_ENTER_DURATION_MS = 320;
const CALM_EASING = 'easeOut';
const CLEANUP_KEY = '__osanMotionCleanup';

type Cleanup = () => void;

declare global {
  interface Window {
    [CLEANUP_KEY]?: Cleanup;
  }
}

const parseNumeric = (raw: string): number | null => {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : null;
};

const parseMs = (raw: string, fallback: number): number => {
  const value = raw.trim();
  if (!value) return fallback;
  if (value.endsWith('ms')) return parseNumeric(value) ?? fallback;
  if (value.endsWith('s')) return (parseNumeric(value) ?? fallback / 1000) * 1000;
  return parseNumeric(value) ?? fallback;
};

const parseDelayMs = (raw: string): number => {
  const value = raw.trim();
  if (!value) return 0;
  if (value.endsWith('ms')) return parseNumeric(value) ?? 0;
  if (value.endsWith('s')) return (parseNumeric(value) ?? 0) * 1000;
  return parseNumeric(value) ?? 0;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const shouldIgnore = (element: Element): boolean =>
  element.matches('[data-motion-ignore]') || Boolean(element.closest('[data-motion-ignore]'));

const getRevealTargets = () =>
  Array.from(document.querySelectorAll<HTMLElement>('.cog-entrance, [data-motion-enter]')).filter(
    (element) => !shouldIgnore(element) && element.dataset.motionGroupMember !== 'true',
  );

const getGroupTargets = (group: Element) =>
  Array.from(group.querySelectorAll<HTMLElement>(':scope > *')).filter((element) => !shouldIgnore(element));

const prepareTarget = (element: HTMLElement, enterDistancePx: number) => {
  if (element.dataset.motionPrepared === 'true') return;
  element.dataset.motionPrepared = 'true';
  element.style.animation = 'none';
  element.style.opacity = '0';
  element.style.transform = `translateY(${enterDistancePx}px)`;
};

const markDone = (element: HTMLElement) => {
  element.dataset.motionDone = 'true';
  element.style.opacity = '1';
  element.style.transform = 'translateY(0px)';
};

const getComputedMotionConfig = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const enterDistancePx = parseNumeric(rootStyles.getPropertyValue('--motion-enter-distance')) ?? DEFAULT_ENTER_DISTANCE_PX;
  const enterDurationMs = parseMs(
    rootStyles.getPropertyValue('--motion-enter-duration'),
    DEFAULT_ENTER_DURATION_MS,
  );

  return {
    enterDistancePx,
    enterDurationSec: Math.max(0.26, Math.min(0.38, enterDurationMs / 1000)),
  };
};

const createProgressRail = (): Cleanup => {
  const progressBar = document.querySelector<HTMLElement>('[data-motion-progress-bar]');
  if (!progressBar) return () => {};

  const stop = scroll((progress: number) => {
    progressBar.style.transform = `scaleX(${clamp(progress)})`;
  });

  return typeof stop === 'function' ? stop : () => {};
};

const createGroupObservers = (enterDistancePx: number, enterDurationSec: number): Cleanup[] => {
  const cleanups: Cleanup[] = [];
  const groups = Array.from(document.querySelectorAll('[data-motion-group]')).filter((group) => !shouldIgnore(group));

  groups.forEach((group) => {
    const targets = getGroupTargets(group);
    if (targets.length === 0) return;

    targets.forEach((target) => {
      target.dataset.motionGroupMember = 'true';
      prepareTarget(target, enterDistancePx);
    });

    let stop: Cleanup = () => {};
    stop = inView(
      group,
      () => {
        targets.forEach((target, index) => {
          animate(
            target,
            { opacity: [0, 1], y: [enterDistancePx, 0] },
            {
              duration: enterDurationSec,
              // Default stagger (0.05s) is reused for grouped resume timeline items.
              delay: index * 0.05,
              ease: CALM_EASING,
            },
          );
        });
        targets.forEach(markDone);
        stop();
      },
      { margin: '0px 0px -8% 0px' },
    );

    cleanups.push(stop);
  });

  return cleanups;
};

const createTargetObservers = (enterDistancePx: number, enterDurationSec: number): Cleanup[] => {
  const cleanups: Cleanup[] = [];

  getRevealTargets().forEach((target) => {
    prepareTarget(target, enterDistancePx);
    const targetDelayMs = parseDelayMs(getComputedStyle(target).getPropertyValue('--reveal-delay'));

    let stop: Cleanup = () => {};
    stop = inView(
      target,
      () => {
        if (target.dataset.motionDone === 'true') {
          stop();
          return;
        }

        animate(
          target,
          { opacity: [0, 1], y: [enterDistancePx, 0] },
          {
            duration: enterDurationSec,
            delay: targetDelayMs / 1000,
            ease: CALM_EASING,
          },
        );
        markDone(target);
        stop();
      },
      { margin: '0px 0px -8% 0px' },
    );

    cleanups.push(stop);
  });

  return cleanups;
};

const initOsanMotion = (): Cleanup => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};

  if (typeof window[CLEANUP_KEY] === 'function') {
    window[CLEANUP_KEY]?.();
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pageId = document.body?.dataset.page ?? '';

  if (reduceMotion || !ENABLED_PAGES.has(pageId)) {
    document.documentElement.classList.remove('motion-enhanced');
    const noop = () => {};
    window[CLEANUP_KEY] = noop;
    return noop;
  }

  document.documentElement.classList.add('motion-enhanced');

  const cleanups: Cleanup[] = [];
  const { enterDistancePx, enterDurationSec } = getComputedMotionConfig();

  cleanups.push(createProgressRail());
  cleanups.push(...createGroupObservers(enterDistancePx, enterDurationSec));
  cleanups.push(...createTargetObservers(enterDistancePx, enterDurationSec));

  const destroy = () => {
    while (cleanups.length > 0) {
      const stop = cleanups.pop();
      stop?.();
    }
    document.documentElement.classList.remove('motion-enhanced');
  };

  const handlePageHide = () => {
    destroy();
    window.removeEventListener('pagehide', handlePageHide);
  };

  window.addEventListener('pagehide', handlePageHide);
  window[CLEANUP_KEY] = destroy;

  return destroy;
};

export default initOsanMotion;
