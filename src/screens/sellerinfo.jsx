function Sellerinfo() {
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <p className="checkout-small-title">MarketGo / Данные об бизнесе</p>
          <div className="admin-signup-logo">
            MarketGo<span>.</span>
          </div>
          <h1>
            ДАННЫЕ
            <br />
            магазина
          </h1>

          <p className="checkout-description">
            Остался последний шаг! Заполните данные что-бы начать продвигать или
            продовать свой товар
          </p>

          <div className="checkout-decoration">ВАШ СТИЛЬ. ВАШ ВЫБОР.</div>
        </div>

        <div className="checkout-right">
          <div className="checkout-form">
            <p className="checkout-form-label">БИЗНЕС</p>

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
              <input type="number" placeholder="+996 XXX XXX XXX" />
            </div>

            <div className="checkout-field">
              <label>Адрес проживания</label>
              <input type="text" placeholder="Город, улица, дом, квартира" />
            </div>
            <br />

            <p className="checkout-form-description">
              Укажите данные об бизнесе.
            </p>
            <div className="checkout-field">
              <label>Имя бизнеса</label>
              <input type="name" placeholder="MARKET №1" />
            </div>

            <div className="checkout-field">
              <label>Категория бизнеса</label>
              <select name="" id="">
                <option value="">Выбирите категорию бизнеса</option>
              </select>
            </div>

            <div className="checkout-field">
              <label>Адрес нахождения бизнеса</label>
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

export default Sellerinfo;
