import { Link } from "react-router-dom";

function Sellercheck() {
  return (
    <div className="seller-check-page">
      <div className="seller-check-header">
        <Link to="/" className="seller-check-logo">
          <i className="fa-solid fa-bag-shopping"></i>
          MarketGo
        </Link>

        <Link to="/signin" className="seller-check-exit">
          <i className="fa-solid fa-right-from-bracket"></i>
          Выйти
        </Link>
      </div>

      <main className="seller-check-main">
        <div className="seller-check-top">
          <span className="seller-check-label">АККАУНТ ПРОДАВЦА</span>

          <h1>Проверка аккаунта</h1>

          <p>
            Ваша заявка на регистрацию магазина получена. Администрация MarketGo
            проверит информацию и сообщит результат.
          </p>
        </div>

        <div className="seller-check-card">
          <div className="seller-check-card-header">
            <div>
              <span>ИНФОРМАЦИЯ О ПРОДАВЦЕ</span>
              <h2>Данные аккаунта</h2>
            </div>

            <span className="seller-check-number">№ 0001</span>
          </div>

          <div className="seller-check-information">
            <div className="seller-check-information-item">
              <div className="seller-check-information-icon">
                <i className="fa-solid fa-user"></i>
              </div>

              <div>
                <span>Имя</span>
                <h3>Имя продавца</h3>
              </div>
            </div>

            <div className="seller-check-information-item">
              <div className="seller-check-information-icon">
                <i className="fa-solid fa-user"></i>
              </div>

              <div>
                <span>Фамилия</span>
                <h3>Фамилия продавца</h3>
              </div>
            </div>

            <div className="seller-check-information-item">
              <div className="seller-check-information-icon">
                <i className="fa-solid fa-store"></i>
              </div>

              <div>
                <span>Название магазина</span>
                <h3>Название вашего магазина</h3>
              </div>
            </div>

            <div className="seller-check-information-item">
              <div className="seller-check-information-icon">
                <i className="fa-solid fa-phone"></i>
              </div>

              <div>
                <span>Номер телефона</span>
                <h3>+996 000 000 000</h3>
              </div>
            </div>

            <div className="seller-check-information-item seller-check-address">
              <div className="seller-check-information-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>

              <div>
                <span>Адрес магазина</span>
                <h3>Адрес вашего магазина</h3>
              </div>
            </div>
          </div>

          <div className="seller-check-status">
            <div className="seller-check-status-top">
              <div className="seller-check-status-icon">
                <i className="fa-solid fa-clock"></i>
              </div>

              <div>
                <span>ТЕКУЩИЙ СТАТУС</span>
                <h3>На проверке</h3>
              </div>

              <span className="seller-check-status-badge">Ожидание</span>
            </div>

            <p>
              Ваша заявка находится на рассмотрении. После проверки
              администрацией статус аккаунта будет обновлён.
            </p>
          </div>

          <div className="seller-check-footer">
            <i className="fa-solid fa-circle-info"></i>
            <p>MarketGo.</p>
          </div>
        </div>

        <div className="seller-check-bottom">
          <span>MARKETGO</span>
          <span>Платформа для продавцов</span>
        </div>
      </main>
    </div>
  );
}

export default Sellercheck;
