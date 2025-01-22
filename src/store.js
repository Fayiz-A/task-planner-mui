import { makeAutoObservable } from "mobx";

class ScheduleStore {
  startTime = null;
  endTime = null;
  slots = [];
  darkMode = false;
  selectedDate = new Date();
  tasks = []; // List of configured tasks
  notificationsEnabled = Notification.permission == "granted"; // Toggle for notifications

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }

  // Load data from local storage
  loadFromLocalStorage() {
    const savedSlots = JSON.parse(localStorage.getItem("dailySlots")) || {};
    const savedTheme = JSON.parse(localStorage.getItem("darkMode")) || false;
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Load slots for the selected date
    const dateKey = this.selectedDate.toISOString().split("T")[0];
    const savedData = savedSlots[dateKey] || { slots: [], startTime: null, endTime: null };

    // Convert saved slots' start and end times to Date objects
    this.slots = savedData.slots.map((slot) => ({
      ...slot,
      start: new Date(slot.start),
      end: new Date(slot.end),
    }));

    this.startTime = savedData.startTime ? new Date(savedData.startTime) : null;
    this.endTime = savedData.endTime ? new Date(savedData.endTime) : null;
    this.darkMode = savedTheme;
    this.tasks = savedTasks;
  }

  // Save data to local storage
  saveToLocalStorage() {
    const dateKey = this.selectedDate.toISOString().split("T")[0];
    const savedSlots = JSON.parse(localStorage.getItem("dailySlots")) || {};
    savedSlots[dateKey] = {
      slots: this.slots,
      startTime: this.startTime,
      endTime: this.endTime,
    };
    localStorage.setItem("dailySlots", JSON.stringify(savedSlots));
    localStorage.setItem("darkMode", JSON.stringify(this.darkMode));
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  // Set start time
  setStartTime(time) {
    this.startTime = time;
  }

  // Set end time
  setEndTime(time) {
    this.endTime = time;
  }

  // Set selected date
  setSelectedDate(date) {
    this.selectedDate = date;
    this.loadFromLocalStorage(); // Reload slots for the new date
  }

  // Generate 20-minute slots
  generateSlots() {
    if (!this.startTime || !this.endTime) {
      throw new Error("Please specify both start and end time.");
    }

    const newSlots = [];
    let currentTime = new Date(this.startTime);

    while (currentTime < this.endTime) {
      const slotEndTime = new Date(currentTime.getTime() + (20 * 60000)); // Add 20 minutes
      if (slotEndTime > this.endTime) break; // Stop if slot exceeds end time

      newSlots.push({
        start: new Date(currentTime),
        end: new Date(slotEndTime),
        activity: "",
      });

      // Schedule notification for the end of the slot
      if (this.notificationsEnabled) {
        this.scheduleNotification(slotEndTime);
      }

      currentTime = slotEndTime; // Move to the next slot
    }

    this.slots = newSlots;
    this.saveToLocalStorage();
  }

  notificationAlertOpen = false; // State to control the alert dialog
  notificationAlertMessage = ""; // Message to display in the alert dialog

  // Existing code...

  // Show the notification alert dialog
  showNotificationAlert(message) {
    this.notificationAlertMessage = message;
    this.notificationAlertOpen = true;
  }

  // Hide the notification alert dialog
  hideNotificationAlert() {
    this.notificationAlertOpen = false;
    this.notificationAlertMessage = "";
  }

  // Schedule a notification
  scheduleNotification(notificationTime) {
    if ("Notification" in window && Notification.permission === "granted") {
      const timeUntilNotification = notificationTime.getTime() - Date.now();

      if (timeUntilNotification > 0) {
        console.log("scheduled");
        this.showNotificationAlert();

        setTimeout(() => {
          // const Notification = electron.remote.Notification;

          // const options = {
          //   title: 'YOU ARE ACCOUNTABLE',
        //     subtitle: 'You are accountable for your blessings',
        //     body: `Please justify how you utilized all the blessings, which are a test for you, from ${notificationTime.getTime()} to ${notificationTime.getTime()}`,
        //     silent: false,
        //     timeoutType: 'never', 
        //     replyPlaceholder: 'Reply Here',
        //     sound: path.join(__dirname, '../assets/Bird Chirp.mov'),
        //     urgency: 'critical' 
        //   }
        // const customNotification = new Notification(options);
        // customNotification.show();

        window.electronAPI.sendNotification({
          options: 'YOU ARE ACCOUNTABLE', 
          subtitle: 'You are accountable for your blessings', 
          body: `Please justify how you utilized all the blessings, which are a test for you, from ${notificationTime.getTime()} to ${notificationTime.getTime()}`, 
          soundPath: './Bird Chirp.mov'
        });
          // const notification = new Notification("Time's up!", {
          //   body: "Please fill the next slot.",
          //   silent:false,
          //   requireInteraction:true
          // });

          // notification.onclick = () => {
          //   window.focus(); // Focus the app window when the notification is clicked
          // };
          // const audio = new Audio(`file://${path.join(__dirname, "../build/Bird Chirp.mov")}`); // Path to your sound file
          // audio.play()
          //   .then(() => {
          //     console.log("Sound played successfully.");
          //   })
          //   .catch((error) => {
          //     console.error("Error playing sound:", error);
          //   });
  
        }, timeUntilNotification);
      }
    }
  }

  // Request notification permission
  requestNotificationPermission() {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    }
  }


  // Update activity for a slot
  updateActivity(index, activity) {
    this.slots[index].activity = activity;
    this.saveToLocalStorage();
  }

  // Submit tasks
  submitTasks() {
    this.saveToLocalStorage();
  }

  // Toggle dark mode
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.saveToLocalStorage();
  }

  // Add a new task
  addTask(task) {
    this.tasks.push(task);
    this.saveToLocalStorage();
  }

  // Remove a task
  removeTask(index) {
    this.tasks.splice(index, 1);
    this.saveToLocalStorage();
  }
}

const scheduleStore = new ScheduleStore();
export default scheduleStore;