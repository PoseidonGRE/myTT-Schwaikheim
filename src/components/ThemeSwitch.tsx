import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

interface Props {
  darkMode: boolean;
  onToggle: () => void;
}

export default function ThemeSwitch({ darkMode, onToggle }: Props) {
  return (
    <Tooltip title={darkMode ? "Heller Modus" : "Dunkler Modus"}>
      <IconButton onClick={onToggle} size="large">
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}
