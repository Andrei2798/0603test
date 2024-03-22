import { usersRepository } from "./usersRepository.js";
localStorage.clear();

const baseUrl = window.location.origin; // Получаем доменное имя

async function logIn(event) {
  event.preventDefault();
  let name = document.querySelector("#name").value;
  let password = document.querySelector("#password").value;

  try {
    const users = await usersRepository.getAll();
    let userFound = false;

    users.forEach((user) => {
      if (user.name === name && user.password === password) {
        userFound = true;
        let userName = document.querySelector("#name").value;
        localStorage.setItem("isAuthorithed", "true");
        localStorage.setItem("userName", userName);
        if (user.status === "admin") {
          localStorage.setItem("isAdmin", "true");
        }
        window.location.href = baseUrl + "/index.html";
      }
    });

    if (!userFound) {
      document.querySelector("#message").style.color = "red";
      document.querySelector("#message").innerHTML = "Wrong email or password";
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("login-form").addEventListener("submit", logIn);
});
