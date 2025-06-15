import React from "react";
import { Avatar, Badge } from "@mui/material";
import { deepPurple, teal, blue, green, amber, orange } from "@mui/material/colors";

const farben = [deepPurple[400], teal[400], blue[400], green[400], amber[600], orange[600]];
function avatarColor(name: string) {
  let code = 0; for (let i = 0; i < name.length; i++) code += name.charCodeAt(i);
  return farben[code % farben.length];
}

interface Props {
  name: string;
  aktiv?: boolean;
}

export default function AvatarBadge({ name, aktiv = true }: Props) {
  const initials = name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{ "& .MuiBadge-dot": { bgcolor: aktiv ? "#25d366" : "#bbb" } }}
    >
      <Avatar
        sx={{
          bgcolor: avatarColor(name),
          fontWeight: 700, fontSize: 19, width: 44, height: 44,
          boxShadow: "0 0 0 3px #fff, 0 1px 7px #aaa2"
        }}
      >
        {initials}
      </Avatar>
    </Badge>
  );
}
