# This is a simple web server built using the Express.js framework. It listens on port 8080 and provides three different routes:

    / - the homepage
    /products - a page that lists all products
    /products/:ID - a page that displays a specific product based on its ID
    /product/:type - a page that lists all products of a certain type

**Usage**

> To run this web server, you will need to have Node.js and the Express.js framework installed on your machine. Once you have these dependencies installed, you can follow these steps:

    Clone the repository to your local machine
    Navigate to the project directory in your terminal
    Run the command npm install to install any necessary dependencies
    Run the command node server.js to start the server
    Open your web browser and navigate to http://localhost:8080 to view the homepage

** Code Explanation **

** Defining the Port **

> The first line of code defines the port number that the server will listen to:
```
> javascript :

const port = 8080;
```
** Requiring Express **

> The second line of code requires the Express module:

javascript :
```
const express = require('express');

** Creating an Express Application Instance **

> The third line of code creates a new instance of the Express application:
```
javascript :
```
const app = express();

** Setting the View Engine to EJS **

> The fourth line of code sets the view engine to EJS:
```
javascript :
```
app.set('view engine', 'ejs');

** Serving Static Files **

> The fifth line of code serves static files from the public directory:
```
javascript :
```
app.use('/public', express.static('public'));

** Requiring External Data **

> The sixth line of code requires an external module file that contains an array of data:
```
javascript :
```
var arrayDB = require('../public/DBdata');

** Homepage Route **

> The seventh line of code defines a route for the homepage:
```
javascript :
```
app.get('/', function (req, res) {
  res.send('anda di homepage');
});

** Products Route **

> The eighth line of code defines a route for the products page:
```
javascript :
```
app.get('/products', function (req, res) {
  res.render('ProductsPage', { products: arrayDB });
});

** Specific Product Route **

> The ninth line of code defines a route for a specific product page using ID:
```
javascript :
```
app.get('/products/:ID', function (req, res) {
  var ID = req.params.ID;
  for (i = 0; i < arrayDB.length; i++) {
    if (ID == arrayDB[i].ID) {
      res.render('listingPage', { listing: arrayDB[i] });
    }
  }
});

** Product Type Route **

> The tenth line of code defines a route for a product type:
```
javascript :
```
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

** Starting the Server **

> The final line of code starts the server and listens on the specified port:
```
javascript :
```
app.listen(port, function () {
  console.log('listening on port 8080');
});
```
