const relatedProductContainer = document.getElementById(
  "relatedProductContainer"
);
const basketBtn = document.getElementById("basketBtn");
const loginBtn = document.getElementById("loginBtn");
const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const mainImg = document.getElementById("mainImg");
const smallImgs = document.getElementById("smallImgs");
const title = document.getElementById("title");
const hasStockFlag = document.getElementById("hasStockFlag");
const hasStock = document.getElementById("hasStock");
const price = document.getElementById("price");
const description = document.getElementById("description");
const count = document.getElementById("count");
const addToBasketBtn = document.getElementById("addToBasketBtn");
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");

if (!productId) {
  console.warn("Product not found");
}

const refreshToken = async (callback) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const res = await fetch("https://ilkinibadov.com/api/v1/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (res.status !== 200) {
      console.error("Refresh token expired.");
      return;
    }
    localStorage.setItem("accessToken", data.accessToken);
    if (callback) callback();
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
};

const checkAccessToken = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

const goLogin = async () => {
  const hasToken = await checkAccessToken();
  if (!hasToken) {
    window.location.href = "/Project/login/login.html";
  } else {
    alert("You are already logged in");
  }
};
loginBtn.addEventListener("click", goLogin);

const isAuthenticated = async () => {
  const hasToken = await checkAccessToken();
  if (!hasToken) {
    window.location.href = "/Project/login/login.html";
  } else {
    window.location.href = "/Project/basket/basket.html";
  }
};
basketBtn.addEventListener("click", isAuthenticated);

const getProductDetails = async () => {
  try {
    const response = await fetch(
      `https://ilkinibadov.com/api/v1/products/${productId}/details`
    );
    if (!response.ok) {
      console.warn("Product not found");
      return;
    }
    const data = await response.json();
    renderProductDetails(data);
    return data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    productContainer.innerHTML = "<h2>Error loading product details</h2>";
    return;
  }
};

const renderProductDetails = (product) => {
  const mainImage = document.createElement("img");
  mainImage.src = product.images[0];
  mainImage.classList.add(
    "w-125",
    "h-150",
    "flex",
    "justify-center",
    "items-center",
    "bg-black",
    "rounded-lg"
  );

  mainImg.append(mainImage);

  const swapImage = (clickedImg) => {
    const tempSrc = mainImage.src;
    mainImage.src = clickedImg.src;
    clickedImg.src = tempSrc;
  };

  for (let index = 1; index < product.images.length; index++) {
    const smallImage = document.createElement("img");
    smallImage.src = product.images[index];
    smallImage.classList.add(
      "w-[170px]",
      "h-[140px]",
      "bg-gray-300",
      "mb-4",
      "rounded-lg",
      "cursor-pointer"
    );

    smallImage.addEventListener("click", () => {
      swapImage(smallImage);
    });

    smallImgs.append(smallImage);
  }
  title.innerText = product.title;
  price.innerText = `${product.currency + product.price.toFixed(2)}`;
  if (product.stock > 0) {
    hasStockFlag.classList.add("bg-green-500");
    hasStock.innerText = "In Stock";
  } else {
    hasStockFlag.classList.add("bg-red-500");
    hasStock.innerText = "Out of Stock";
  }
  description.innerText = product.description;

  let currentCount = parseInt(count.innerText);

  if (currentCount === 1) minusBtn.disabled = true;
  if (currentCount === product.stock) plusBtn.disabled = true;
  plusBtn.addEventListener("click", () => {
    if (currentCount < product.stock) {
      currentCount++;
      count.innerText = currentCount;
    }
    if (currentCount === product.stock) {
      plusBtn.disabled = true;
    }
    if (currentCount > 1) {
      minusBtn.disabled = false;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (currentCount > 1) {
      currentCount--;
      count.innerText = currentCount;
    }
    if (currentCount === 1) {
      minusBtn.disabled = true;
    }
    if (currentCount < product.stock) {
      plusBtn.disabled = false;
    }
  });

  addToBasketBtn.addEventListener("click", async function addToBasket() {
    try {
      const accessToken = localStorage.getItem("accessToken");

      let response = await fetch("https://ilkinibadov.com/api/v1/basket/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          count: currentCount,
        }),
      });

      if (response.status === 401) {
        console.log("401: Refresh token required.");
        return refreshToken(addToBasket);
      }

      const result = await response.json();
      console.log("Basket response:", result);

      addToBasketBtn.innerText = "Added successfully";
      addToBasketBtn.classList.add("bg-green-600");

      setTimeout(() => {
        addToBasketBtn.innerText = "Add to Basket";
        addToBasketBtn.classList.remove("bg-green-600");
      }, 1200);
    } catch (error) {
      console.error("Error adding to basket:", error);
    }
  });
};

getProductDetails();

const getRelatedProducts = async () => {
  try {
    const response = await fetch(
      `https://ilkinibadov.com/api/v1/products/${productId}/similar`
    );
    if (!response.ok) {
      console.warn("Related products not found");
      return;
    }
    const data = await response.json();
    console.log("Related products data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching related products:", error);
  }
};

const renderRelatedProducts = async () => {
  const products = await getRelatedProducts();

  products.forEach((product) => {
    const card = document.createElement("button");
    const imageCard = document.createElement("div");
    const image = document.createElement("img");
    const title = document.createElement("h2");
    const price = document.createElement("h3");
    const button = document.createElement("button");

    card.classList.add(
      "w-[270px]",
      "h-[322px]",
      "flex",
      "flex-col",
      "items-start",
      "group",
      "bg-white",
      "rounded-xl",
      "shadow-md",
      "transition-all",
      "duration-300",
      "hover:shadow-xl",
      "hover:scale-[1.05]",
      "cursor-pointer"
    );

    card.addEventListener("click", () => {
      console.log("Clicked product ID:", product._id);
      window.location.href = `/Project/details/details.html?productId=${product._id}`;
    });

    image.classList.add("w-[180px]", "h-[190px]");

    imageCard.classList.add(
      "w-[270px]",
      "h-[250px]",
      "bg-gray-50",
      "flex",
      "justify-center",
      "items-center",
      "relative"
    );

    title.classList.add("text-xl", "font-bold", "pt-4", "pb-2");
    price.classList.add("text-red-500", "text-xl", "pb-2");

    button.innerText = "Add to Basket";
    button.classList.add(
      "absolute",
      "bottom-1",
      "w-full",
      "flex",
      "justify-center",
      "px-4",
      "py-2",
      "bg-black",
      "text-white",
      "rounded",
      "hidden",
      "group-hover:flex",
      "transform",
      "scale-90",
      "group-hover:scale-100",
      "transition-all",
      "duration-500",
      "ease-out"
    );
    button.addEventListener("click", async (e) => {
      try {
        const response = await fetch(
          "https://ilkinibadov.com/api/v1/basket/add",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              productId: product._id,
              count: 1,
            }),
          }
        );
        const result = await response.json();
        console.log("Basket response:", result);
        button.innerText = "Added successfully";
        button.classList.add("bg-green-600");
        setTimeout(() => {
          button.innerText = "Add to Basket";
          button.classList.remove("bg-green-600");
        }, 1200);
      } catch (error) {
        console.error("Error adding to basket:", error);
      }
    });

    image.src =
      product.images?.[0] || product?.images || "https://picsum.photos/150";

    title.innerText = product.title;
    price.innerText = `${product.currency + product.price}`;

    imageCard.append(image);
    imageCard.append(button);

    card.append(imageCard);
    card.append(title);
    card.append(price);

    relatedProductContainer.append(card);
  });
};

renderRelatedProducts();
