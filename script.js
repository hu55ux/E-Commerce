const productContainer = document.getElementById("productContainer");
const viewMoreBtn = document.getElementById("viewMoreBtn");
const basketBtn = document.getElementById("basketBtn");
const loginBtn = document.getElementById("loginBtn");
let productLimit = 8;

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

const getProducts = async () => {
  try {
    const response = await fetch(
      `https://ilkinibadov.com/api/v1/products?page=1&limit=${productLimit}`
    );

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
    button.addEventListener("click", async () => {
      try {
        const response = await fetch(
          "https://ilkinibadov.com/api/v1/basket/add",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              productId: product.productId,
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
    price.innerText = `$${product.price}`;

    imageCard.append(image);
    imageCard.append(button);

    card.append(imageCard);
    card.append(title);
    card.append(price);

    productContainer.append(card);
  });
};

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
