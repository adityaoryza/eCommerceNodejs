const port = 8080;
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(cookieParser());

var arrayDB = require('./public/DBdata');

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
