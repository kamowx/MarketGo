function Deliveryinfo() {
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <p className="checkout-small-title">MarketGo / Данные об курьере</p>
          <div className="admin-signup-logo">
            MarketGo<span>.</span>
          </div>
          <h1>
            ДАННЫЕ
            <br />
            заказа
          </h1>

          <p className="checkout-description">
            Остался последний шаг! Заполните данные что-бы начать работу
          </p>

          <div className="checkout-decoration">ВАШ СТИЛЬ. ВАШ ВЫБОР.</div>
        </div>

        <div className="checkout-right">
          <div className="checkout-form">
            <p className="checkout-form-label">ДАННЫЕ</p>

            <h2>ДАННЫЕ ДЛЯ РАБОТУ</h2>

            <p className="checkout-form-description">
              Укажите свои контактные данные.
            </p>

            <div className="checkout-name-row">
              <div className="checkout-field">
                <label>Имя</label>
                <input type="text" placeholder="Ваше имя" />
              </div>

              <div className="checkout-field">
                <label>Фамилия</label>
                <input type="text" placeholder="Ваша фамилия" />
              </div>
            </div>

            <div className="checkout-field">
              <label>Номер телефона</label>
              <input type="tel" placeholder="+996 XXX XXX XXX" />
            </div>

            <div className="checkout-field">
              <label>Адрес проживания</label>
              <input type="text" placeholder="Город, улица, дом, квартира" />
            </div>

            <button className="checkout-button">
              Отправить на проверку <span>→</span>
            </button>
          </div>

          <p className="checkout-footer">STYLESTORE © 2026</p>
        </div>
      </div>
    </div>
  );
}

export default Deliveryinfo;
