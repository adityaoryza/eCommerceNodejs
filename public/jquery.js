$(document).ready(function () {
  // Set up a click event listener on the "buttonsContainer" container that listens for button clicks

  $(".buttonsContainer").on("click", "button", function () {
    var color = $(this).text();

    $.ajax({
      url: `/product/${color}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        $(".productsContainer").html("");
        var productsArrayLength = data.products.length;

        for (i = 0; i < productsArrayLength; i++) {
          var img = data.products[i].image;
          var title = data.products[i].title;
          var price = data.products[i].price;
          var ID = data.products[i].ID;

          $(".productsContainer").append(`
      <div class=".container-md">
        <div class="card">
          <img src="public/${img}" class="card-img-top" alt="${title}">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">$${price}</p>
            <div class="d-grid gap-2">
              <a href='buyNow/${ID}'>
                <button class="btn btn-primary" type="button">Buy It Now</button>
              </a>
              <button class="btn btn-secondary" id="addCart" value="${ID}">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
					`);
        }
      },
    });
  });

  $("body").on("click", "#addCart", function () {
    var ID = $(this).val();

    $.ajax({
      url: `/addCart/${ID}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        // $(".navLink em").html("");
        $(".nav-item em").html("");

        var cartNumb = data.cartNumb;

        // $(".navLink em").html(cartNumb);
        $(".nav-item em").html(cartNumb);
      },
    });
  });
});
