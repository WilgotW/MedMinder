import { Expo } from "expo-server-sdk";

const expo = new Expo();

export async function sendPushNotification(to: string, message: string) {
  if (!Expo.isExpoPushToken(to)) {
    console.error("Invalid Expo push token: ", to);
    return;
  }

  const notifications = [
    {
      to,
      sound: "default",
      body: message,
      data: { withSome: "data" },
    },
  ];
  try {
    await expo.sendPushNotificationsAsync(notifications);
  } catch (err) {
    console.error("Error sending push notification: ", err);
  }
}
