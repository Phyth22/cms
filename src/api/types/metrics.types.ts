export interface DiskDevice {
  read_MBps: number;
  read_iops: number;
  write_MBps: number;
  write_iops: number;
}

export interface SupervisorProcess {
  cpu_percent: number;
  mem_percent: number;
  pid: number;
  program: string;
  rss_MB: number;
  status: string;
}

export interface SystemdService {
  cpu_percent: number;
  mem_percent: number;
  pid: number;
  rss_MB: number;
  service: string;
  status: string;
  unit: string;
}

export interface ApiPerformanceMetrics {
  ok: boolean;
  timestamp: string;
  metrics_window_seconds: number;
  api_latency: {
    p50_ms: number;
    p95_ms: number;
    p99_ms: number;
    avg_ms: number;
    min_ms: number;
    max_ms: number;
    sample_count: number;
  };
  error_rates: {
    success_rate_percent: number;
    error_4xx_rate_percent: number;
    error_5xx_rate_percent: number;
    error_4xx_count: number;
    error_5xx_count: number;
    success_count: number;
    total_requests: number;
  };
  request_rates: {
    requests_per_second: number;
    requests_per_minute: number;
    total_requests_lifetime: number;
  };
  top_endpoints: Record<string, number>;
  kafka: {
    consumer_lag: {
      total_lag: number;
      by_topic: Record<string, number>;
      consumer_group: string;
    };
    last_update: string;
    error: string | null;
  };
  uptime: {
    seconds: number;
    days: number;
    percentage_30d: number;
    start_time: string;
  };
}

export interface GunicornWorker {
  cpu_percent: number;
  mem_percent: number;
  pid: number;
  rss_MB: number;
  status: string;
}

export interface ServerMetrics {
  disk_io: {
    devices: Record<string, DiskDevice>;
  };
  hostname: string;
  ok: boolean;
  processes: {
    supervisor: Record<string, SupervisorProcess>;
    systemd: Record<string, SystemdService>;
    gunicorn?: Record<string, GunicornWorker>;
  };
  system: {
    cpu_percent: number;
    disk_space_root_percent: number;
    memory_percent: number;
  };
  ts: number;
  window_sec: number;
}
