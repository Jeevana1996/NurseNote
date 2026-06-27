import type { Colleague } from "../types";

export const colleagues: Colleague[] = [
  {
    key: "sophie",
    name: "Sophie Lefebvre",
    initials: "SL",
    entries: [
      {
        chambre: "20",
        nom: "M. Alain Dubois",
        note: "Post-op valve — surveillance saignement",
        statut: "a_surveiller",
        heure: "13:40",
        detail:
          "J1 post-remplacement valvulaire aortique. Pansement sternal sec, redon ramène 80 mL séro-sanglant sur 4h. TA 118/72, FC 78 sinusal. Douleur 2/10 sous paracétamol. Reprise d'une alimentation légère ce midi, bien tolérée. À surveiller : reprise du redon, apparition de fièvre.",
      },
      {
        chambre: "21",
        nom: "Mme Hélène Faure",
        note: "Insuffisance cardiaque — diurèse 900 mL",
        statut: "stable",
        heure: "14:05",
        detail:
          "Décompensation cardiaque en cours d'amélioration sous diurétiques IV. Diurèse des 24h : 900 mL pour des apports de 600 mL, bilan négatif comme souhaité. Auscultation pulmonaire allégée par rapport à hier. Poids -1,2 kg depuis l'admission. Poursuite du traitement, pesée prévue ce soir.",
      },
      {
        chambre: "22",
        nom: "M. Marc Leroy",
        note: "ACFA — anticoagulation en cours",
        statut: "stable",
        heure: "12:50",
        detail:
          "ACFA rapide ralentie par bêta-bloquant, FC actuelle 84/min irrégulière. Anticoagulation curative débutée hier, prochain contrôle biologique demain matin. Patient asymptomatique, pas de palpitations rapportées. Éducation thérapeutique sur l'anticoagulation à prévoir avant la sortie.",
      },
      {
        chambre: "23",
        nom: "Mme Sylvie Marchand",
        note: "HTA — TA contrôlée",
        statut: "sortie_prevue",
        heure: "11:30",
        detail:
          "Hypertension artérielle équilibrée sous bithérapie, dernières TA entre 128/78 et 134/82. Aucun symptôme. Sortie envisagée demain matin sous réserve de l'avis du cardiologue de garde. Ordonnance de sortie à préparer, consultation de suivi à programmer à 1 mois.",
      },
    ],
  },
  {
    key: "karim",
    name: "Karim Haddad",
    initials: "KH",
    entries: [
      {
        chambre: "24",
        nom: "M. Julien Robert",
        note: "Angor instable — coro prévue",
        statut: "a_surveiller",
        heure: "13:15",
        detail:
          "Douleurs thoraciques résolutives sous trinitrine, dernier épisode il y a 6h. ECG sans sus-décalage, troponines en légère cinétique ascendante. Coronarographie programmée demain matin à jeun. Surveillance rapprochée de la douleur et scope continu.",
      },
      {
        chambre: "25",
        nom: "Mme Fatima Said",
        note: "Œdèmes — surveillance poids",
        statut: "stable",
        heure: "12:20",
        detail:
          "Œdèmes des membres inférieurs en régression sous diurétique oral. Poids stable par rapport à hier (68,4 kg). Pas de signe de surcharge pulmonaire à l'auscultation. Pesée quotidienne à poursuivre, surélévation des jambes au fauteuil.",
      },
      {
        chambre: "26",
        nom: "M. Pierre Garnier",
        note: "Pacemaker — pansement propre",
        statut: "sortie_prevue",
        heure: "10:50",
        detail:
          "J2 post-implantation pacemaker double chambre. Pansement propre et sec, pas de signe inflammatoire au point de ponction. Contrôle radiologique du matin satisfaisant. Sortie prévue demain avec carte de porteur de pacemaker et consultation de contrôle à 1 mois.",
      },
    ],
  },
  {
    key: "emilie",
    name: "Émilie Roux",
    initials: "ER",
    entries: [
      {
        chambre: "27",
        nom: "Mme Claire Moreau",
        note: "Péricardite — douleur soulagée",
        statut: "stable",
        heure: "13:55",
        detail:
          "Péricardite aiguë sous AINS, douleur thoracique nettement améliorée (1/10 ce matin contre 6/10 hier). Frottement péricardique toujours perceptible mais discret. Apyrétique depuis 24h. Échocardiographie de contrôle prévue avant la sortie.",
      },
      {
        chambre: "28",
        nom: "M. Thomas Petit",
        note: "Bilan douleur thoracique — troponines OK",
        statut: "sortie_prevue",
        heure: "11:05",
        detail:
          "Bilan de douleur thoracique atypique : troponines négatives à deux dosages successifs, ECG normal, épreuve d'effort prévue en externe. Patient totalement asymptomatique depuis l'admission. Sortie prévue cet après-midi avec consigne de reconsulter si récidive.",
      },
    ],
  },
];
