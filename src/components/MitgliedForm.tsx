import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Switch, Checkbox, Autocomplete, Box, Chip,
  FormControl, InputLabel, Select, MenuItem, OutlinedInput
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2'; // ★ neues Grid2-API
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupsIcon from '@mui/icons-material/Groups';

// Neue Typen
export interface Gruppe {
  id: string;
  name: string;
}

export interface MitgliedFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  initialValues?: any;
  gruppen?: Gruppe[];
  saving?: boolean;
}

const MITGLIEDSTYP_OPTIONS = [
  { label: 'Herren', value: 'Herren' },
  { label: 'Jugend', value: 'Jugend' },
  // ...weitere Typen
];

const plzRegex = /^\d{5}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strasseRegex = /^([A-Za-zäöüÄÖÜß\s\.]{2,})(\s?\d+[a-zA-Z]?)?$/;

// Hilfsfunktion: konvertiert auf string[]
const toIdArray = (val: any): string[] =>
  Array.isArray(val)
    ? val.map(v => typeof v === 'string' ? v : v?.id).filter(Boolean as any)
    : (typeof val === 'string' ? [val] : []);

export default function MitgliedForm({
  onSubmit, onClose, initialValues, gruppen = [], saving = false
}: MitgliedFormProps) {
  // States initialisieren
  const [name, setName] = useState(initialValues?.name ?? '');
  const [vorname, setVorname] = useState(initialValues?.vorname ?? '');
  const [mitgliedstyp, setMitgliedstyp] = useState<string[]>(toIdArray(initialValues?.mitgliedstyp));
  const [geburtstag, setGeburtstag] = useState<Date | null>(
    initialValues?.geburtstag ? new Date(initialValues.geburtstag) : null
  );
  const [senioren, setSenioren] = useState<boolean>(!!initialValues?.senioren);
  const [telefon, setTelefon] = useState(initialValues?.telefon ?? '');
  const [handy, setHandy] = useState(initialValues?.handy ?? '');
  const [geschaeftlich, setGeschaeftlich] = useState(initialValues?.geschaeftlich ?? '');
  const [strasse, setStrasse] = useState(initialValues?.strasse ?? '');
  const [plz, setPLZ] = useState(initialValues?.plz ?? '');
  const [ort, setOrt] = useState(initialValues?.ort ?? '');
  const [eintrittsdatum, setEintrittsdatum] = useState<Date | null>(
    initialValues?.eintrittsdatum ? new Date(initialValues.eintrittsdatum) : null
  );
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [whatsapp, setWhatsapp] = useState<boolean>(!!initialValues?.whatsapp);
  const [verteilerliste, setVerteilerliste] = useState<boolean>(!!initialValues?.verteilerliste);
  const [mitgliedGruppen, setMitgliedGruppen] = useState<string[]>(toIdArray(initialValues?.gruppen));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset beim Wechsel von initialValues
  useEffect(() => {
    setName(initialValues?.name ?? '');
    setVorname(initialValues?.vorname ?? '');
    setMitgliedstyp(toIdArray(initialValues?.mitgliedstyp));
    setGeburtstag(initialValues?.geburtstag ? new Date(initialValues.geburtstag) : null);
    setSenioren(!!initialValues?.senioren);
    setTelefon(initialValues?.telefon ?? '');
    setHandy(initialValues?.handy ?? '');
    setGeschaeftlich(initialValues?.geschaeftlich ?? '');
    setStrasse(initialValues?.strasse ?? '');
    setPLZ(initialValues?.plz ?? '');
    setOrt(initialValues?.ort ?? '');
    setEintrittsdatum(initialValues?.eintrittsdatum ? new Date(initialValues.eintrittsdatum) : null);
    setEmail(initialValues?.email ?? '');
    setWhatsapp(!!initialValues?.whatsapp);
    setVerteilerliste(!!initialValues?.verteilerliste);
    setMitgliedGruppen(toIdArray(initialValues?.gruppen));
    setErrors({});
  }, [initialValues]);

  // Validierung
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name) e.name = 'Pflichtfeld';
    if (!vorname) e.vorname = 'Pflichtfeld';
    if (mitgliedstyp.length === 0) e.mitgliedstyp = 'Pflichtfeld';
    if (!strasse || !strasseRegex.test(strasse)) e.strasse = 'Ungültig';
    if (!plz || !plzRegex.test(plz)) e.plz = '5-stellige PLZ';
    if (!ort) e.ort = 'Pflichtfeld';
    if (!email || !emailRegex.test(email)) e.email = 'Ungültige Email';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    onSubmit({
      name, vorname, mitgliedstyp,
      geburtstag: geburtstag?.toISOString().slice(0, 10),
      senioren, telefon, handy, geschaeftlich,
      strasse, plz, ort,
      eintrittsdatum: eintrittsdatum?.toISOString().slice(0, 10),
      email, whatsapp, verteilerliste,
      gruppen: mitgliedGruppen
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {/* Name / Vorname */}
          <Grid2 xs={6}>
            <TextField
              label="Name"
              required
              value={name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={e => setName(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>
          <Grid2 xs={6}>
            <TextField
              label="Vorname"
              required
              value={vorname}
              error={!!errors.vorname}
              helperText={errors.vorname}
              onChange={e => setVorname(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>

          {/* Mitgliedstyp */}
          <Grid2 xs={12}>
            <Autocomplete
              multiple
              options={MITGLIEDSTYP_OPTIONS}
              getOptionLabel={opt => opt.label}
              value={MITGLIEDSTYP_OPTIONS.filter(opt => mitgliedstyp.includes(opt.value))}
              onChange={(_, newVal) =>
                setMitgliedstyp(newVal.map(v => (typeof v === 'string' ? v : v.value)))
              }
              isOptionEqualToValue={(o, v) => o.value === v.value}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Mitgliedstyp"
                  error={!!errors.mitgliedstyp}
                  helperText={errors.mitgliedstyp}
                  disabled={saving}
                />
              )}
            />
          </Grid2>

          {/* Gruppen */}
          <Grid2 xs={12}>
            <FormControl fullWidth>
              <InputLabel>Gruppen</InputLabel>
              <Select
                multiple
                value={mitgliedGruppen}
                onChange={e =>
                  setMitgliedGruppen((e.target.value as string[]).filter(Boolean))
                }
                input={<OutlinedInput label="Gruppen" />}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selected.map(id => {
                      const g = gruppen.find(x => x.id === id);
                      return g ? (
                        <Chip
                          key={id}
                          icon={<GroupsIcon sx={{ fontSize: 18 }} />}
                          label={g.name}
                          size="small"
                          sx={{ bgcolor: '#e3ecfa', color: '#1976d2' }}
                        />
                      ) : null;
                    })}
                  </Box>
                )}
                disabled={saving}
              >
                {gruppen.map(g => (
                  <MenuItem key={g.id} value={g.id} disabled={saving}>
                    <Checkbox checked={mitgliedGruppen.includes(g.id)} />
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          {/* Geburtstag / Senioren */}
          <Grid2 xs={6}>
            <DatePicker
              label="Geburtstag"
              value={geburtstag}
              onChange={v => setGeburtstag(v)}
              slotProps={{ textField: { fullWidth: true, disabled: saving } }}
              disabled={saving}
            />
          </Grid2>
          <Grid2 xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={senioren}
              onChange={e => setSenioren(e.target.checked)}
              disabled={saving}
            />
            Senioren (40+)
          </Grid2>

          {/* Kontakt */}
          <Grid2 xs={4}>
            <TextField
              label="Telefon"
              value={telefon}
              onChange={e => setTelefon(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>
          <Grid2 xs={4}>
            <TextField
              label="Handy"
              value={handy}
              onChange={e => setHandy(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>
          <Grid2 xs={4}>
            <TextField
              label="Geschäftlich"
              value={geschaeftlich}
              onChange={e => setGeschaeftlich(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>

          {/* Adresse */}
          <Grid2 xs={8}>
            <TextField
              label="Straße"
              required
              value={strasse}
              error={!!errors.strasse}
              helperText={errors.strasse}
              onChange={e => setStrasse(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>
          <Grid2 xs={2}>
            <TextField
              label="PLZ"
              required
              value={plz}
              error={!!errors.plz}
              helperText={errors.plz}
              onChange={e => setPLZ(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>
          <Grid2 xs={2}>
            <TextField
              label="Ort"
              required
              value={ort}
              error={!!errors.ort}
              helperText={errors.ort}
              onChange={e => setOrt(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>

          {/* Eintrittsdatum / Email */}
          <Grid2 xs={6}>
            <DatePicker
              label="Eintrittsdatum"
              value={eintrittsdatum}
              onChange={v => setEintrittsdatum(v)}
              slotProps={{ textField: { fullWidth: true, disabled: saving } }}
              disabled={saving}
            />
          </Grid2>
          <Grid2 xs={6}>
            <TextField
              label="Email-Adresse"
              required
              value={email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid2>

          {/* Switches */}
          <Grid2 xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <WhatsAppIcon color={whatsapp ? 'success' : 'disabled'} />
            <Switch
              checked={whatsapp}
              onChange={e => setWhatsapp(e.target.checked)}
              inputProps={{ 'aria-label': 'WhatsApp' }}
              disabled={saving}
            />
            WhatsApp
          </Grid2>
          <Grid2 xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <ListAltIcon color={verteilerliste ? 'primary' : 'disabled'} />
            <Switch
              checked={verteilerliste}
              onChange={e => setVerteilerliste(e.target.checked)}
              inputProps={{ 'aria-label': 'Verteilerliste' }}
              disabled={saving}
            />
            Verteilerliste
          </Grid2>

          {/* Buttons */}
          <Grid2 xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={onClose} disabled={saving}>
                Abbrechen
              </Button>
              <Button variant="contained" type="submit" disabled={saving}>
                {saving ? 'Speichern…' : 'Speichern'}
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </form>
    </LocalizationProvider>
  );
}
