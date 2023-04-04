// Define the port number that the server will listen to
const port = 8080;

// Require the Express module
const express = require('express');

// Create a new Express application instance
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use('/public', express.static('public'));

// Require the data from the external module file
var arrayDB = require('../public/DBdata');

// Define a route for the homepage
app.get('/', function (req, res) {
  // When the user requests the homepage, render a view with the specified name
  res.send('anda di homepage');
});

// Define a route for the product page
app.get('/products', function (req, res) {
  // When the user requests the product page, render an EJS template called "ProductsPage"
  res.render('ProductsPage', { products: arrayDB });
});

// Define a route for a specific product page using ID
app.get('/products/:ID', function (req, res) {
  // Get the ID parameter from the URL
  var ID = req.params.ID;

  // Loop through the arrayDB to find the product with the matching ID
  for (i = 0; i < arrayDB.length; i++) {
    if (ID == arrayDB[i].ID) {
      // When the product is found, render a view with the specified name and the product data
      res.render('listingPage', { listing: arrayDB[i] });
    }
  }
});

// Define a route for the product type
app.get('/product/:type', function (req, res) {
  // Get the product type parameter from the URL
  var type = req.params.type;
  // Create an empty array to hold the products of the specified type
  var tempArray = [];

  // Loop through the arrayDB to find the products with the matching type
  for (i = 0; i < arrayDB.length; i++) {
    if (type === arrayDB[i].type) {
      // When a product of the specified type is found, add it to the temporary array
      tempArray.push(arrayDB[i]);
    }
  }

  // Send the temporary array of products as a JSON response
  res.send({ products: tempArray });
});

// Start the server and listen on the specified port
app.listen(port, function () {
  // When the server starts listening, log a message to the console
  console.log('listening on port 8080');
});
