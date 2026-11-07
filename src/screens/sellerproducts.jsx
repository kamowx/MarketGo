import { useState } from "react";
import { Link } from "react-router-dom";
import SellerBottomnav from "../components/SellerBottomnav";

function Sellerproducts() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Классическая футболка",
      price: 1200,
      category: "Одежда",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      status: "Активен",
    },
    {
      id: 2,
      name: "Спортивная куртка",
      price: 3500,
      category: "Верхняя одежда",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      status: "Активен",
    },
    {
      id: 3,
      name: "Повседневные кроссовки",
      price: 2800,
      category: "Обувь",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      status: "Активен",
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const openEdit = (product) => {
    setSelectedProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const saveEdit = () => {
    setProducts(
      products.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              name: editName,
              price: Number(editPrice),
            }
          : product,
      ),
    );

    setSelectedProduct(null);
  };

  return (
    <div className="seller-page">
      <SellerBottomnav />

      <main className="seller-main">
        <div className="seller-header">
          <div>
            <span className="seller-header-small">КАБИНЕТ ПРОДАВЦА</span>
            <h1>Мои товары</h1>
            <p>Управляйте товарами своего магазина</p>
          </div>

          <Link to="/seller/add-product" className="seller-add-button">
            <i className="fa-solid fa-plus"></i>
            Добавить товар
          </Link>
        </div>

        <div className="seller-statistics">
          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <i className="fa-solid fa-box"></i>
            </div>
            <div>
              <span>Всего товаров</span>
              <h3>{products.length}</h3>
            </div>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <span>Активные товары</span>
              <h3>{products.length}</h3>
            </div>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            <div>
              <span>Новые заказы</span>
              <h3>0</h3>
            </div>
          </div>
        </div>

        <div className="seller-products-heading">
          <div>
            <h2>Все товары</h2>
            <p>Список товаров вашего магазина</p>
          </div>

          <span className="seller-products-count">
            {products.length} товара
          </span>
        </div>

        <div className="seller-products-grid">
          {products.map((product) => (
            <div className="seller-product-card" key={product.id}>
              <div className="seller-product-image">
                <img src={product.image} alt={product.name} />

                <span className="seller-product-status">
                  <i className="fa-solid fa-circle"></i>
                  {product.status}
                </span>
              </div>

              <div className="seller-product-info">
                <span className="seller-product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <div className="seller-product-bottom">
                  <strong>{product.price.toLocaleString("ru-RU")} сом</strong>

                  <button
                    className="seller-edit-button"
                    onClick={() => openEdit(product)}
                  >
                    <i className="fa-solid fa-pen"></i>
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="seller-empty">
            <i className="fa-solid fa-box-open"></i>
            <h3>Пока нет товаров</h3>
            <p>Добавьте первый товар в свой магазин</p>
            <Link to="/seller/add-product" className="seller-add-button">
              <i className="fa-solid fa-plus"></i>
              Добавить товар
            </Link>
          </div>
        )}
      </main>

      {selectedProduct && (
        <div
          className="seller-modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="seller-modal" onClick={(e) => e.stopPropagation()}>
            <div className="seller-modal-header">
              <div>
                <span>УПРАВЛЕНИЕ ТОВАРОМ</span>
                <h2>Редактировать товар</h2>
              </div>

              <button
                className="seller-modal-close"
                onClick={() => setSelectedProduct(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="seller-modal-body">
              <label>Название товара</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <label>Цена товара (сом)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />

              <button className="seller-modal-save" onClick={saveEdit}>
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sellerproducts;
