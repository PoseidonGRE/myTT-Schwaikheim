import React, { useState } from "react";
import { Box, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import Mitglieder from "./components/Mitglieder";
import Adminbereich from "./components/Adminbereich";
import Hilfe from "./components/Hilfe";

function App() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        aria-label="Menü"
        centered={!isMobile}
        variant={isMobile ? "scrollable" : "fullWidth"}
        scrollButtons={isMobile ? "auto" : false}
      >
        <Tab icon={<GroupIcon />} label="Mitgliederliste" />
        <Tab icon={<AdminPanelSettingsIcon />} label="Adminbereich" />
        <Tab icon={<HelpOutlineIcon />} label="Hilfe" />
      </Tabs>
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
        {tab === 0 && <Mitglieder />}
        {tab === 1 && <Adminbereich />}
        {tab === 2 && <Hilfe />}
      </Box>
    </Box>
  );
}

export default App;
