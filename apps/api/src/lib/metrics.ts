type RouteMetric = {
  count: number;
  totalMs: number;
  maxMs: number;
  minMs: number;
};

const metrics = new Map<string, RouteMetric>();

export function recordLatency(routeKey: string, durationMs: number) {
  const current = metrics.get(routeKey);
  if (!current) {
    metrics.set(routeKey, {
      count: 1,
      totalMs: durationMs,
      maxMs: durationMs,
      minMs: durationMs,
    });
    return;
  }
  current.count += 1;
  current.totalMs += durationMs;
  current.maxMs = Math.max(current.maxMs, durationMs);
  current.minMs = Math.min(current.minMs, durationMs);
}

export function getMetricsSnapshot() {
  const routes: Record<
    string,
    { count: number; avgMs: number; maxMs: number; minMs: number }
  > = {};
  for (const [key, value] of metrics.entries()) {
    routes[key] = {
      count: value.count,
      avgMs: Math.round((value.totalMs / value.count) * 100) / 100,
      maxMs: value.maxMs,
      minMs: value.minMs,
    };
  }
  return {
    service: 'painel-contratos-api',
    routes,
  };
}

export function resetMetrics() {
  metrics.clear();
}
