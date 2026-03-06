/**
 * Authentication Service
 * Monitors session status by checking for _nvxs_account_uid cookie
 */

const ACCOUNT_COOKIE_NAME = "_nvxs_account_uid";
const CHECK_INTERVAL = 1000; // 1 second

/**
 * Get the value of a specific cookie
 */
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

/**
 * Check if user is currently logged in
 */
export function isUserLoggedIn(): boolean {
  return getCookie(ACCOUNT_COOKIE_NAME) !== null;
}

/**
 * Start monitoring user session
 * Returns interval ID for cleanup
 */
export function startSessionMonitor(onSessionInvalid?: () => void): number {
  // Check if not logged in and redirect once
  if (!isUserLoggedIn()) {
    // Set a flag to prevent repeated redirects
    if (!sessionStorage.getItem("_nvxs_redirect_in_progress")) {
      sessionStorage.setItem("_nvxs_redirect_in_progress", "true");
      // Session expired, redirect to home and refresh
      if (onSessionInvalid) {
        onSessionInvalid();
      } else {
        window.location.href = "/";
      }
    }
    // Return a dummy interval that doesn't do anything
    return setInterval(() => {}, CHECK_INTERVAL);
  }

  // Clear the redirect flag if user is now logged in
  sessionStorage.removeItem("_nvxs_redirect_in_progress");

  // Only monitor if user is logged in
  return setInterval(() => {
    if (!isUserLoggedIn()) {
      if (!sessionStorage.getItem("_nvxs_redirect_in_progress")) {
        sessionStorage.setItem("_nvxs_redirect_in_progress", "true");
        if (onSessionInvalid) {
          onSessionInvalid();
        } else {
          window.location.href = "/";
        }
      }
    }
  }, CHECK_INTERVAL);
}

/**
 * Stop monitoring user session
 */
export function stopSessionMonitor(intervalId: number): void {
  clearInterval(intervalId);
}

/**
 * Get account UID from cookie
 */
export function getAccountUid(): string | null {
  return getCookie(ACCOUNT_COOKIE_NAME);
}
