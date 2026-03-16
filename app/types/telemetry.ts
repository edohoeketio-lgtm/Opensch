export interface TelemetryLog {
  lesson: string;
  watched: number;
  total: number;
  status: 'completed' | 'skipped' | 'in_progress';
}

export interface GradeRecord {
  sprint: string;
  score: number;
  arch: 'Pass' | 'Fail' | 'Needs Work';
  date: string;
}

export interface StudentTelemetryPayload {
  telemetry: TelemetryLog[];
  grades: GradeRecord[];
  notes: string;
}
