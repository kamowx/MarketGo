import AdminLayout from "../components/AdminLayout";

function Adminstores() {
  const stores = [
    {
      id: 1,
      name: "Style одежда",
      owner: "Александр Иванов",
      category: "Одежда",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
    },
    {
      id: 2,
      name: "Fashion Store",
      owner: "Мария Петрова",
      category: "Женская одежда",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
    },
    {
      id: 3,
      name: "Shoes Market",
      owner: "Дмитрий Сидоров",
      category: "Обувь",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    },
    {
      id: 4,
      name: "Modern Shop",
      owner: "Анна Смирнова",
      category: "Аксессуары",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600",
    },
  ];

  return (
    <AdminLayout title="Магазины">
      <div className="admin-page-heading">
        <div>
          <h3>Все магазины</h3>
          <p>Магазины, которые работают на платформе MarketGo.</p>
        </div>
        <span className="admin-total">{stores.length} магазина</span>
      </div>

      <div className="admin-stores-grid">
        {stores.map((item) => (
          <div className="admin-store-card" key={item.id}>
            <img src={item.image} alt={item.name} />

            <div className="admin-store-info">
              <span className="admin-store-category">{item.category}</span>
              <h3>{item.name}</h3>
              <p>
                <i className="fa-solid fa-user"></i> {item.owner}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default Adminstores;
