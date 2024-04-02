import { usersRepository } from "./usersRepository.js";
localStorage.clear();

const baseUrl = window.location.origin;

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
        if (user.status != "blocked") {
          let userName = document.querySelector("#name").value;
          localStorage.setItem("isAuthorithed", "true");
          localStorage.setItem("userName", userName);
          if (user.status === "admin") {
            localStorage.setItem("isAdmin", "true");
          }

          window.location.href = baseUrl + "/index.html";
        } else {
          document.querySelector("#message").style.color = "red";
          document.querySelector("#message").innerHTML = "The user is blocked";
          return;
        }
      }
    });

    if (!userFound) {
      document.querySelector("#message").style.color = "red";
      document.querySelector("#message").innerHTML =
        "Wrong name or password. Probably user does not exists";
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("login-form").addEventListener("submit", logIn);
});
