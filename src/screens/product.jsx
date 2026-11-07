import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();

  const products = [
    {
      id: "1",
      name: "Классическая куртка",
      price: 3500,
      rating: "4.9",
      reviews: 86,
      category: "Мужская одежда",
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900",
        "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900",
      ],
      colors: [
        { name: "Чёрный", value: "#111111" },
        { name: "Белый", value: "#eeeeee" },
        { name: "Коричневый", value: "#795548" },
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      store: "Fashion Store",
    },
    {
      id: "2",
      name: "Белые кроссовки",
      price: 2800,
      rating: "4.8",
      reviews: 64,
      category: "Обувь",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
        "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=900",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900",
      ],
      colors: [
        { name: "Красный", value: "#c62828" },
        { name: "Белый", value: "#eeeeee" },
        { name: "Чёрный", value: "#111111" },
      ],
      sizes: ["38", "39", "40", "41", "42", "43"],
      store: "Sneaker House",
    },
    {
      id: "3",
      name: "Чёрная сумка",
      price: 1900,
      rating: "4.7",
      reviews: 42,
      category: "Аксессуары",
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900",
      ],
      colors: [
        { name: "Чёрный", value: "#111111" },
        { name: "Коричневый", value: "#795548" },
      ],
      sizes: ["Один размер"],
      store: "Style Accessories",
    },
    {
      id: "4",
      name: "Мужская футболка",
      price: 1200,
      rating: "4.9",
      reviews: 51,
      category: "Одежда",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900",
        "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=900",
      ],
      colors: [
        { name: "Белый", value: "#eeeeee" },
        { name: "Чёрный", value: "#111111" },
        { name: "Серый", value: "#888888" },
      ],
      sizes: ["S", "M", "L", "XL"],
      store: "Fashion Store",
    },
  ];

  const product = products.find((item) => item.id === id) || products[0];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const balance = 25000;
  const total = product.price * quantity;

  const formatPrice = (price) => price.toLocaleString("ru-RU");

  const payOrder = () => {
    if (total > balance) {
      alert("Недостаточно средств на вашем балансе");
      return;
    }

    alert("Заказ успешно оплачен!");
    setShowModal(false);
    navigate("/orderstatus");
  };

  return (
    <div className="product-page">
      <main className="product-container">
        <button className="product-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
          Назад
        </button>

        <div className="product-layout">
          {/* ФОТО ТОВАРА */}
          <div className="product-gallery">
            <div className="product-main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>

            <div className="product-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={selectedImage === index ? "selected" : ""}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ИНФОРМАЦИЯ О ТОВАРЕ */}
          <div className="product-information">
            <span className="product-category">{product.category}</span>

            <h1>{product.name}</h1>

            <div className="product-rating">
              <i className="fa-solid fa-star"></i>
              <strong>{product.rating}</strong>
              <span>({product.reviews} отзывов)</span>
            </div>

            <h2 className="product-price">{formatPrice(product.price)} сом</h2>

            <div className="product-divider"></div>

            {/* ЦВЕТ */}
            <div className="product-option">
              <div className="product-option-heading">
                <strong>Цвет</strong>
                <span>{selectedColor.name}</span>
              </div>

              <div className="product-colors">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className={
                      selectedColor.name === color.name ? "selected" : ""
                    }
                    style={{ background: color.value }}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <i
                        className={`fa-solid fa-check ${
                          color.name === "Белый" ? "dark-check" : ""
                        }`}
                      ></i>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* РАЗМЕР */}
            <div className="product-option">
              <div className="product-option-heading">
                <strong>Размер</strong>
                <span>{selectedSize}</span>
              </div>

              <div className="product-sizes">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={selectedSize === size ? "selected" : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* КОЛИЧЕСТВО */}
            <div className="product-option">
              <div className="product-option-heading">
                <strong>Количество</strong>
              </div>

              <div className="product-quantity">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity === 1}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>

                <span>{quantity}</span>

                <button onClick={() => setQuantity((prev) => prev + 1)}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            {/* БАЛАНС */}
            <div className="product-balance">
              <div>
                <span>МОЙ СЧЁТ</span>
                <strong>{formatPrice(balance)} сом</strong>
              </div>

              <i className="fa-solid fa-wallet"></i>
            </div>

            {/* ИТОГО */}
            <div className="product-total">
              <span>Общая сумма</span>
              <strong>{formatPrice(total)} сом</strong>
            </div>

            <button
              className="product-order-button"
              onClick={() => setShowModal(true)}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              Заказать
            </button>

            <div className="product-store">
              <i className="fa-solid fa-store"></i>
              Магазин: <strong>{product.store}</strong>
            </div>
          </div>
        </div>

        {/* МОДАЛЬНОЕ ОКНО */}
        {showModal && (
          <div
            className="product-modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="product-modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="product-modal-icon">
                <i className="fa-solid fa-wallet"></i>
              </div>

              <h2>Подтвердить заказ?</h2>
              <p>Проверьте информацию перед оплатой.</p>

              <div className="product-modal-product">
                <img src={product.images[0]} alt={product.name} />

                <div>
                  <strong>{product.name}</strong>
                  <span>Цвет: {selectedColor.name}</span>
                  <span>Размер: {selectedSize}</span>
                  <span>Количество: {quantity} шт.</span>
                </div>
              </div>

              <div className="product-modal-row">
                <span>Мой баланс</span>
                <strong>{formatPrice(balance)} сом</strong>
              </div>

              <div className="product-modal-row">
                <span>К оплате</span>
                <strong>{formatPrice(total)} сом</strong>
              </div>

              <div className="product-modal-actions">
                <button
                  className="product-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Отменить
                </button>

                <button className="product-modal-pay" onClick={payOrder}>
                  Оплатить
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Product;
