import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const ORDERS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/orders";
const BUSINESS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/buisness";

function Checkout() {
  const navigate = useNavigate();
  const { businessId } = useParams();

  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [business, setBusiness] = useState(null);

  const [products, setProducts] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const cartKey = `cart_${businessId}`;

  const getCheckout = async () => {
    try {
      const uid = localStorage.getItem("uid")?.replaceAll('"', "");

      if (!uid) {
        navigate("/");
        return;
      }

      if (!businessId) {
        navigate("/home");
        return;
      }

      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

      if (!Array.isArray(cart) || cart.length === 0) {
        setProducts([]);
        return;
      }

      const currentProducts = cart.filter(
        (item) => String(item.businessId) === String(businessId),
      );

      setProducts(currentProducts);

      if (currentProducts.length === 0) {
        return;
      }

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
      setPhone(currentUser.numberphone || "");
      setAddress(currentUser.adres || "");

      // Находим магазин
      const businessResponse = await axios.get(BUSINESS_URL);

      const currentBusiness = businessResponse.data.find(
        (item) => String(item.id) === String(businessId),
      );

      if (!currentBusiness) {
        alert("Магазин не найден");
        navigate("/home");
        return;
      }

      setBusiness(currentBusiness);

      // Находим аккаунт продавца
      const currentSeller = usersResponse.data.find(
        (item) => String(item.id) === String(currentBusiness.userId),
      );

      if (!currentSeller) {
        alert("Аккаунт продавца не найден");
        navigate("/home");
        return;
      }

      setSeller(currentSeller);
    } catch (error) {
      console.log("Ошибка загрузки оформления:", error);
      alert("Не удалось загрузить данные оформления");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCheckout();
  }, [businessId]);

  const totalPrice = products.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const totalWeight = products.reduce(
    (sum, item) => sum + Number(item.weight || 0) * Number(item.quantity || 1),
    0,
  );

  const deliveryPrice = totalWeight * 100;

  const formatPrice = (price) => Number(price || 0).toLocaleString("ru-RU");

  const payOrder = async () => {
    if (paying) return;

    if (!user || !seller || !business) {
      alert("Не удалось получить данные покупателя или продавца");
      return;
    }

    if (products.length === 0) {
      alert("Корзина пуста");
      return;
    }

    if (!phone.trim() || !address.trim()) {
      alert("Заполните номер телефона и адрес доставки");
      return;
    }

    const buyerBalance = Number(user.balance || 0);

    if (buyerBalance < totalPrice) {
      alert(
        `Недостаточно средств. Ваш баланс: ${formatPrice(buyerBalance)} сом`,
      );
      return;
    }

    const sellerBalance = Number(seller.balance || 0);

    // Все товары текущего магазина
    const orderProducts = products.map((item) => ({
      id: item.id,
      avatar: item.avatar || "",
      name: item.name || "",
      lastname: item.lastname || "",
      firstname: item.firstname || "",
      price: Number(item.price || 0),
      size: item.size || "",
      color: item.color || "",
      quantity: Number(item.quantity || 1),
      weight: Number(item.weight || 0),
    }));

    const productIds = products.map((item) => item.id);

    // Отдельная информация о заказе магазина
    const storeOrder = {
      businessId: String(business.id),
      sellerId: String(seller.id),

      namecompany: business.name || "",
      adrescompany: business.adrescompany || "",
      numberphonecompany: seller.numberphone || "",

      products: orderProducts,

      productId: productIds,
      totalPrice: totalPrice,
      allweight: totalWeight,

      orderstatus: "Ожидание",

      createdAt: new Date().toISOString(),
    };

    // Основной заказ покупателя
    const orderData = {
      buyerId: user.id,

      firstname: user.firstname || "",
      lastname: user.lastname || "",

      productId: productIds,

      numberphone: phone.trim(),
      adres: address.trim(),

      allweight: totalWeight,

      namecompany: business.name || "",
      adrescompany: business.adrescompany || "",
      numberphonecompany: seller.numberphone || "",

      products: orderProducts,

      totalPrice: totalPrice,
      price: totalPrice,

      // Новое поле: заказы по магазинам
      storeOrders: [storeOrder],

      createdAt: new Date().toISOString(),

      orderstatus: "Ожидание",
    };

    setPaying(true);

    let createdOrder = null;
    let sellerUpdated = false;
    let buyerUpdated = false;

    try {
      // Создаём заказ
      const orderResponse = await axios.post(ORDERS_URL, orderData);
      createdOrder = orderResponse.data;

      // Списываем деньги у покупателя
      const updatedBuyer = {
        ...user,
        balance: buyerBalance - totalPrice,
        numberphone: phone.trim(),
        adres: address.trim(),
      };

      await axios.put(`${USERS_URL}/${user.id}`, updatedBuyer);
      buyerUpdated = true;

      // Начисляем деньги продавцу
      const updatedSeller = {
        ...seller,
        balance: sellerBalance + totalPrice,
      };

      await axios.put(`${USERS_URL}/${seller.id}`, updatedSeller);
      sellerUpdated = true;

      setUser(updatedBuyer);
      setSeller(updatedSeller);

      // Очищаем только корзину этого магазина
      localStorage.removeItem(cartKey);
      setProducts([]);

      alert("Заказ успешно оформлен!");

      navigate(`/orderstatus/${createdOrder.id}`);
    } catch (error) {
      console.log("Ошибка оформления заказа:", error);

      // Возвращаем баланс продавца при ошибке
      try {
        if (sellerUpdated) {
          await axios.put(`${USERS_URL}/${seller.id}`, seller);
        }

        // Возвращаем баланс покупателя при ошибке
        if (buyerUpdated) {
          await axios.put(`${USERS_URL}/${user.id}`, user);
        }

        // Удаляем созданный заказ при ошибке
        if (createdOrder?.id) {
          await axios.delete(`${ORDERS_URL}/${createdOrder.id}`);
        }
      } catch (rollbackError) {
        console.log("Ошибка возврата данных:", rollbackError);
      }

      alert(
        "Не удалось полностью оформить заказ. Проверьте подключение и баланс.",
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <p>Загрузка оформления заказа...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-empty">
            <i className="fa-solid fa-cart-shopping"></i>
            <h2>Корзина пуста</h2>
            <p>Добавьте товары из этого магазина.</p>

            <Link to="/home" className="checkout-back-button">
              Перейти к покупкам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <div>
            <h2>Оформление заказа</h2>
            <p>Проверьте данные перед оплатой</p>
          </div>

          <Link to={`/cart/${businessId}`} className="checkout-back">
            <i className="fa-solid fa-arrow-left"></i>
            Назад в корзину
          </Link>
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* ДАННЫЕ ПОКУПАТЕЛЯ */}
            <div className="checkout-card">
              <div className="checkout-card-title">
                <i className="fa-solid fa-location-dot"></i>
                <h3>Доставка</h3>
              </div>

              <div className="checkout-input-group">
                <label>Номер телефона</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Введите номер телефона"
                />
              </div>

              <div className="checkout-input-group">
                <label>Адрес доставки</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Введите ваш адрес"
                  rows="3"
                />
              </div>
            </div>

            {/* ИНФОРМАЦИЯ О МАГАЗИНЕ */}
            <div className="checkout-card">
              <div className="checkout-card-title">
                <i className="fa-solid fa-store"></i>
                <h3>Магазин</h3>
              </div>

              <div className="checkout-store-info">
                {business?.avatar && (
                  <img src={business.avatar} alt={business.name} />
                )}

                <div>
                  <strong>{business?.name || "Магазин"}</strong>
                  <span>Адрес: {business?.adrescompany || "Не указан"}</span>
                  <span>
                    Телефон продавца: {seller?.numberphone || "Не указан"}
                  </span>
                </div>
              </div>
            </div>

            {/* ТОВАРЫ */}
            <div className="checkout-card">
              <div className="checkout-card-title">
                <i className="fa-solid fa-box"></i>
                <h3>Ваши товары</h3>
              </div>

              <div className="checkout-products">
                {products.map((item, index) => (
                  <div
                    className="checkout-product"
                    key={`${item.id}-${item.color}-${item.size}-${index}`}
                  >
                    <img src={item.avatar} alt={item.name} />

                    <div className="checkout-product-info">
                      <strong>{item.name}</strong>
                      <span>Цвет: {item.color}</span>
                      <span>Размер: {item.size}</span>
                      <span>Количество: {item.quantity} шт.</span>
                      <span>
                        Вес:{" "}
                        {(
                          Number(item.weight || 0) * Number(item.quantity || 1)
                        ).toFixed(2)}{" "}
                        кг
                      </span>
                    </div>

                    <strong className="checkout-product-price">
                      {formatPrice(Number(item.price) * Number(item.quantity))}{" "}
                      сом
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ИТОГИ И ОПЛАТА */}
          <div className="checkout-summary">
            <h3>Ваш заказ</h3>

            <div className="checkout-summary-row">
              <span>Товаров</span>
              <strong>
                {products.reduce(
                  (sum, item) => sum + Number(item.quantity || 1),
                  0,
                )}{" "}
                шт.
              </strong>
            </div>

            <div className="checkout-summary-row">
              <span>Общий вес</span>
              <strong>{totalWeight.toFixed(2)} кг</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Стоимость товаров</span>
              <strong>{formatPrice(totalPrice)} сом</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Доставка (расчёт)</span>
              <strong>{formatPrice(deliveryPrice)} сом</strong>
            </div>

            <p className="checkout-delivery-note">
              Доставка рассчитывается отдельно и сейчас не списывается с
              баланса.
            </p>

            <div className="checkout-balance">
              <span>Ваш баланс</span>
              <strong>{formatPrice(user?.balance)} сом</strong>
            </div>

            <div className="checkout-summary-total">
              <span>К оплате</span>
              <strong>{formatPrice(totalPrice)} сом</strong>
            </div>

            <button
              className="checkout-pay-button"
              onClick={payOrder}
              disabled={paying || !user || !seller}
            >
              {paying ? (
                "Оформление..."
              ) : (
                <>
                  <i className="fa-solid fa-lock"></i>
                  Оплатить заказ
                </>
              )}
            </button>

            <p className="checkout-safe-text">
              С баланса спишется только стоимость товаров.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
