import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const ORDERS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/orders";

function Orderstatus() {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiving, setReceiving] = useState(false);

  const statuses = [
    {
      name: "Ожидание",
      icon: "fa-regular fa-clock",
    },
    {
      name: "Подтверждено",
      icon: "fa-solid fa-circle-check",
    },
    {
      name: "Едет",
      icon: "fa-solid fa-truck-fast",
    },
    {
      name: "Получить",
      icon: "fa-solid fa-box",
    },
    {
      name: "Передано",
      icon: "fa-solid fa-box-open",
    },
    {
      name: "На дороге",
      icon: "fa-solid fa-truck",
    },
    {
      name: "Приехал",
      icon: "fa-solid fa-location-dot",
    },
    {
      name: "Получено",
      icon: "fa-solid fa-check",
    },
    {
      name: "Завершен",
      icon: "fa-solid fa-circle-check",
    },
  ];

  const getOrder = async () => {
    try {
      const uid = localStorage.getItem("uid")?.replaceAll('"', "");

      if (!uid) {
        navigate("/");
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

      const ordersResponse = await axios.get(ORDERS_URL);

      const userOrders = ordersResponse.data.filter(
        (item) =>
          String(item.firstname) === String(currentUser.firstname) &&
          String(item.lastname) === String(currentUser.lastname) &&
          String(item.numberphone) === String(currentUser.numberphone),
      );

      if (userOrders.length === 0) {
        setOrder(null);
        return;
      }

      userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrder(userOrders[0]);
    } catch (error) {
      console.log("Ошибка получения заказа:", error);
      alert("Не удалось загрузить заказ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  // Определяем этап заказа
  const getStatusIndex = (status) => {
    const current = String(status || "").toLowerCase();

    if (current === "ожидание" || current === "новый") return 1;

    if (
      current === "подтверждено" ||
      current === "подтвержденный" ||
      current === "подтверждённый" ||
      current === "курьер принял заказ"
    ) {
      return 2;
    }

    if (current === "едет" || current === "в пути") return 3;

    if (current === "получить") return 4;

    if (current === "передано") return 5;

    if (current === "на дороге") return 6;

    if (current === "приехал") return 7;

    if (current === "получено") return 8;

    if (current === "завершен" || current === "завершён") return 9;

    return 1;
  };

  // Покупатель подтверждает получение
  const receiveOrder = async () => {
    try {
      setReceiving(true);

      const response = await axios.get(`${ORDERS_URL}/${order.id}`);

      if (response.data.orderstatus !== "Приехал") {
        alert("Курьер ещё не отметил прибытие");
        setOrder(response.data);
        return;
      }

      await axios.put(`${ORDERS_URL}/${order.id}`, {
        ...response.data,
        orderstatus: "Получено",
      });

      setOrder({
        ...response.data,
        orderstatus: "Получено",
      });

      alert("Вы получили заказ!");
    } catch (error) {
      console.log("Ошибка получения заказа:", error);
      alert("Не удалось подтвердить получение");
    } finally {
      setReceiving(false);
    }
  };

  if (loading) {
    return (
      <div className="order-status-page">
        <div className="order-status-container">Загрузка заказа...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-status-page">
        <div className="order-status-container">
          <div className="order-status-header">
            <button className="order-status-back" onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>

            <div>
              <h1>Мой заказ</h1>
              <p>Информация о вашей покупке</p>
            </div>
          </div>

          <div className="order-status-information">
            <h2>Заказов пока нет</h2>
            <button onClick={() => navigate("/home")}>
              Перейти к покупкам
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStatus = getStatusIndex(order.orderstatus);

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("ru-RU")
    : "—";

  return (
    <div className="order-status-page">
      <div className="order-status-container">
        {/* Верхняя часть */}
        <div className="order-status-header">
          <button className="order-status-back" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <div>
            <h1>Мой заказ</h1>
            <p>Информация о вашей покупке</p>
          </div>
        </div>

        {/* Карточка товара */}
        <div className="order-status-product">
          <div className="order-status-image">
            <img src={order.avatar} alt={order.name} />
          </div>

          <div className="order-status-product-info">
            <span className="order-status-label">ЗАКАЗ № {order.id}</span>

            <h2>{order.name}</h2>

            <div className="order-status-details">
              <p>
                Цвет: <strong>{order.color || "—"}</strong>
              </p>

              <p>
                Размер: <strong>{order.size || "—"}</strong>
              </p>

              <p>
                Количество: <strong>{order.quantity || 1} шт.</strong>
              </p>
            </div>

            <h3>{Number(order.price || 0).toLocaleString("ru-RU")} сом</h3>
          </div>
        </div>

        {/* Статус доставки */}
        <div className="order-status-progress-card">
          <div className="order-status-title">
            <div>
              <span>ДОСТАВКА</span>
              <h2>Статус заказа</h2>
            </div>

            <div className="order-status-current">{order.orderstatus}</div>
          </div>

          <div className="order-status-timeline">
            {statuses.map((item, index) => {
              const completed = index < currentStatus;
              const active = index === currentStatus - 1;

              return (
                <div className="order-status-step" key={index}>
                  <div className="order-status-step-top">
                    <div
                      className={`order-status-icon ${
                        completed ? "completed" : ""
                      } ${active ? "active" : ""}`}
                    >
                      <i
                        className={completed ? "fa-solid fa-check" : item.icon}
                      ></i>
                    </div>

                    {index !== statuses.length - 1 && (
                      <div
                        className={`order-status-line ${
                          completed ? "line-active" : ""
                        }`}
                      ></div>
                    )}
                  </div>

                  <p className={active || completed ? "step-text-active" : ""}>
                    {item.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Кнопка получения */}
        {order.orderstatus === "Приехал" && (
          <button
            className="order-status-receive-button"
            onClick={receiveOrder}
            disabled={receiving}
          >
            <i className="fa-solid fa-box-open"></i>
            {receiving ? "Подтверждение..." : "Получить заказ"}
          </button>
        )}

        {order.orderstatus === "Получено" && (
          <div className="order-status-received">
            <i className="fa-solid fa-circle-check"></i>
            Вы получили заказ!
          </div>
        )}

        {order.orderstatus === "Завершен" && (
          <div className="order-status-received">
            <i className="fa-solid fa-circle-check"></i>
            Заказ завершён
          </div>
        )}

        {/* Информация о заказе */}
        <div className="order-status-information">
          <h2>Информация о заказе</h2>

          <div className="order-status-info-row">
            <span>Номер заказа</span>
            <strong>{order.id}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Дата заказа</span>
            <strong>{orderDate}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Магазин</span>
            <strong>{order.adrescompany || "—"}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Адрес доставки</span>
            <strong>{order.adres || "—"}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Способ оплаты</span>
            <strong>Мой баланс</strong>
          </div>

          <div className="order-status-info-row total">
            <span>Итого</span>
            <strong>
              {Number(order.price || 0).toLocaleString("ru-RU")} сом
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orderstatus;
