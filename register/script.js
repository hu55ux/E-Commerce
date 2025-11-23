const registerBtn = document.getElementById("registerBtn");

const registerUser = async () => {
  try {
    const registerNameInput =
      document.getElementById("registerNameInput").value;
    const registerLastnameInput = document.getElementById(
      "registerLastnameInput"
    ).value;
    const registerEmailInput =
      document.getElementById("registerEmailInput").value;
    const registerPasswordInput = document.getElementById(
      "registerPasswordInput"
    ).value;
    if (
      !registerNameInput.trim() ||
      !registerLastnameInput.trim() ||
      !registerEmailInput.trim() ||
      !registerPasswordInput.trim()
    ) {
      console.log(error);
      alert("Please fill in all fields.");
      return;
    }
    const res = await fetch("https://ilkinibadov.com/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        firstname: registerNameInput,
        lastname: registerLastnameInput,
        email: registerEmailInput,
        password: registerPasswordInput,
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
    console.log(error + "An error occurred. Please try again.");
  }
};

registerBtn?.addEventListener("click", registerUser);
