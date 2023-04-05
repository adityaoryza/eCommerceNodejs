$(document).ready(function () {
  // Set up a click event listener on the "buttonsContainer" container that listens for button clicks
  $('.buttonsContainer').on('click', 'button', function () {
    // Get the color of the button that was clicked
    var color = $(this).text();

    // Make an AJAX request to the server to get products of the specified color
    $.ajax({
      url: `/product/${color}`,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        // Clear the products container before adding new products
        $('.productsContainer').html('');

        // Loop through the array of products and create a listing for each one
        var productsArrayLength = data.products.length;
        for (i = 0; i < productsArrayLength; i++) {
          var img = data.products[i].image;
          var title = data.products[i].title;
          var price = data.products[i].price;
          var ID = data.products[i].ID;

          // Add the listing to the products container
          $('.productsContainer').append(`
            <div class="listing">
                <div class="listingImage">
                   <a href='products/${ID}'> <img src='/public/${img}'> </a>
                </div>
                <div class="listingTittle">
                   <a href='products/${ID}'> <p>${title}</p> </a>
                </div>
                <div class="listingPrice">
                    <p>$${price}</p>
                </div>
                <div class="listingButtons">
                    <button id="BuyNow"> Buy It Now</button>
                     <button id="AddToCart" value ='${ID}'> Add To Cart</button>
                </div>
            </div>
            `);
        }
      },
    });
  });

  $('body').on('click', '#addCart', function () {
    var ID = $(this).val();

    $.ajax({
      url: `/addCart/${ID}`,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        $('.navLink em').html('');
        var cartNumb = data.cartNumb;

        $('.navLink em').html(cartNumb);
      },
    });
  });
});
