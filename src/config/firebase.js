import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

// TODO: Replace with your actual Firebase Web config
const firebaseConfig = {
  apiKey: "AIzaSyD7iApztrBzgQ8iuonuO2JoiC95q5k0oEc",
  authDomain: "lecturescheduler-5658a.firebaseapp.com",
  projectId: "lecturescheduler-5658a",
  storageBucket: "lecturescheduler-5658a.firebasestorage.app",
  messagingSenderId: "565391947322",
  appId: "1:565391947322:web:b43ce2112f5066acbba703",
  measurementId: "G-5WGESSP4D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Safe initialization of messaging (requires HTTPS or localhost)
export let messaging = null;
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  } else {
    console.warn("Firebase Messaging is not supported in this environment (insecure context or unsupported browser).");
  }
}).catch((err) => console.log("Messaging support check failed:", err));

export default app;
