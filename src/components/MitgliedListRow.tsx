import React from "react";
import { Box, Typography, IconButton, Stack, Chip, Tooltip, Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import GroupsIcon from "@mui/icons-material/Groups";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EmailIcon from "@mui/icons-material/Email";
import { Mitglied } from "../types/mitglied";
import { Gruppe } from "../types/gruppe";

interface Props {
  m: Mitglied;
  gruppen?: Gruppe[];
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (m: Mitglied) => void;
  onDelete: (m: Mitglied) => void;
}

export default function MitgliedListRow({ m, gruppen, selected, onSelect, onEdit, onDelete }: Props) {
  return (
    <Box
      sx={{
        display: "flex", alignItems: "center",
        px: 2, py: 1,
        borderRadius: 3,
        boxShadow: selected ? "0 4px 22px #4f8cff44" : "0 2px 6px #dde8fa",
        mb: 1,
        bgcolor: selected ? "#e8f4ff" : "#fff",
        color: undefined, gap: 2,
        transition: "background 0.22s, box-shadow 0.25s"
      }}
    >
      <Checkbox checked={selected} onChange={() => onSelect(m.id)} sx={{ mr: 1 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ cursor: "pointer" }}
          onClick={() => onEdit(m)}
        >
          {m.vorname} {m.name}
        </Typography>
        <Stack direction="row" gap={1} flexWrap="wrap" mt={0.4}>
          {m.mitgliedstyp?.map(t => (
            <Chip key={t} color="primary" label={t} size="small" />
          ))}
          {m.senioren && <Chip size="small" label="Senior" color="secondary" />}
          {m.verteilerliste && (
            <Chip
              size="small"
              icon={<ListAltIcon sx={{ fontSize: 16 }} />}
              label="Verteiler"
              color="default"
            />
          )}
          {m.whatsapp && (
            <Chip
              size="small"
              icon={<WhatsAppIcon sx={{ fontSize: 16, color: "#25d366" }} />}
              label="WhatsApp"
              sx={{ bgcolor: "#e5f7ef", color: "#25d366" }}
            />
          )}
          {m.gruppen && m.gruppen.map(grId => {
            const gruppe = gruppen?.find(g => g.id === grId);
            return gruppe ? (
              <Chip
                key={grId}
                size="small"
                label={gruppe.name}
                icon={<GroupsIcon sx={{ fontSize: 16 }} />}
                sx={{ bgcolor: "#e3ecfa", color: "#1976d2" }}
              />
            ) : null;
          })}
        </Stack>
      </Box>
      <Box>
        <Tooltip title="Bearbeiten">
          <IconButton onClick={() => onEdit(m)}><EditIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton onClick={() => onDelete(m)}><DeleteIcon /></IconButton>
        </Tooltip>
        <Tooltip title="E-Mail schreiben">
          <IconButton component="a" href={`mailto:${m.email}`}>
            <EmailIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
