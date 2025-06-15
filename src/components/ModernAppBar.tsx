import React from "react";
import {
  AppBar, Toolbar, IconButton, Avatar, Box, TextField, useMediaQuery
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion } from "framer-motion";

// Props-Typisierung!
interface ModernAppBarProps {
  onSearch?: (value: string) => void;
}

// Styled Gradient AppBar
const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(90deg, #4f8cff 0%, #5eead4 100%)",
  boxShadow: "0 4px 20px 0 rgba(60,132,247,0.08)",
  backdropFilter: "blur(4px)",
}));

const ModernAppBar: React.FC<ModernAppBarProps> = ({ onSearch }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <GradientAppBar position="sticky" elevation={0}>
        <Toolbar sx={{ py: 2 }}>
          <Avatar sx={{ mr: 2, width: 40, height: 40, bgcolor: "#fff", color: "#4f8cff" }}>U</Avatar>
          <Box sx={{ flexGrow: 1, mx: isMobile ? 0 : 4 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Mitglieder suchen..."
              fullWidth
              onChange={e => onSearch && onSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "#a8b4c6", mr: 1 }} />
                ),
                sx: {
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.75)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  fontWeight: 500,
                },
              }}
            />
          </Box>
          <IconButton sx={{ ml: 2 }}>
            <SettingsIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Toolbar>
      </GradientAppBar>
    </motion.div>
  );
};

export default ModernAppBar;
