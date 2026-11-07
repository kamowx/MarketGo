import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Bottomnav from "../components/bottomnav";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";

function Home() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Все");
  const [user, setUser] = useState(null);

  const products = [
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
    {
      id: 5,
      name: "Стильные часы",
      price: "4 200 сом",
      category: "Аксессуары",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    },
    {
      id: 6,
      name: "Повседневные кроссовки",
      price: "3 100 сом",
      category: "Обувь",
      image:
        "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=600",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((item) => {
    const matchesCategory = category === "Все" || item.category === category;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /////////////////////////
  ////////////////////////
  // Ищем пользователя по Firebase uid
  const getUser = async () => {
    const uid = localStorage.getItem("uid");

    if (!uid) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(USERS_URL);

      console.log("GET USERS:", response.data);

      const currentUser = response.data.find(
        (item) => String(item.uid) === String(uid).replaceAll('"', ""),
      );

      if (!currentUser) {
        console.error("Пользователь с таким uid не найден в MockAPI");

        return;
      }

      console.log("CURRENT USER:", currentUser);

      console.log("CURRENT USER:", currentUser);

      setUser(currentUser);

      if (currentUser.role === "admin") {
        navigate("/admin");
        return;
      }
    } catch (error) {
      console.error("GET USER ERROR:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="market-page">
      <header className="market-header">
        <Link to="/home" className="market-logo">
          MarketGo<span>.</span>
        </Link>
        <Link to="/profile" className="market-profile">
          {user ? (
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

        <div className="market-products">
          {filteredProducts.map((item) => (
            <div className="market-product-card" key={item.id}>
              <div className="market-product-image">
                <img src={item.image} alt={item.name} />
                <button className="market-favorite-button">
                  <i className="fa-regular fa-heart"></i>
                </button>
              </div>
              <div className="market-product-info  storeinfo-product-text">
                <p>{item.category}</p>
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
                <button onClick={() => navigate(`/product/${item.id}`)}>
                  Посмотреть товар
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

export default Home;
