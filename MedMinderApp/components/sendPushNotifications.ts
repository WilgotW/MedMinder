import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useEffect } from "react";

// Define or receive these variables from your app's state or context:
const userId = "your-user-id"; // Replace with real user id or pass it as a prop
const fetchDoses = () => {
  console.log("Fetching doses...");
  // Your dose fetching logic here
};

export default function useNotificationListener() {
  useEffect(() => {
    let subscription: Notifications.Subscription | undefined;

    if (Platform.OS !== "web") {
      subscription = Notifications.addNotificationReceivedListener(
        (notification) => {
          if (userId) {
            fetchDoses();
          }
        }
      );
    } else {
      console.log("Push notifications are not supported on web.");
    }

    return () => {
      subscription?.remove();
    };
  }, [userId]);
}
