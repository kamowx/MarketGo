import { NavLink } from "react-router-dom";

function Bottomnav() {
  const menu = [
    {
      name: "Главная",
      icon: "fa-solid fa-house",
      path: "/home",
    },
    {
      name: "Магазины",
      icon: "fa-solid fa-store",
      path: "/stores",
    },
    {
      name: "Заказы",
      icon: "fa-solid fa-box",
      path: "/myorders",
    },
    {
      name: "Избранное",
      icon: "fa-solid fa-heart",
      path: "/favorites",
    },
    {
      name: "Профиль",
      icon: "fa-solid fa-user",
      path: "/profile",
    },
  ];

  return (
    <nav className="market-bottom-nav">
      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `market-bottom-item ${isActive ? "active" : ""}`
          }
        >
          <i className={item.icon}></i>
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default Bottomnav;
