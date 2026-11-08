import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bottomnav from "../components/bottomnav";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const BUSINESS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/buisness";

function Stores() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");

  const [stores, setStores] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Получаем пользователя и все магазины
  useEffect(() => {
    let cancelled = false;

    const getData = async () => {
      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      if (!uid) {
        navigate("/", { replace: true });
        setLoading(false);
        return;
      }

      try {
        const [usersResponse, businessResponse] = await Promise.all([
          axios.get(USERS_URL),
          axios.get(BUSINESS_URL),
        ]);

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

        setStores(businessResponse.data);
      } catch (error) {
        console.error("Ошибка загрузки магазинов:", error);

        if (error.response?.status === 429) {
          alert("Слишком много запросов. Подожди немного и попробуй снова.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getData();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // Поиск и фильтрация магазинов
  const filteredStores = stores.filter((store) => {
    const matchesSearch = (store.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "Все" || store.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="stores-page">
      <main className="stores-container">
        <button className="stores-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Назад
        </button>

        <div className="stores-heading">
          <p>MARKETGO MARKETPLACE</p>
          <h1>Все магазины</h1>
          <span>Откройте для себя магазины и их коллекции</span>
        </div>

        <div className="stores-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            placeholder="Поиск магазинов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="stores-categories">
          {["Все", "Одежда", "Обувь", "Аксессуары"].map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="stores-title">
          <h2>Популярные магазины</h2>
          <span>{filteredStores.length} магазинов</span>
        </div>

        <div className="stores-grid">
          {loading ? (
            <p>Загрузка магазинов...</p>
          ) : filteredStores.length === 0 ? (
            <div className="stores-empty">
              <i className="fa-solid fa-store"></i>
              <h3>Магазины не найдены</h3>
              <p>Попробуйте изменить поиск или категорию</p>
            </div>
          ) : (
            filteredStores.map((store) => (
              <div className="store-card" key={store.id}>
                <div className="store-card-image">
                  <img
                    src={
                      store.avatar || "https://placehold.co/700x400?text=Store"
                    }
                    alt={store.name}
                  />
                </div>

                <div className="store-card-info">
                  <div className="store-card-name">
                    <h3>{store.name}</h3>
                  </div>

                  <p>{store.category}</p>

                  <div className="store-card-address">
                    <i className="fa-solid fa-location-dot"></i>
                    {store.adrescompany || "Адрес не указан"}
                  </div>

                  <button onClick={() => navigate(`/storeinfo/${store.id}`)}>
                    Открыть магазин
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
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

export default Stores;
