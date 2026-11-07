import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

function Adminsellerrequests() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Александр Иванов",
      business: "Style одежда",
      phone: "+996 700 123 456",
      email: "style@mail.com",
      date: "06.11.2026",
    },
    {
      id: 2,
      name: "Мария Петрова",
      business: "Fashion Store",
      phone: "+996 555 222 111",
      email: "fashion@mail.com",
      date: "05.11.2026",
    },
    {
      id: 3,
      name: "Дмитрий Сидоров",
      business: "Shoes Market",
      phone: "+996 777 333 222",
      email: "shoes@mail.com",
      date: "04.11.2026",
    },
  ]);

  const [selected, setSelected] = useState(null);

  const removeRequest = (id) => {
    setRequests(requests.filter((item) => item.id !== id));
    setSelected(null);
  };

  const approveRequest = (id) => {
    alert("Заявка продавца подтверждена!");
    removeRequest(id);
  };

  return (
    <AdminLayout title="Заявки продавцов">
      <div className="admin-page-heading">
        <div>
          <h3>Заявки на регистрацию бизнеса</h3>
          <p>Проверяйте информацию и подтверждайте новых продавцов.</p>
        </div>
        <span className="admin-total">{requests.length} заявки</span>
      </div>

      <div className="admin-request-list">
        {requests.map((item) => (
          <div className="admin-request-card" key={item.id}>
            <div className="admin-request-icon">
              <i className="fa-solid fa-store"></i>
            </div>

            <div className="admin-request-info">
              <h4>{item.business}</h4>
              <p>{item.name}</p>
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

            <h3>Информация о заявке</h3>

            <div className="admin-detail-list">
              <p>
                <span>Название бизнеса:</span> {selected.business}
              </p>
              <p>
                <span>Владелец:</span> {selected.name}
              </p>
              <p>
                <span>Телефон:</span> {selected.phone}
              </p>
              <p>
                <span>Email:</span> {selected.email}
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

export default Adminsellerrequests;
