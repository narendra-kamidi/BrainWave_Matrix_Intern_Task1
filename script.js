const planner = document.getElementById("planner");
const currentDateTime = document.getElementById("currentDateTime");

// Show current date and time
function updateDateTime() {
  const now = new Date();
  currentDateTime.innerText = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

const hours = [
  "9 AM", "10 AM", "11 AM", "12 PM", "1 PM",
  "2 PM", "3 PM", "4 PM", "5 PM"
];

function getHourNumber(label) {
  return new Date(`01/01/2020 ${label}`).getHours();
}

// Create time blocks
hours.forEach(hourLabel => {
  const blockHour = getHourNumber(hourLabel);
  const currentHour = new Date().getHours();

  const timeBlock = document.createElement("div");
  timeBlock.className = "time-block";

  const hourDiv = document.createElement("div");
  hourDiv.className = "hour";
  hourDiv.textContent = hourLabel;

  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.className = "task";
  const savedTask = localStorage.getItem(`task-${hourLabel}`);
  if (savedTask) taskInput.value = savedTask;

  if (blockHour < currentHour) taskInput.classList.add("past");
  else if (blockHour === currentHour) taskInput.classList.add("present");
  else taskInput.classList.add("future");

  const saveBtn = document.createElement("button");
  saveBtn.className = "save-btn";
  saveBtn.textContent = "Save";

  saveBtn.addEventListener("click", () => {
    if (taskInput.value.trim() === "") {
      showToast("⚠️ Task cannot be empty!", "warning");
    } else {
      localStorage.setItem(`task-${hourLabel}`, taskInput.value);
      showToast("✅ Task saved successfully!", "success");
    }
  });

  timeBlock.append(hourDiv, taskInput, saveBtn);
  planner.appendChild(timeBlock);
});

// Clear All Tasks
document.getElementById("clearAllBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    hours.forEach(hourLabel => localStorage.removeItem(`task-${hourLabel}`));
    location.reload();
  }
});

// Theme Toggle
const themeBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

// ✅ Toast with close button & type support
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastClose = document.getElementById("toast-close");

  // Reset all toast classes
  toast.className = "toast";
  toast.classList.add("show", type);
  toastMessage.textContent = message;

  // Clear any previous timeout
  if (toast.timeoutHandle) {
    clearTimeout(toast.timeoutHandle);
  }

  // Auto-hide after 3 seconds
  toast.timeoutHandle = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

  // Manual close
  toastClose.onclick = () => {
    toast.classList.remove("show");
    clearTimeout(toast.timeoutHandle);
  };
}
