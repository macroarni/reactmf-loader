import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  MutableRefObject,
  ReactElement,
  RefObject,
} from 'react';
import { AppWrapper, UseMF, Render } from '../interfaces';
import { load, unmount, getUid } from "../utils";
import stylesInjection from "../utils/stylesInjection";

const useMF: UseMF = (options): AppWrapper<{}>  => {
  const ModuleRef: MutableRefObject<{ default: Render } | null> = useRef<{ default: Render } | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect((): void => {
    load(options.loader, options.name).then((module: any) => {
      setLoaded(true);
      ModuleRef.current = module;
    });
  }, []);

  const App: AppWrapper<{}> = useCallback(
    memo((): ReactElement => {

      const rootRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
      const renderRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

      useEffect((): () => void => {
        if (ModuleRef.current && typeof ModuleRef.current.default !== 'function') {
          throw new Error("typeof ModuleRef!.current!.default !== 'function'");
        }

        let callback: void | (() => void);

        Promise.resolve().then((): void => {
          stylesInjection(rootRef && rootRef.current, options.name);
          callback =
            ModuleRef.current &&
            ModuleRef.current.default(renderRef.current, options.props ?? {})
            || undefined;
        });

        return (): void => {
          unmount(rootRef.current, options.name);
          if (callback) {
            callback();
          }
        };
      }, []);
      const uid = getUid(options.name);
      return (
        <div id={`MF_${options.name}`} ref={rootRef} data-mf-client={uid} {...options.attrs}>
          <div ref={renderRef} />
        </div>
      );
    }),
    [loaded]
  );

  return loaded ? App : ({ fallback }) => fallback ?? null;
};

export default (
  name: string,
  loader: () => Promise<any>
): React.ReactElement => {
  const CurrentMF: AppWrapper<{}> = useMF({name, loader});
  return <CurrentMF />
}
