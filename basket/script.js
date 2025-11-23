const productContainer = document.getElementById("productContainer");
const basketBtn = document.getElementById("basketBtn");
const loginBtn = document.getElementById("loginBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const totalCount = document.getElementById("totalCount");
const totalPrice = document.getElementById("totalPrice");
let productLimit = 8;

const checkAccessToken = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
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
    alert("User is authenticated");
    window.location.href = "/Project/basket/basket.html";
  }
};

basketBtn.addEventListener("click", isAuthenticated);

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

const removeAllProducts = async () => {
  try {
    const products = await getProducts();

    for (const product of products) {
      await removeFromBasket(product.id);
    }
    renderProducts();
  } catch (error) {
    console.error("Error removing all products:", error);
  }
};
clearAllBtn.addEventListener("click", removeAllProducts);

const getProducts = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(
      "https://ilkinibadov.com/api/v1/basket/products",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 401) {
      console.warn("Access token expired, refreshing...");
      return refreshToken(getProducts);
    }
    const data = await response.json();
    console.log("Fetched products:", data);
    return data.content;
  } catch (error) {
    console.log("Error fetching products:", error);
  }
  return [];
};

const removeFromBasket = async (productId) => {
  try {
    if (!productId) {
      alert("Product not found");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(
      `https://ilkinibadov.com/api/v1/basket/delete/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("API response:", data);

    if (data.success) {
      console.log("Product removed from basket:", productId);

      renderProducts();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Remove from basket error:", error);
    alert("Error occured: " + error.message);
  }
};

const renderProducts = async () => {
  const products = await getProducts();
  totalCount.innerText = "Basket: " + products.length;
  totalPrice.innerText = "Total: " + products.reduce((sum, p) => sum + parseFloat(p.total), 0).toFixed(2);
  productContainer.innerHTML = "";
  if (!products || products.length === 0) {
    const emptyMessage = document.createElement("h2");
    emptyMessage.innerText = "Your basket is empty.";
    emptyMessage.classList.add(
      "text-2xl",
      "font-semibold",
      "text-gray-600",
      "mt-10",
      "text-center"
    );
    productContainer.appendChild(emptyMessage);
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("button");
    const imageCard = document.createElement("div");
    const image = document.createElement("img");
    const title = document.createElement("h2");
    const price = document.createElement("h3");
    const button = document.createElement("button");
    const removeimg = document.createElement("img");

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
      console.log("Clicked product ID:", product.id);
      window.location.href = `/Project/details/details.html?productId=${product.id}`;
    });

    image.classList.add("w-[180px]", "h-[190px]");

    imageCard.classList.add(
      "w-[270px]",
      "h-[250px]",
      "bg-gray-200",
      "flex",
      "justify-center",
      "items-center",
      "relative"
    );
    button.classList.add(
      "absolute",
      "w-6",
      "h-6",
      "top-5",
      "right-2",
      "px-3",
      "py-1",
      "bg-white",
      "text-white",
      "rounded",
      "hover:bg-red-500",
      "transition-all",
      "duration-300",
      "ease-out"
    );
    productContainer.classList.add("relative");
    removeimg.classList.add("w-6", "h-6");
    button.append(removeimg);
    button.addEventListener("click", async (event) => {
      event.stopPropagation();

      if (!product || !product.id) {
        alert("Məhsul tapılmadı");
        return;
      }
      console.log("Silinən məhsul ID:", product.id);
      await removeFromBasket(product.id);
    });

    title.classList.add("text-xl", "font-bold", "pt-4", "pb-2");
    price.classList.add("text-red-500", "text-xl", "pb-2");

    image.src = product.image || "https://picsum.photos/150";

    title.innerText = product.title;
    price.innerText = `${product.currency +
      " " +
      product.pricePerItem +
      " x " +
      product.count +
      " = " +
      product.total
      }`;
    imageCard.append(image);
    imageCard.append(button);

    card.append(imageCard);
    card.append(title);
    card.append(price);

    productContainer.append(card);
  });
};

renderProducts();

// Object
// basketTotal
// :
// "119.96"
// content
// :
// Array(1)
// 0
// :
// count
// :
// 4
// currency
// :
// "$"
// id
// :
// "6922b2634fb6873b8782e574"
// image
// :
// "https://i.pinimg.com/474x/a2/4f/e4/a24fe4e11182caaf3eef65df4ebfb90e.jpg"
// pricePerItem
// :
// "29.99"
// productId
// :
// "68e3ac59fafd4c040e6a33fe"
// title
// :
// "Men's Casual Shirt"
// total
// :
// "119.96"
// [[Prototype]]
// :
// Object
// length
// :
// 1
// [[Prototype]]
// :
// Array(0)
// currency
// :
// "$"
