function Sellerignin() {
  return (
    <div className="admin-signup-page">
      {/* 1 часть */}
      <div className="admin-signup-left">
        <div className="admin-signup-logo">
          MarketGo<span>.</span>
        </div>

        <div className="admin-signup-left-content">
          <p className="admin-signup-small">Продовец</p>

          <h1>
            Вход в
            <br />
            аккаунт
          </h1>

          <p className="admin-signup-left-text">
            Входите в аккаунт или <b>Зарегистрируйте свой бизнес</b>{" "}
            пользователя, чтобы продовать товары и оформлять заказы в одном
            месте.
          </p>
        </div>

        <div className="admin-signup-left-bottom">MarketGo — ВАШ МАГАЗИН</div>
      </div>

      {/* 2 часть */}
      <div className="admin-signup-right">
        <div className="admin-signup-form-container">
          <p className="admin-signup-form-small">ДОБРО ПОЖАЛОВАТЬ</p>

          <h2>Вход в аккаунт или Зарегистрируйте свой бизнес</h2>

          <p className="admin-signup-form-description">Через Google</p>

          <div className="admin-signup-form">
            <button className="admin-signup-button">
              <div className="google-logo" style={{ fontSize: "20px" }}>
                <span className="g-first">G</span>
                <span className="o-first">o</span>
                <span className="o-second">o</span>
                <span className="g-second">g</span>
                <span className="l-letter">l</span>
                <span className="e-letter">e</span>
              </div>
              <span>→</span>
            </button>
          </div>

          <p className="admin-signup-bottom-text">MarketGO</p>
        </div>
      </div>
    </div>
  );
}

export default Sellerignin;
