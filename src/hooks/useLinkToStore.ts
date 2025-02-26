import { useEffect, useState } from "react";

export const useLinkToStore = () => {
     const [installLink, setInstallLink] = useState<string>('');

     useEffect(() => {
          const isHuawei = /huawei/i.test(navigator.userAgent); // Check if the device is Huawei
          const isAndroid = /android/i.test(navigator.userAgent); // Check if the device is Android

          if (isHuawei) {
               // Huawei AppGallery link
               setInstallLink(
                    'https://play.google.com/store/apps/details?id=com.buddha.lao_tipitaka'
               ); // Replace with actual Huawei AppGallery URL
          } else if (isAndroid) {
               // Google Play Store link
               setInstallLink(
                    'https://play.google.com/store/apps/details?id=com.buddha.lao_tipitaka'
               ); // Replace with actual Play Store URL
          } else {
               // Default fallback
               setInstallLink(
                    'https://play.google.com/store/apps/details?id=com.buddha.lao_tipitaka'
               ); // Default to Play Store if not detected
          }
     }, []);
     
     return { installLink };
};