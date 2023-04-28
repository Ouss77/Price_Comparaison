const express = require("express");
const app = express();
const port = 3000;
const { scrapeBooking } = require("./utils/BookingData");
const { scrapeExpedia } = require("./utils/expediaPrice");
const {scrapeHotels} = require("./utils/hotelsPrice");
const {scrapeOrbitz} = require("./utils/orbitzPrice")
const {scrapeGoogle} = require('./utils/googlePrice')
const cors = require("cors");
app.use(cors());
app.use(express.json()); // Middleware to parse request body as JSON

app.get("/booking", (req, res) => {
  console.log("laucnhed");
  const { checkInDate, checkOutDate, city } = req.query;
  scrapeBooking(city, checkInDate, checkOutDate)
    .then((data) => {
      res.send(data);
      
    })
    .catch((err) => res.send(err));
});

app.get("/priceHotels", (req, res) => {
  const { hoteltitle, cityName, checkInDate, checkOutDate } = req.query;
  console.log("the 1 hotel title is", hoteltitle);
  scrapeHotels(hoteltitle, cityName, checkInDate, checkOutDate)
    .then((data) => {
      res.send(data);
      console.log("the price of Hotels is", data);
    })
    .catch((err) => res.send(err));
});


app.get("/priceExpbyDate", (req, res) => {
  const { hoteltitle, cityName, checkInDate, checkOutDate } = req.query;
  scrapeExpedia(hoteltitle, cityName, checkInDate, checkOutDate)
    .then((data) => {
      res.send(data);
      console.log("the price of Expedia is", data);
    })
    .catch((err) => res.send(err));
});

app.get("/priceOrbitz", (req, res) => {
  const { hoteltitle, cityName, checkInDate, checkOutDate } = req.query;
  scrapeOrbitz(hoteltitle, cityName, checkInDate, checkOutDate)
    .then((data) => {
      res.send(data);
      console.log("the price of Orbitz is", data);
    })
    .catch((err) => res.send(err));
});
app.get("/priceGoogle", (req, res) => {
  const { hoteltitle, checkInDate, checkOutDate} = req.query;
  scrapeGoogle(hoteltitle, checkInDate, checkOutDate )
    .then((data) => {
      if(data[0].price.length>10){
        res.send([{title: 'there is no hotels with this availabilty ',price:'no prices found'}])
      }
      else{
        console.log("the price of Google is", data);
        res.send(data);
      }

    })
    .catch((err) => res.send(err));
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
