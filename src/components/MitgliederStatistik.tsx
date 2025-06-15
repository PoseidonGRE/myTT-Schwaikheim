import React, { useMemo, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Paper
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2"; // NEU: Grid2 verwenden!
import { Mitglied } from "../types/mitglied";
import StatWidget from "./StatWidget";
import MitgliederChart from "./MitgliederChart";
import AltersstrukturDonut from "./AltersstrukturDonut";
import { filterMitglieder } from "../utils/filterMitglieder";

interface Props {
  mitglieder: Mitglied[];
}

export default function MitgliederStatistik({ mitglieder }: Props) {
  const [filter, setFilter] = useState({
    gruppe: "",
    typ: "",
    suchtext: "",
    von: "",
    bis: "",
  });

  const gefiltert = useMemo(
    () => filterMitglieder(mitglieder, filter),
    [mitglieder, filter]
  );

  const gruppen = Array.from(
    new Set(mitglieder.flatMap((m) => m.gruppen ?? []))
  ).sort();
  const typen = Array.from(
    new Set(mitglieder.flatMap((m) => m.mitgliedstyp ?? []))
  ).sort();

  const count = {
    total: gefiltert.length,
    herren: gefiltert.filter((m) => (m.mitgliedstyp ?? []).includes("Herren")).length,
    jugend: gefiltert.filter((m) => (m.mitgliedstyp ?? []).includes("Jugend")).length,
    senioren: gefiltert.filter((m) => m.senioren).length,
    whatsapp: gefiltert.filter((m) => m.whatsapp).length,
    verteiler: gefiltert.filter((m) => m.verteilerliste).length,
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Gruppe"
              value={filter.gruppe}
              onChange={(e) =>
                setFilter((f) => ({ ...f, gruppe: e.target.value }))
              }
            >
              <MenuItem value="">Alle</MenuItem>
              {gruppen.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>

          <Grid2 xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Mitgliedstyp"
              value={filter.typ}
              onChange={(e) =>
                setFilter((f) => ({ ...f, typ: e.target.value }))
              }
            >
              <MenuItem value="">Alle</MenuItem>
              {typen.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>

          <Grid2 xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Von"
              InputLabelProps={{ shrink: true }}
              value={filter.von}
              onChange={(e) =>
                setFilter((f) => ({ ...f, von: e.target.value }))
              }
            />
          </Grid2>

          <Grid2 xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Bis"
              InputLabelProps={{ shrink: true }}
              value={filter.bis}
              onChange={(e) =>
                setFilter((f) => ({ ...f, bis: e.target.value }))
              }
            />
          </Grid2>

          <Grid2 xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Suche"
              value={filter.suchtext}
              onChange={(e) =>
                setFilter((f) => ({ ...f, suchtext: e.target.value }))
              }
            />
          </Grid2>
        </Grid2>
      </Paper>

      {/* Statistik-Kacheln */}
      <Grid2 container spacing={2}>
        <Grid2 xs={6} sm={4} md={2}>
          <StatWidget title="Mitglieder gesamt" value={count.total} />
        </Grid2>
        <Grid2 xs={6} sm={4} md={2}>
          <StatWidget title="Herren" value={count.herren} color="info" />
        </Grid2>
        <Grid2 xs={6} sm={4} md={2}>
          <StatWidget title="Jugend" value={count.jugend} color="secondary" />
        </Grid2>
        <Grid2 xs={6} sm={4} md={2}>
          <StatWidget title="Senioren" value={count.senioren} color="success" />
        </Grid2>
        <Grid2 xs={6} sm={4} md={2}>
          <StatWidget title="WhatsApp" value={count.whatsapp} />
        </Grid2>
        <Grid2 xs={6} sm={4} md={2}>
          <StatWidget title="Verteiler" value={count.verteiler} />
        </Grid2>
      </Grid2>

      {/* Charts */}
      <Grid2 container spacing={2} sx={{ mt: 4 }}>
        <Grid2 xs={12} md={6}>
          <MitgliederChart mitglieder={gefiltert} />
        </Grid2>
        <Grid2 xs={12} md={6}>
          <AltersstrukturDonut mitglieder={gefiltert} />
        </Grid2>
      </Grid2>
    </Box>
  );
}
