import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottomnav from "../components/bottomnav";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const PRODUCTS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/products";
const FAVORITES_URL =
  "https://6ad252f566cd28aed82de514.mockapi.io/favoritesmerketgo";

function Favorites() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Получаем пользователя и его избранные товары
  useEffect(() => {
    let cancelled = false;

    const getFavorites = async () => {
      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      if (!uid) {
        navigate("/", { replace: true });
        setLoading(false);
        return;
      }

      try {
        const [usersResponse, favoritesResponse, productsResponse] =
          await Promise.all([
            axios.get(USERS_URL),
            axios.get(FAVORITES_URL),
            axios.get(PRODUCTS_URL),
          ]);

        const currentUser = usersResponse.data.find(
          (item) => String(item.uid) === uid,
        );

        if (!currentUser) {
          navigate("/", { replace: true });
          return;
        }

        if (currentUser.role === "admin") {
          navigate("/admin", { replace: true });
          return;
        }

        const userFavorites = favoritesResponse.data.filter(
          (item) => String(item.fuid) === uid,
        );

        // Находим товары по productId
        const favoriteProducts = userFavorites
          .map((favorite) => {
            const product = productsResponse.data.find(
              (item) => String(item.id) === String(favorite.productId),
            );

            if (!product) return null;

            return {
              ...favorite,
              product,
            };
          })
          .filter(Boolean);

        if (!cancelled) {
          setUser(currentUser);
          setFavorites(favoriteProducts);
        }
      } catch (error) {
        console.error("GET FAVORITES ERROR:", error);
        alert("Не удалось загрузить избранное");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getFavorites();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // Удалить из избранного
  const removeFavorite = async (favorite) => {
    try {
      await axios.delete(`${FAVORITES_URL}/${favorite.id}`);

      setFavorites((prev) =>
        prev.filter((item) => String(item.id) !== String(favorite.id)),
      );
    } catch (error) {
      console.error("DELETE FAVORITE ERROR:", error);
      alert("Не удалось удалить товар из избранного");
    }
  };

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

        {loading ? (
          <p>Загрузка избранного...</p>
        ) : (
          <div className="market-products">
            {favorites.map((item) => (
              <div className="market-product-card" key={item.id}>
                <div className="market-product-image">
                  <img src={item.product.avatar} alt={item.product.name} />

                  <button
                    className="market-favorite-button favorite-active"
                    onClick={() => removeFavorite(item)}
                  >
                    <i className="fa-solid fa-heart"></i>
                  </button>
                </div>

                <div className="market-product-info">
                  <p>{item.product.category}</p>
                  <h3>{item.product.name}</h3>

                  <strong>
                    {Number(item.product.price).toLocaleString("ru-RU")} сом
                  </strong>
                  <br />
                  <br />
                  <button
                    className="buttonfa"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    Посмотреть товар
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && favorites.length === 0 && (
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
