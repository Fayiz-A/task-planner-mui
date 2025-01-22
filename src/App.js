import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  CssBaseline,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete,
  Drawer,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import { Brightness4, Brightness7, Settings } from "@mui/icons-material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import scheduleStore from "./store";
import SettingsPage from "./settingsPage";

const App = observer(() => {
  const [openDialog, setOpenDialog] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    scheduleStore.requestNotificationPermission();
  },[]);

  // Define the lively dark theme
  const theme = createTheme({
    palette: {
      mode: scheduleStore.darkMode ? "dark" : "light",
      primary: {
        main: scheduleStore.darkMode ? "#FF6F61" : "#FF6F61", // Coral for both themes
      },
      secondary: {
        main: scheduleStore.darkMode ? "#FFD166" : "#FFD166", // Warm yellow for both themes
      },
      background: {
        default: scheduleStore.darkMode ? "#121212" : "#FFF8F0", // Dark gray for dark mode, warm light for light mode
        paper: scheduleStore.darkMode ? "#1E1E1E" : "#FFFFFF", // Darker gray for dark mode, white for light mode
      },
    },
    shape: {
      borderRadius: 8,
    },
  });

  // Handle slot generation with confirmation dialog
  const handleGenerateSlots = () => {
    if (scheduleStore.slots.length > 0) {
      setOpenDialog(true); // Show confirmation dialog
    } else {
      scheduleStore.generateSlots();
    }
  };

  // Generate slots after confirmation
  const generateSlots = () => {
    try {
      scheduleStore.generateSlots();
      setOpenDialog(false); // Close dialog
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle activity input
  const handleActivityChange = (index, value) => {
    scheduleStore.updateActivity(index, value);
  };

  // Handle task submission with toast
  const handleSubmitTasks = () => {
    scheduleStore.submitTasks();
    toast.success("Tasks submitted successfully!", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <List>
              <ListItemButton component={Link} to="/" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Planner" />
              </ListItemButton>
              <ListItemButton component={Link} to="/settings" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </List>
          </Drawer>
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ mb: 2 }}>
            <Settings />
          </IconButton>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Typography variant="h3" align="center" gutterBottom sx={{ color: "primary.main" }}>
                    Daily Schedule Planner
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={scheduleStore.darkMode}
                        onChange={() => scheduleStore.toggleDarkMode()}
                        color="primary"
                      />
                    }
                    label={
                      <IconButton onClick={() => scheduleStore.toggleDarkMode()} color="inherit">
                        {scheduleStore.darkMode ? <Brightness7 /> : <Brightness4 />}
                      </IconButton>
                    }
                  />
                  <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Select Date"
                          value={scheduleStore.selectedDate}
                          onChange={(newValue) => scheduleStore.setSelectedDate(newValue)}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth sx={{ borderRadius: 2 }} />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="Start Time"
                          value={scheduleStore.startTime}
                          onChange={(newValue) => scheduleStore.setStartTime(newValue)}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth sx={{ borderRadius: 2 }} />
                          )}
                          ampm={false} // Use 24-hour format
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="End Time"
                          value={scheduleStore.endTime}
                          onChange={(newValue) => scheduleStore.setEndTime(newValue)}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth sx={{ borderRadius: 2 }} />
                          )}
                          ampm={false} // Use 24-hour format
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={handleGenerateSlots}
                          sx={{ borderRadius: 2, mt: 2 }}
                        >
                          Generate Slots
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                  <List>
                    {scheduleStore.slots.map((slot, index) => (
                      <Paper key={index} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
                        <ListItem>
                          <ListItemText
                            primary={`${slot.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} - ${slot.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`}
                          />
                          <Autocomplete
                            options={scheduleStore.tasks}
                            value={slot.activity}
                            onChange={(e, newValue) => handleActivityChange(index, newValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="What did you do?"
                                sx={{ ml: 2, width: 300 }}
                              />
                            )}
                            freeSolo={false} // Disable free text input
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                  {scheduleStore.slots.length > 0 && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={handleSubmitTasks}
                      sx={{ borderRadius: 2, mt: 2, mb: 4, backgroundColor: theme.palette.secondary.main }}
                    >
                      Submit Tasks
                    </Button>
                  )}
                  <ToastContainer />
                  <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Confirm Slot Generation</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Generating new slots will overwrite the existing slots. Are you sure you want to proceed?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={generateSlots} color="primary" autoFocus>
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
                  {/* Notification Alert Dialog */}
                  <Dialog
                    open={scheduleStore.notificationAlertOpen}
                    onClose={() => scheduleStore.hideNotificationAlert()}
                  >
                    <DialogTitle>Notification Scheduled</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {scheduleStore.notificationAlertMessage}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => scheduleStore.hideNotificationAlert()} color="primary">
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
});

export default App;