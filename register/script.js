const registerNameInput = document.getElementById("registerNameInput");
const registerLastnameInput = document.getElementById("registerLastnameInput");
const registerEmailInput = document.getElementById("registerEmailInput");
const registerPasswordInput = document.getElementById("registerPasswordInput");

const registerBtn = document.getElementById("registerBtn");

const registerUser = async () => {
  try {
    if (
      !registerNameInput.trim() ||
      !registerLastnameInput.trim() ||
      !registerEmailInput.trim() ||
      !registerPasswordInput.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }
    const res = await fetch("https://ilkinibadov.com/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        firstname: registerNameInput.value,
        lastname: registerLastnameInput.value,
        email: registerEmailInput.value,
        password: registerPasswordInput.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
      alert("Registration successful! Please log in.");

      window.location.href = "../login/login.html";
    } else {
      alert(data.error || "Registration failed");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
};

registerBtn?.addEventListener("click", registerUser);
