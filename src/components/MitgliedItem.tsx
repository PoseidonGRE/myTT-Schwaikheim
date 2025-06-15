import React from "react";
import { ListItem, IconButton, Box, Chip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Mitglied } from "../types/mitglied";

type Props = {
  mitglied: Mitglied;
  onMenu: (e: React.MouseEvent<HTMLElement>, m: Mitglied) => void;
};

export const MitgliedItem = React.memo(({ mitglied, onMenu }: Props) => (
  <ListItem
    divider
    secondaryAction={
      <IconButton edge="end" aria-label="Optionen" onClick={e => onMenu(e, mitglied)}>
        <MoreVertIcon />
      </IconButton>
    }
  >
    <Box sx={{ width: '100%' }}>
      <b>{mitglied.name}, {mitglied.vorname}</b>{" "}
      {mitglied.mitgliedstyp && Array.isArray(mitglied.mitgliedstyp)
        ? mitglied.mitgliedstyp.map(t => (
            <Chip key={t} label={t} size="small" sx={{ ml: 1 }} />
          ))
        : <Chip label={mitglied.mitgliedstyp} size="small" sx={{ ml: 1 }} />}
      <br />
      {mitglied.email}
      <br />
      {mitglied.strasse}, {mitglied.plz} {mitglied.ort}
      <br />
      <small>
        {mitglied.telefon && `Tel: ${mitglied.telefon} `}
        {mitglied.handy && `Handy: ${mitglied.handy} `}
        {mitglied.geschaeftlich && `Geschäftlich: ${mitglied.geschaeftlich} `}
        {mitglied.senioren ? "Senior" : ""}
      </small>
    </Box>
  </ListItem>
));
