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

const checkAccesToken = async () => {
  try {
    const accesToken = localStorage.getItem("accesToken");
    if (!accesToken) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

const goLogin = async () => {
  const hasToken = await checkAccesToken();

  if (!hasToken) {
    window.location.href = "/Project/login/login.html";
  } else {
    console.alert("You are already logged in");
  }
};

loginBtn.addEventListener("click", goLogin);

const isAuthenticated = async () => {
  const hasToken = await checkAccesToken();

  if (!hasToken) {
    window.location.href = "/Project/login/login.html";
  } else {
    console.alert("User is authenticated");
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
    console.log("Fetched product details:", data);
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
  for (let index = 0; index < product.images.length; index++) {
    const smallImage = document.createElement("img");
    smallImage.src = product.images[index];
    smallImage.classList.add(
      "w-[170px]",
      "h-[140px]",
      "bg-gray-300",
      "mb-4",
      "rounded-lg"
    );
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
  addToBasketBtn.addEventListener("click", () => {
    const response = fetch("https://ilkinibadov.com/api/v1/basket/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        productId: product.productId,
        count: currentCount,
      }),
    });
  });
};

getProductDetails();
