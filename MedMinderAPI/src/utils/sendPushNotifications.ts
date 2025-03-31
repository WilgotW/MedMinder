import { Notifications } from "expo";
import { Platform } from "react-native";
import { useEffect } from "react";

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
    if (subscription) {
      subscription.remove();
    }
  };
}, [userId]);
