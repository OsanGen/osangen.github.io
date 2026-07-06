import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  isCanonicalLink,
  isExternalUrl,
  isInternalPath,
  isUnavailableLink,
} from '../src/lib/link-utils';
import {
  loadBooking,
  loadCommunities,
  loadGames,
  loadGPTs,
  loadModules,
  loadPosts,
  loadProfile,
  loadWorkshops,
} from '../src/lib/content';
import { HOME_ROUTE_ICONS } from '../src/lib/ui-icons';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const extractViewBoxSize = (svg: string): number | null => {
  const match = svg.match(/viewBox=["']\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*["']/i);
  if (!match) return null;
  const [, w, h] = match;
  return w === h ? Number(w) : null;
};

const isWhiteFill = (value: string) => /^#?(fff|ffffff|white)$/i.test(value.trim());

const hasFullBleedWhiteBackground = (svg: string, size: number): boolean => {
  const rectTagRe = /<rect\b([^>]*)\/?>/gi;
  const attrRe = /([a-zA-Z-]+)=["']([^"']*)["']/g;
  let rectMatch: RegExpExecArray | null;

  while ((rectMatch = rectTagRe.exec(svg))) {
    const attrs: Record<string, string> = {};
    let attrMatch: RegExpExecArray | null;
    attrRe.lastIndex = 0;
    while ((attrMatch = attrRe.exec(rectMatch[1]))) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
    }

    const w = parseFloat(attrs.width ?? '');
    const h = parseFloat(attrs.height ?? '');
    const x = attrs.x !== undefined ? parseFloat(attrs.x) : 0;
    const y = attrs.y !== undefined ? parseFloat(attrs.y) : 0;

    if (w === size && h === size && x === 0 && y === 0 && attrs.fill && isWhiteFill(attrs.fill)) {
      return true;
    }
  }

  return false;
};

const hasInkStroke = (svg: string): boolean => /stroke=["']#10121A["']/i.test(svg);

/**
 * Generic flat-line UI icons (see src/lib/ui-icons.ts) must all share the
 * same visual template: a full-bleed white background + ink outline. This
 * catches a branded/product icon (dark tile, no outline) being mistakenly
 * wired in as a generic UI icon before it ships.
 */
const checkUiIconTemplate = (iconPath: string, label: string, messages: string[]) => {
  const filePath = path.join(PUBLIC_DIR, iconPath.replace(/^\//, ''));
  let svg: string;
  try {
    svg = readFileSync(filePath, 'utf8');
  } catch {
    messages.push(`${label}: icon file not found at ${filePath}`);
    return;
  }

  const size = extractViewBoxSize(svg);
  if (size === null) {
    messages.push(`${label}: expected a square viewBox (e.g. "0 0 64 64")`);
    return;
  }

  if (!hasFullBleedWhiteBackground(svg, size)) {
    messages.push(
      `${label}: missing a full-bleed white background rect — this looks like a branded/product icon, not a flat UI icon (match the template in replay-slides.svg / teaching-checklist.svg / learn-catalog.svg)`
    );
  }

  if (!hasInkStroke(svg)) {
    messages.push(
      `${label}: missing an ink-colored stroke (#10121A) — flat UI icons must use ink line art, not solid fills`
    );
  }
};

const checkLinkField = ({
  label,
  value,
  required,
  allowInternal = true,
  allowExternal = true,
  messages,
}: {
  label: string;
  value: string;
  required: boolean;
  allowInternal?: boolean;
  allowExternal?: boolean;
  messages: string[];
}) => {
  const trimmed = value.trim();

  if (!trimmed) {
    if (required) {
      messages.push(`${label}: missing required value`);
    }
    return;
  }

  if (isUnavailableLink(trimmed)) {
    messages.push(`${label}: contains placeholder token`);
    return;
  }

  const isInternal = isInternalPath(trimmed);
  const isExternal = isExternalUrl(trimmed);

  if (!isCanonicalLink(trimmed)) {
    messages.push(`${label}: must be an https(s) URL or app path`);
    return;
  }

  if (isInternal && !allowInternal) {
    messages.push(`${label}: internal link not allowed for this field`);
  }

  if (isExternal && !allowExternal) {
    messages.push(`${label}: external link not allowed for this field`);
  }
};

const checkDuplicateIds = <T extends { id: string }>(items: T[], scope: string, messages: string[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  items.forEach((item) => {
    const id = item.id.trim();
    if (!id) {
      messages.push(`${scope}: empty id detected`);
      return;
    }

    const key = id.toLowerCase();
    if (seen.has(key)) {
      duplicates.add(key);
      return;
    }

    seen.add(key);
  });

  duplicates.forEach((id) => messages.push(`${scope}: duplicate id ${id}`));
};

const main = async () => {
  const messages: string[] = [];
  const [gpts, games, modules, workshops, posts, profile, communities, booking] = await Promise.all([
    loadGPTs(),
    loadGames(),
    loadModules(),
    loadWorkshops(),
    loadPosts(),
    loadProfile(),
    loadCommunities(),
    loadBooking(),
  ]);

  checkDuplicateIds(gpts, 'gpts', messages);
  checkDuplicateIds(games, 'games', messages);
  checkDuplicateIds(modules, 'modules', messages);
  checkDuplicateIds(workshops, 'workshops', messages);
  checkDuplicateIds(posts, 'posts', messages);
  checkDuplicateIds(communities, 'communities', messages);

  gpts.forEach((gpt) => {
    checkLinkField({
      label: `${gpt.id}: listing link`,
      value: gpt.link,
      required: true,
      allowInternal: true,
      messages,
    });

    checkLinkField({
      label: `${gpt.id}: links.use`,
      value: gpt.links.use,
      required: false,
      allowInternal: true,
      messages,
    });

    if (gpt.links.promptPack) {
      checkLinkField({
        label: `${gpt.id}: links.promptPack`,
        value: gpt.links.promptPack,
        required: false,
        allowInternal: true,
        messages,
      });
    }

    if (gpt.links.demo) {
      checkLinkField({
        label: `${gpt.id}: links.demo`,
        value: gpt.links.demo,
        required: false,
        allowInternal: true,
        messages,
      });
    }
  });

  games.forEach((game) => {
    checkLinkField({
      label: `${game.id}: deployUrl`,
      value: game.deployUrl,
      required: true,
      allowInternal: false,
      messages,
    });

    if (game.repoUrl) {
      checkLinkField({
        label: `${game.id}: repoUrl`,
        value: game.repoUrl,
        required: false,
        allowInternal: false,
        messages,
      });
    }
  });

  modules.forEach((module) => {
    checkLinkField({
      label: `${module.id}: cta.href`,
      value: module.cta.href,
      required: true,
      allowInternal: true,
      messages,
    });

    Object.entries(module.links).forEach(([key, value]) => {
      if (!value) return;
      checkLinkField({
        label: `${module.id}: links.${key}`,
        value,
        required: false,
        allowInternal: true,
        messages,
      });
    });
  });

  workshops.forEach((workshop) => {
    checkLinkField({
      label: `${workshop.id}: replayUrl`,
      value: workshop.replayUrl,
      required: true,
      allowInternal: false,
      messages,
    });

    if (workshop.slidesUrl) {
      checkLinkField({
        label: `${workshop.id}: slidesUrl`,
        value: workshop.slidesUrl,
        required: false,
        allowInternal: true,
        messages,
      });
    }
  });

  posts.forEach((post) => {
    checkLinkField({
      label: `${post.id}: url`,
      value: post.url,
      required: true,
      allowInternal: false,
      messages,
    });

    if (post.proofLinks && post.proofLinks.length > 0) {
      post.proofLinks.forEach((proofLink: string, index: number) => {
        checkLinkField({
          label: `${post.id}: proofLinks[${index}]`,
          value: proofLink,
          required: false,
          allowInternal: false,
          messages,
        });
      });
    }
  });

  checkLinkField({
    label: 'profile.links.linkedin',
    value: profile.links.linkedin,
    required: true,
    allowInternal: false,
    messages,
  });
  checkLinkField({
    label: 'profile.links.portfolio',
    value: profile.links.portfolio,
    required: true,
    allowInternal: false,
    messages,
  });
  checkLinkField({
    label: 'profile.links.youtube',
    value: profile.links.youtube,
    required: true,
    allowInternal: false,
    messages,
  });

  communities.forEach((community) => {
    if (!community.join.url) {
      return;
    }

    checkLinkField({
      label: `${community.id}: join.url`,
      value: community.join.url,
      required: false,
      allowInternal: false,
      messages,
    });
  });

  const calendlyLinkEntries = [
    ['booking.one_on_one.url', booking.calendly.one_on_one.url],
    ['booking.teach_private.url', booking.calendly.teach_private.url],
    ['booking.teach_class.url', booking.calendly.teach_class.url],
  ] as const;

  calendlyLinkEntries.forEach(([label, value]) => {
    if (!value) {
      return;
    }

    checkLinkField({
      label,
      value,
      required: false,
      allowInternal: false,
      messages,
    });
  });

  if (gpts.length < 3) {
    messages.push(`gpts: expected at least 3 items, found ${gpts.length}`);
  }

  Object.entries(HOME_ROUTE_ICONS).forEach(([key, iconPath]) => {
    checkUiIconTemplate(iconPath, `home route icon (${key})`, messages);
  });

  if (messages.length > 0) {
    console.error('Content validation issues:');
    messages.forEach((message) => console.error(` - ${message}`));
    process.exit(1);
  }

  console.log('Content validation passed.');
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
