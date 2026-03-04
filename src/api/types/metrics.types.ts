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

export interface ServerMetrics {
  disk_io: {
    devices: Record<string, DiskDevice>;
  };
  hostname: string;
  ok: boolean;
  processes: {
    supervisor: Record<string, SupervisorProcess>;
    systemd: Record<string, SystemdService>;
  };
  system: {
    cpu_percent: number;
    disk_space_root_percent: number;
    memory_percent: number;
  };
  ts: number;
  window_sec: number;
}
