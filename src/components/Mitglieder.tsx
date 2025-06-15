import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Button, Snackbar, Typography, Stack, TextField, Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  IconButton, Tooltip, Autocomplete, LinearProgress, Menu, MenuItem, Divider
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MitgliedForm from "./MitgliedForm";
import { useMitglieder } from "../hooks/useMitglieder";
import { Mitglied } from "../types/mitglied";
import { Gruppe } from "../types/gruppe";
import MitgliederGrid from "./MitgliederGrid";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from "@mui/icons-material/Groups";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { supabase } from "../types/supabaseClient";

// 🆕 Modernes Dashboard!
import MitgliederStatistik from "../components/MitgliederStatistik";
// 🆕 Modern Floating Action Button!
import FloatingFab from "../components/FloatingFab";

function getSafeOnClose(saving: boolean, fn: () => void) {
  return saving ? () => {} : fn;
}

export default function Mitglieder() {
  const { mitglieder, loading, error, reload, addMitglied, updateMitglied, deleteMitglied } = useMitglieder();
  const [modalOpen, setModalOpen] = useState(false);
  const [editMitglied, setEditMitglied] = useState<Mitglied | null>(null);
  const [mitgliedToDelete, setMitgliedToDelete] = useState<Mitglied | null>(null);
  const [snackbar, setSnackbar] = useState<string>();
  const [search, setSearch] = useState("");
  const [selectedMitglieder, setSelectedMitglieder] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Filter
  const [gruppenFilter, setGruppenFilter] = useState<Gruppe[]>([]);
  const [mitgliedstypFilter, setMitgliedstypFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Gruppenverwaltung
  const [gruppen, setGruppen] = useState<Gruppe[]>([]);
  const [gruppeName, setGruppeName] = useState("");
  const [gruppeDialogOpen, setGruppeDialogOpen] = useState(false);
  const [gruppeToDelete, setGruppeToDelete] = useState<Gruppe | null>(null);

  const [saving, setSaving] = useState(false);

  const [actionsAnchor, setActionsAnchor] = useState<null | HTMLElement>(null);
  const openActionsMenu = (e: React.MouseEvent<HTMLElement>) => setActionsAnchor(e.currentTarget);
  const closeActionsMenu = () => setActionsAnchor(null);

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase.from("gruppen").select("*");
      if (error) throw error;
      setGruppen((data ?? []) as Gruppe[]);
    } catch (e: any) {
      setSnackbar("Fehler beim Laden der Gruppen: " + (e.message || JSON.stringify(e)));
    }
  };
  useEffect(() => { loadGroups(); }, []);

  const alleMitgliedstypen = useMemo(() => {
    const set = new Set<string>();
    mitglieder.forEach(m => (m.mitgliedstyp || []).forEach(t => set.add(t)));
    return Array.from(set);
  }, [mitglieder]);

  const gefilterteMitglieder = useMemo(() => {
    return mitglieder
      .filter(m => {
        if (!gruppenFilter.length) return true;
        return m.gruppen?.some(id => gruppenFilter.some(g => g.id === id));
      })
      .filter(m => {
        if (!mitgliedstypFilter.length) return true;
        return m.mitgliedstyp?.some(t => mitgliedstypFilter.includes(t));
      })
      .filter(m =>
        [m.name, m.vorname, ...(m.mitgliedstyp||[]), m.email, m.ort, m.telefon, m.handy, m.strasse, m.plz,
         ...(m.gruppen?.map(id => gruppen.find(g => g.id === id)?.name) || [])]
          .join(" ").toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [mitglieder, gruppenFilter, mitgliedstypFilter, search, gruppen]);

  const handleDarkMode = () => setDarkMode(dm => !dm);
  const handleAddClick = () => { setEditMitglied(null); setModalOpen(true); };
  const handleEditClick = (m: Mitglied) => { setEditMitglied(m); setModalOpen(true); };
  const handleDelete = (m: Mitglied) => { setMitgliedToDelete(m); };
  const handleModalClose = () => setModalOpen(false);

  function cleanseGroups(raw: any): string[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((g: any) =>
      typeof g === "string" ? g :
      (g && typeof g === "object" && "id" in g) ? (g.id as string) :
      ""
    ).filter(Boolean);
  }

  // SPEICHERN
  const handleFormSubmit = async (data: any) => {
    setSaving(true);
    try {
      const cleanData = {
        ...data,
        gruppen: cleanseGroups(data.gruppen),
      };
      if (editMitglied && editMitglied.id) {
        await updateMitglied({ ...editMitglied, ...cleanData, id: editMitglied.id });
        setSnackbar("Mitglied aktualisiert!");
      } else {
        await addMitglied({ ...cleanData });
        setSnackbar("Mitglied angelegt!");
      }
      await reload();
    } catch (e: any) {
      setSnackbar("Fehler beim Speichern: " + (e.message || JSON.stringify(e)));
    }
    setSaving(false);
    setModalOpen(false);
    setEditMitglied(null);
  };

  // LÖSCHEN
  const confirmDelete = async () => {
    try {
      if (mitgliedToDelete?.id) {
        await deleteMitglied(mitgliedToDelete.id);
        setSnackbar("Mitglied gelöscht!");
        await reload();
      }
      setMitgliedToDelete(null);
    } catch (e: any) {
      setSnackbar("Fehler beim Löschen: " + (e.message || JSON.stringify(e)));
      setMitgliedToDelete(null);
    }
  };
  const cancelDelete = () => setMitgliedToDelete(null);

  // Massenlöschen
  const handleSelectMitglied = (id: string) => {
    setSelectedMitglieder(sel =>
      sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]
    );
  };
  const handleSelectAll = () => {
    setSelectedMitglieder(curr =>
      curr.length === gefilterteMitglieder.length
        ? []
        : gefilterteMitglieder.map(m => m.id)
    );
  };
  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedMitglieder) {
        await deleteMitglied(id);
      }
      setSelectedMitglieder([]);
      setSnackbar("Mitglieder gelöscht!");
      await reload();
    } catch (e: any) {
      setSnackbar("Fehler beim Massenlöschen: " + (e.message || JSON.stringify(e)));
    }
    closeActionsMenu();
  };

  // Exporte
  const handleExport = () => {
    try {
      const exportData = selectedMitglieder.length
        ? mitglieder.filter(m => selectedMitglieder.includes(m.id))
        : mitglieder;
      const csv = [
        ['Name','Vorname','E-Mail','Typ','Eintritt','Geburtstag','Gruppen'],
        ...exportData.map(m => [
          m.name,
          m.vorname,
          m.email||"",
          (m.mitgliedstyp||[]).join('/'),
          m.eintrittsdatum||"",
          m.geburtstag||"",
          m.gruppen?.map(id => gruppen.find(g=>g.id===id)?.name).filter(Boolean).join(", ")||""
        ])
      ].map(r => r.join(';')).join('\n');
      saveAs(new Blob([csv]), 'mitglieder.csv');
    } catch (e: any) {
      setSnackbar("Fehler beim CSV-Export: " + (e.message || JSON.stringify(e)));
    }
    closeActionsMenu();
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Mitgliederliste", 10, 10);
      let y = 20;
      (selectedMitglieder.length
        ? mitglieder.filter(m => selectedMitglieder.includes(m.id))
        : mitglieder
      ).forEach(m => {
        const line = `${m.vorname} ${m.name} – ${m.email||""} – ${(m.mitgliedstyp||[]).join(", ")} – ${m.gruppen?.map(id=>gruppen.find(g=>g.id===id)?.name).filter(Boolean).join(", ")||""}`;
        doc.text(line, 10, y);
        y += 8;
      });
      doc.save("mitglieder.pdf");
    } catch (e: any) {
      setSnackbar("Fehler beim PDF-Export: " + (e.message || JSON.stringify(e)));
    }
    closeActionsMenu();
  };

  // Gruppen
  const handleAddGruppe = async () => {
    try {
      if (!gruppeName.trim()) return;
      const { error } = await supabase.from("gruppen").insert([{ name: gruppeName }]);
      if (error) throw error;
      await loadGroups();
      setGruppeName("");
      setGruppeDialogOpen(false);
      setSnackbar("Gruppe angelegt!");
    } catch (e: any) {
      setSnackbar("Fehler beim Anlegen der Gruppe: " + (e.message || JSON.stringify(e)));
    }
  };

  const handleRemoveGruppe = async (g: Gruppe) => {
    try {
      await supabase.from("gruppen").delete().eq("id", g.id);
      for (const m of mitglieder) {
        if (m.gruppen?.includes(g.id)) {
          const neu = m.gruppen.filter(id => id !== g.id);
          await updateMitglied({ ...m, gruppen: neu });
        }
      }
      await reload();
      await loadGroups();
      setGruppeToDelete(null);
      setSnackbar("Gruppe gelöscht!");
    } catch (e: any) {
      setSnackbar("Fehler beim Löschen der Gruppe: " + (e.message || JSON.stringify(e)));
    }
  };

  const isMobile = window.innerWidth < 600;

  return (
    <Box sx={{
      maxWidth: 1300, mx: "auto", pt: 4,
      bgcolor: darkMode ? "#23272e" : undefined,
      color: darkMode ? "#fff" : undefined,
      minHeight: "100vh"
    }}>
      {/* Toolbar / Actions */}
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Mitglieder</Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title={darkMode ? "Heller Modus" : "Dunkler Modus"}>
            <IconButton onClick={handleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Aktionen">
            <IconButton onClick={openActionsMenu}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={actionsAnchor} open={Boolean(actionsAnchor)} onClose={closeActionsMenu}>
            <MenuItem onClick={handleExport}>
              <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> CSV-Export
            </MenuItem>
            <MenuItem onClick={handleExportPDF}>
              <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> PDF-Export
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setGruppeDialogOpen(true)}>
              <GroupsIcon fontSize="small" sx={{ mr: 1 }} /> Gruppe anlegen
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteSelected} disabled={selectedMitglieder.length === 0}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> {selectedMitglieder.length > 0 ? `${selectedMitglieder.length} löschen` : "Massenlöschen"}
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>

      {/* 🆕 MODERNES STATISTIK-DASHBOARD */}
      <MitgliederStatistik mitglieder={gefilterteMitglieder} />

      {/* Filter- und Suchzeile */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }} alignItems="flex-start">
        <Autocomplete
          multiple
          options={gruppen}
          getOptionLabel={g => g.name}
          value={gruppenFilter}
          onChange={(_, value) => setGruppenFilter(value)}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          renderInput={params => <TextField {...params} label="Nach Gruppen filtern" />}
          sx={{ minWidth: 200 }}
        />
        <Autocomplete
          multiple
          options={alleMitgliedstypen}
          getOptionLabel={t => t}
          value={mitgliedstypFilter}
          onChange={(_, value) => setMitgliedstypFilter(value)}
          renderInput={params => <TextField {...params} label="Nach Typ filtern" />}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Suchen…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          variant="outlined"
          sx={{ width: { xs: "100%", sm: 280 } }}
        />
        <Button
          variant={viewMode === "grid" ? "contained" : "outlined"}
          onClick={() => setViewMode("grid")}
          startIcon={<span style={{ fontWeight: 900 }}>🔳</span>}
        >
          Karten
        </Button>
        <Button
          variant={viewMode === "list" ? "contained" : "outlined"}
          onClick={() => setViewMode("list")}
          startIcon={<span style={{ fontWeight: 900 }}>☰</span>}
        >
          Liste
        </Button>
      </Stack>

      {/* Ladebalken */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Mitglieder-Grid */}
      <MitgliederGrid
        mitglieder={gefilterteMitglieder}
        gruppen={gruppen}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        loading={loading}
        error={error ?? undefined}
        onSelect={handleSelectMitglied}
        selected={selectedMitglieder}
        onSelectAll={handleSelectAll}
        allSelected={selectedMitglieder.length === gefilterteMitglieder.length}
        darkMode={darkMode}
        viewMode={viewMode}
      />

      {/* Drawer für Add/Edit */}
      <Drawer
        anchor="right"
        open={modalOpen}
        onClose={getSafeOnClose(saving, handleModalClose)}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 440, md: 480 },
            borderTopLeftRadius: 14,
            borderBottomLeftRadius: 14,
            boxShadow: 8,
            bgcolor: darkMode ? "#23272e" : "#fff"
          }
        }}
      >
        <Box sx={{ p: 3, pt: 4 }}>
          <MitgliedForm
            initialValues={editMitglied}
            onSubmit={handleFormSubmit}
            onClose={getSafeOnClose(saving, handleModalClose)}
            gruppen={gruppen}
            saving={saving}
          />
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={5000}
        onClose={() => setSnackbar(undefined)}
        message={snackbar}
      />

      {/* Dialog Mitglied löschen */}
      <Dialog open={!!mitgliedToDelete} onClose={cancelDelete}>
        <DialogTitle>Mitglied löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Möchtest du <b>{mitgliedToDelete?.vorname} {mitgliedToDelete?.name}</b> wirklich unwiderruflich löschen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Abbrechen</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Löschen</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Gruppe anlegen */}
      <Dialog open={gruppeDialogOpen} onClose={() => setGruppeDialogOpen(false)}>
        <DialogTitle>Gruppe anlegen</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Gruppenname"
                     value={gruppeName}
                     onChange={e => setGruppeName(e.target.value)}
                     fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGruppeDialogOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={handleAddGruppe}>Anlegen</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Gruppe löschen */}
      <Dialog open={!!gruppeToDelete} onClose={() => setGruppeToDelete(null)}>
        <DialogTitle>Gruppe löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Willst du wirklich die Gruppe <strong>{gruppeToDelete?.name}</strong> löschen?
            Sie wird von allen Mitgliedern entfernt.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGruppeToDelete(null)}>Abbrechen</Button>
          <Button color="error" variant="contained"
                  onClick={() => handleRemoveGruppe(gruppeToDelete!)}>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modern Floating Action Button */}
      <FloatingFab onClick={handleAddClick} label="Neues Mitglied anlegen" />

    </Box>
  );
}
