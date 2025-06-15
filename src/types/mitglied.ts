// src/types/mitglied.ts
export interface Mitglied {
  id: string;                   // Primärschlüssel, UUID oder serial (Supabase)
  name: string;
  vorname: string;
  mitgliedstyp: string[];       // z.B. ["Herren", "Jugend"]
  senioren?: boolean;
  whatsapp?: boolean;
  verteilerliste?: boolean;
  email?: string;
  strasse?: string;
  plz?: string;
  ort?: string;
  geburtstag?: string;          // yyyy-mm-dd
  eintrittsdatum?: string;      // yyyy-mm-dd
  telefon?: string;
  handy?: string;
  geschaeftlich?: string;
  selected?: boolean;           // Nur für UI-Auswahl, nicht Supabase!
  gruppen?: string[];           // Array von group-IDs
  aktiv?: boolean;              // Aktivitätsstatus (optional)
}
