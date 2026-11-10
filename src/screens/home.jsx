import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bottomnav from "../components/bottomnav";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const PRODUCTS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/products";
const FAVORITES_URL =
  "https://6ad252f566cd28aed82de514.mockapi.io/favoritesmerketgo";

function Home() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("Все");
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Получаем товары
  const getProducts = async () => {
    try {
      const response = await axios.get(PRODUCTS_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("GET PRODUCTS ERROR:", error);
      alert("Не удалось загрузить товары");
    } finally {
      setLoading(false);
    }
  };

  // Получаем избранное пользователя
  const getFavorites = async (uid) => {
    try {
      const response = await axios.get(FAVORITES_URL);

      const userFavorites = response.data.filter(
        (item) => String(item.fuid) === String(uid),
      );

      setFavorites(userFavorites);
    } catch (error) {
      console.error("GET FAVORITES ERROR:", error);
    }
  };

  // Добавить или удалить избранное
  const toggleFavorite = async (product) => {
    const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

    if (!uid) {
      navigate("/");
      return;
    }

    const existingFavorite = favorites.find(
      (item) => String(item.productId) === String(product.id),
    );

    try {
      if (existingFavorite) {
        await axios.delete(`${FAVORITES_URL}/${existingFavorite.id}`);

        setFavorites((prev) =>
          prev.filter((item) => String(item.productId) !== String(product.id)),
        );
      } else {
        const response = await axios.post(FAVORITES_URL, {
          createdAt: new Date().toISOString(),
          fuid: uid,
          productId: String(product.id),
        });

        setFavorites((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("TOGGLE FAVORITE ERROR:", error);
      alert("Не удалось изменить избранное");
    }
  };

  // Фильтрация товаров
  const filteredProducts = products.filter((item) => {
    const matchesCategory = category === "Все" || item.category === category;

    const matchesSearch = (item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Ищем пользователя по Firebase uid
  const getUser = async () => {
    const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

    if (!uid) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(USERS_URL);

      const currentUser = response.data.find(
        (item) => String(item.uid) === uid,
      );

      if (!currentUser) {
        console.error("Пользователь с таким uid не найден в MockAPI");
        return;
      }

      setUser(currentUser);

      if (currentUser.role === "admin") {
        navigate("/");
        return;
      }

      getFavorites(uid);
    } catch (error) {
      console.error("GET USER ERROR:", error);
    }
  };

  useEffect(() => {
    getUser();
    getProducts();
  }, []);

  return (
    <div className="market-page">
      <header className="market-header">
        <Link to="/home" className="market-logo">
          MarketGo<span>.</span>
        </Link>

        <Link to="/profile" className="market-profile">
          {user ? (
            user.avatar ? (
              <img
                className="market-profile"
                src={user.avatar}
                alt="Фото профиля"
              />
            ) : (
              <i className="fa-solid fa-user"></i>
            )
          ) : (
            <i className="fa-solid fa-user"></i>
          )}
        </Link>
      </header>

      <main className="market-container">
        <div className="market-welcome">
          <div>
            <p>ДОБРО ПОЖАЛОВАТЬ В MARKETGO</p>
            <h1>Найди свой стиль.</h1>
          </div>
        </div>

        <div className="market-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="market-categories">
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

        <div className="market-section-title">
          <div>
            <p>НАША КОЛЛЕКЦИЯ</p>
            <h2>Популярные товары</h2>
          </div>

          <span>{filteredProducts.length} товаров</span>
        </div>

        {loading ? (
          <p>Загрузка товаров...</p>
        ) : (
          <div className="market-products">
            {filteredProducts.map((item) => {
              const isFavorite = favorites.some(
                (favorite) => String(favorite.productId) === String(item.id),
              );

              return (
                <div className="market-product-card" key={item.id}>
                  <div className="market-product-image">
                    <img src={item.avatar} alt={item.name} />

                    <button
                      className={`market-favorite-button ${
                        isFavorite ? "favorite-active" : ""
                      }`}
                      onClick={() => toggleFavorite(item)}
                    >
                      <i
                        className={
                          isFavorite
                            ? "fa-solid fa-heart"
                            : "fa-regular fa-heart"
                        }
                      ></i>
                    </button>
                  </div>

                  <div className="market-product-info storeinfo-product-text">
                    <p>{item.category}</p>
                    <h3>{item.name}</h3>

                    <h3>{item.weight} кг</h3>

                    <strong>
                      {Number(item.price).toLocaleString("ru-RU")} сом
                    </strong>

                    <button onClick={() => navigate(`/product/${item.id}`)}>
                      Посмотреть товар
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="seller-empty">
            <i className="fa-solid fa-box-open"></i>
            <h3>Товары не найдены</h3>
            <p>Попробуйте выбрать другую категорию или изменить поиск</p>
          </div>
        )}
      </main>

      <Bottomnav />
    </div>
  );
}

export default Home;
