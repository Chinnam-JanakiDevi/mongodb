const adminbutton = document.getElementById("admin-button");
const userbutton = document.getElementById("user-button");
const admin_form = document.getElementById("adminform");
const userform = document.getElementById("userform");

adminbutton.addEventListener("click", () => {
  // Show the admin form
  
  admin_form.style.display = "block";
  // Hide the user form
  userform.style.display = "none";

  // Set styles for the buttons
  adminbutton.style.backgroundColor = "#2a58df";
  userbutton.style.backgroundColor = "#587ef4";
});

userbutton.addEventListener("click", () => {
  // Show the user form
  userform.style.display = "block";
  // Hide the admin form
  admin_form.style.display = "none";

  // Set styles for the buttons
  userbutton.style.backgroundColor = "#2a58df";
  adminbutton.style.backgroundColor = "#587ef4";
});


const username=document.getElementById("username");