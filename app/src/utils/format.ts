export function nowLabel(): string {
  try {
    return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
}

export function dpiReference(chambre: string): string {
  return `APHP-2307-${chambre}${Math.floor(100 + Math.random() * 900)}`;
}
