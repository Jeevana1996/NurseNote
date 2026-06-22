import type { Service } from "../types";

export const services: Service[] = [
  { key: "cardio", name: "Cardiologie", sub: "Votre service", short: "Ca", locked: false },
  { key: "mater", name: "Maternité", sub: "Verrouillé", short: "Ma", locked: true },
  { key: "pedia", name: "Pédiatrie", sub: "Verrouillé", short: "Pé", locked: true },
  { key: "urg", name: "Urgences", sub: "Verrouillé", short: "Ur", locked: true },
];
