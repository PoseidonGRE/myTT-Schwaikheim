import React from "react";
import { Fab, Zoom, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  onClick: () => void;
  label?: string;
}

export default function FloatingFab({ onClick, label = "Neues Mitglied anlegen" }: Props) {
  return (
    <Zoom in>
      <Tooltip title={label}>
        <Fab
          color="primary"
          size="large"
          onClick={onClick}
          sx={{
            boxShadow: 10,
            background: "linear-gradient(90deg,#4f8cff 0%,#5eead4 100%)",
            position: "fixed",
            right: 28,
            bottom: 38,
            zIndex: 2222
          }}
        >
          <AddIcon fontSize="large" />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
