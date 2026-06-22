import type { Drug } from "../types";

export const drugs: Drug[] = [
  {
    key: "furosemide",
    name: "Furosémide (Lasilix)",
    classe: "Diurétique de l'anse",
    poso: "20 à 40 mg/jour, à adapter selon la diurèse et le poids.",
    voie: "Per os ou IV lente. Ne pas injecter trop vite.",
    effets: "Hypokaliémie, déshydratation, hypotension, hyperuricémie.",
    surv: "Ionogramme (kaliémie), diurèse, poids quotidien, tension artérielle.",
  },
  {
    key: "enoxaparine",
    name: "Énoxaparine (Lovenox)",
    classe: "HBPM — anticoagulant",
    poso: "Préventif : 4000 UI/jour en 1 injection. Curatif : selon le poids.",
    voie: "Sous-cutanée, pli abdominal latéral. Ne pas purger la bulle d'air.",
    effets: "Risque hémorragique, thrombopénie induite (TIH), hématome au point d'injection.",
    surv: "Plaquettes (2x/sem), signes de saignement, anti-Xa si besoin.",
  },
  {
    key: "bisoprolol",
    name: "Bisoprolol",
    classe: "Bêta-bloquant cardiosélectif",
    poso: "1,25 à 10 mg/jour en une prise le matin.",
    voie: "Orale. Ne pas arrêter brutalement.",
    effets: "Bradycardie, hypotension, fatigue, refroidissement des extrémités.",
    surv: "Fréquence cardiaque (ne pas administrer si FC < 50), tension artérielle.",
  },
  {
    key: "amiodarone",
    name: "Amiodarone (Cordarone)",
    classe: "Anti-arythmique classe III",
    poso: "200 mg/jour en entretien. Dose de charge selon protocole.",
    voie: "PO ou IV (voie centrale si perfusion prolongée).",
    effets: "Dysthyroïdie, photosensibilité, allongement du QT, dépôts cornéens.",
    surv: "ECG (QT), bilan thyroïdien (TSH), bilan hépatique.",
  },
];
