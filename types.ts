export interface OperationalStep {
  order_id: number;
  title: string;
  type: 'INSTRUCTION' | 'DOCUMENT' | 'ANALYSIS';
  content: string;
}

export interface AnalysisResponse {
  analysis_summary: string;
  recommended_strategy: string;
  operational_steps: OperationalStep[];
  document_url?: string;
  escalation_index?: number;
  escalation_quote?: string;
}

/** Structured context harvested from the intake screen */
export interface IntakeContext {
  /** User's intended vector of approach */
  intent?: 'COMPREHENSION' | 'REACTION' | 'INITIATIVE';
  /** User's role relative to the document */
  role: 'recipient' | 'sender';
  /** Primary objective */
  objective: 'understand' | 'defend' | 'assert' | 'negotiate' | 'delay' | 'unknown';
  /** Entity type */
  entity_type: 'person' | 'business' | 'organization';
  /** Whether the user is a lawyer representing the party */
  is_lawyer?: boolean;
  /** When the document was received (ISO date string or empty) */
  received_date: string;
  /** Known deadline (free text or empty) */
  deadline: string;
  /** Whether a known deadline has already passed */
  deadline_passed: boolean;
  /** Prior actions taken */
  prior_actions: 'none' | 'responded' | 'paid_partial' | 'paid_full' | 'consulted_lawyer' | 'ignored';
  /** Amount at stake in PLN (0 if unknown) */
  amount: number;
  /** Free-text additional notes */
  notes: string;
}

export type AppView = 'upload' | 'intake' | 'analyzing' | 'results';