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
const password=document.getElementById("userpass");
const email =document.getElementById("usermail");
const phone_number=document.getElementById("userph_no");

// function validate() {
//   const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

//   let errorMessage = "";

//   if (!regEmail.test(email)) {
//     errorMessage += "Invalid email address.\n";
//     if (!regPassword.test(password)) {
//       errorMessage += "Invalid password. It must be at least 8 characters, include one lowercase letter, one uppercase letter, and one digit.\n";
//       if (username.length < 3 || username.length > 20) {
//         errorMessage += "Username must be between 3 and 20 characters.\n";
//       }
//     }
//   }
//   return true; // Allow form submission
// }
// const crypto = require('crypto');

const secretKey = 'yourSecretKey';
const data = 'dataToHash';

try {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);

  const hashedData = hmac.digest('hex');
  console.log(hashedData);
} catch (error) {
  console.error(error);
}
