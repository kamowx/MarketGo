import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ORDERS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/orders";
const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";

function Orderstatus() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiving, setReceiving] = useState(false);

  const statuses = [
    { name: "Ожидание", icon: "fa-regular fa-clock" },
    { name: "Подтверждено", icon: "fa-solid fa-circle-check" },
    { name: "Ожидание курьера", icon: "fa-solid fa-truck" },
    { name: "Едет", icon: "fa-solid fa-truck-fast" },
    { name: "Получить", icon: "fa-solid fa-box" },
    { name: "Передано", icon: "fa-solid fa-box-open" },
    { name: "На дороге", icon: "fa-solid fa-truck" },
    { name: "Приехал", icon: "fa-solid fa-location-dot" },
    { name: "Получено", icon: "fa-solid fa-check" },
    { name: "Завершен", icon: "fa-solid fa-circle-check" },
  ];

  const getProducts = (currentOrder) => {
    if (Array.isArray(currentOrder.products)) return currentOrder.products;

    if (currentOrder.name) {
      return [
        {
          id: currentOrder.productId,
          name: currentOrder.name,
          avatar: currentOrder.avatar,
          price: currentOrder.price,
          color: currentOrder.color,
          size: currentOrder.size,
          quantity: currentOrder.quantity || 1,
          weight: currentOrder.weight || 0,
        },
      ];
    }

    return [];
  };

  const getWeight = (currentOrder) =>
    getProducts(currentOrder).reduce(
      (sum, item) =>
        sum + Number(item.weight || 0) * Number(item.quantity || 1),
      0,
    );

  const getStatusIndex = (status) => {
    const current = String(status || "").toLowerCase();

    const statusMap = {
      ожидание: 0,
      новый: 0,
      подтверждено: 1,
      "ожидание курьера": 2,
      едет: 3,
      "в пути": 3,
      получить: 4,
      передано: 5,
      "на дороге": 6,
      приехал: 7,
      получено: 8,
      завершен: 9,
      завершён: 9,
    };

    return statusMap[current] ?? 0;
  };

  const getOrder = async () => {
    try {
      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      if (!uid) {
        navigate("/", { replace: true });
        return;
      }

      const usersResponse = await axios.get(USERS_URL);

      const currentUser = usersResponse.data.find(
        (item) => String(item.uid).replaceAll('"', "") === uid,
      );

      if (!currentUser) {
        alert("Пользователь не найден");
        navigate("/", { replace: true });
        return;
      }

      const response = await axios.get(`${ORDERS_URL}/${id}`);

      if (String(response.data.buyerId) !== String(currentUser.id)) {
        alert("Этот заказ вам не принадлежит");
        navigate("/myorders", { replace: true });
        return;
      }

      setOrder(response.data);
    } catch (error) {
      console.log("Ошибка получения заказа:", error);
      alert("Не удалось загрузить заказ");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, [id]);

  // Покупатель подтверждает получение и оплачивает доставку
  const receiveOrder = async () => {
    try {
      setReceiving(true);

      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      const orderResponse = await axios.get(`${ORDERS_URL}/${id}`);
      const freshOrder = orderResponse.data;

      if (freshOrder.deliveryPaid === true) {
        alert("Доставка уже оплачена");
        setOrder(freshOrder);
        return;
      }

      if (freshOrder.deliveryPaymentStatus === "processing") {
        alert("Оплата уже обрабатывается. Попробуйте обновить страницу.");
        return;
      }

      if (freshOrder.orderstatus !== "Приехал") {
        alert("Курьер ещё не отметил прибытие");
        setOrder(freshOrder);
        return;
      }

      const usersResponse = await axios.get(USERS_URL);

      const buyer = usersResponse.data.find(
        (item) => String(item.uid).replaceAll('"', "") === uid,
      );

      if (!buyer || String(freshOrder.buyerId) !== String(buyer.id)) {
        alert("Не удалось проверить покупателя");
        return;
      }

      const courier = usersResponse.data.find(
        (item) =>
          String(item.id) === String(freshOrder.deliveryId) &&
          item.role === "courier",
      );

      if (!courier) {
        alert("Курьер не найден");
        return;
      }

      const totalWeight = getWeight(freshOrder);
      const deliveryPrice = totalWeight * 100;

      const buyerBalance = Number(buyer.balance || 0);
      const courierBalance = Number(courier.balance || 0);

      if (buyerBalance < deliveryPrice) {
        alert(
          `Недостаточно денег на балансе. Нужно ${deliveryPrice} сом, у вас ${buyerBalance} сом.`,
        );
        return;
      }

      // Сначала блокируем повторную оплату
      const lockedOrder = {
        ...freshOrder,
        deliveryPaymentStatus: "processing",
      };

      await axios.put(`${ORDERS_URL}/${id}`, lockedOrder);

      let buyerUpdated = false;
      let courierUpdated = false;

      try {
        // Списываем деньги с покупателя
        await axios.put(`${USERS_URL}/${buyer.id}`, {
          ...buyer,
          balance: buyerBalance - deliveryPrice,
        });

        buyerUpdated = true;

        // Начисляем деньги курьеру
        await axios.put(`${USERS_URL}/${courier.id}`, {
          ...courier,
          balance: courierBalance + deliveryPrice,
        });

        courierUpdated = true;

        // Завершаем заказ и отмечаем оплату
        const completedStores = Array.isArray(lockedOrder.storeOrders)
          ? lockedOrder.storeOrders.map((store) => ({
              ...store,
              orderstatus: "Получено",
            }))
          : lockedOrder.storeOrders;

        const completedOrder = {
          ...lockedOrder,
          orderstatus: "Получено",
          storeOrders: completedStores,
          deliveryPrice,
          deliveryWeight: totalWeight,
          deliveryPaid: true,
          deliveryPaymentStatus: "paid",
          deliveryPaidAt: new Date().toISOString(),
        };

        await axios.put(`${ORDERS_URL}/${id}`, completedOrder);

        setOrder(completedOrder);

        alert(
          `Заказ получен!\nС покупателя списано: ${deliveryPrice} сом.\nКурьеру начислено: ${deliveryPrice} сом.`,
        );
      } catch (paymentError) {
        console.log("Ошибка перевода денег:", paymentError);

        // Если перевод не завершился, возвращаем изменённые балансы
        if (courierUpdated) {
          await axios.put(`${USERS_URL}/${courier.id}`, {
            ...courier,
            balance: courierBalance,
          });
        }

        if (buyerUpdated) {
          await axios.put(`${USERS_URL}/${buyer.id}`, {
            ...buyer,
            balance: buyerBalance,
          });
        }

        await axios.put(`${ORDERS_URL}/${id}`, {
          ...lockedOrder,
          deliveryPaymentStatus: "unpaid",
        });

        throw paymentError;
      }
    } catch (error) {
      console.log("Ошибка получения заказа:", error);
      alert("Не удалось завершить оплату доставки");
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
            <h2>Заказ не найден</h2>
            <button onClick={() => navigate("/myorders")}>Мои заказы</button>
          </div>
        </div>
      </div>
    );
  }

  const products = getProducts(order);
  const totalWeight = getWeight(order);
  const deliveryPrice = totalWeight * 100;
  const currentStatus = getStatusIndex(order.orderstatus);

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("ru-RU")
    : "—";

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

        {products.map((item, index) => (
          <div className="order-status-product" key={item.id || index}>
            <div className="order-status-image">
              <img src={item.avatar} alt={item.name} />
            </div>

            <div className="order-status-product-info">
              <span className="order-status-label">ЗАКАЗ № {order.id}</span>
              <h2>{item.name}</h2>

              <div className="order-status-details">
                <p>
                  Цвет: <strong>{item.color || "—"}</strong>
                </p>

                <p>
                  Размер: <strong>{item.size || "—"}</strong>
                </p>

                <p>
                  Количество: <strong>{item.quantity || 1} шт.</strong>
                </p>

                <p>
                  Вес:{" "}
                  <strong>
                    {Number(item.weight || 0) * Number(item.quantity || 1)} кг
                  </strong>
                </p>
              </div>

              <h3>
                {(
                  Number(item.price || 0) * Number(item.quantity || 1)
                ).toLocaleString("ru-RU")}{" "}
                сом
              </h3>
            </div>
          </div>
        ))}

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
              const active = index === currentStatus;

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

        {order.orderstatus === "Приехал" && (
          <button
            className="order-status-receive-button"
            onClick={receiveOrder}
            disabled={receiving || order.deliveryPaid}
          >
            <i className="fa-solid fa-box-open"></i>
            {receiving ? "Оплата..." : `Получить заказ · ${deliveryPrice} сом`}
          </button>
        )}

        {order.orderstatus === "Получено" && (
          <div className="order-status-received">
            <i className="fa-solid fa-circle-check"></i>
            Вы получили заказ! Доставка оплачена.
          </div>
        )}

        {order.orderstatus === "Завершен" && (
          <div className="order-status-received">
            <i className="fa-solid fa-circle-check"></i>
            Заказ завершён
          </div>
        )}

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
            <strong>{order.namecompany || "—"}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Адрес магазина</span>
            <strong>{order.adrescompany || "—"}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Телефон магазина</span>
            <strong>{order.numberphonecompany || "—"}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Адрес доставки</span>
            <strong>{order.adres || "—"}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Телефон покупателя</span>
            <strong>{order.numberphone || "—"}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Общий вес</span>
            <strong>{totalWeight} кг</strong>
          </div>

          <div className="order-status-info-row">
            <span>Цена доставки (100 сом/кг)</span>
            <strong>{deliveryPrice.toLocaleString("ru-RU")} сом</strong>
          </div>

          <div className="order-status-info-row">
            <span>Статус оплаты доставки</span>
            <strong>{order.deliveryPaid ? "Оплачено" : "Не оплачено"}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Способ оплаты товаров</span>
            <strong>Мой баланс</strong>
          </div>

          <div className="order-status-info-row total">
            <span>Итого за товары</span>
            <strong>
              {Number(order.totalPrice ?? order.price ?? 0).toLocaleString(
                "ru-RU",
              )}{" "}
              сом
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orderstatus;
