import {DynamicImport, InsertedStyle, TLoadMF, NodeElement, Render} from "../interfaces";
import {Error} from '../components/error';

export const getUid = (name: string): string =>
  `MFClient-${name}-${Math.random().toString(36).slice(2, -1)}`;

export const load = (dynamicImport: DynamicImport, name: string): Promise<{ default: Render }> =>
    dynamicImport(name)
        .then((app: { default: Render }): { default: Render } => {
          (window as any).__MF_IMPORTED__ = true;
          return app;
        })
        .catch((): { default: Render } => {
          console.error(`Failed to load MF ${name}.`);
          return { default: (): () => JSX.Element => Error };
        });

export const unmount = (currentTarget: HTMLDivElement | null, name: string): void => {
  const key = `__${name}__`;
  (window as any)[key] = (window as any)[key] ?? {};
  const insertedStyle: InsertedStyle = (window as any)[key];
  insertedStyle.targets?.splice(
    insertedStyle.targets?.findIndex((target) => target === currentTarget),
    1
  );
};

export const Bootstrap = (render: Render, element: NodeElement): void => {
  if (!(window as any).__MF_IMPORTED__) {
    render(element);
  }
};

export function LoadMF <T>(MF: TLoadMF): T {
  const Window = window as any;

  if (!Window.__PROVIDERS_LOADED__) {
    MF.providers.forEach((func: () => void): void => func());
    Window.__PROVIDERS_LOADED__ = true;
  }

  return MF.apps as unknown as T;
}
