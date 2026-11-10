import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
function Cart() {
  const navigate = useNavigate();
  const { businessId } = useParams();

  const [products, setProducts] = useState([]);

  const cartKey = businessId ? `cart_${businessId}` : null;

  const getCart = () => {
    if (!cartKey) {
      setProducts([]);
      return;
    }

    try {
      const savedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      setProducts(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    getCart();
  }, [cartKey]);

  const saveCart = (newProducts) => {
    setProducts(newProducts);
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(newProducts));
    }
  };

  const changeQuantity = (id, color, size, amount) => {
    const newProducts = products.map((item) => {
      if (
        String(item.id) === String(id) &&
        item.color === color &&
        item.size === size
      ) {
        return {
          ...item,
          quantity: Math.max(1, Number(item.quantity || 1) + amount),
        };
      }

      return item;
    });

    saveCart(newProducts);
  };

  const removeProduct = (id, color, size) => {
    const newProducts = products.filter(
      (item) =>
        !(
          String(item.id) === String(id) &&
          item.color === color &&
          item.size === size
        ),
    );

    saveCart(newProducts);
  };

  const totalPrice = products.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const totalWeight = products.reduce(
    (sum, item) => sum + Number(item.weight || 0) * Number(item.quantity || 1),
    0,
  );

  const deliveryPrice = totalWeight * 100;

  if (!businessId) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <i className="fa-solid fa-cart-shopping"></i>
            <h2>Корзина магазина</h2>
            <p>Откройте магазин, чтобы посмотреть его корзину.</p>
            <Link to="/home" className="cart-back-button">
              Перейти к магазинам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div>
            <h2>Моя корзина</h2>
            <p>Товары выбранного магазина</p>
          </div>

          <Link to="/home" className="cart-back">
            <i className="fa-solid fa-arrow-left"></i>
            Продолжить покупки
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="cart-empty">
            <i className="fa-solid fa-cart-shopping"></i>
            <h2>Корзина пуста</h2>
            <p>Добавьте товары из этого магазина.</p>

            <Link to="/home" className="cart-back-button">
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-products">
              <div className="cart-store-name">
                <i className="fa-solid fa-store"></i>
                {products[0]?.namecompany || "Магазин"}
              </div>

              {products.map((item, index) => (
                <div
                  className="cart-product"
                  key={`${item.id}-${item.color}-${item.size}-${index}`}
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="cart-product-image"
                  />

                  <div className="cart-product-info">
                    <h3>{item.name}</h3>

                    <p>Цвет: {item.color}</p>
                    <p>Размер: {item.size}</p>
                    <p>Вес: {item.weight || 0} кг / шт.</p>

                    <strong>
                      {Number(item.price).toLocaleString("ru-RU")} сом
                    </strong>

                    <div className="cart-quantity">
                      <button
                        onClick={() =>
                          changeQuantity(item.id, item.color, item.size, -1)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          changeQuantity(item.id, item.color, item.size, 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-product-right">
                    <strong>
                      {(
                        Number(item.price) * Number(item.quantity)
                      ).toLocaleString("ru-RU")}{" "}
                      сом
                    </strong>

                    <button
                      className="cart-remove"
                      onClick={() =>
                        removeProduct(item.id, item.color, item.size)
                      }
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Ваш заказ</h3>

              <div className="cart-summary-row">
                <span>Количество товаров</span>
                <strong>
                  {products.reduce(
                    (sum, item) => sum + Number(item.quantity || 1),
                    0,
                  )}
                </strong>
              </div>

              <div className="cart-summary-row">
                <span>Общий вес</span>
                <strong>{totalWeight.toFixed(2)} кг</strong>
              </div>

              <div className="cart-summary-row">
                <span>Стоимость товаров</span>
                <strong>{totalPrice.toLocaleString("ru-RU")} сом</strong>
              </div>

              <div className="cart-summary-row">
                <span>Доставка (расчёт)</span>
                <strong>{deliveryPrice.toLocaleString("ru-RU")} сом</strong>
              </div>

              <div className="cart-summary-total">
                <span>Итого за товары</span>
                <strong>{totalPrice.toLocaleString("ru-RU")} сом</strong>
              </div>

              <button
                className="cart-checkout-button"
                onClick={() => navigate(`/checkout/${businessId}`)}
              >
                Перейти к оформлению
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <p className="cart-summary-note">
                Стоимость доставки пока не списывается с баланса.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
