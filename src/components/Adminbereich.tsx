import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { db } from "../pouchdb";

export default function Adminbereich() {
  const [open, setOpen] = useState(false);

  const handleReset = async () => {
    await db.destroy();
    window.location.reload();
  };

  return (
    <div>
      <h2>Adminbereich – Hier kommen deine Admin-Funktionen rein.</h2>
      
      <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
        Datenbank zurücksetzen
      </Button>
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Datenbank wirklich zurücksetzen?</DialogTitle>
        <DialogContent>
          <b>Alle Mitglieder, Gruppen und sonstige Daten werden gelöscht.</b>
          <br /><br />
          Dies kann <b>nicht rückgängig</b> gemacht werden!
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button color="error" variant="contained" onClick={handleReset}>
            Ja, unwiderruflich löschen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
