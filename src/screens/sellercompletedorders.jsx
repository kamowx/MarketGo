import { Link } from "react-router-dom";
import SellerBottomnav from "../components/SellerBottomnav";

function Sellercompletedorders() {
  return (
    <div className="seller-completed-page">
      <div className="seller-completed-header">
        <div>
          <h2>Завершённые заказы</h2>
          <p>История заказов, которые уже доставлены покупателям</p>
        </div>

        <span className="seller-completed-count">3 заказа</span>
      </div>

      <div className="seller-completed-list">
        <div className="seller-completed-card">
          <div className="seller-completed-top">
            <strong>Заказ № MG-1015</strong>
            <span>Завершён</span>
          </div>

          <div className="seller-completed-product">
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

          <div className="seller-completed-info">
            <p>
              <span>Покупатель</span> Иван Иванов
            </p>
            <p>
              <span>Курьер</span> Руслан Абдиев
            </p>
            <p>
              <span>Дата доставки</span> 05.11.2026
            </p>
          </div>

          <Link
            to="/seller/completed-order/1015"
            className="seller-completed-button"
          >
            Подробнее
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="seller-completed-card">
          <div className="seller-completed-top">
            <strong>Заказ № MG-1014</strong>
            <span>Завершён</span>
          </div>

          <div className="seller-completed-product">
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

          <div className="seller-completed-info">
            <p>
              <span>Покупатель</span> Алексей Петров
            </p>
            <p>
              <span>Курьер</span> Тимур Осмонов
            </p>
            <p>
              <span>Дата доставки</span> 04.11.2026
            </p>
          </div>

          <Link
            to="/seller/completed-order/1014"
            className="seller-completed-button"
          >
            Подробнее
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="seller-completed-card">
          <div className="seller-completed-top">
            <strong>Заказ № MG-1013</strong>
            <span>Завершён</span>
          </div>

          <div className="seller-completed-product">
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

          <div className="seller-completed-info">
            <p>
              <span>Покупатель</span> Мария Смирнова
            </p>
            <p>
              <span>Курьер</span> Руслан Абдиев
            </p>
            <p>
              <span>Дата доставки</span> 03.11.2026
            </p>
          </div>

          <Link
            to="/seller/completed-order/1013"
            className="seller-completed-button"
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

export default Sellercompletedorders;
