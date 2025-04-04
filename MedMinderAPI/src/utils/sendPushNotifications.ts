import { Expo } from "expo-server-sdk";

const expo = new Expo();

/**
 * Sends a push notification using Expo's push notification service.
 *
 * @param token - A valid Expo push token.
 * @param message - The message body to send.
 */
export async function sendPushNotification(token: string, message: string) {
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token`);
    return;
  }

  const messages = [
    {
      to: token,
      sound: "default",
      body: message,
      data: { customData: "custom data " },
    },
  ];

  try {
    // Send the notification asynchronously
    const tickets = await expo.sendPushNotificationsAsync(messages);
    console.log("Push notification tickets:", tickets);
    return tickets;
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
