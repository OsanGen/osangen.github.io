import { loadSiteContent } from '../src/lib/content';

const LINK_PLACEHOLDER_PATTERN = /\b(?:placeholder|todo|xxxxx|temp)\b/i;

const isInvalidLinkUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return !['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const isSuspiciousLink = (value: string) => {
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && LINK_PLACEHOLDER_PATTERN.test(normalized);
};

const main = async () => {
  const { gpts } = await loadSiteContent();
  const violations: string[] = [];
  const badLinks: string[] = [];

  gpts.forEach((gpt) => {
    const links = [
      { key: 'use', value: gpt.links.use },
      { key: 'promptPack', value: gpt.links.promptPack },
      { key: 'demo', value: gpt.links.demo },
    ];

    links.forEach(({ key, value }) => {
      if (isSuspiciousLink(value)) {
        badLinks.push(`${gpt.id}: link "${key}" uses placeholder token`);
      }

      if (value.trim() && isInvalidLinkUrl(value)) {
        badLinks.push(`${gpt.id}: link "${key}" is not an http(s) URL`);
      }
    });

    if (gpt.proof.type === 'image') {
      if (!gpt.proof.imageUrl.trim() || !gpt.proof.imageAlt.trim()) {
        violations.push(`${gpt.id}: image proof requires non-empty imageUrl and imageAlt`);
      }
    } else if (gpt.proof.type === 'sample_io') {
      if (!gpt.proof.input.trim() || !gpt.proof.output.trim()) {
        violations.push(`${gpt.id}: sample_io proof requires non-empty input and output`);
      }
    } else {
      violations.push(`${gpt.id}: unknown proof type`);
    }
  });

  if (badLinks.length > 0 || violations.length > 0) {
    if (badLinks.length > 0) {
      console.error('Invalid GPT link fields detected:');
      badLinks.forEach((item) => console.error(` - ${item}`));
    }
    if (violations.length > 0) {
      console.error('Proof content issues detected:');
      violations.forEach((item) => console.error(` - ${item}`));
    }
    process.exit(1);
  }

  if (gpts.length < 3) {
    console.warn(`Expected at least 3 GPTs for launch, found ${gpts.length}.`);
  }

  console.log('Content validation passed.');
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
