export interface RiskFlag {
  message_index: number;
  type: string;
  description: string;
  severity: number;
}

export interface ChatSummary {
  id: number;
  agent_name: string;
  risk_score: number;
  analyzed_at: string;
  flag_count: number;
}

export interface ChatDetail {
  id: number;
  agent_name: string;
  transcript: string;
  risk_score: number;
  risk_flags: RiskFlag[];
  analyzed_at: string;
}

export interface CreateChatRequest {
  agent_name: string;
  transcript: string;
} 