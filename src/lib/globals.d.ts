declare global {
  interface Window extends Record<string, T> {
    AsyncComponentLoader: {
      MountedComponents: Record<string, Array<string>>;
    };
  }
}

export {};
