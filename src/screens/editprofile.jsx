import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const USER_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";

function Editprofile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [adres, setAdres] = useState("");
  const [photo, setPhoto] = useState("");

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoInput, setPhotoInput] = useState("");

  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      let uid = localStorage.getItem("uid");

      if (!uid) {
        alert("Сначала войдите в аккаунт");
        navigate("/signin");
        return;
      }

      try {
        uid = JSON.parse(uid);
      } catch (error) {}

      const response = await axios.get(USER_URL);

      // Ищем пользователя по Google UID
      const currentUser = response.data.find(
        (item) => String(item.uid) === String(uid),
      );

      if (!currentUser) {
        alert("Пользователь не найден");
        navigate("/signin");
        return;
      }

      // Проверяем администратора
      if (currentUser.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      setUser(currentUser);

      setName(currentUser.firstname || "");
      setSurname(currentUser.lastname || "");
      setPhone(currentUser.numberphone || "");
      setEmail(currentUser.email || "");
      setAdres(currentUser.adres || "");
      setPhoto(currentUser.avatar || "");
      setPhotoInput(currentUser.avatar || "");
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
      alert("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Сохраняем изменения
  const saveProfile = async () => {
    if (!name.trim() || !surname.trim() || !phone.trim() || !email.trim()) {
      alert("Заполните все обязательные поля");
      return;
    }

    if (!user) {
      alert("Пользователь не найден");
      return;
    }

    try {
      const response = await axios.get(USER_URL);

      // Проверяем, занят ли email другим пользователем
      const emailExists = response.data.find(
        (item) =>
          item.id !== user.id &&
          item.email?.toLowerCase() === email.trim().toLowerCase(),
      );

      if (emailExists) {
        alert("Этот email уже используется");
        return;
      }

      // Проверяем, занят ли телефон другим пользователем
      const phoneExists = response.data.find(
        (item) => item.id !== user.id && item.numberphone === phone.trim(),
      );

      if (phoneExists) {
        alert("Этот номер телефона уже используется");
        return;
      }

      await axios.put(`${USER_URL}/${user.id}`, {
        ...user,
        firstname: name.trim(),
        lastname: surname.trim(),
        numberphone: phone.trim(),
        email: email.trim(),
        adres: adres.trim(),
        avatar: photo,
      });

      alert("Профиль успешно обновлён");
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка сохранения профиля:", error);
      alert("Не удалось сохранить изменения");
    }
  };

  const openPhotoModal = () => {
    setPhotoInput(photo);
    setShowPhotoModal(true);
  };

  const savePhoto = () => {
    setPhoto(photoInput.trim());
    setShowPhotoModal(false);
  };

  if (loading) {
    return <div className="edit-profile-loading">Загрузка...</div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        {/* Назад */}
        <button
          className="edit-profile-back"
          onClick={() => navigate("/profile")}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        <div className="edit-profile-header">
          <h2>Редактировать профиль</h2>
          <p>Измените информацию своего аккаунта</p>
        </div>

        <div className="edit-profile-avatar">
          <div className="edit-profile-avatar-img">
            {photo ? (
              <img src={photo} alt="Фото профиля" />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>

          <button
            type="button"
            className="edit-photo-btn"
            onClick={openPhotoModal}
          >
            Изменить фотографию
          </button>
        </div>
        <div className="edit-profile-form">
          <h3>Личная информация</h3>
          <div className="edit-profile-row">
            <div className="edit-profile-field">
              <label>Имя</label>
              <input
                type="text"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="edit-profile-field">
              <label>Фамилия</label>
              <input
                type="text"
                placeholder="Введите фамилию"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>

            <div className="edit-profile-field">
              <label>Номер телефона</label>
              <input
                type="tel"
                placeholder="+996 Введите номер телефона"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="edit-profile-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="edit-profile-field">
              <label>Адрес доставки</label>
              <input
                type="text"
                placeholder="Введите адрес"
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
              />
            </div>
            <br />
            <br />
            <button
              type="button"
              className="edit-profile-save"
              onClick={saveProfile}
            >
              Сохранить изменения
            </button>
            <a href="/profile" className="edit-profile-cancel">
              Отмена
            </a>
          </div>
        </div>
      </div>

      {showPhotoModal && (
        <div className="edit-photo-modal">
          <div className="edit-photo-modal-content">
            <h3>Изменить фотографию</h3>

            <input
              type="text"
              placeholder="Вставьте ссылку на фотографию"
              value={photoInput}
              onChange={(e) => setPhotoInput(e.target.value)}
            />

            <div className="edit-photo-modal-actions">
              <button type="button" onClick={() => setShowPhotoModal(false)}>
                Отмена
              </button>

              <button type="button" onClick={savePhoto}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editprofile;
