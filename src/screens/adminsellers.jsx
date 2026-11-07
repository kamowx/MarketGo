import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

function Adminsellers() {
  const [sellers, setSellers] = useState([
    {
      id: 1,
      name: "Александр Иванов",
      business: "Style одежда",
      phone: "+996 700 123 456",
      email: "style@mail.com",
    },
    {
      id: 2,
      name: "Мария Петрова",
      business: "Fashion Store",
      phone: "+996 555 222 111",
      email: "fashion@mail.com",
    },
    {
      id: 3,
      name: "Дмитрий Сидоров",
      business: "Shoes Market",
      phone: "+996 777 333 222",
      email: "shoes@mail.com",
    },
  ]);

  const [editing, setEditing] = useState(null);

  const updateSeller = (e) => {
    e.preventDefault();

    setSellers(
      sellers.map((item) => (item.id === editing.id ? editing : item)),
    );

    setEditing(null);
  };

  const deleteSeller = (id) => {
    if (window.confirm("Удалить этого продавца?")) {
      setSellers(sellers.filter((item) => item.id !== id));
    }
  };

  return (
    <AdminLayout title="Продавцы">
      <div className="admin-page-heading">
        <div>
          <h3>Все продавцы</h3>
          <p>Управление аккаунтами продавцов MarketGo.</p>
        </div>
        <span className="admin-total">{sellers.length} продавца</span>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Продавец</th>
              <th>Магазин</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>{item.business}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
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
                      onClick={() => deleteSeller(item.id)}
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
            onSubmit={updateSeller}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setEditing(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3>Редактировать продавца</h3>

            <label>Имя владельца</label>
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />

            <label>Название магазина</label>
            <input
              value={editing.business}
              onChange={(e) =>
                setEditing({ ...editing, business: e.target.value })
              }
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

            <button type="submit" className="admin-save-button">
              Сохранить изменения
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

export default Adminsellers;
