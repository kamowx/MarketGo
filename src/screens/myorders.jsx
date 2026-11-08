import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bottomnav from "../components/bottomnav";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const ORDERS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/orders";

function Myorders() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Все");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const getOrders = async () => {
      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      if (!uid) {
        navigate("/", { replace: true });
        setLoading(false);
        return;
      }

      try {
        const usersResponse = await axios.get(USERS_URL);

        const currentUser = usersResponse.data.find(
          (item) => String(item.uid) === uid,
        );

        if (!currentUser) {
          if (!cancelled) {
            alert("Пользователь не найден");
            localStorage.removeItem("uid");
            navigate("/signin", { replace: true });
          }
          return;
        }

        if (currentUser.role === "admin") {
          navigate("/admin", { replace: true });
          return;
        }

        if (cancelled) return;

        setUser(currentUser);

        const ordersResponse = await axios.get(ORDERS_URL);

        const userOrders = ordersResponse.data.filter(
          (item) => String(item.buyerId) === String(currentUser.id),
        );

        userOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        if (!cancelled) {
          setOrders(userOrders);
        }
      } catch (error) {
        console.error("Ошибка получения заказов:", error);
        alert("Не удалось загрузить заказы");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getOrders();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const getStatusName = (orderStatus) => {
    if (
      orderStatus === "Ожидание" ||
      orderStatus === "Новый" ||
      orderStatus === "Ожидание курьера"
    ) {
      return "Заказан";
    }

    if (
      orderStatus === "Подтверждено" ||
      orderStatus === "Подтвержденный" ||
      orderStatus === "Подтверждённый" ||
      orderStatus === "Курьер принял заказ" ||
      orderStatus === "Едет" ||
      orderStatus === "В пути"
    ) {
      return "Едет";
    }

    if (orderStatus === "Получено" || orderStatus === "Завершен") {
      return "Получено";
    }

    return orderStatus;
  };

  // Фильтрация заказов
  const filteredOrders = orders.filter((item) => {
    const matchesSearch = (item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      status === "Все" || getStatusName(item.orderstatus) === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="market-page">
      <main className="market-container orders-container">
        <div className="market-page-heading">
          <p>ВАШИ ПОКУПКИ</p>
          <h1>Мои заказы</h1>
          <span>Следите за своими покупками и доставкой</span>
        </div>

        <div className="market-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            placeholder="Найти заказ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="market-categories order-categories">
          {["Все", "Заказан", "Едет", "Получено"].map((item) => (
            <button
              key={item}
              className={status === item ? "active" : ""}
              onClick={() => setStatus(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="market-section-title">
          <div>
            <p>ИСТОРИЯ ПОКУПОК</p>
            <h2>Ваши товары</h2>
          </div>

          <span>{filteredOrders.length} заказа</span>
        </div>

        <div className="market-order-list">
          {loading ? (
            <div className="market-empty-orders">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p>Загрузка заказов...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="market-empty-orders">
              <i className="fa-solid fa-bag-shopping"></i>
              <h3>Заказов пока нет</h3>
              <p>Здесь будут отображаться ваши покупки</p>
            </div>
          ) : (
            filteredOrders.map((item) => (
              <div
                className="market-order-card"
                key={item.id}
                onClick={() => navigate(`/orderstatus/${item.id}`)}
              >
                <img src={item.avatar} alt={item.name} />

                <div className="market-order-info">
                  <p>Заказ №{item.id}</p>

                  <h3>{item.name}</h3>

                  <span>
                    Дата:{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("ru-RU")
                      : "Не указана"}
                  </span>

                  <strong>
                    {Number(item.price || 0).toLocaleString("ru-RU")} сом
                  </strong>
                </div>

                <div
                  className={`market-order-status status-${
                    getStatusName(item.orderstatus) === "Едет"
                      ? "moving"
                      : getStatusName(item.orderstatus) === "Получено"
                        ? "done"
                        : "new"
                  }`}
                >
                  {getStatusName(item.orderstatus)}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Bottomnav />
    </div>
  );
}

export default Myorders;
