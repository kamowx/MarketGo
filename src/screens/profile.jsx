import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="stylestore-profile">
      <div className="stylestore-profile-header">
        <Link to="/home" className="stylestore-profile-back">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>

        <h2>
          MarketGo<span>.</span>
        </h2>

        <div></div>
      </div>

      <div className="stylestore-profile-content">
        {/* Фото и заголовок */}
        <div className="stylestore-profile-user">
          <div className="stylestore-profile-avatar">
            <i className="fa-solid fa-user"></i>
          </div>

          <h1>Мой профиль</h1>

          <p>Управление вашим аккаунтом</p>
        </div>

        {/* Данные пользователя */}
        <div className="stylestore-profile-card">
          <div className="stylestore-profile-row">
            <div className="stylestore-profile-icon">
              <i className="fa-solid fa-user"></i>
            </div>

            <div>
              <span>Имя и фамилия</span>
              <strong>Ваше имя</strong>
            </div>
          </div>

          <div className="stylestore-profile-row">
            <div className="stylestore-profile-icon">
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div>
              <span>Email</span>
              <strong>Ваш email</strong>
            </div>
          </div>

          <div className="stylestore-profile-row">
            <div className="stylestore-profile-icon">
              <i className="fa-solid fa-phone"></i>
            </div>

            <div>
              <span>Номер телефона</span>
              <strong>Ваш номер</strong>
            </div>
          </div>
        </div>

        {/* Разделы профиля */}
        <div className="stylestore-profile-actions">
          <Link to="/mybalance" className="stylestore-profile-action">
            <div className="stylestore-action-icon">
              <i className="fa-solid fa-wallet"></i>
            </div>

            <div>
              <strong>Мой счёт</strong>
              <span>Ваш баланс и деньги</span>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>

          <Link to="/myorders" className="stylestore-profile-action">
            <div className="stylestore-action-icon">
              <i className="fa-solid fa-box"></i>
            </div>

            <div>
              <strong>Мои заказы</strong>
              <span>История и статус заказов</span>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>

          <Link to="/favorites" className="stylestore-profile-action">
            <div className="stylestore-action-icon">
              <i className="fa-solid fa-heart"></i>
            </div>

            <div>
              <strong>Избранное</strong>
              <span>Сохранённые товары</span>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>

          <Link to="/deliveryinfo" className="stylestore-profile-action">
            <div className="stylestore-action-icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>

            <div>
              <strong>Адрес доставки</strong>
              <span>Информация для доставки</span>
            </div>

            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>

        {/* Кнопки */}
        <div className="stylestore-profile-buttons">
          <Link to="/editprofile" className="stylestore-profile-edit">
            <i className="fa-solid fa-pen"></i>
            Редактировать профиль
          </Link>

          <button className="stylestore-profile-logout">
            <i className="fa-solid fa-right-from-bracket"></i>
            Выйти из аккаунта
          </button>
        </div>

        <p className="stylestore-profile-footer">MarketGo</p>
      </div>
    </div>
  );
}

export default Profile;
