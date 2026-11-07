import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function Admin() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Всего пользователей",
      number: "1 250",
      icon: "fa-users",
      color: "black",
    },
    {
      title: "Обычные пользователи",
      number: "980",
      icon: "fa-user",
      color: "blue",
    },
    {
      title: "Продавцы",
      number: "180",
      icon: "fa-store",
      color: "green",
    },
    {
      title: "Курьеры",
      number: "90",
      icon: "fa-truck",
      color: "orange",
    },
  ];

  const applications = [
    {
      id: 1,
      name: "Магазин одежды Style",
      type: "Продавец",
      date: "06.11.2026",
    },
    {
      id: 2,
      name: "Иван Петров",
      type: "Курьер",
      date: "06.11.2026",
    },
    {
      id: 3,
      name: "Магазин Fashion",
      type: "Продавец",
      date: "05.11.2026",
    },
  ];

  return (
    <AdminLayout title="Главная">
      <div className="admin-welcome">
        <div>
          <h2>Добро пожаловать!</h2>
          <p>Здесь вы можете управлять платформой MarketGo.</p>
        </div>
        <i className="fa-solid fa-chart-line"></i>
      </div>

      <div className="admin-stats">
        {stats.map((item, index) => (
          <div className="admin-stat-card" key={index}>
            <div className={`admin-stat-icon ${item.color}`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>

            <div>
              <p>{item.title}</p>
              <h2>{item.number}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h3>Новые заявки</h3>
            <p>Последние заявки от продавцов и курьеров</p>
          </div>

          <button
            className="admin-text-button"
            onClick={() => navigate("/admin/seller-requests")}
          >
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
                <th>Действие</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>
                    <span className="admin-type">{item.type}</span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      className="admin-small-button"
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
      </div>
    </AdminLayout>
  );
}

export default Admin;
