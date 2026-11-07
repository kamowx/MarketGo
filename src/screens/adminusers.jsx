import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

function Adminusers() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Алексей Иванов",
      phone: "+996 700 123 456",
      email: "alex@mail.com",
    },
    {
      id: 2,
      name: "Мария Смирнова",
      phone: "+996 555 222 111",
      email: "maria@mail.com",
    },
    {
      id: 3,
      name: "Данияр Алиев",
      phone: "+996 777 333 222",
      email: "daniyar@mail.com",
    },
    {
      id: 4,
      name: "Анна Петрова",
      phone: "+996 500 444 333",
      email: "anna@mail.com",
    },
  ]);

  const [editing, setEditing] = useState(null);

  const updateUser = (e) => {
    e.preventDefault();
    setUsers(users.map((item) => (item.id === editing.id ? editing : item)));
    setEditing(null);
  };

  const deleteUser = (id) => {
    if (window.confirm("Удалить этого пользователя?")) {
      setUsers(users.filter((item) => item.id !== id));
    }
  };

  return (
    <AdminLayout title="Пользователи">
      <div className="admin-page-heading">
        <div>
          <h3>Обычные пользователи</h3>
          <p>Список пользователей, зарегистрированных на MarketGo.</p>
        </div>
        <span className="admin-total">{users.length} пользователей</span>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                </td>
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
                      onClick={() => deleteUser(item.id)}
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
            onSubmit={updateUser}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setEditing(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3>Редактировать пользователя</h3>

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

            <button type="submit" className="admin-save-button">
              Сохранить изменения
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

export default Adminusers;
