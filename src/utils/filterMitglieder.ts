// src/utils/filterMitglieder.ts
import { Mitglied } from "../types/mitglied";

interface Filter {
  gruppe?: string;
  typ?: string;
  von?: string;
  bis?: string;
  suchtext?: string;
}

export function filterMitglieder(mitglieder: Mitglied[], filter: Filter): Mitglied[] {
  return mitglieder.filter((m) => {
    const matchGruppe = filter.gruppe ? m.gruppen?.includes(filter.gruppe) : true;
    const matchTyp = filter.typ ? m.mitgliedstyp.includes(filter.typ) : true;
    const matchSuchtext = filter.suchtext
      ? (m.name + " " + m.vorname).toLowerCase().includes(filter.suchtext.toLowerCase())
      : true;

    const eintritt = m.eintrittsdatum ? new Date(m.eintrittsdatum) : null;
    const matchVon = filter.von ? eintritt && eintritt >= new Date(filter.von) : true;
    const matchBis = filter.bis ? eintritt && eintritt <= new Date(filter.bis) : true;

    return matchGruppe && matchTyp && matchSuchtext && matchVon && matchBis;
  });
}
