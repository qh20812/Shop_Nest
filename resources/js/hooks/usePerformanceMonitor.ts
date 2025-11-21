import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

/**
 * Hook to monitor component performance
 * Logs render times and can be used for optimization
 */
export function usePerformanceMonitor(componentName: string, enabled: boolean = process.env.NODE_ENV === 'development') {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);

  // Mark render start
  if (enabled) {
    renderStart.current = performance.now();
  }

  useEffect(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStart.current;
    renderCount.current += 1;

    const metrics: PerformanceMetrics = {
      componentName,
      renderTime,
      timestamp: Date.now(),
    };

    // Only log if render time is significant (> 16ms for 60fps)
    if (renderTime > 16) {
      console.warn(
        `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render (Count: ${renderCount.current})`,
        metrics
      );
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development' && renderCount.current % 10 === 0) {
      console.log(`[Performance] ${componentName} average over last 10 renders:`, {
        renders: renderCount.current,
        lastRenderTime: `${renderTime.toFixed(2)}ms`,
        metrics,
      });
    }

    // Could send to analytics service here
    // sendToAnalytics(metrics);
  });

  return renderCount.current;
}
