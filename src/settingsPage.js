import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import scheduleStore from "./store";

const SettingsPage = observer(() => {
  const [newTask, setNewTask] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [taskToRemove, setTaskToRemove] = useState(null);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    scheduleStore.addTask(newTask);
    setNewTask("");
  };

  const handleRemoveTask = (index) => {
    setTaskToRemove(index);
    setOpenDialog(true);
  };

  const confirmRemoveTask = () => {
    scheduleStore.removeTask(taskToRemove);
    setOpenDialog(false);
    setTaskToRemove(null);
  };

  const cancelRemoveTask = () => {
    setOpenDialog(false);
    setTaskToRemove(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Configure Tasks
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          label="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button fullWidth variant="contained" onClick={handleAddTask}>
          Add Task
        </Button>
      </Paper>
      <List>
        {scheduleStore.tasks.map((task, index) => (
          <Paper key={index} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
            <ListItem>
              <ListItemText primary={task} />
              <Button onClick={() => handleRemoveTask(index)} color="error">
                Remove
              </Button>
            </ListItem>
          </Paper>
        ))}
      </List>
      <Button component={Link} to="/" variant="outlined" sx={{ mt: 2 }}>
        Back to Planner
      </Button>
      <Dialog open={openDialog} onClose={cancelRemoveTask}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelRemoveTask} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmRemoveTask} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});

export default SettingsPage;