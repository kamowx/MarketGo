import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SellerBottomnav from "../components/SellerBottomnav";

function Sellerneworderdetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState("Новый");

  const confirmOrder = () => {
    setStatus("Подтверждён");
    alert("Заказ подтверждён!");
    navigate("/seller/confirmed-orders");
  };

  return (
    <div className="seller-order-details-page">
      <div className="seller-order-details-header">
        <Link to="/seller/new-orders" className="seller-details-back">
          <i className="fa-solid fa-arrow-left"></i>
          Назад к заказам
        </Link>

        <span className="seller-details-number">Заказ № MG-{id || "1025"}</span>
      </div>

      <div className="seller-details-content">
        <div className="seller-details-main">
          <div className="seller-details-card">
            <div className="seller-details-title">
              <h2>Информация о заказе</h2>
              <span className="seller-details-new">{status}</span>
            </div>

            <div className="seller-details-product">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
                alt="Футболка"
              />

              <div>
                <h3>Базовая футболка</h3>
                <p>Категория: Мужская одежда</p>
                <p>Размер: M</p>
                <p>Цвет: Чёрный</p>
                <p>Количество: 1 шт.</p>
                <strong>1 200 сом</strong>
              </div>
            </div>

            <div className="seller-details-divider"></div>

            <h3 className="seller-details-subtitle">Данные покупателя</h3>

            <div className="seller-details-info">
              <div>
                <span>Имя и фамилия</span>
                <strong>Иван Иванов</strong>
              </div>

              <div>
                <span>Номер телефона</span>
                <strong>+996 700 123 456</strong>
              </div>

              <div>
                <span>Адрес доставки</span>
                <strong>г. Бишкек, ул. Киевская, 100</strong>
              </div>

              <div>
                <span>Место на карте</span>
                <strong>Бишкек, Кыргызстан</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="seller-details-sidebar">
          <div className="seller-details-card">
            <h3 className="seller-details-subtitle">Оплата заказа</h3>

            <div className="seller-details-total">
              <span>Стоимость товара</span>
              <strong>1 200 сом</strong>
            </div>

            <div className="seller-details-total">
              <span>Количество</span>
              <strong>1 шт.</strong>
            </div>

            <div className="seller-details-divider"></div>

            <div className="seller-details-total seller-details-final">
              <span>Итого</span>
              <strong>1 200 сом</strong>
            </div>

            <button
              className="seller-details-confirm"
              onClick={confirmOrder}
              disabled={status !== "Новый"}
            >
              <i className="fa-solid fa-check"></i>
              Подтвердить заказ
            </button>

            <Link to="/seller/new-orders" className="seller-details-cancel">
              Вернуться назад
            </Link>
          </div>
        </div>
      </div>

      <SellerBottomnav />
    </div>
  );
}

export default Sellerneworderdetails;
