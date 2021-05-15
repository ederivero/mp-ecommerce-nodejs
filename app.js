var express = require("express");
var exphbs = require("express-handlebars");
var mercadopago = require("mercadopago");
require("dotenv").config();
var port = process.env.PORT || 3000;
// una vez que instalamos e importamos la libreria ahora es necesario definir las credenciales para que mp sepa quienes somos (algo asi como cuando usamos firebase)
mercadopago.configure({
  // el access_token es la token que nos generara mp por cada integracion que realicemos, esta token es unica por empresa y no debe ser usada en dos pasarelas diferentes ya que la configuracion sera diferente
  access_token: process.env.ACCESS_TOKEN,
  // integrator_id es la identificacion que nosotros tendremos una vez realizada la certificacion, esta nos ayudara para que mp sepa que desarrollador fue el responsable de dicha integracion
  integrator_id: process.env.INTEGRATOR_ID,
});
var app = express();

const cliente = {
  name: "Lalo",
  surname: "Landa",
  email: "test_user_46542185@testuser.com",
  phone: {
    number: "5549737300",
    area_code: "52",
  },
  address: {
    zip_code: "03940",
    street_name: "Insurgentes Sur",
    street_number: 1602,
  },
  identification: {
    type: "DNI", // https://api.mercadopago.com/v1/identification_types
    number: "22334445",
  },
};

const metodos_pago = {
  installments: 6,
  exclude_payment_methods: [
    {
      id: "diners",
    },
  ],
  exclude_payment_types: [
    {
      id: "atm",
    },
  ],
};

const preferencia = {
  items: [],
  back_urls: {},
  payment_methods: metodos_pago,
  payer: cliente,
  auto_return: "approved",
  notification_url: "",
  external_reference: "ederiveroman@gmail.com",
};
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  console.log(req.query);
  // crear el objeto item y agregarlo al array de items de la preferencia (leer la documentacion para ello)
  // { img: './assets/l6g6.jpg', title: 'LG G6', price: '10000', unit: '1' }
  const item = {
    id: "1234",
    title: req.query.title,
    description: "Dispositivo móvil de Tienda e-commerce”",
    picture_url: req.query.img,
    quantity: req.query.unit,
    currency_id: "PEN",
    unit_price: req.query.price,
  };
  preferencia.items.push(item);
  res.render("detail", req.query);
});

app.listen(port);
