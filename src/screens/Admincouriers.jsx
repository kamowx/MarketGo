import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

function Admincouriers() {
  const [couriers, setCouriers] = useState([
    {
      id: 1,
      name: "Иван Петров",
      phone: "+996 700 111 222",
      email: "ivan@mail.com",
      transport: "Мотоцикл",
    },
    {
      id: 2,
      name: "Андрей Смирнов",
      phone: "+996 555 444 333",
      email: "andrey@mail.com",
      transport: "Автомобиль",
    },
    {
      id: 3,
      name: "Бекзат Алиев",
      phone: "+996 777 888 999",
      email: "bekzat@mail.com",
      transport: "Велосипед",
    },
  ]);

  const [editing, setEditing] = useState(null);

  const updateCourier = (e) => {
    e.preventDefault();
    setCouriers(
      couriers.map((item) => (item.id === editing.id ? editing : item)),
    );
    setEditing(null);
  };

  const deleteCourier = (id) => {
    if (window.confirm("Удалить этого курьера?")) {
      setCouriers(couriers.filter((item) => item.id !== id));
    }
  };

  return (
    <AdminLayout title="Курьеры">
      <div className="admin-page-heading">
        <div>
          <h3>Все курьеры</h3>
          <p>Управление аккаунтами курьеров MarketGo.</p>
        </div>
        <span className="admin-total">{couriers.length} курьера</span>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Транспорт</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            {couriers.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td>{item.transport}</td>
                <td>
                  <div className="admin-row-actions">
                    <button
                      className="admin-edit-button"
                      onClick={() => setEditing({ ...item })}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      className="admin-delete-button"
                      onClick={() => deleteCourier(item.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="admin-modal-overlay" onClick={() => setEditing(null)}>
          <form
            className="admin-modal"
            onSubmit={updateCourier}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setEditing(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3>Редактировать курьера</h3>

            <label>Имя</label>
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />

            <label>Телефон</label>
            <input
              value={editing.phone}
              onChange={(e) =>
                setEditing({ ...editing, phone: e.target.value })
              }
            />

            <label>Email</label>
            <input
              value={editing.email}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
            />

            <label>Транспорт</label>
            <input
              value={editing.transport}
              onChange={(e) =>
                setEditing({ ...editing, transport: e.target.value })
              }
            />

            <button type="submit" className="admin-save-button">
              Сохранить изменения
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

export default Admincouriers;
