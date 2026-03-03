import type { Module, Workshop } from './schemas';

export const CORE_WORKSHOP_IDS = new Set([
  'leanagents-workshop-chatgpt-apps',
  'manus-workshop',
]);

const VISUAL_CLASS_MODULE_BLOCKLIST = new Set(['beautiful-code-theory']);
const VISUAL_CLASS_MODULE_TITLE_BLOCKLIST = new Set([
  'beautiful code theory: loops, roles, and proof packs',
]);
const VISUAL_CLASS_WORKSHOP_ID_BLOCKLIST = new Set(['beautiful-code-theory']);
const VISUAL_CLASS_WORKSHOP_TITLE_BLOCKLIST = new Set([
  'beautiful code theory: loops, roles, and proof packs',
]);

const normalizeWorkshopId = (id: string) => id.trim().toLowerCase();
const normalizeText = (value = '') => value.trim().toLowerCase();

const hasWorkshopCategory = (workshop: Workshop) => normalizeText(workshop.category).length > 0;

const isBlockedVisualClassWorkshop = (workshop: Workshop): boolean =>
  VISUAL_CLASS_WORKSHOP_ID_BLOCKLIST.has(normalizeWorkshopId(workshop.id)) ||
  VISUAL_CLASS_WORKSHOP_TITLE_BLOCKLIST.has(normalizeText(workshop.title));

export const isDisplayableVisualClassModule = (module: Module): boolean =>
  !VISUAL_CLASS_MODULE_BLOCKLIST.has(module.id) &&
  !VISUAL_CLASS_MODULE_TITLE_BLOCKLIST.has(normalizeText(module.title));

export const isDisplayableVisualClassWorkshop = (workshop: Workshop): boolean =>
  !isCoreWorkshop(workshop.id) && !isBlockedVisualClassWorkshop(workshop);

export const isCoreWorkshop = (input: string | Workshop): boolean => {
  if (typeof input === 'string') {
    return CORE_WORKSHOP_IDS.has(normalizeWorkshopId(input));
  }

  return CORE_WORKSHOP_IDS.has(normalizeWorkshopId(input.id)) || hasWorkshopCategory(input);
};

export const isCoreWorkshopId = (id: string): boolean => isCoreWorkshop(id);

export const isVisualClassWorkshopId = (id: string): boolean => !isCoreWorkshop(id);

export const splitWorkshops = (workshops: Workshop[]) => {
  const coreWorkshops: Workshop[] = [];
  const visualClassWorkshops: Workshop[] = [];

  workshops.forEach((workshop) => {
    if (isBlockedVisualClassWorkshop(workshop)) {
      return;
    }

    if (isCoreWorkshop(workshop)) {
      coreWorkshops.push(workshop);
      return;
    }

    if (isDisplayableVisualClassWorkshop(workshop)) {
      visualClassWorkshops.push(workshop);
    }
  });

  return { coreWorkshops, visualClassWorkshops };
};
