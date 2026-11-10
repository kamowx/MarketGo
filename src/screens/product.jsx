import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const PRODUCTS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/products";
const BUSINESS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/buisness";

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Получаем количество товаров в корзине текущего магазина
  const getCartCount = (currentBusinessId = business?.id) => {
    if (!currentBusinessId) {
      setCartCount(0);
      return;
    }

    try {
      const cartKey = `cart_${currentBusinessId}`;
      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

      const count = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 1),
        0,
      );

      setCartCount(count);
    } catch (error) {
      setCartCount(0);
    }
  };

  // Получение товара
  const getProduct = async () => {
    try {
      const uid = localStorage.getItem("uid")?.replaceAll('"', "");

      if (!uid) {
        navigate("/");
        return;
      }

      const productResponse = await axios.get(`${PRODUCTS_URL}/${id}`);

      setProduct(productResponse.data);

      const usersResponse = await axios.get(USERS_URL);

      const currentUser = usersResponse.data.find(
        (item) => String(item.uid).replaceAll('"', "") === String(uid),
      );

      if (!currentUser) {
        alert("Пользователь не найден");
        navigate("/");
        return;
      }

      setUser(currentUser);

      // Получаем магазин продавца
      const businessResponse = await axios.get(BUSINESS_URL);

      const currentBusiness = businessResponse.data.find(
        (item) => String(item.userId) === String(productResponse.data.userId),
      );

      setBusiness(currentBusiness || null);

      // Загружаем количество товаров именно этого магазина
      if (currentBusiness) {
        getCartCount(currentBusiness.id);
      }
    } catch (error) {
      console.log("Ошибка получения данных:", error);
      alert("Не удалось загрузить товар");
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  // Фотографии товара
  const images = product
    ? product.avatar
      ? [product.avatar]
      : product.images || []
    : [];

  // Цвета товара
  const colors = product
    ? Array.isArray(product.color)
      ? product.color
      : product.color
        ? [product.color]
        : []
    : [];

  // Размеры товара
  const sizes = product
    ? Array.isArray(product.size)
      ? product.size
      : product.size
        ? [product.size]
        : []
    : [];

  useEffect(() => {
    if (product) {
      setSelectedColor(colors[0] || "");
      setSelectedSize(sizes[0] || "");
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  // Цвета
  const getColorValue = (color) => {
    const colorNames = {
      Чёрный: "#111111",
      Черный: "#111111",
      Белый: "#eeeeee",
      Коричневый: "#795548",
      Красный: "#c62828",
      Серый: "#888888",
      Синий: "#1565c0",
      Зелёный: "#2e7d32",
      Зеленый: "#2e7d32",
      Жёлтый: "#fdd835",
      Желтый: "#fdd835",
      Розовый: "#ec407a",
    };

    return colorNames[color] || color;
  };

  // Баланс
  const balance = Number(user?.balance || 0);

  // Общая сумма
  const total = Number(product?.price || 0) * quantity;

  const formatPrice = (price) => Number(price).toLocaleString("ru-RU");

  // Добавление товара в отдельную корзину магазина
  const addToCart = () => {
    if (!user) {
      alert("Пользователь не найден");
      return;
    }

    if (!business) {
      alert("Не удалось найти магазин продавца");
      return;
    }

    if (!selectedColor || !selectedSize) {
      alert("Выберите цвет и размер товара");
      return;
    }

    try {
      const cartKey = `cart_${business.id}`;

      let savedCart = [];

      try {
        savedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");

        if (!Array.isArray(savedCart)) {
          savedCart = [];
        }
      } catch {
        savedCart = [];
      }

      // Проверяем, есть ли такой же товар с таким же цветом и размером
      const existingIndex = savedCart.findIndex(
        (item) =>
          String(item.id) === String(product.id) &&
          String(item.color) === String(selectedColor) &&
          String(item.size) === String(selectedSize),
      );

      if (existingIndex !== -1) {
        // Если уже есть, увеличиваем количество
        savedCart[existingIndex].quantity =
          Number(savedCart[existingIndex].quantity || 1) + Number(quantity);
      } else {
        // Добавляем новый товар
        savedCart.push({
          id: product.id,
          userId: product.userId,

          avatar: product.avatar,
          name: product.name,
          description: product.description,
          category: product.category,

          price: Number(product.price),
          weight: Number(product.weight || 0),

          color: selectedColor,
          size: selectedSize,
          quantity: Number(quantity),

          namecompany: business.name || product.namecompany || "",
          adrescompany: business.adrescompany || "",
          avatarcompany: business.avatar || "",
          categorycompany: business.category || "",
          businessId: business.id,
        });
      }

      // Сохраняем только в корзину текущего магазина
      localStorage.setItem(cartKey, JSON.stringify(savedCart));

      // Обновляем количество товаров текущего магазина
      getCartCount(business.id);

      setShowModal(true);
    } catch (error) {
      console.log("Ошибка добавления в корзину:", error);
      alert("Не удалось добавить товар в корзину");
    }
  };

  if (loading) {
    return <div className="product-page">Загрузка товара...</div>;
  }

  if (!product) {
    return (
      <div className="product-page">
        <h2>Товар не найден</h2>
        <button onClick={() => navigate("/home")}>На главную</button>
      </div>
    );
  }

  return (
    <div className="product-page">
      <main className="product-container">
        <div className="product-top-actions">
          <button className="product-back" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
            Назад
          </button>

          <Link to={`/cart/${business?.id}`} className="product-cart-link">
            <i className="fa-solid fa-cart-shopping"></i>
            Корзина
            <span>{cartCount}</span>
          </Link>
        </div>

        <div className="product-layout">
          {/* ФОТО ТОВАРА */}
          <div className="product-gallery">
            <div className="product-main-image">
              <img src={images[selectedImage]} alt={product.name} />
            </div>

            <div className="product-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={selectedImage === index ? "selected" : ""}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ИНФОРМАЦИЯ О ТОВАРЕ */}
          <div className="product-information">
            <span className="product-category">{product.category}</span>

            <h1>{product.name}</h1>

            <div className="product-rating">
              <i className="fa-solid fa-star"></i>
              <strong>{product.rating || "—"}</strong>
              <span>({product.reviews || 0} отзывов)</span>
            </div>

            <h2 className="product-price">{formatPrice(product.price)} сом</h2>

            <div className="product-divider"></div>

            {/* ЦВЕТ */}
            <div className="product-option">
              <div className="product-option-heading">
                <strong>Цвет</strong>
                <span>{selectedColor}</span>
              </div>

              <div className="product-colors">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={selectedColor === color ? "selected" : ""}
                    style={{ background: getColorValue(color) }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    {selectedColor === color && (
                      <i
                        className={`fa-solid fa-check ${
                          color === "Белый" ? "dark-check" : ""
                        }`}
                      ></i>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* РАЗМЕР */}
            <div className="product-option">
              <div className="product-option-heading">
                <strong>Размер</strong>
                <span>{selectedSize}</span>
              </div>

              <div className="product-sizes">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className={selectedSize === size ? "selected" : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* КОЛИЧЕСТВО */}
            <div className="product-option">
              <div className="product-option-heading">
                <strong>Количество</strong>
              </div>

              <div className="product-quantity">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity === 1}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>

                <span>{quantity}</span>

                <button onClick={() => setQuantity((prev) => prev + 1)}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            {/* БАЛАНС */}
            <div className="product-balance">
              <div>
                <span>МОЙ СЧЁТ</span>
                <strong>{formatPrice(balance)} сом</strong>
              </div>

              <i className="fa-solid fa-wallet"></i>
            </div>

            {/* ИТОГО */}
            <div className="product-total">
              <span>Общая сумма</span>
              <strong>{formatPrice(total)} сом</strong>
            </div>

            <button className="product-order-button" onClick={addToCart}>
              <i className="fa-solid fa-bag-shopping"></i>В корзину
            </button>

            <div className="product-store">
              <i className="fa-solid fa-store"></i>
              Магазин: <strong>{product.namecompany}</strong>
            </div>
          </div>
        </div>

        {/* МОДАЛЬНОЕ ОКНО ПОСЛЕ ДОБАВЛЕНИЯ */}
        {showModal && (
          <div
            className="product-modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="product-modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="product-modal-icon">
                <i className="fa-solid fa-basket-shopping"></i>
              </div>

              <h2>Товар добавлен!</h2>

              <p>Товар успешно добавлен в корзину этого магазина.</p>

              <div className="product-modal-product">
                <img src={images[0]} alt={product.name} />

                <div>
                  <strong>{product.name}</strong>
                  <span>Цвет: {selectedColor}</span>
                  <span>Размер: {selectedSize}</span>
                  <span>Количество: {quantity} шт.</span>
                  <span>Вес: {Number(product.weight || 0) * quantity} кг</span>
                </div>
              </div>

              <div className="product-modal-row">
                <span>Стоимость</span>
                <strong>{formatPrice(total)} сом</strong>
              </div>

              <div className="product-modal-row">
                <span>Всего товаров в корзине</span>
                <strong>{cartCount} шт.</strong>
              </div>

              <div className="product-modal-actions">
                <button
                  className="product-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Продолжить покупки
                </button>

                <button
                  className="product-modal-pay"
                  onClick={() => navigate(`/cart/${business.id}`)}
                >
                  Перейти в корзину
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Product;
