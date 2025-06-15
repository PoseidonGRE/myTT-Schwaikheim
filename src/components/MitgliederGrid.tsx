// src/components/MitgliederGrid.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupsIcon from '@mui/icons-material/Groups';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { motion } from 'framer-motion';

import { Mitglied } from '../types/mitglied';
import { Gruppe } from '../types/gruppe';

interface MitgliederGridProps {
  mitglieder: Mitglied[];
  gruppen?: Gruppe[];
  onEdit: (mitglied: Mitglied) => void;
  onDelete: (mitglied: Mitglied) => void;
  onSelect: (id: string) => void;
  selected: string[];
  onSelectAll: () => void;
  allSelected: boolean;
  loading?: boolean;
  error?: string;
  darkMode?: boolean;
  viewMode?: "grid" | "list";
}

export default function MitgliederGrid({
  mitglieder,
  gruppen,
  onEdit,
  onDelete,
  onSelect,
  selected,
  onSelectAll,
  allSelected,
  loading,
  error,
  darkMode,
  viewMode = "grid"
}: MitgliederGridProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuMitglied, setMenuMitglied] = React.useState<Mitglied | null>(null);

  const openMenu = (event: React.MouseEvent<HTMLElement>, m: Mitglied) => {
    setAnchorEl(event.currentTarget);
    setMenuMitglied(m);
  };
  const closeMenu = () => {
    setAnchorEl(null);
    setMenuMitglied(null);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress size={48} sx={{ mb: 2 }} />
        <Typography variant="body2" color="textSecondary">Lade Mitglieder ...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (mitglieder.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 6, opacity: 0.6 }}>
        <SentimentDissatisfiedIcon color="disabled" sx={{ fontSize: 64, mb: 1 }} />
        <Typography variant="h6" color="textSecondary">
          Keine Mitglieder gefunden.
        </Typography>
      </Box>
    );
  }

  // Listenansicht
  if (viewMode === "list") {
    return (
      <Box>
        <Grid2 container spacing={1}>
          <Grid2 xs={12}>
            <Box sx={{ pl: 2, pb: 1, display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={allSelected}
                onChange={onSelectAll}
                indeterminate={selected.length > 0 && !allSelected}
              />
              <Typography component="span" sx={{ fontWeight: 700 }}>
                Alle auswählen
              </Typography>
            </Box>
          </Grid2>
          {mitglieder.map((m) => (
            <Grid2 xs={12} key={m.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.4,
                  borderRadius: 3,
                  boxShadow: selected.includes(m.id)
                    ? "0 4px 24px #4f8cff33"
                    : (darkMode ? "0 2px 8px #222a36" : "0 2px 6px #dde8fa"),
                  mb: 1,
                  bgcolor: selected.includes(m.id)
                    ? (darkMode ? "#27324a" : "#e8f4ff")
                    : (darkMode ? "#23272e" : "#fff"),
                  color: darkMode ? "#fff" : undefined,
                  gap: 2,
                  transition: "background 0.22s, box-shadow 0.25s"
                }}
                component={motion.div}
                whileHover={{ scale: 1.013, boxShadow: "0 6px 22px #5eead4bb" }}
              >
                <Checkbox
                  checked={selected.includes(m.id)}
                  onChange={() => onSelect(m.id)}
                  sx={{ mr: 1 }}
                  inputProps={{ 'aria-label': 'Mitglied auswählen' }}
                />
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
                    {m.gruppen?.map(grId => {
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
                    <IconButton onClick={() => onEdit(m)} aria-label="Bearbeiten"><EditIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Löschen">
                    <IconButton onClick={() => onDelete(m)} aria-label="Löschen"><DeleteIcon /></IconButton>
                  </Tooltip>
                  {m.email && (
                    <Tooltip title="E-Mail schreiben">
                      <IconButton component="a" href={`mailto:${m.email}`} aria-label="E-Mail schreiben">
                        <EmailIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    );
  }

  // Kartenansicht
  return (
    <Box>
      <Grid2 container spacing={{ xs: 2, md: 3 }} justifyContent="flex-start">
        <Grid2 xs={12}>
          <Box sx={{ pl: 2, pb: 1, display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={allSelected}
              onChange={onSelectAll}
              indeterminate={selected.length > 0 && !allSelected}
            />
            <Typography component="span" sx={{ fontWeight: 700 }}>
              Alle auswählen
            </Typography>
          </Box>
        </Grid2>
        {mitglieder.map((m) => (
          <Grid2 xs={12} sm={6} md={4} key={m.id}>
            <Card
              component={motion.div}
              whileHover={{
                scale: 1.027,
                boxShadow: "0 12px 44px #4f8cff44"
              }}
              sx={{
                boxShadow: selected.includes(m.id)
                  ? "0 6px 36px #4f8cff33"
                  : "0 6px 32px #bee7fd55",
                minHeight: 250,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                px: 1,
                pt: 2,
                pb: 1,
                bgcolor: darkMode ? "rgba(24,29,36,0.98)" : "rgba(255,255,255,0.97)",
                backdropFilter: "blur(4px)",
                color: darkMode ? "#fff" : undefined,
                border: selected.includes(m.id)
                  ? "2px solid #4f8cff99"
                  : "1.5px solid #e4efff33",
                transition: "all 0.18s cubic-bezier(.54,.07,.56,1.0)"
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pb: 0.5, px: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "#4f8cff",
                    fontWeight: 800,
                    fontSize: 19,
                    width: 44,
                    height: 44,
                    mr: 1,
                  }}
                >
                  {(m.vorname?.[0] || '') + (m.name?.[0] || '')}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    fontWeight={700}
                    fontSize={17}
                    sx={{ cursor: "pointer", wordBreak: "break-all" }}
                    onClick={() => onEdit(m)}
                  >
                    {m.vorname} {m.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {m.email}
                  </Typography>
                </Box>
                <Checkbox
                  checked={selected.includes(m.id)}
                  onChange={() => onSelect(m.id)}
                  sx={{ mx: 0.5, my: 0 }}
                  inputProps={{ 'aria-label': 'Mitglied auswählen' }}
                />
                <Tooltip title="Mehr Aktionen">
                  <IconButton onClick={e => openMenu(e, m)} aria-label="Mehr Aktionen">
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                  <MenuItem onClick={() => { if (menuMitglied) onEdit(menuMitglied); closeMenu(); }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Bearbeiten
                  </MenuItem>
                  <MenuItem onClick={() => { if (menuMitglied) onDelete(menuMitglied); closeMenu(); }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Löschen
                  </MenuItem>
                  <Divider />
                  <MenuItem component="a" href={menuMitglied ? `mailto:${menuMitglied.email}` : "#"} onClick={closeMenu}>
                    <EmailIcon fontSize="small" sx={{ mr: 1 }} /> E-Mail schreiben
                  </MenuItem>
                </Menu>
              </Stack>
              <CardContent sx={{ py: 1, pb: 0.2 }}>
                <Stack direction="row" gap={1} flexWrap="wrap" mb={1.2}>
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
                  {m.gruppen?.map(grId => {
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
                <Typography variant="body2" color="textSecondary">
                  {m.strasse}{m.strasse && ','} {m.plz} {m.ort}
                </Typography>
                {m.geburtstag && (
                  <Typography variant="caption" color="warning.main">
                    🎂 {new Date(m.geburtstag).toLocaleDateString("de-DE")}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ pt: 0, pl: 0.5 }}>
                <Tooltip title="Bearbeiten">
                  <IconButton onClick={() => onEdit(m)} aria-label="Bearbeiten"><EditIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Löschen">
                  <IconButton onClick={() => onDelete(m)} aria-label="Löschen"><DeleteIcon /></IconButton>
                </Tooltip>
                {m.email && (
                  <Tooltip title="E-Mail schreiben">
                    <IconButton component="a" href={`mailto:${m.email}`} aria-label="E-Mail schreiben">
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
