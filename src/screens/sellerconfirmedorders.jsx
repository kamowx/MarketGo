import { Link } from "react-router-dom";
import SellerBottomnav from "../components/SellerBottomnav";

function Sellerconfirmedorders() {
  return (
    <div className="seller-confirmed-page">
      <div className="seller-confirmed-header">
        <div>
          <h2>Подтверждённые заказы</h2>
          <p>Заказы, которые вы подтвердили и готовите к отправке</p>
        </div>

        <span className="seller-confirmed-count">3 заказа</span>
      </div>

      <div className="seller-confirmed-list">
        <div className="seller-confirmed-card">
          <div className="seller-confirmed-top">
            <strong>Заказ № MG-1022</strong>
            <span>Подтверждён</span>
          </div>

          <div className="seller-confirmed-product">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
              alt="Футболка"
            />

            <div>
              <h4>Базовая футболка</h4>
              <p>Размер: M · Цвет: Чёрный</p>
              <strong>1 200 сом</strong>
            </div>
          </div>

          <div className="seller-confirmed-info">
            <p>
              <span>Покупатель</span> Иван Иванов
            </p>
            <p>
              <span>Количество</span> 1 шт.
            </p>
            <p>
              <span>Дата заказа</span> 06.11.2026
            </p>
          </div>

          <Link
            to="/seller/confirmed-order/1022"
            className="seller-confirmed-button"
          >
            Подробнее
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="seller-confirmed-card">
          <div className="seller-confirmed-top">
            <strong>Заказ № MG-1021</strong>
            <span>Подтверждён</span>
          </div>

          <div className="seller-confirmed-product">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300"
              alt="Кроссовки"
            />

            <div>
              <h4>Спортивные кроссовки</h4>
              <p>Размер: 42 · Цвет: Красный</p>
              <strong>3 500 сом</strong>
            </div>
          </div>

          <div className="seller-confirmed-info">
            <p>
              <span>Покупатель</span> Алексей Петров
            </p>
            <p>
              <span>Количество</span> 1 шт.
            </p>
            <p>
              <span>Дата заказа</span> 06.11.2026
            </p>
          </div>

          <Link
            to="/seller/confirmed-order/1021"
            className="seller-confirmed-button"
          >
            Подробнее
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="seller-confirmed-card">
          <div className="seller-confirmed-top">
            <strong>Заказ № MG-1020</strong>
            <span>Подтверждён</span>
          </div>

          <div className="seller-confirmed-product">
            <img
              src="https://images.unsplash.com/photo-1544441893-675973e31985?w=300"
              alt="Куртка"
            />

            <div>
              <h4>Женская куртка</h4>
              <p>Размер: L · Цвет: Бежевый</p>
              <strong>4 800 сом</strong>
            </div>
          </div>

          <div className="seller-confirmed-info">
            <p>
              <span>Покупатель</span> Мария Смирнова
            </p>
            <p>
              <span>Количество</span> 1 шт.
            </p>
            <p>
              <span>Дата заказа</span> 05.11.2026
            </p>
          </div>

          <Link
            to="/seller/confirmed-order/1020"
            className="seller-confirmed-button"
          >
            Подробнее
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>

      <SellerBottomnav />
    </div>
  );
}

export default Sellerconfirmedorders;
