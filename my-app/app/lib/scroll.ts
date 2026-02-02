let rafId: number | null = null;

type EasingName = "linear" | "easeOutQuad" | "easeOutCubic";

function easingFn(t: number, type: EasingName) {
  switch (type) {
    case "easeOutQuad":
      return 1 - (1 - t) * (1 - t);
    case "easeOutCubic":
      return 1 - Math.pow(1 - t, 3);
    case "linear":
    default:
      return t;
  }
}

export function cancelScroll() {
  if (rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

export function scrollToId(id: string, opts?: { duration?: number; easing?: EasingName }) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = opts?.duration ?? 800;
  const easing: EasingName = opts?.easing ?? "easeOutCubic";

  const start = window.scrollY || window.pageYOffset || 0;
  const rect = el.getBoundingClientRect();
  const target = Math.round(rect.top + start);

  // if already at target (within 2px), do a direct scroll
  if (Math.abs(target - start) <= 2) {
    window.scrollTo(0, target);
    return;
  }

  let startTime: number | null = null;

  cancelScroll();

  function step(ts: number) {
    if (startTime == null) startTime = ts;
    const elapsed = ts - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = easingFn(t, easing);

    const current = Math.round(start + (target - start) * eased);
    window.scrollTo(0, current);

    if (t < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
      window.scrollTo(0, target);
      try {
        (el as HTMLElement).focus({ preventScroll: true });
      } catch (e) {
        // ignore
      }
    }
  }

  rafId = requestAnimationFrame(step);
}
