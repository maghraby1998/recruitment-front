import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDqQ_zjXIKQttuQIKMFaOBCRiz7XX-_dYE",
  authDomain: "recruitment-da3fc.firebaseapp.com",
  projectId: "recruitment-da3fc",
  storageBucket: "recruitment-da3fc.firebasestorage.app",
  messagingSenderId: "731488250835",
  appId: "1:731488250835:web:9b88555939d40f41eedd26",
  measurementId: "G-CFJYSXWMY9",
};

const app = initializeApp(firebaseConfig);

const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export { messaging };

export const requestPermission = async (): Promise<string | null> => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );
      console.log("Service Worker registered:", registration);

      const token = await getToken(messaging, {
        vapidKey:
          "BOXgQ5WqEAZIkuVjnjsEPL2CP7dk-XjUUQNt8t2Qzo0u22bgpDSq9RJy9WbJ8bxJ4vK9G5Tq4NNG06Wby4l2p-8",
        serviceWorkerRegistration: registration,
      });
      return token;
    }
  } catch (error) {
    console.error("Unable to get FCM token:", error);
  }
  return null;
};

export const onForegroundMessage = () => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
  });
};
