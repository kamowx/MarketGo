import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const PRODUCTS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/products";
const BUSINESS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/buisness";
const ORDERS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/orders";

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
  const [paying, setPaying] = useState(false);

  // Пол товар
  const getProduct = async () => {
    try {
      const uid = localStorage.getItem("uid")?.replaceAll('"', "");

      if (!uid) {
        navigate("/");
        return;
      }

      // Получае выб тов
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

  // Оформление и оплата заказа
  const payOrder = async () => {
    if (paying) return;

    if (!user) {
      alert("Пользователь не найден");
      return;
    }

    if (balance < total) {
      alert("Суммы не хватает на балансе");
      return;
    }

    if (!business) {
      alert("Не удалось найти магазин продавца");
      return;
    }

    try {
      setPaying(true);

      const newBalance = balance - total;

      // Сохраняем заказ в MockAPI
      const orderResponse = await axios.post(ORDERS_URL, {
        createdAt: new Date().toISOString(),

        buyerId: user.id,
        productId: product.id,

        avatar: product.avatar,
        name: product.name,
        price: total,

        size: selectedSize,
        color: selectedColor,
        quantity: quantity,

        orderstatus: "Ожидание",

        firstname: user.firstname,
        lastname: user.lastname,
        numberphone: user.numberphone,

        adrescompany: business.adrescompany,
        adres: user.adres,
      });

      // Обнов баланс
      try {
        const balanceResponse = await axios.put(`${USERS_URL}/${user.id}`, {
          ...user,
          balance: newBalance,
        });

        setUser(balanceResponse.data);
      } catch (balanceError) {
        await axios.delete(`${ORDERS_URL}/${orderResponse.data.id}`);
        throw balanceError;
      }

      alert("Заказ успешно оплачен!");

      setShowModal(false);
      navigate("/orderstatus");
    } catch (error) {
      console.log("Ошибка оформления заказа:", error);
      alert("Не удалось оформить заказ. Попробуйте ещё раз.");
    } finally {
      setPaying(false);
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
        <button className="product-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
          Назад
        </button>

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

            <button
              className="product-order-button"
              onClick={() => setShowModal(true)}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              Заказать
            </button>

            <div className="product-store">
              <i className="fa-solid fa-store"></i>
              Магазин: <strong>{product.namecompany}</strong>
            </div>
          </div>
        </div>

        {/* МОДАЛЬНОЕ ОКНО */}
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
                <i className="fa-solid fa-wallet"></i>
              </div>

              <h2>Подтвердить заказ?</h2>
              <p>Проверьте информацию перед оплатой.</p>

              <div className="product-modal-product">
                <img src={images[0]} alt={product.name} />

                <div>
                  <strong>{product.name}</strong>
                  <span>Цвет: {selectedColor}</span>
                  <span>Размер: {selectedSize}</span>
                  <span>Количество: {quantity} шт.</span>
                </div>
              </div>

              <div className="product-modal-row">
                <span>Мой баланс</span>
                <strong>{formatPrice(balance)} сом</strong>
              </div>

              <div className="product-modal-row">
                <span>К оплате</span>
                <strong>{formatPrice(total)} сом</strong>
              </div>

              <div className="product-modal-actions">
                <button
                  className="product-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Отменить
                </button>

                <button
                  className="product-modal-pay"
                  onClick={payOrder}
                  disabled={paying}
                >
                  {paying ? "Оплата..." : "Оплатить"}
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
