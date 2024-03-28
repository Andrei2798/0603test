import { usersRepository } from "./usersRepository.js";

const addUserForm = document.querySelector("#user-form");
addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.querySelector("#name-input").value;
  const emailInput = document.querySelector("#email-input").value;
  const passwordInput = document.querySelector("#password-input").value;
  const repeatPasswordInput = document.querySelector(
    "#repeatPassword-input"
  ).value;
  let randomID = Math.floor(Math.random() * 1000000000) + 1;
  let today = new Date().toLocaleDateString("ru-RU");

  if (repeatPasswordInput != passwordInput) {
    document.querySelector("#message").style.color = "red";
    document.querySelector("#message").innerHTML = "Passwords are different";
  } else {
    await usersRepository.create({
      id: randomID,
      name: nameInput,
      email: emailInput,
      password: passwordInput,
      registrationDate: today,
      status: "unblocked",
    });

    window.location.href = "../index.html";
  }
});
