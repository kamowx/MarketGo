import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottomnav from "../components/bottomnav";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";

function Favorites() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const favorites = [
    {
      id: 1,
      name: "Классическая куртка",
      price: "3 500 сом",
      category: "Одежда",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    },
    {
      id: 2,
      name: "Белые кроссовки",
      price: "2 800 сом",
      category: "Обувь",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    },
    {
      id: 3,
      name: "Чёрная сумка",
      price: "1 900 сом",
      category: "Аксессуары",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
    },
    {
      id: 4,
      name: "Мужская футболка",
      price: "1 200 сом",
      category: "Одежда",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    },
  ];

  // Ищем пользователя по Firebase uid
  useEffect(() => {
    let cancelled = false;

    const getUser = async () => {
      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      if (!uid) {
        navigate("/signin", { replace: true });
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

  return (
    <div className="market-page">
      <header className="market-header">
        <Link to="/home" className="market-logo">
          MarketGo<span>.</span>
        </Link>

        <Link to="/profile" className="market-profile">
          {user && user.avatar ? (
            <img
              className="market-profile"
              src={user.avatar}
              alt="Фото профиля"
            />
          ) : (
            <i className="fa-solid fa-user"></i>
          )}
        </Link>
      </header>

      <main className="market-container">
        <div className="market-page-heading">
          <p>ВАШ ВЫБОР</p>
          <h1>
            Избранное <i className="fa-solid fa-heart"></i>
          </h1>
          <span>Товары, которые вам понравились</span>
        </div>

        <div className="market-section-title">
          <div>
            <p>СОХРАНЁННЫЕ ТОВАРЫ</p>
            <h2>Ваш список</h2>
          </div>

          <span>{favorites.length} товаров</span>
        </div>

        <div className="market-products">
          {favorites.map((item) => (
            <div className="market-product-card" key={item.id}>
              <div className="market-product-image">
                <img src={item.image} alt={item.name} />

                <button className="market-favorite-button favorite-active">
                  <i className="fa-solid fa-heart"></i>
                </button>
              </div>

              <div className="market-product-info">
                <p>{item.category}</p>
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
              </div>
            </div>
          ))}
        </div>

        {favorites.length === 0 && (
          <div className="market-empty">
            <i className="fa-regular fa-heart"></i>
            <h3>Избранное пока пустое</h3>
            <p>Добавляйте понравившиеся товары в избранное.</p>

            <Link to="/home">Перейти к покупкам</Link>
          </div>
        )}
      </main>

      <Bottomnav />
    </div>
  );
}

export default Favorites;
