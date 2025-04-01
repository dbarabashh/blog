import posthog from "posthog-js";

const POSTHOG_KEY = "{{ env.NEXT_PUBLIC_POSTHOG_KEY }}";
const POSTHOG_HOST = "{{ env.NEXT_PUBLIC_POSTHOG_HOST }}";

if (POSTHOG_KEY && POSTHOG_HOST) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    loaded: (posthog) => {
      posthog.register({
        source: "blog",
      });
    },
  });
} else {
  console.warn("PostHog not initialized: missing configuration");
}

export default posthog;
