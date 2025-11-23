const productContainer = document.getElementById("productContainer");
const viewMoreBtn = document.getElementById("viewMoreBtn");
const basketBtn = document.getElementById("basketBtn");
const loginBtn = document.getElementById("loginBtn");
const searchInput = document.getElementById("searchInput");
let productLimit = 8;

const checkAccessToken = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    return token ? true : false;
  } catch (err) {
    console.error("Error checking authentication:", err);
    return false;
  }
};

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

const addToBasket = async (product, button) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    let response = await fetch("https://ilkinibadov.com/api/v1/basket/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        productId: product._id,
        count: 1,
      }),
    });

    if (response.status === 401) {
      console.log("401: Access token expired. Refreshing...");
      return refreshToken(() => addToBasket(product, button));
    }

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
};

const searchProducts = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://ilkinibadov.com/api/v1/search?searchterm=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Search results:", data);

    return data.content || [];
  } catch (error) {
    console.error("Search API error:", error);
    return [];
  }
};

searchInput.addEventListener("input", async () => {
  const value = searchInput.value.trim();

  if (value.length < 3) {
    init();
    return;
  }

  const products = await searchProducts(value);
  renderProducts(products);
});



const isAuthenticated = async () => {
  const hasToken = await checkAccessToken();
  console.log("Has token:", hasToken);

  if (!hasToken) {
    window.location.href = "/Project/login/login.html";
  } else {
    window.location.href = "/Project/basket/basket.html";
  }
};

basketBtn.addEventListener("click", isAuthenticated);

const goLogin = async () => {
  const hasToken = await checkAccessToken();

  if (!hasToken) {
    window.location.href = "/Project/login/login.html";
  } else {
    alert("You are already logged in");
  }
};

loginBtn.addEventListener("click", goLogin);

const getProducts = async (category = "") => {
  try {
    const url = `https://ilkinibadov.com/api/v1/products?page=1&limit=${productLimit}${category ? `&category=${category}` : ""
      }`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Fetched products:", data.products);
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const renderProducts = (products) => {
  productContainer.innerHTML = "";

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
      e.stopPropagation();
      await addToBasket(product, button);
    });

    image.src =
      product.images?.[0] || product?.images || product.image || "https://picsum.photos/150";

    title.innerText = product.title;
    price.innerText = `$${product.price}`;

    imageCard.append(image);
    imageCard.append(button);

    card.append(imageCard);
    card.append(title);
    card.append(price);

    productContainer.append(card);
  });
};

const categorieBtns = document.querySelectorAll(".category-btn");
categorieBtns.forEach(button => {
  button.addEventListener("click", async () => {
    const category = button.getAttribute("data-category");
    productLimit = 8;
    const products = await getProducts(category);
    renderProducts(products);
  });
});

viewMoreBtn.addEventListener("click", async () => {
  productLimit += 8;
  const newProducts = await getProducts();
  renderProducts(newProducts);
});

const init = async () => {
  const products = await getProducts();
  renderProducts(products);
};
init();
