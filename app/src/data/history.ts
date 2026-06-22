import type { HistoryEntry, MonthSummary } from "../types";

export const historyEntries: HistoryEntry[] = [
  { date: "19 juil.", chambre: "12", nom: "M. Bernard Lefèvre", motif: "Insuffisance cardiaque", shift: "Matin" },
  { date: "19 juil.", chambre: "14", nom: "M. Antoine Girard", motif: "Surveillance post-coro", shift: "Matin" },
  { date: "18 juil.", chambre: "13", nom: "Mme Jacqueline Morel", motif: "ACFA — adaptation traitement", shift: "Matin" },
  { date: "17 juil.", chambre: "15", nom: "Mme Christine Petit", motif: "OAP — relais oral", shift: "Matin" },
  { date: "17 juil.", chambre: "12", nom: "M. Bernard Lefèvre", motif: "Décompensation — entrée", shift: "Matin" },
];

const MONTH_LABELS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const MONTH_COUNTS = [18, 22, 25, 20, 28, 31, 17, 0, 0, 0, 0, 0];

export const historyMonths: MonthSummary[] = MONTH_LABELS.map((label, i) => ({
  label,
  count: MONTH_COUNTS[i],
}));
