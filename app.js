const port = 8080;
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: 'sandbox',
  client_id:
    'AS8WhP5kI_S2om83A2i88dvBJVQJxTwAGbhkABeIk1O_6JKcUVCDiJLkEBz4-iJngaTeb_CdXL1Qzcea',
  client_secret:
    'EHa94zj1eJxIUj8eQ9a3c_F5ZRckzNcsmnBq38vwGBe7-n7R3ijF_I75Anh4kLyS5enqQohArXB4tOB-',
});
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var arrayDB = require('./public/DBdata');

mongoose.connect('mongodb://localhost/ecommerceDB');
mongoose.connection
  .once('open', function () {
    console.log('successfully connected to DB...');
  })
  .on('error', function (err) {
    console.log(err);
  });

const contactEntry = require('./models/contactEntry');
const orderEntry = require('./models/orderEntry');

app.get('/', function (req, res) {
  var cookieValue = req.cookies;
  console.log(cookieValue);
  res.clearCookie('cart');
  res.send('anda di homepage');
});

app.get('/products', function (req, res) {
  var cookieValue = req.cookies;
  if (cookieValue.cart) {
    var cookieArray = JSON.parse(cookieValue.cart);
  } else {
    var cookieArray = [];
  }
  res.render('ProductsPage', {
    products: arrayDB,
    cartNumb: cookieArray.length,
  });
});

app.get('/products/:ID', function (req, res) {
  var ID = req.params.ID;
  var cookieValue = req.cookies;
  if (cookieValue.cart) {
    var cookieArray = JSON.parse(cookieValue.cart);
  } else {
    var cookieArray = [];
  }

  for (i = 0; i < arrayDB.length; i++) {
    if (ID == arrayDB[i].ID) {
      res.render('listingPage', {
        listing: arrayDB[i],
        cartNumb: cookieArray.length,
      });
    }
  }
});

// routes for cart page
app.get('/cart', function (req, res) {
  var cookieValue = req.cookies;

  if (cookieValue.cart) {
    var cookieArray = JSON.parse(cookieValue.cart);
    cookieArray.sort();

    var tempCartArray = [];

    for (var i = 0; i < cookieArray.length; i++) {
      for (var c = 0; c < arrayDB.length; c++) {
        if (cookieArray[i] == arrayDB[c].ID) {
          tempCartArray.push(arrayDB[c]);
        }
      }
    }

    var cartTotal = 0;
    for (var i = 0; i < tempCartArray.length; i++) {
      cartTotal = cartTotal + tempCartArray[i].price;
    }
  } else {
    var cartTotal = 0;
    var tempCartArray = [];
    var cookieArray = [];
  }
  res.render('cartPage', {
    cart: cookieValue.cart,
    cartNumb: cookieArray.length,
    cartValues: tempCartArray,
    total: cartTotal,
  });
});

app.get('/remove/:ID', function (req, res) {
  var cookieValue = req.cookies;
  var cookieArray = JSON.parse(cookieValue.cart);
  var IDremove = req.params.ID;

  for (var i = 0; i < cookieArray.length; i++) {
    if (cookieArray[i] == IDremove) {
      cookieArray.splice(i, 1);
      break;
    }
  }

  var stringArray = JSON.stringify(cookieArray);
  res.clearCookie('cart');
  res.cookie('cart', stringArray);
  res.redirect('/cart');
});

app.get('/contact', function (req, res) {
  var cookieValue = req.cookies;

  if (cookieValue.cart) {
    var cookieArray = JSON.parse(cookieValue.cart);
  } else {
    var cookieArray = [];
  }
  res.render('contactPage', {
    cartNumb: cookieArray.length,
  });
});

app.get('/submission/:text', function (req, res) {
  var cookieValue = req.cookies;
  if (cookieValue.cart) {
    var cookieArray = JSON.parse(cookieValue.cart);
  } else {
    var cookieArray = [];
  }

  var text = req.params.text;

  res.render('submissionPage', {
    cartNumb: cookieArray.length,
    successText: text,
  });
});

app.post('/submit/:type', function (req, res) {
  var type = req.params.type;

  if (type == 'contact') {
    var contactName = req.body.name;
    var contactEmail = req.body.email;
    var contactSubject = req.body.subject;
    var contactComment = req.body.comment;

    var newContactEntry = new contactEntry({
      name: contactName,
      email: contactEmail,
      subject: contactSubject,
      comment: contactComment,
    });

    newContactEntry.save();
    res.redirect('/submission/Form_Successfully_Submitted');
  }
});

app.post('/chargePaypal', function (req, res) {
  var items = req.body.description;
  items = JSON.parse(items);

  var chargeAmount = 5;

  for (var i = 0; i < items.length; i++) {
    for (var c = 0; c < arrayDB.length; c++) {
      if (items[i] == arrayDB[c].ID) {
        chargeAmount = chargeAmount + arrayDB[c].price;
      }
    }
  }

  var create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `https://localhost:8080/success?price=${chargeAmount}&description=${items}`,
      cancel_url: 'https://localhost:8080/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'eCommerce Sale',
              sku: `${items}`,
              price: `${chargeAmount}`,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: `${chargeAmount}`,
        },
        description: 'Sale of Color(s)',
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      res.send('an error has occured');
      throw error;
    } else {
      for (var i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

app.get('/success', function (req, res) {
  var payerID = req.query.payerID;
  var paymentID = req.query.paymentID;
  var chargeAmount = req.query.price;
  var items = req.query.description;

  var execute_payment_json = {
    payer_id: payerID,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: `${chargeAmount}`,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentID,
    execute_payment_json,
    function (err, payment) {
      if (err) {
        res.send('an error occurred:' + err);
        throw err;
      } else {
        var shippingEmail = payment.payer.payer_info_email;
        var shippingName =
          payment.payer.payer_info.shipping_address.receipient_name;
        var shippingAddress =
          payment.payer.payer_info.shipping_address.line1 +
          ' ' +
          payment.payer.payer_info.shipping_address.line2;

        var shippingZip = payment.payer.payer_info.shipping_address.postal_code;
        var shippingState = payment.payer.payer_info.shipping_address.state;
        var shippingCity = payment.payer.payer_info.shipping_address.city;
        var shippingCountry =
          payment.payer.payer_info.shipping_address.country_code;
        var Type = 'Paypal';

        var newOrderEntry = new orderEntry({
          name: shippingName,
          email: shippingEmail,
          address: shippingAddress,
          zip: shippingZIP,
          city: shippingCity,
          country: shippingCountry,
          description: items,
          grossTotal: chargeAmount,
          type: Type,
        });

        newOrderEntry.save();
        res.clearCookie('cart');
        res.redirect('/submission/Your_Payment_Was_Successful');
      }
    }
  );
});

// ajax routes
app.get('/product/:type', function (req, res) {
  var type = req.params.type;
  var tempArray = [];

  for (i = 0; i < arrayDB.length; i++) {
    if (type === arrayDB[i].type) {
      tempArray.push(arrayDB[i]);
    }
  }

  res.send({ products: tempArray });
});

app.get('/addCart/:ID', function (req, res) {
  var ID = req.params.ID;
  var cookieValue = req.cookies;

  if (!cookieValue.cart) {
    var cookieArray = [];
    cookieArray.push(ID);
    var cookieStringArray = JSON.stringify(cookieArray);
    res.cookie('cart', cookieStringArray);
    res.send({ cartNumb: 1 });
  } else {
    var cartValue = cookieValue.cart;
    var cookieArray = JSON.parse(cartValue);
    cookieArray.push(ID);
    var cookieStringArray = JSON.stringify(cookieArray);
    res.clearCookie('cart');
    res.cookie('cart', cookieStringArray);
    res.send({ cartNumb: cookieArray.length });
  }
});

// Start the server and listen on the specified port
app.listen(port, function () {
  // When the server starts listening, log a message to the console
  console.log('listening on port 8080');
});
