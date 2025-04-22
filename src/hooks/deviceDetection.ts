/**
 * Detects if the current device is running iOS
 * @returns boolean indicating if the device is iOS
 */
export const isIOS = (): boolean => {
     const userAgent = window.navigator.userAgent.toLowerCase();
     return /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
};

/**
 * Detects if the PWA is running in standalone mode (installed)
 * @returns boolean indicating if the app is in standalone mode
 */
export const isInStandaloneMode = (): boolean => {
     return window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true;
};