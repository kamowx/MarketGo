import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Orderstatus() {
  const navigate = useNavigate();

  // Временный статус заказа
  const [currentStatus] = useState(1);

  const order = {
    id: "MG-1025",
    name: "Классическая куртка",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    color: "Чёрный",
    size: "XL",
    quantity: 1,
    price: 3500,
    date: "06.11.2026",
    store: "Fashion Store",
  };

  const statuses = [
    {
      name: "Ожидание",
      icon: "fa-regular fa-clock",
    },
    {
      name: "Подтверждено",
      icon: "fa-solid fa-circle-check",
    },
    {
      name: "Едет",
      icon: "fa-solid fa-truck-fast",
    },
    {
      name: "Получено",
      icon: "fa-solid fa-box-open",
    },
  ];

  return (
    <div className="order-status-page">
      <div className="order-status-container">
        {/* Верхняя часть */}
        <div className="order-status-header">
          <button className="order-status-back" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <div>
            <h1>Мой заказ</h1>
            <p>Информация о вашей покупке</p>
          </div>
        </div>

        {/* Карточка товара */}
        <div className="order-status-product">
          <div className="order-status-image">
            <img src={order.image} alt={order.name} />
          </div>

          <div className="order-status-product-info">
            <span className="order-status-label">ЗАКАЗ № {order.id}</span>

            <h2>{order.name}</h2>

            <div className="order-status-details">
              <p>
                Цвет: <strong>{order.color}</strong>
              </p>

              <p>
                Размер: <strong>{order.size}</strong>
              </p>

              <p>
                Количество: <strong>{order.quantity} шт.</strong>
              </p>
            </div>

            <h3>{order.price.toLocaleString("ru-RU")} сом</h3>
          </div>
        </div>

        {/* Статус доставки */}
        <div className="order-status-progress-card">
          <div className="order-status-title">
            <div>
              <span>ДОСТАВКА</span>
              <h2>Статус заказа</h2>
            </div>

            <div className="order-status-current">
              {statuses[currentStatus - 1].name}
            </div>
          </div>

          <div className="order-status-timeline">
            {statuses.map((item, index) => {
              const completed = index < currentStatus;
              const active = index === currentStatus - 1;

              return (
                <div className="order-status-step" key={index}>
                  <div className="order-status-step-top">
                    <div
                      className={`order-status-icon ${
                        completed ? "completed" : ""
                      } ${active ? "active" : ""}`}
                    >
                      <i
                        className={completed ? "fa-solid fa-check" : item.icon}
                      ></i>
                    </div>

                    {index !== statuses.length - 1 && (
                      <div
                        className={`order-status-line ${
                          completed ? "line-active" : ""
                        }`}
                      ></div>
                    )}
                  </div>

                  <p className={active || completed ? "step-text-active" : ""}>
                    {item.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Информация о заказе */}
        <div className="order-status-information">
          <h2>Информация о заказе</h2>

          <div className="order-status-info-row">
            <span>Номер заказа</span>
            <strong>{order.id}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Дата заказа</span>
            <strong>{order.date}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Магазин</span>
            <strong>{order.store}</strong>
          </div>

          <div className="order-status-info-row">
            <span>Способ оплаты</span>
            <strong>Мой баланс</strong>
          </div>

          <div className="order-status-info-row total">
            <span>Итого</span>
            <strong>
              {(order.price * order.quantity).toLocaleString("ru-RU")} сом
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orderstatus;
