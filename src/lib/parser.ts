export const parseFetchURL = (url: string): Record<string, string> => {
  const parsed: Record<string, string> = {};

  const it = (pair: string): void => {
    if (!pair) {
      return;
    }
    const [key, value] = pair.split('=');
    if (key && value) {
      parsed[key] = value;
    }
  };

  if (url) {
    const [, query] = url.split('?');
    if (query) {
      query.replace(/\+/g, ' ').split(/[&;]/).forEach(it);
    }
  }
  return parsed;
};
