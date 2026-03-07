importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDqQ_zjXIKQttuQIKMFaOBCRiz7XX-_dYE",
  authDomain: "recruitment-da3fc.firebaseapp.com",
  projectId: "recruitment-da3fc",
  storageBucket: "recruitment-da3fc.firebasestorage.app",
  messagingSenderId: "731488250835",
  appId: "1:731488250835:web:9b88555939d40f41eedd26",
  measurementId: "G-CFJYSXWMY9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/next.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
