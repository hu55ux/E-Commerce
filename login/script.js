const loginEmailInput = document.getElementById("loginEmailInput");
const loginPasswordInput = document.getElementById("loginPasswordInput");

const loginBtn = document.getElementById("loginBtn");

const loginUser = async () => {
  try {
    const res = await fetch("https://ilkinibadov.com/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: loginEmailInput.value,
        password: loginPasswordInput.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      const tokens = data?.[0];
      if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
        alert("Invalid response from server");
        return;
      }
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      window.location.href = "/Project/index.html";
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
  }
};

loginBtn.addEventListener("click", loginUser);
