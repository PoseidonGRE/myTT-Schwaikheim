import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    // Beim nächsten Rendern können wir eine Fallback-UI anzeigen
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hier kannst du den Fehler an ein Monitoring schicken
    console.error("Uncaught error:", error, info);
  }

  handleReload = () => {
    // Möglichkeit: Seite neu laden oder Fehlerzustand zurücksetzen
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback-UI
      return (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Oops – da ist etwas schiefgelaufen!
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Ein Fehler ist aufgetreten und hat diesen Bereich deaktiviert.
          </Typography>
          <Button variant="contained" onClick={this.handleReload}>
            Seite neu laden
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
