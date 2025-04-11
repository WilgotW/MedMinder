// utils/sendPushNotifications.ts

export interface PushNotificationMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Sends a push notification using Expo's push notification service.
 *
 * @param message - The push notification details including the Expo push token.
 * @returns The response from the Expo push notification service.
 */
export async function sendPushNotification(message: PushNotificationMessage) {
  const expoPushEndpoint = "https://exp.host/--/api/v2/push/send";

  // Construct the message payload.
  const payload = {
    to: message.to,
    sound: "default", // "default" sound for most cases, customize as needed.
    title: message.title,
    body: message.body,
    data: message.data || {},
  };

  try {
    const response = await fetch(expoPushEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("Push notification sent:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}
