import React from "react";
import { Drawer, Box, Typography, Stack, Chip } from "@mui/material";
import { Mitglied } from "../types/mitglied";
import AvatarBadge from "./AvatarBadge";

interface Props {
  open: boolean;
  mitglied: Mitglied | null;
  onClose: () => void;
}

export default function QuickPeekDrawer({ open, mitglied, onClose }: Props) {
  if (!mitglied) return null;
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 340, p: 2 } }}>
      <Box sx={{ p: 3 }}>
        <Stack spacing={2} alignItems="center">
          <AvatarBadge name={`${mitglied.vorname} ${mitglied.name}`} aktiv={mitglied.aktiv ?? true} />
          <Typography variant="h6" fontWeight={700}>{mitglied.vorname} {mitglied.name}</Typography>
          <Typography color="text.secondary">{mitglied.email}</Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {(mitglied.mitgliedstyp ?? []).map(t => <Chip key={t} label={t} />)}
            {mitglied.senioren && <Chip color="success" label="Senior" />}
          </Stack>
          <Typography variant="body2" sx={{ mt: 2 }}>Weitere Details...</Typography>
        </Stack>
      </Box>
    </Drawer>
  );
}
