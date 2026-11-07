import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

function Admincourierrequests() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Иван Петров",
      phone: "+996 700 111 222",
      email: "ivan@mail.com",
      transport: "Мотоцикл",
      date: "06.11.2026",
    },
    {
      id: 2,
      name: "Андрей Смирнов",
      phone: "+996 555 444 333",
      email: "andrey@mail.com",
      transport: "Автомобиль",
      date: "05.11.2026",
    },
    {
      id: 3,
      name: "Бекзат Алиев",
      phone: "+996 777 888 999",
      email: "bekzat@mail.com",
      transport: "Велосипед",
      date: "04.11.2026",
    },
  ]);

  const [selected, setSelected] = useState(null);

  const removeRequest = (id) => {
    setRequests(requests.filter((item) => item.id !== id));
    setSelected(null);
  };

  const approveRequest = (id) => {
    alert("Заявка курьера подтверждена!");
    removeRequest(id);
  };

  return (
    <AdminLayout title="Заявки курьеров">
      <div className="admin-page-heading">
        <div>
          <h3>Заявки на работу курьером</h3>
          <p>Проверяйте данные и подтверждайте новых курьеров.</p>
        </div>
        <span className="admin-total">{requests.length} заявки</span>
      </div>

      <div className="admin-request-list">
        {requests.map((item) => (
          <div className="admin-request-card" key={item.id}>
            <div className="admin-request-icon courier">
              <i className="fa-solid fa-truck"></i>
            </div>

            <div className="admin-request-info">
              <h4>{item.name}</h4>
              <p>{item.transport}</p>
              <span>{item.date}</span>
            </div>

            <div className="admin-request-actions">
              <button
                className="admin-small-button"
                onClick={() => setSelected(item)}
              >
                Смотреть
              </button>

              <button
                className="admin-approve-button"
                onClick={() => approveRequest(item.id)}
              >
                <i className="fa-solid fa-check"></i> Подтвердить
              </button>

              <button
                className="admin-delete-button"
                onClick={() => removeRequest(item.id)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="admin-empty">Новых заявок пока нет</div>
        )}
      </div>

      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="admin-modal-close"
              onClick={() => setSelected(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3>Информация о курьере</h3>

            <div className="admin-detail-list">
              <p>
                <span>Имя:</span> {selected.name}
              </p>
              <p>
                <span>Телефон:</span> {selected.phone}
              </p>
              <p>
                <span>Email:</span> {selected.email}
              </p>
              <p>
                <span>Транспорт:</span> {selected.transport}
              </p>
              <p>
                <span>Дата заявки:</span> {selected.date}
              </p>
            </div>

            <div className="admin-modal-actions">
              <button
                className="admin-approve-button"
                onClick={() => approveRequest(selected.id)}
              >
                Подтвердить
              </button>
              <button
                className="admin-delete-button"
                onClick={() => removeRequest(selected.id)}
              >
                Удалить заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Admincourierrequests;
