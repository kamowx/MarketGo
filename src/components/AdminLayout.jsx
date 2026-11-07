import { NavLink } from "react-router-dom";

function AdminLayout({ title, children }) {
  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <i className="fa-solid fa-bag-shopping"></i>
          <span>MarketGo</span>
        </div>

        <nav className="admin-menu">
          <NavLink to="/admin" end>
            <i className="fa-solid fa-house"></i>
            Главная
          </NavLink>

          <NavLink to="/adminsellerrequests">
            <i className="fa-solid fa-store"></i>
            Заявки продавцов
          </NavLink>

          <NavLink to="/admincourierrequests">
            <i className="fa-solid fa-truck"></i>
            Заявки курьеров
          </NavLink>

          <NavLink to="/adminsellers">
            <i className="fa-solid fa-shop"></i>
            Продавцы
          </NavLink>

          <NavLink to="/admincouriers">
            <i className="fa-solid fa-motorcycle"></i>
            Курьеры
          </NavLink>

          <NavLink to="/adminusers">
            <i className="fa-solid fa-users"></i>
            Пользователи
          </NavLink>

          <NavLink to="/adminstores">
            <i className="fa-solid fa-bag-shopping"></i>
            Магазины
          </NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <NavLink to="/signin">
            <i className="fa-solid fa-right-from-bracket"></i>
            Выйти
          </NavLink>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>{title}</h2>

          <div className="admin-profile">
            <i className="fa-solid fa-user"></i>
            <span>Администратор</span>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
