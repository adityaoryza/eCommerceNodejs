$(document).ready(function () {
  // Set up a click event listener on the "buttonsContainer" container that listens for button clicks

  $('.buttonsContainer').on('click', 'button', function () {
    var color = $(this).text();

    $.ajax({
      url: `/product/${color}`,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        $('.productsContainer').html('');
        var productsArrayLength = data.products.length;

        for (i = 0; i < productsArrayLength; i++) {
          var img = data.products[i].image;
          var title = data.products[i].title;
          var price = data.products[i].price;
          var ID = data.products[i].ID;

          $('.productsContainer').append(`
						<div class='listing'>
							<div class='listingImage'>
								<a href='products/${ID}'><img src='public/${img}'></a>
							</div>
							<div class='listingTitle'>
								<a href='products/${ID}'><p>${title}</p></a>
							</div>
							<div class='listingPrice'>
								<p>$${price}</p>
							</div>
							<div class='listingButtons'>
								<a href="buyNow/${ID}">
									<button id="buyNow">Buy it Now</button>
								</a>
								<button id='addCart' value='${ID}'>Add to Cart</button>
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
