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

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [selectedPickupId, setSelectedPickupId] = useState("");
  const [loadingPickups, setLoadingPickups] = useState(false);
  const [returning, setReturning] = useState(false);

  // Обычные статусы доставки
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
    if (Array.isArray(currentOrder.products)) {
      return currentOrder.products;
    }

    if (
      Array.isArray(currentOrder.storeOrders) &&
      currentOrder.storeOrders.length > 0
    ) {
      return currentOrder.storeOrders.flatMap((store) => store.products || []);
    }

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

      const buyerId =
        response.data.buyerid || response.data.buyerId || response.data.userId;

      if (String(buyerId) !== String(currentUser.id)) {
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

      const buyerId =
        freshOrder.buyerid || freshOrder.buyerId || freshOrder.userId;

      if (!buyer || String(buyerId) !== String(buyer.id)) {
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

      const lockedOrder = {
        ...freshOrder,
        deliveryPaymentStatus: "processing",
      };

      await axios.put(`${ORDERS_URL}/${id}`, lockedOrder);

      let buyerUpdated = false;
      let courierUpdated = false;

      try {
        await axios.put(`${USERS_URL}/${buyer.id}`, {
          ...buyer,
          balance: buyerBalance - deliveryPrice,
        });

        buyerUpdated = true;

        await axios.put(`${USERS_URL}/${courier.id}`, {
          ...courier,
          balance: courierBalance + deliveryPrice,
        });

        courierUpdated = true;

        const completedStores = Array.isArray(lockedOrder.storeOrders)
          ? lockedOrder.storeOrders.map((item) => ({
              ...item,
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

  // Загружаем пункты передачи для возврата
  const openReturnModal = async () => {
    try {
      setLoadingPickups(true);
      setShowReturnModal(true);
      setSelectedPickupId("");

      const usersResponse = await axios.get(USERS_URL);

      const points = usersResponse.data.filter(
        (item) => item.role === "pickuppoint",
      );

      setPickupPoints(points);
    } catch (error) {
      console.log("Ошибка загрузки пунктов передачи:", error);
      alert("Не удалось загрузить пункты передачи");
      setShowReturnModal(false);
    } finally {
      setLoadingPickups(false);
    }
  };

  // Сразу возвращаем деньги покупателю и списываем их у продавца
  const createReturn = async () => {
    if (!selectedPickupId) {
      alert("Выберите пункт передачи");
      return;
    }

    try {
      setReturning(true);

      const latestResponse = await axios.get(`${ORDERS_URL}/${id}`);
      const freshOrder = latestResponse.data;

      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      const usersResponse = await axios.get(USERS_URL);
      const allUsers = usersResponse.data;

      const buyer = allUsers.find(
        (item) => String(item.uid).replaceAll('"', "") === uid,
      );

      const buyerId =
        freshOrder.buyerid || freshOrder.buyerId || freshOrder.userId;

      if (!buyer || String(buyer.id) !== String(buyerId)) {
        alert("Не удалось проверить покупателя");
        return;
      }

      if (
        !["Получено", "Завершен", "Завершено"].includes(freshOrder.orderstatus)
      ) {
        alert("Возврат можно оформить только после получения заказа");
        return;
      }

      if (
        freshOrder.returnPaymentStatus === "paid" ||
        freshOrder.returnPaymentStatus === "processing" ||
        freshOrder.returnStatus
      ) {
        alert("Возврат по этому заказу уже оформлен");
        setOrder(freshOrder);
        setShowReturnModal(false);
        return;
      }

      const pickup = allUsers.find(
        (item) =>
          String(item.id) === String(selectedPickupId) &&
          item.role === "pickuppoint",
      );

      if (!pickup) {
        alert("Пункт передачи не найден");
        return;
      }

      // Определяем сумму и продавцов
      let sellerAmounts = [];

      if (
        Array.isArray(freshOrder.storeOrders) &&
        freshOrder.storeOrders.length > 0
      ) {
        const amounts = {};

        freshOrder.storeOrders.forEach((store) => {
          const sellerId = store.sellerId;
          const storeAmount = Number(store.totalPrice ?? store.price ?? 0);

          if (!sellerId || storeAmount <= 0) {
            throw new Error(
              "Не удалось определить продавца или сумму одного из магазинов",
            );
          }

          amounts[String(sellerId)] =
            (amounts[String(sellerId)] || 0) + storeAmount;
        });

        sellerAmounts = Object.entries(amounts).map(([sellerId, amount]) => ({
          sellerId,
          amount,
        }));
      } else {
        const sellerId = freshOrder.sellerId;
        const amount = Number(freshOrder.totalPrice ?? freshOrder.price ?? 0);

        if (!sellerId || amount <= 0) {
          alert("Не удалось определить продавца или стоимость товаров");
          return;
        }

        sellerAmounts = [{ sellerId: String(sellerId), amount }];
      }

      const totalRefund = sellerAmounts.reduce(
        (sum, item) => sum + item.amount,
        0,
      );

      const sellers = sellerAmounts.map((item) => {
        const seller = allUsers.find(
          (user) =>
            String(user.id) === String(item.sellerId) && user.role === "seller",
        );

        if (!seller) {
          throw new Error(`Продавец ${item.sellerId} не найден`);
        }

        return {
          ...seller,
          refundAmount: item.amount,
          oldBalance: Number(seller.balance || 0),
        };
      });

      const buyerOldBalance = Number(buyer.balance || 0);

      // Ставим блокировку, чтобы не оформить возврат дважды
      const lockedOrder = {
        ...freshOrder,
        returnPaymentStatus: "processing",
      };

      await axios.put(`${ORDERS_URL}/${id}`, lockedOrder);

      let buyerUpdated = false;
      const updatedSellers = [];

      try {
        // Начисляем деньги покупателю
        await axios.put(`${USERS_URL}/${buyer.id}`, {
          ...buyer,
          balance: buyerOldBalance + totalRefund,
        });

        buyerUpdated = true;

        // Списываем деньги у каждого продавца
        for (const seller of sellers) {
          await axios.put(`${USERS_URL}/${seller.id}`, {
            ...seller,
            balance: seller.oldBalance - seller.refundAmount,
          });

          updatedSellers.push(seller);
        }

        const returnedOrder = {
          ...lockedOrder,
          orderstatus: "Ожидание возврата подтверждения продавец",
          returnStatus: "Ожидает передачи",
          returnPickupId: String(pickup.id),
          returnPickupName:
            pickup.namecompany || pickup.firstname || "Пункт передачи",
          returnPickupAddress: pickup.adres || "",
          returnAmount: totalRefund,
          returnPaymentStatus: "paid",
          returnPaidAt: new Date().toISOString(),
        };

        await axios.put(`${ORDERS_URL}/${id}`, returnedOrder);

        setOrder(returnedOrder);
        setShowReturnModal(false);

        alert(
          `Возврат оформлен!\nПокупателю начислено: ${totalRefund.toLocaleString("ru-RU")} сом.\nУ продавца списано: ${totalRefund.toLocaleString("ru-RU")} сом.`,
        );
      } catch (paymentError) {
        console.log("Ошибка возврата денег:", paymentError);

        // Откатываем изменения, если перевод завершился с ошибкой
        for (const seller of updatedSellers.reverse()) {
          await axios.put(`${USERS_URL}/${seller.id}`, {
            ...seller,
            balance: seller.oldBalance,
          });
        }

        if (buyerUpdated) {
          await axios.put(`${USERS_URL}/${buyer.id}`, {
            ...buyer,
            balance: buyerOldBalance,
          });
        }

        await axios.put(`${ORDERS_URL}/${id}`, {
          ...freshOrder,
          returnPaymentStatus: "unpaid",
        });

        throw paymentError;
      }
    } catch (error) {
      console.log("Ошибка оформления возврата:", error);
      alert(error.message || "Не удалось оформить возврат");
    } finally {
      setReturning(false);
    }
  };

  // Отправить отклонённый возврат на проверку администрации
  const sendReturnToAdmin = async () => {
    if (returning) return;

    try {
      setReturning(true);

      const response = await axios.get(`${ORDERS_URL}/${id}`);
      const freshOrder = response.data;

      if (freshOrder.orderstatus !== "Отклонено") {
        alert("Этот возврат уже обработан или отправлен администрации");
        setOrder(freshOrder);
        return;
      }

      if (freshOrder.returnPaymentStatus !== "paid") {
        alert("Не найден подтверждённый возврат денег");
        return;
      }

      const updatedStoreOrders = Array.isArray(freshOrder.storeOrders)
        ? freshOrder.storeOrders.map((item) => ({
            ...item,
            orderstatus: "Ожидание от администратора",
          }))
        : freshOrder.storeOrders;

      const updatedOrder = {
        ...freshOrder,
        orderstatus: "Ожидание от администратора",
        storeOrders: updatedStoreOrders,
      };

      const updateResponse = await axios.put(
        `${ORDERS_URL}/${id}`,
        updatedOrder,
      );

      setOrder(updateResponse.data);

      alert("Возврат отправлен на проверку администрации!");
    } catch (error) {
      console.log("Ошибка отправки администрации:", error);
      alert("Не удалось отправить возврат администрации");
    } finally {
      setReturning(false);
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

  const canReturn =
    ["Получено", "Завершен", "Завершено"].includes(order.orderstatus) &&
    !order.returnStatus &&
    order.returnPaymentStatus !== "paid";

  // Статусы возврата
  const returnStatuses = [
    "Ожидание возврата подтверждения продавец",
    "Отклонено",
    "Ожидание от администратора",
    "Ожидание пункта передачи",
    "Ожидание возврата",
    "Возврат завершён",
    "Возврат завершен",
  ];

  const isReturnFlow =
    order.returnPaymentStatus === "paid" ||
    returnStatuses.includes(order.orderstatus);

  const isReturnRejected = order.orderstatus === "Отклонено";

  const isWaitingAdmin = order.orderstatus === "Ожидание от администратора";

  const isWaitingPickup =
    order.orderstatus === "Ожидание пункта передачи" ||
    order.orderstatus === "Ожидание возврата";

  const isReturnCompleted =
    order.orderstatus === "Возврат завершён" ||
    order.orderstatus === "Возврат завершен" ||
    order.returnStatus === "Завершён" ||
    order.returnStatus === "Завершен";

  // Определяем этапы возврата
  const returnSteps = [
    {
      name: "Возврат оформлен",
      icon: "fa-solid fa-rotate-left",
      completed: true,
      active: false,
    },
    {
      name: "Решение продавца",
      icon: isReturnRejected ? "fa-solid fa-xmark" : "fa-solid fa-store",
      completed:
        isReturnRejected ||
        isWaitingAdmin ||
        isWaitingPickup ||
        isReturnCompleted,
      active: order.orderstatus === "Ожидание возврата подтверждения продавец",
      rejected: isReturnRejected || isWaitingAdmin,
    },
    {
      name: "Проверка администрации",
      icon: "fa-solid fa-shield-halved",
      completed: isWaitingPickup || isReturnCompleted,
      active: isWaitingAdmin,
      skipped: isWaitingPickup || isReturnCompleted,
    },
    {
      name: "Пункт передачи",
      icon: "fa-solid fa-box-open",
      completed: isReturnCompleted,
      active: isWaitingPickup,
    },
    {
      name: "Возврат завершён",
      icon: "fa-solid fa-circle-check",
      completed: isReturnCompleted,
      active: isReturnCompleted,
    },
  ];

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
              <img src={item.avatar} alt={item.name || item.title} />
            </div>

            <div className="order-status-product-info">
              <span className="order-status-label">ЗАКАЗ № {order.id}</span>
              <h2>{item.name || item.title}</h2>

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

        {/* СТАТУС ЗАКАЗА */}
        <div className="order-status-progress-card">
          <div className="order-status-title">
            <div>
              <span>{isReturnFlow ? "ВОЗВРАТ ТОВАРА" : "ДОСТАВКА"}</span>
              <h2>{isReturnFlow ? "Статус возврата" : "Статус заказа"}</h2>
            </div>

            <div className="order-status-current">{order.orderstatus}</div>
          </div>

          {/* КРУГОВАЯ ШКАЛА ВОЗВРАТА */}
          {isReturnFlow ? (
            <div className="order-status-timeline">
              {returnSteps.map((item, index) => {
                const completed = item.completed;
                const active = item.active;
                const rejected = item.rejected;

                return (
                  <div className="order-status-step" key={index}>
                    <div className="order-status-step-top">
                      <div
                        className={`order-status-icon ${
                          completed ? "completed" : ""
                        } ${active ? "active" : ""}`}
                        style={
                          rejected
                            ? {
                                borderColor: "#dc3545",
                                color: "#dc3545",
                                background: "#fff0f0",
                              }
                            : item.skipped
                              ? {
                                  opacity: 0.4,
                                }
                              : {}
                        }
                      >
                        <i
                          className={
                            completed && !rejected
                              ? "fa-solid fa-check"
                              : item.icon
                          }
                        ></i>
                      </div>

                      {index !== returnSteps.length - 1 && (
                        <div
                          className={`order-status-line ${
                            completed ? "line-active" : ""
                          }`}
                        ></div>
                      )}
                    </div>

                    <p
                      className={active || completed ? "step-text-active" : ""}
                    >
                      {item.name}
                      {rejected && index === 1 ? " · Отклонено" : ""}
                      {item.skipped ? " · Не требуется" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ОБЫЧНАЯ ШКАЛА ДОСТАВКИ */
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
                          className={
                            completed ? "fa-solid fa-check" : item.icon
                          }
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

                    <p
                      className={active || completed ? "step-text-active" : ""}
                    >
                      {item.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ПОЛУЧИТЬ ЗАКАЗ */}
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

        {/* ОФОРМИТЬ ВОЗВРАТ */}
        {canReturn && (
          <button
            className="order-status-receive-button"
            onClick={openReturnModal}
          >
            <i className="fa-solid fa-rotate-left"></i>
            Оформить возврат
          </button>
        )}

        {/* ЕСЛИ ПРОДАВЕЦ ОТКЛОНИЛ ВОЗВРАТ */}
        {isReturnRejected && order.returnPaymentStatus === "paid" && (
          <div className="order-status-information">
            <h2>
              <i
                className="fa-solid fa-circle-xmark"
                style={{ color: "#dc3545", marginRight: "8px" }}
              ></i>
              Продавец отклонил возврат
            </h2>

            <p>
              Вы можете отправить отказ продавца на дополнительную проверку
              администрации.
            </p>

            <button
              className="order-status-receive-button"
              onClick={sendReturnToAdmin}
              disabled={returning}
            >
              <i className="fa-solid fa-shield-halved"></i>
              {returning
                ? "Отправка..."
                : "Отправить на проверку администрации"}
            </button>
          </div>
        )}

        {/* АДМИНИСТРАЦИЯ ПРОВЕРЯЕТ */}
        {isWaitingAdmin && (
          <div className="order-status-received">
            <i className="fa-solid fa-shield-halved"></i>
            Возврат отправлен администрации. Ожидайте решения.
          </div>
        )}

        {/* ОЖИДАНИЕ ПУНКТА ПЕРЕДАЧИ */}
        {isWaitingPickup && (
          <div className="order-status-received">
            <i className="fa-solid fa-box-open"></i>
            Продавец принял возврат. Ожидается передача товара в пункт передачи.
            <br />
            Пункт передачи: {order.returnPickupName || "выбран"}.
            <br />
            Адрес: {order.returnPickupAddress || "—"}
          </div>
        )}

        {/* ВОЗВРАТ ЗАВЕРШЁН */}
        {isReturnCompleted && (
          <div className="order-status-received">
            <i className="fa-solid fa-circle-check"></i>
            Возврат завершён! Деньги уже возвращены на ваш баланс.
          </div>
        )}

        {/* ИНФОРМАЦИЯ О ВОЗВРАТЕ НА ЭТАПЕ ПРОВЕРКИ ПРОДАВЦОМ */}
        {order.orderstatus === "Ожидание возврата подтверждения продавец" && (
          <div className="order-status-received">
            <i className="fa-solid fa-clock"></i>
            Возврат оформлен. Деньги возвращены на ваш баланс. Ожидайте решения
            продавца.
          </div>
        )}

        {/* ИНФОРМАЦИЯ О ЗАКАЗЕ */}
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

          {order.returnPaymentStatus === "paid" && (
            <div className="order-status-info-row">
              <span>Статус возврата денег</span>
              <strong>Деньги возвращены</strong>
            </div>
          )}

          {order.returnPaymentStatus === "paid" && (
            <div className="order-status-info-row">
              <span>Сумма возврата</span>
              <strong>
                {Number(order.returnAmount || 0).toLocaleString("ru-RU")} сом
              </strong>
            </div>
          )}

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

      {/* МОДАЛЬНОЕ ОКНО ВОЗВРАТА */}
      {showReturnModal && (
        <div
          className="pickup-order-modal-overlay"
          onClick={() => !returning && setShowReturnModal(false)}
        >
          <div
            className="pickup-order-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pickup-order-modal-header">
              <div>
                <span>ВОЗВРАТ ТОВАРА</span>
                <h2>Выберите пункт передачи</h2>
              </div>

              <button
                className="pickup-order-modal-close"
                onClick={() => setShowReturnModal(false)}
                disabled={returning}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="pickup-order-modal-body">
              <p>
                После оформления возврата деньги сразу поступят на ваш баланс.
              </p>

              {loadingPickups ? (
                <p>Загрузка пунктов передачи...</p>
              ) : pickupPoints.length === 0 ? (
                <p>Пункты передачи пока не найдены.</p>
              ) : (
                <div>
                  {pickupPoints.map((pickup) => (
                    <label
                      key={pickup.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        marginBottom: "10px",
                        border: "1px solid #e5e5e5",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="returnPickup"
                        value={pickup.id}
                        checked={selectedPickupId === String(pickup.id)}
                        onChange={() => setSelectedPickupId(String(pickup.id))}
                      />

                      <span>
                        <strong>
                          {pickup.namecompany ||
                            pickup.firstname ||
                            `Пункт передачи №${pickup.id}`}
                        </strong>
                        <br />
                        {pickup.adres || "Адрес не указан"}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <button
                className="order-status-receive-button"
                onClick={createReturn}
                disabled={
                  returning || loadingPickups || pickupPoints.length === 0
                }
              >
                <i className="fa-solid fa-rotate-left"></i>
                {returning ? "Оформление возврата..." : "Подтвердить возврат"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orderstatus;
