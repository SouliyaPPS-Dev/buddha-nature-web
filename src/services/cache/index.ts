// Get data from local storage
export const localStorageData = (() => {
     // Theme
     const getTheme = () => {
          return localStorage.getItem('theme');
     };

     const setTheme = (theme: string) => {
          localStorage.setItem('theme', theme);
     };

     // Favorite
     const getFavorite = () => {
          return localStorage.getItem('favorites');
     };

     const setFavorite = (favorite: string) => {
          localStorage.setItem('favorites', favorite);
     };

     return {
          // Theme
          getTheme,
          setTheme,

          // Favorite
          getFavorite,
          setFavorite,
     };
})();

/**
 * A utility function for managing the 'rememberMe' value in the local storage.
 */
export const rememberMe = (() => {
     const getRememberMe = () => {
          return localStorage.getItem('rememberMe') || '';
     };

     const setRememberMe = (rememberMe: string) => {
          localStorage.setItem('rememberMe', rememberMe);
     };
     const removeRememberMe = () => {
          localStorage.removeItem('rememberMe');
     };
     return {
          /**
           * Retrieves the 'rememberMe' value from the local storage.
           * @returns The 'rememberMe' value.
           */
          getRememberMe,
          /**
           * Sets the 'rememberMe' value in the local storage.
           * @param rememberMe - The 'rememberMe' value to be set.
           */
          setRememberMe,
          /**
           * Removes the 'rememberMe' value from the local storage.
           */
          removeRememberMe,
     };
})();


export const clearCache = () => {
     if ('caches' in window) {
          caches.keys().then((cacheNames) => {
               cacheNames.forEach((cacheName) => {
                    caches.delete(cacheName).then(() => {
                         console.log(`Cache ${cacheName} deleted`);
                    });
               });
          });
     }
};
