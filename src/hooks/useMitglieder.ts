// hooks/useMitglieder.ts
import { useState, useCallback, useEffect } from "react";
import { supabase } from "../types/supabaseClient";
import { Mitglied } from "../types/mitglied";

export function useMitglieder() {
  const [mitglieder, setMitglieder] = useState<Mitglied[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Alle Mitglieder laden
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("mitglieder")
        .select("*");
      if (error) {
        setError("Fehler beim Laden: " + error.message);
        setMitglieder([]);
      } else {
        setMitglieder(data as Mitglied[]);
      }
    } catch (e: any) {
      setError("Fehler beim Laden!");
      setMitglieder([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // Mitglied hinzufügen
  const addMitglied = useCallback(async (mitglied: Omit<Mitglied, "id">) => {
    const { error } = await supabase
      .from("mitglieder")
      .insert([mitglied]);
    if (error) {
      console.error("Fehler beim Hinzufügen:", error);
      alert("Fehler beim Hinzufügen: " + error.message + "\n\n" + JSON.stringify(error, null, 2));
    }
    await reload();
  }, [reload]);

  // Mitglied bearbeiten/aktualisieren
  const updateMitglied = useCallback(async (mitglied: Mitglied) => {
    const { error } = await supabase
      .from("mitglieder")
      .update(mitglied)
      .eq("id", mitglied.id);

    if (error) {
      console.error("Fehler beim Update:", error);
      alert(
        "Fehler beim Update: " + error.message + "\n\n" + JSON.stringify(error, null, 2) +
        "\n\nMitglied (Debug):\n" + JSON.stringify(mitglied, null, 2)
      );
      return;
    }
    await reload();
  }, [reload]);

  // Mitglied löschen
  const deleteMitglied = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("mitglieder")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Fehler beim Löschen:", error);
      alert("Fehler beim Löschen: " + error.message + "\n\n" + JSON.stringify(error, null, 2));
    }
    await reload();
  }, [reload]);

  return {
    mitglieder,
    loading,
    error,
    reload,
    addMitglied,
    updateMitglied,
    deleteMitglied
  };
}
