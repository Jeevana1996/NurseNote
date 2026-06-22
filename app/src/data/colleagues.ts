import type { Colleague } from "../types";

export const colleagues: Colleague[] = [
  {
    key: "sophie",
    name: "Sophie Lefebvre",
    initials: "SL",
    entries: [
      { chambre: "20", nom: "M. Alain Dubois", note: "Post-op valve — surveillance saignement" },
      { chambre: "21", nom: "Mme Hélène Faure", note: "Insuffisance cardiaque — diurèse 900 mL" },
      { chambre: "22", nom: "M. Marc Leroy", note: "ACFA — anticoagulation en cours" },
      { chambre: "23", nom: "Mme Sylvie Marchand", note: "HTA — TA contrôlée" },
    ],
  },
  {
    key: "karim",
    name: "Karim Haddad",
    initials: "KH",
    entries: [
      { chambre: "24", nom: "M. Julien Robert", note: "Angor instable — coro prévue" },
      { chambre: "25", nom: "Mme Fatima Said", note: "Œdèmes — surveillance poids" },
      { chambre: "26", nom: "M. Pierre Garnier", note: "Pacemaker — pansement propre" },
    ],
  },
  {
    key: "emilie",
    name: "Émilie Roux",
    initials: "ER",
    entries: [
      { chambre: "27", nom: "Mme Claire Moreau", note: "Péricardite — douleur soulagée" },
      { chambre: "28", nom: "M. Thomas Petit", note: "Bilan douleur thoracique — troponines OK" },
    ],
  },
];
