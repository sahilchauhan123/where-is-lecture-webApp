import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
// import { getToken } from "firebase/messaging"; // For FCM if needed later

const getInternetStatus = () => {
  // Web specific: Use navigator.onLine instead of NetInfo
  return navigator.onLine;
};

const useLectureStore = create(
  persist(
    (set, get) => ({
      className: null,
      data: null,
      isInitialized: false,

      setInitialized: () => set({ isInitialized: true }),

      setData: async () => {
        const internetStatus = getInternetStatus();
        const classNames = get().className;

        if (internetStatus && classNames != null) {
          try {
            const docRef = doc(db, "test10", classNames);
            const documentSnapshot = await getDoc(docRef);
            
            if (documentSnapshot.exists()) {
              console.log("🔥 Data fetched from Firestore:", documentSnapshot.data(), "of this class", classNames);
              set({ data: documentSnapshot.data() });
              set({ className: classNames });
            }
          } catch (error) {
            console.error("Error fetching lecture data:", error);
          }
        } else {
          console.log("classname Is empty or offline");
        }
      },
      logout: () => {
        set({ data: null, className: null });
      },

      setClassName: async (name) => {
        const classNames = get().className;

        if (classNames) {
          // Web specific: Topic subscription is usually handled server-side for web. 
          // You would typically send the FCM token to your backend to unsubscribe.
          console.log("Unsubscribed from the topic! (Web mock)", classNames);
        }

        set({ className: name });

        try {
          // Web specific: Send FCM token to backend to subscribe
          console.log("Subscribed to topic! (Web mock)", name);
        } catch (error) {
          console.log(error);
        }

        console.log("class updated in store to : ", name);
        get().setData(name); // ✅ Fetch data when className updates
      },

      setClassThroughLogin: async (name) => {
        set({ className: name });
        get().setData(name);

        console.log("Subscribed to topic! (Web mock)", name);
        console.log("class updated in store to : ", name);
      },
    }),
    {
      name: "user-lecture-data",
      // Web specific: Use localStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setTimeout(() => {
            state.setInitialized();
            state.setData(); // ✅ Fetch data after rehydration
          }, 0);
        }
      },
    }
  )
);

export default useLectureStore;
