import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottomnav from "../components/bottomnav";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
function Stores() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");

  const stores = [
    {
      id: 1,
      name: "Fashion Store",
      category: "Одежда",
      rating: "4.9",
      address: "Бишкек, ул. Киевская 100",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700",
    },
    {
      id: 2,
      name: "Sneaker House",
      category: "Обувь",
      rating: "4.8",
      address: "Бишкек, ул. Манаса 45",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700",
    },
    {
      id: 3,
      name: "Style Accessories",
      category: "Аксессуары",
      rating: "4.7",
      address: "Бишкек, ул. Чуй 120",
      image:
        "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=700",
    },
    {
      id: 4,
      name: "Urban Wear",
      category: "Одежда",
      rating: "4.9",
      address: "Бишкек, ул. Токтогула 80",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700",
    },
  ];

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "Все" || store.category === category;
    return matchesSearch && matchesCategory;
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
          {filteredStores.map((store) => (
            <div className="store-card" key={store.id}>
              <div className="store-card-image">
                <img src={store.image} alt={store.name} />
              </div>

              <div className="store-card-info">
                <div className="store-card-name">
                  <h3>{store.name}</h3>
                  <span>
                    <i className="fa-solid fa-star"></i> {store.rating}
                  </span>
                </div>

                <p>{store.category}</p>

                <div className="store-card-address">
                  <i className="fa-solid fa-location-dot"></i>
                  {store.address}
                </div>

                <button onClick={() => navigate(`/storeinfo/${store.id}`)}>
                  Открыть магазин
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Bottomnav />
    </div>
  );
}

export default Stores;
