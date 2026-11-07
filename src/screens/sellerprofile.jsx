import { Link, useNavigate } from "react-router-dom";
import SellerBottomnav from "../components/SellerBottomnav";

function Sellerprofile() {
  const navigate = useNavigate();

  return (
    <div className="seller-profile-page">
      <SellerBottomnav />

      <div className="seller-profile-container">
        <div className="seller-profile-header">
          <div>
            <span>КАБИНЕТ ПРОДАВЦА</span>
            <h1>Мой профиль</h1>
            <p>Управляйте информацией своего аккаунта</p>
          </div>

          <div className="seller-profile-avatar">
            <i className="fa-solid fa-user"></i>
          </div>
        </div>

        <div className="seller-profile-card">
          <div className="seller-profile-card-title">
            <div>
              <h2>Личная информация</h2>
              <p>Данные вашего аккаунта продавца</p>
            </div>

            <i className="fa-solid fa-user-pen"></i>
          </div>

          <div className="seller-profile-info">
            <div className="seller-profile-info-item">
              <span>Имя</span>
              <h3>Имя продавца</h3>
            </div>

            <div className="seller-profile-info-item">
              <span>Фамилия</span>
              <h3>Фамилия продавца</h3>
            </div>

            <div className="seller-profile-info-item">
              <span>Название магазина</span>
              <h3>MarketGo Store</h3>
            </div>

            <div className="seller-profile-info-item">
              <span>Номер телефона</span>
              <h3>+996 000 000 000</h3>
            </div>

            <div className="seller-profile-info-item seller-profile-full">
              <span>Адрес магазина</span>
              <h3>Бишкек, Кыргызстан</h3>
            </div>
          </div>
        </div>

        <div className="seller-profile-actions">
          <Link to="/seller/products" className="seller-profile-action">
            <div className="seller-profile-action-icon">
              <i className="fa-solid fa-store"></i>
            </div>

            <div>
              <h3>Мой магазин</h3>
              <p>Информация о вашем магазине</p>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>

          <Link to="/seller/products" className="seller-profile-action">
            <div className="seller-profile-action-icon">
              <i className="fa-solid fa-box"></i>
            </div>

            <div>
              <h3>Мои товары</h3>
              <p>Управление товарами магазина</p>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>

          <button
            className="seller-profile-logout"
            onClick={() => {
              localStorage.removeItem("id");
              localStorage.removeItem("uid");
              localStorage.removeItem("accountType");
              navigate("/signin");
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sellerprofile;
