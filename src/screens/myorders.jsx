import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottomnav from "../components/bottomnav";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";

function Myorders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Все");

  const orders = [
    {
      id: 1,
      name: "Классическая куртка",
      price: "3 500 сом",
      date: "05.11.2026",
      status: "Едет",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    },
    {
      id: 2,
      name: "Белые кроссовки",
      price: "2 800 сом",
      date: "03.11.2026",
      status: "Получено",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    },
    {
      id: 3,
      name: "Чёрная сумка",
      price: "1 900 сом",
      date: "06.11.2026",
      status: "Заказан",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
    },
  ];

  const filteredOrders = orders.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status === "Все" || item.status === status;
    return matchesSearch && matchesStatus;
  });

  /////////////////////////////
  ////////////////////////////
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Ищем пользователя по Firebase uid
  useEffect(() => {
    let cancelled = false;

    const getUser = async () => {
      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      if (!uid) {
        navigate("/", { replace: true });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(USERS_URL);

        const currentUser = response.data.find(
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

        if (cancelled) return;

        console.log("CURRENT USER:", currentUser);

        if (currentUser.role === "admin") {
          navigate("/admin", { replace: true });
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error("Ошибка получения пользователя:", error);

        if (error.response?.status === 429) {
          alert("Слишком много запросов. Подожди немного и попробуй снова.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getUser();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /////////////////////////////
  ////////////////////////////
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
          {filteredOrders.map((item) => (
            <div
              className="market-order-card"
              key={item.id}
              onClick={() => navigate(`/orderstatus/${item.id}`)}
            >
              <img src={item.image} alt={item.name} />
              <div className="market-order-info">
                <p>Заказ №{item.id}</p>
                <h3>{item.name}</h3>
                <span>Дата: {item.date}</span>
                <strong>{item.price}</strong>
              </div>
              <div
                className={`market-order-status status-${item.status === "Едет" ? "moving" : item.status === "Получено" ? "done" : "new"}`}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Bottomnav />
    </div>
  );
}

export default Myorders;
