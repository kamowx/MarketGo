import { Link } from "react-router-dom";
import SellerBottomnav from "../components/SellerBottomnav";

function Sellerneworders() {
  return (
    <div className="seller-orders-page">
      <main className="seller-orders-main">
        <div className="seller-orders-header">
          <div>
            <span className="seller-orders-small">КАБИНЕТ ПРОДАВЦА</span>
            <h2>Новые заказы</h2>
            <p>Заказы, которые ожидают вашего подтверждения</p>
          </div>

          <span className="seller-orders-count">3 новых</span>
        </div>

        {/* НАВИГАЦИЯ ПО ЗАКАЗАМ */}

        <div className="seller-orders-navigation">
          <Link to="/sellerneworders" className="seller-orders-nav active">
            <i className="fa-solid fa-inbox"></i>
            <span>Новые заказы</span>
            <b>3</b>
          </Link>

          <Link to="/sellerconfirmedorders" className="seller-orders-nav">
            <i className="fa-solid fa-circle-check"></i>
            <span>Подтверждённые</span>
          </Link>

          <Link to="/sellercourierorders" className="seller-orders-nav">
            <i className="fa-solid fa-truck"></i>
            <span>Вызванный курьер</span>
          </Link>

          <Link to="/sellercourierorders" className="seller-orders-nav">
            <i className="fa-solid fa-box"></i>
            <span>Передать курьеру</span>
          </Link>

          <Link to="/sellercompletedorders" className="seller-orders-nav">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>История заказов</span>
          </Link>
        </div>

        {/* СПИСОК ЗАКАЗОВ */}

        <div className="seller-orders-list">
          <div className="seller-order-card">
            <div className="seller-order-top">
              <span>Заказ № MG-1025</span>
              <span className="seller-order-status">Новый</span>
            </div>

            <div className="seller-order-product">
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

            <div className="seller-order-info">
              <p>
                <span>Покупатель</span> Иван Иванов
              </p>
              <p>
                <span>Количество</span> 1 шт.
              </p>
              <p>
                <span>Дата заказа</span> 07.11.2026
              </p>
            </div>

            <Link to="/seller/new-order/1025" className="seller-order-button">
              Посмотреть заказ
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="seller-order-card">
            <div className="seller-order-top">
              <span>Заказ № MG-1024</span>
              <span className="seller-order-status">Новый</span>
            </div>

            <div className="seller-order-product">
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

            <div className="seller-order-info">
              <p>
                <span>Покупатель</span> Алексей Петров
              </p>
              <p>
                <span>Количество</span> 1 шт.
              </p>
              <p>
                <span>Дата заказа</span> 07.11.2026
              </p>
            </div>

            <Link to="/seller/new-order/1024" className="seller-order-button">
              Посмотреть заказ
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="seller-order-card">
            <div className="seller-order-top">
              <span>Заказ № MG-1023</span>
              <span className="seller-order-status">Новый</span>
            </div>

            <div className="seller-order-product">
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

            <div className="seller-order-info">
              <p>
                <span>Покупатель</span> Мария Смирнова
              </p>
              <p>
                <span>Количество</span> 1 шт.
              </p>
              <p>
                <span>Дата заказа</span> 06.11.2026
              </p>
            </div>

            <Link to="/seller/new-order/1023" className="seller-order-button">
              Посмотреть заказ
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </main>

      <SellerBottomnav />
    </div>
  );
}

export default Sellerneworders;
