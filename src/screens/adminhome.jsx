import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  const stats = [
    { title: "Все пользователи", number: "1 250", icon: "fa-users" },
    { title: "Покупатели", number: "980", icon: "fa-user" },
    { title: "Продавцы", number: "180", icon: "fa-store" },
    { title: "Курьеры", number: "90", icon: "fa-truck" },
  ];

  const applications = [
    { id: 1, name: "Александр Иванов", type: "Продавец", date: "06.11.2026" },
    { id: 2, name: "Мария Петрова", type: "Курьер", date: "06.11.2026" },
    { id: 3, name: "Дмитрий Смирнов", type: "Продавец", date: "05.11.2026" },
  ];

  return (
    <>
      <section className="admin-welcome">
        <div>
          <p>АДМИНИСТРИРОВАНИЕ MARKETGO</p>
          <h1>Добро пожаловать!</h1>
          <span>Управляйте пользователями, магазинами и заявками.</span>
        </div>
        <i className="fa-solid fa-chart-pie"></i>
      </section>

      <section className="admin-stats">
        {stats.map((item) => (
          <div className="admin-stat-card" key={item.title}>
            <div className="admin-stat-icon">
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <h3>{item.number}</h3>
            <b>{item.title}</b>
            <p>Общее количество аккаунтов</p>
          </div>
        ))}
      </section>

      <section className="admin-applications">
        <div className="admin-section-header">
          <div>
            <h3>Новые заявки</h3>
            <p>Последние заявки от продавцов и курьеров</p>
          </div>
          <button onClick={() => navigate("/admin/seller-requests")}>
            Все заявки <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Заявитель</th>
                <th>Тип заявки</th>
                <th>Дата</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item.id}>
                  <td>
                    <b>{item.name}</b>
                  </td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className="admin-status">Новая</span>
                  </td>
                  <td>
                    <button
                      className="admin-view-button"
                      onClick={() =>
                        navigate(
                          item.type === "Продавец"
                            ? "/admin/seller-requests"
                            : "/admin/courier-requests",
                        )
                      }
                    >
                      Смотреть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default AdminHome;
