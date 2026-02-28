/**
 * Utility module for browser Web Notifications API.
 * All functions handle unavailability and permission denial gracefully.
 */

export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (!('Notification' in window)) {
    return null;
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return null;
  }
}

export async function showBookingConfirmationNotification(mobileNumber: string): Promise<void> {
  if (!('Notification' in window)) {
    return;
  }
  try {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return;
    }
    new Notification('Booking Confirmed! 🎉', {
      body: `We will contact you shortly at ${mobileNumber}.`,
      icon: '/assets/generated/icon-pop-gypsum.dim_256x256.png',
      badge: '/assets/generated/icon-pop-gypsum.dim_256x256.png',
      tag: 'booking-confirmation',
    });
  } catch {
    // Silently fail — do not disrupt the booking flow
  }
}
