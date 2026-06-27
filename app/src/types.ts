export type FieldKey =
  | "antecedents"
  | "traitements"
  | "constantes"
  | "examens"
  | "surveillance";

export type View = "login" | "service" | "patients" | "transmission" | "history" | "colleagues";

export type PatientStatus = "a_faire" | "fait";

export interface Constantes {
  ta: string;
  fc: string;
  spo2: string;
  o2: string;
  diurese: string;
}

export interface Patient {
  id: string;
  chambre: string;
  civilite: "M." | "Mme";
  nom: string;
  age: number;
  status: PatientStatus;
  motif: string;
  antecedents: string;
  traitements: string;
  constantes: Constantes;
  examens: string;
  examAlert: boolean;
  surveillance: string;
  /** Medical term flagged for review if the nurse's dictation contains it. */
  lowConfidenceTerm?: string;
  commentaire?: string;
}

export interface Drug {
  key: string;
  name: string;
  classe: string;
  poso: string;
  voie: string;
  effets: string;
  surv: string;
}

export interface HistoryEntry {
  date: string;
  chambre: string;
  nom: string;
  motif: string;
  shift: string;
}

export interface MonthSummary {
  label: string;
  count: number;
}

export interface ColleagueEntry {
  chambre: string;
  nom: string;
  note: string;
  statut: "stable" | "a_surveiller" | "sortie_prevue";
  heure: string;
  detail: string;
}

export interface Colleague {
  key: string;
  name: string;
  initials: string;
  entries: ColleagueEntry[];
}

export interface Service {
  key: string;
  name: string;
  sub: string;
  short: string;
  locked: boolean;
}
