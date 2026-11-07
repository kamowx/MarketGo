import { Link } from "react-router-dom";
import SellerBottomnav from "../components/SellerBottomnav";

function Sellercourierorders() {
  return (
    <div className="seller-courier-orders-page">
      <div className="seller-courier-orders-header">
        <div>
          <h2>Заказы с курьерами</h2>
          <p>Заказы, ожидающие передачи курьеру</p>
        </div>

        <span className="seller-courier-orders-count">2 заказа</span>
      </div>

      <div className="seller-courier-orders-list">
        <div className="seller-courier-order-card">
          <div className="seller-courier-order-top">
            <strong>Заказ № MG-1019</strong>
            <span>Курьер назначен</span>
          </div>

          <div className="seller-courier-order-product">
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

          <div className="seller-courier-order-info">
            <p>
              <span>Покупатель</span> Иван Иванов
            </p>
            <p>
              <span>Курьер</span> Руслан Абдиев
            </p>
            <p>
              <span>Телефон курьера</span> +996 700 111 222
            </p>
          </div>

          <Link
            to="/seller/courier-order/1019"
            className="seller-courier-order-button"
          >
            Подробнее
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="seller-courier-order-card">
          <div className="seller-courier-order-top">
            <strong>Заказ № MG-1018</strong>
            <span>Курьер назначен</span>
          </div>

          <div className="seller-courier-order-product">
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

          <div className="seller-courier-order-info">
            <p>
              <span>Покупатель</span> Алексей Петров
            </p>
            <p>
              <span>Курьер</span> Тимур Осмонов
            </p>
            <p>
              <span>Телефон курьера</span> +996 555 222 333
            </p>
          </div>

          <Link
            to="/seller/courier-order/1018"
            className="seller-courier-order-button"
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

export default Sellercourierorders;
