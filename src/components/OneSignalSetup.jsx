import { useEffect } from 'react';

export function OneSignalSetup() {
  useEffect(() => {
    const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
    if (!appId) return;

    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(function() {
      window.OneSignal.init({
        appId: appId,
        safari_web_id: "web.onesignal.auto.17b4c7c8-77c5-4d7a-8b4b-9f1bbe5c526b",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      });
    });
  }, []);

  return null;
}
