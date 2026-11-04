function Adminsignup() {
  return (
    <div className="admin-signup-page">
      {/* 1 часть */}
      <div className="admin-signup-left">
        <div className="admin-signup-logo">
          MarketGo<span>.</span>
        </div>

        <div className="admin-signup-left-content">
          <p className="admin-signup-small">ПАНЕЛЬ УПРАВЛЕНИЯ</p>

          <h1>
            Регистрация
            <br />
            администратора
          </h1>

          <p className="admin-signup-left-text">
            Создайте аккаунт администратора, чтобы управлять магазином, товарами
            и заказами в одном месте.
          </p>
        </div>

        <div className="admin-signup-left-bottom">MarketGo — ВАШ МАГАЗИН</div>
      </div>

      {/* 2 часть */}
      <div className="admin-signup-right">
        <div className="admin-signup-form-container">
          <p className="admin-signup-form-small">ДОБРО ПОЖАЛОВАТЬ</p>

          <h2>Создать аккаунт</h2>

          <p className="admin-signup-form-description">
            Заполните данные для регистрации администратора.
          </p>

          <div className="admin-signup-form">
            <div className="admin-signup-field">
              <label>Email</label>

              <input type="email" placeholder="Введите ваш email" />
            </div>

            <div className="admin-signup-field">
              <label>Пароль</label>

              <input type="password" placeholder="Введите пароль" />
            </div>

            <button className="admin-signup-button">
              Зарегистрироваться
              <span>→</span>
            </button>
          </div>

          <p className="admin-signup-bottom-text">MarketGO</p>
        </div>
      </div>
    </div>
  );
}

export default Adminsignup;
