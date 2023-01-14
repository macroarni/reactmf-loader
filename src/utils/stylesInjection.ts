import { InsertedStyle } from '../interfaces';

export default (target: HTMLDivElement | null, name: string): void => {
  const key = `__${name}__`;

  (window as Record<string, any>)[key] = (window as Record<string, any>)[key] ?? {};

  const insertedStyle: InsertedStyle = (window as Record<string, any>)[key];

  insertedStyle.elements = insertedStyle.elements ?? [];
  insertedStyle.targets = insertedStyle.targets ?? [];

  if (target && !insertedStyle.targets.includes(target)) {
    insertedStyle.targets.push(target);
  }

  const inserted: Record<string, boolean> = {};

  insertedStyle.elements.forEach((style:  HTMLStyleElement | HTMLLinkElement): void => {
    if (style.tagName === 'LINK') {
      try {
        document.head.removeChild(style);
      } catch (e) {
        console.warn(e);
      }
    }

    const keyT = (style as HTMLLinkElement).href || style.innerText;

    if (!inserted[keyT]) {
      inserted[keyT] = true;
      target?.appendChild(style.cloneNode(true));
    }
  });
};
