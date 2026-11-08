import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Bottomnav from "../components/bottomnav";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const allUser = async () => {
      const uid = String(localStorage.getItem("uid") || "").replaceAll('"', "");

      if (!uid) {
        navigate("/signin", { replace: true });
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

        // Восстанавливаем ID записи MockAPI, если он отсутствует
        // localStorage.setItem("id", String(currentUser.id));

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

    allUser();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("uid");

    alert("Вы вышли из аккаунта");
    navigate("/", { replace: true });
  };

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
    <div className="stylestore-profile">
      <div className="stylestore-profile-header">
        <Link to="/home" className="stylestore-profile-back">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>

        <h2>
          MarketGo<span>.</span>
        </h2>

        <div></div>
      </div>

      <div className="stylestore-profile-content">
        {/* Фото и заголовок */}
        <div className="stylestore-profile-user">
          <div className="">
            {" "}
            {user ? (
              <img
                className="stylestore-profile-avatar"
                src={user.avatar}
                alt="Фото профиля"
              />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>

          <h1>Мой профиль</h1>

          <p>Управление вашим аккаунтом</p>
        </div>

        {/* Данные пользователя */}
        <div className="stylestore-profile-card">
          <div className="stylestore-profile-row">
            <div className="stylestore-profile-icon">
              <i className="fa-solid fa-user"></i>
            </div>

            <div>
              <span>Имя и фамилия</span>
              <strong>
                {loading
                  ? "Загрузка..."
                  : user
                    ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
                    : ""}
              </strong>
            </div>
          </div>

          <div className="stylestore-profile-row">
            <div className="stylestore-profile-icon">
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div>
              <span>Email</span>
              <strong>{loading ? "Загрузка..." : user?.email || ""}</strong>
            </div>
          </div>

          <div className="stylestore-profile-row">
            <div className="stylestore-profile-icon">
              <i className="fa-solid fa-phone"></i>
            </div>

            <div>
              <span>Номер телефона</span>
              <strong>
                {loading ? "Загрузка..." : user?.numberphone || ""}
              </strong>
            </div>
          </div>
        </div>

        {/* Разделы профиля */}
        <div className="stylestore-profile-actions">
          <Link to="/mybalance" className="stylestore-profile-action">
            <div className="stylestore-action-icon">
              <i className="fa-solid fa-wallet"></i>
            </div>

            <div>
              <strong>Мой счёт</strong>
              <span>Ваш баланс и деньги</span>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>

          <Link to="/myorders" className="stylestore-profile-action">
            <div className="stylestore-action-icon">
              <i className="fa-solid fa-box"></i>
            </div>

            <div>
              <strong>Мои заказы</strong>
              <span>История и статус заказов</span>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>

          <Link to="/favorites" className="stylestore-profile-action">
            <div className="stylestore-action-icon">
              <i className="fa-solid fa-heart"></i>
            </div>

            <div>
              <strong>Избранное</strong>
              <span>Сохранённые товары</span>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>

          <Link to="/editprofile" className="stylestore-profile-action">
            <div className="stylestore-action-icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>

            <div>
              <strong>Адрес доставки</strong>
              <span> {loading ? "Загрузка..." : user?.adres || ""}</span>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>

        {/* Кнопки */}
        <div className="stylestore-profile-buttons">
          <Link to="/editprofile" className="stylestore-profile-edit">
            <i className="fa-solid fa-pen"></i>
            Редактировать профиль
          </Link>

          <button className="stylestore-profile-logout" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            Выйти из аккаунта
          </button>
        </div>

        <p className="stylestore-profile-footer">MarketGo</p>
      </div>
      <Bottomnav />
    </div>
  );
}

export default Profile;
