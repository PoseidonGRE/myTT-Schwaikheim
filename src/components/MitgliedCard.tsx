import React from "react";
import { Card, CardContent, Typography, Stack, IconButton, Chip, Tooltip } from "@mui/material";
import AvatarBadge from "./AvatarBadge";
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
  onEdit: (m: Mitglied) => void;
  onDelete: (m: Mitglied) => void;
}

export default function MitgliedCard({ m, gruppen, onEdit, onDelete }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 6px 32px #bee7fd77",
        px: 2, py: 1.5, mb: 2,
        backdropFilter: "blur(2px)",
        minHeight: 180,
        transition: "box-shadow 0.22s, background 0.18s",
        "&:hover": { boxShadow: "0 8px 34px #4f8cff66" }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <AvatarBadge name={`${m.vorname} ${m.name}`} aktiv={m.aktiv ?? true} />
        <CardContent sx={{ flex: 1, py: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ cursor: "pointer" }} onClick={() => onEdit(m)}>
            {m.vorname} {m.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">{m.email}</Typography>
          <Stack direction="row" spacing={1} mt={1}>
            {(m.mitgliedstyp ?? []).map(t => <Chip key={t} label={t} size="small" color="primary" />)}
            {m.senioren && <Chip color="success" size="small" label="Senior" />}
            {m.whatsapp && <WhatsAppIcon fontSize="small" sx={{ color: "#25d366" }} />}
            {m.verteilerliste && <Chip icon={<ListAltIcon />} label="Verteiler" size="small" />}
            {m.gruppen?.map(id => {
              const g = gruppen?.find(gr => gr.id === id);
              return g ? <Chip key={id} size="small" label={g.name} icon={<GroupsIcon />} /> : null;
            })}
          </Stack>
        </CardContent>
        <Stack spacing={1}>
          <Tooltip title="Bearbeiten">
            <IconButton onClick={() => onEdit(m)}><EditIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton onClick={() => onDelete(m)}><DeleteIcon color="error" /></IconButton>
          </Tooltip>
          <Tooltip title="E-Mail schreiben">
            <IconButton component="a" href={`mailto:${m.email}`}><EmailIcon /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
