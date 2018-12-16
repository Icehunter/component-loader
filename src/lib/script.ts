export type ILoadScriptOptions = Record<string | number | symbol, unknown> &
  Pick<HTMLScriptElement, 'src'> &
  Pick<
    Partial<HTMLScriptElement>,
    'async' | 'crossOrigin' | 'defer' | 'integrity' | 'noModule' | 'referrerPolicy' | 'text' | 'type'
  > & {
    host?: Window;
  };

const enum SCRIPT_STATE {
  LOADING,
  LOADED
}

const SCRIPT_STATES: Record<string, SCRIPT_STATE> = {};

export const loadScript = async (options: ILoadScriptOptions): Promise<HTMLScriptElement> => {
  const { src, host = window, ...scriptAttributes } = options;
  const { document: doc } = host;

  const head = doc.getElementsByTagName('head')[0];

  const script = document.createElement('script');

  script.type = 'text/javascript';
  script.async = true;
  script.src = src;

  for (const key in scriptAttributes) {
    if (scriptAttributes[key]) {
      script.setAttribute(key, scriptAttributes[key] as string);
    }
  }

  return new Promise((resolve, reject) => {
    const handleScriptLoad = (scriptSrc: string): void => {
      if (scriptSrc in SCRIPT_STATES) {
        if (SCRIPT_STATES[scriptSrc] === SCRIPT_STATE.LOADED) {
          resolve(script);
          return;
        }
        setTimeout(function () {
          handleScriptLoad(scriptSrc);
        }, 0);
        return;
      }

      SCRIPT_STATES[scriptSrc] = SCRIPT_STATE.LOADING;

      script.onload = (): void => {
        if (SCRIPT_STATES[scriptSrc] === SCRIPT_STATE.LOADED) {
          return;
        }
        script.onload = script.onerror = null;
        SCRIPT_STATES[scriptSrc] = SCRIPT_STATE.LOADED;
        resolve(script);
      };

      script.onerror = (): void => {
        script.onload = script.onerror = null;
        head.removeChild(script);
        reject(new Error(`Failed to load script '${scriptSrc}'.`));
      };

      head.insertBefore(script, head.lastChild);
    };

    host.setTimeout(() => {
      handleScriptLoad(src);
    }, 0);
  });
};
