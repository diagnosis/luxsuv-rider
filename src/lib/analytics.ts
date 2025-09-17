// Analytics tracking utilities
interface AnalyticsEvent {
  booking_id?: string
  email_domain?: string
  timestamp: string
  [key: string]: any
}

class Analytics {
  private enabled: boolean

  constructor() {
    this.enabled = import.meta.env.VITE_ENVIRONMENT !== 'development'
  }

  private track(eventName: string, properties: AnalyticsEvent) {
    if (!this.enabled) {
      console.log(`[Analytics] ${eventName}:`, properties)
      return
    }

    // In production, integrate with your analytics service
    // Examples: Google Analytics, Mixpanel, PostHog, etc.
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      // Google Analytics 4 example
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties)
      }
    }

    // PostHog example
    if (typeof posthog !== 'undefined') {
      posthog.capture(eventName, properties)
    }
  }

  trackBookingCreated(bookingId: string) {
    this.track('booking_created', {
      booking_id: bookingId,
      timestamp: new Date().toISOString(),
    })
  }

  trackEmailVerification(email: string) {
    this.track('email_verification_requested', {
      email_domain: email.split('@')[1],
      timestamp: new Date().toISOString(),
    })
  }

  trackBookingUpdated(bookingId: string) {
    this.track('booking_updated', {
      booking_id: bookingId,
      timestamp: new Date().toISOString(),
    })
  }

  trackBookingCancelled(bookingId: string) {
    this.track('booking_cancelled', {
      booking_id: bookingId,
      timestamp: new Date().toISOString(),
    })
  }

  trackUserLogin(method: 'email' | 'guest') {
    this.track('user_login', {
      method,
      timestamp: new Date().toISOString(),
    })
  }

  trackUserRegister() {
    this.track('user_register', {
      timestamp: new Date().toISOString(),
    })
  }

  trackPageView(path: string) {
    this.track('page_view', {
      path,
      timestamp: new Date().toISOString(),
    })
  }
}

export const analytics = new Analytics()