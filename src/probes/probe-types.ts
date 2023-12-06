export interface ProbeConfig {
  id: string;
  title: string;
  url?: string;
  matchCron(cron: string): boolean;
  execute(context: ProbeContext): Promise<ProbeResult>;
}

export interface ProbeContext {
  startTimer(): void;
  stopTimer(): void;
}

export interface ProbeResult {
  result: 'success' | 'failure';
  category: string;
  description: string | null;
}

export interface StatusEvent {
  probeId: string | null;
  webhookId: string | null;
  duration: number | null;
  result: 'success' | 'failure';
  category: string;
  description: string | null;
  createdAt: Date;
}
