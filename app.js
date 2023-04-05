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
