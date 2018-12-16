import * as React from 'react';

import { DefaultComponent } from './DefaultComponent';
import { Loader } from './Loader';
import { loadScript } from './script';
import { parseFetchURL } from './parser';

interface AsyncComponentLoaderState<T> {
  isReady: boolean;
  component: React.FC<T>;
}

export interface AsyncComponentLoaderProps<T> {
  host?: Window;
  globals?: Record<string, unknown>;
  fetchUrl: string;
  loader?: React.ReactNode;
  componentName?: string;
  componentProps?: T;
}

export const AsyncComponentLoader = <T extends object>(props: AsyncComponentLoaderProps<T>): JSX.Element => {
  const { host = window, globals = {}, fetchUrl, componentName, loader, componentProps = {} as T } = props;

  const [error, setError] = React.useState<unknown>();

  host.AsyncComponentLoader = host.AsyncComponentLoader || {
    MountedComponents: {}
  };

  for (const key in globals) {
    host[key] = host[key] ?? globals[key];
  }

  const [componentLoaderState, setComponentLoaderState] = React.useState<AsyncComponentLoaderState<T>>({
    isReady: false,
    component: DefaultComponent
  });

  const handleOnReady = React.useCallback(
    async (moduleName: string): Promise<void> => {
      let component = DefaultComponent;
      if (moduleName) {
        if (host[moduleName]) {
          component = host[moduleName][componentName] || host[moduleName];
        }
        if (!component || typeof component !== 'function') {
          console.warn(`component "${moduleName}" was null or not a function! rendering nothing`);
        }
      } else {
        console.warn(`moduleName was null or not set in response! rendering nothing`);
      }

      setComponentLoaderState({
        isReady: true,
        component
      });
    },
    [componentName, host]
  );

  React.useEffect(() => {
    const resolveModule = async (): Promise<void> => {
      try {
        const response = await fetch(fetchUrl, {
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });

        // get index.json response objects
        const { moduleName, runtime, main, vendor } = await response.json();

        // append current module to array of resolved modules that have been loaded BY host
        const { host: queryHost } = parseFetchURL(fetchUrl);
        const windowKey = queryHost || 'GLOBAL';

        host.AsyncComponentLoader.MountedComponents[windowKey] =
          host.AsyncComponentLoader.MountedComponents[windowKey] || [];
        if (!host.AsyncComponentLoader.MountedComponents[windowKey].includes(moduleName)) {
          host.AsyncComponentLoader.MountedComponents[windowKey].push(moduleName);
        }

        // if we have the resolved module already loaded by someone else
        // don't call script fetcher
        if (host[moduleName]) {
          await handleOnReady(moduleName);
        } else {
          // systematically add scripts to page in topological order
          if (runtime) {
            await loadScript({ host, src: runtime });
          }
          // if a vendor script is generated, use that
          if (vendor) {
            await loadScript({ host, src: vendor });
          }
          // load main script now that dependencies have been loaded
          await loadScript({ host, src: main });

          await handleOnReady(moduleName);
        }
      } catch (error) {
        setError(error);
      }
    };

    resolveModule();
  }, [fetchUrl, componentName, handleOnReady, host]);

  if (error) {
    throw error;
  }

  if (!componentLoaderState.isReady) {
    return <Loader loader={loader} />;
  }

  const { component: Component } = componentLoaderState;

  return <Component {...componentProps} />;
};
