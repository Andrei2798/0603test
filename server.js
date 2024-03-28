const express = require("express"); //npm install express
const path = require("path");
const tickets = require("./storage/tickets");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log(`\n--- ${req.url} Time: ${Date.now()} `);
  next(); //передача управления следующей функции-middleware
});

app.use(express.static(__dirname + "/public"));

app.use(express.json()); //middleware для работы с body из fetch клиента

app.post("/returnSeats", (req, res) => {
  let request = req.body;
  console.log("Request: " + request);
  let result = request;
  res.status(200).json({ message: good });
});

let users = {};
app.post("/addUser", (req, res) => {
  let request = req.body;

  if (request.name == null)
    return res.status(403).json({ message: "Данные не инициализированы" });
  console.log(request);
  // users.push(request);
  users[request.orderNumber] = request;
  // console.log("Request: " + JSON.stringify(request));
  console.log(users);
  let result = users;
  res.status(200).json(request);
});

app.post("/searchOrder", (req, res) => {
  let request = req.body;
  console.log("Request: " + request);
  console.log(request);
  console.log(request.surname);
  console.log(request.orderNumber);

  if (!(request.orderNumber in users))
    return res.status(400).json({ message: "error orderNumber" });
  if (
    users[request.orderNumber].surname.toLowerCase() !==
    request.surname.toLowerCase()
  )
    return res.status(400).json({ message: "error surname" });

  res.json(users[request.orderNumber]);
});

app.get("/tickets/all", (req, res) => {
  res.status(200).json({ tickets: tickets });
});

app.get("/orders/all", (req, res) => {
  res.status(200).json({ users: users });
});

//обработка post-запросов
app.post("/searchTickets", (req, res) => {
  let request = req.body;

  console.log(request);
  console.log(request.directionFrom);
  console.log("RequestDate: " + request.date);

  let result;

  const exists = tickets.some((obj) => {
    return (
      obj.directionFrom.toLowerCase() === request.directionFrom.toLowerCase() &&
      obj.directionTo.toLowerCase() === request.directionTo.toLowerCase() &&
      obj.date === request.date
    );
  });
  if (exists) {
    let newTickets = tickets.filter((obj) => {
      if (
        obj.directionFrom.toLowerCase() ===
          request.directionFrom.toLowerCase() &&
        obj.directionTo.toLowerCase() === request.directionTo.toLowerCase() &&
        obj.date === request.date
      ) {
        return true;
      }
      return false;
    });
    result = newTickets;
  } else {
    // result = "No";
    res.status(404).json({ error: "not found" });
  }
  res.status(200).json(result);
});

app.post("/orderSeat", (req, res) => {
  let request = req.body;
  console.log("RequestQuantity: " + request.quantity);

  console.log(tickets[request.id]);
  console.log("tickets[request.id].quantity: " + tickets[request.id].quantity);

  if (tickets[request.id].quantity >= request.quantity) {
    tickets[request.id].quantity -= request.quantity;
    console.log("yes");
    res.json(tickets[request.id].quantity);
    return;
  }
  console.log(tickets[request.id].quantity);
  res.status(403).json({ error: "Нет столько мест" });
});

app.use(function (req, res, next) {
  res.status(404).redirect("/error.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
