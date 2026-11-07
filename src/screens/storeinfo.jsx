import { useNavigate, useParams } from "react-router-dom";

function Storeinfo() {
  const navigate = useNavigate();
  const { id } = useParams();

  const stores = [
    {
      id: "1",
      name: "Fashion Store",
      category: "Одежда",
      rating: "4.9",
      reviews: 128,
      address: "Бишкек, ул. Киевская 100",
      seller: "Александр Иванов",
      phone: "+996 700 123 456",
      description:
        "Современная одежда для повседневного стиля. Большой выбор качественных вещей.",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900",
    },
    {
      id: "2",
      name: "Sneaker House",
      category: "Обувь",
      rating: "4.8",
      reviews: 96,
      address: "Бишкек, ул. Манаса 45",
      seller: "Данияр Осмонов",
      phone: "+996 555 123 456",
      description: "Магазин современной обуви и кроссовок.",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900",
    },
    {
      id: "3",
      name: "Style Accessories",
      category: "Аксессуары",
      rating: "4.7",
      reviews: 75,
      address: "Бишкек, ул. Чуй 120",
      seller: "Айжан Садыкова",
      phone: "+996 777 123 456",
      description: "Стильные аксессуары для вашего образа.",
      image:
        "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=900",
    },
    {
      id: "4",
      name: "Urban Wear",
      category: "Одежда",
      rating: "4.9",
      reviews: 110,
      address: "Бишкек, ул. Токтогула 80",
      seller: "Бекжан Алиев",
      phone: "+996 500 123 456",
      description: "Уличная одежда и современные коллекции.",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900",
    },
  ];

  const store = stores.find((item) => item.id === id) || stores[0];

  const products = [
    {
      id: 1,
      name: "Классическая куртка",
      price: "3 500 сом",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    },
    {
      id: 2,
      name: "Мужская футболка",
      price: "1 200 сом",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    },
    {
      id: 3,
      name: "Стильная рубашка",
      price: "2 000 сом",
      image:
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600",
    },
    {
      id: 4,
      name: "Повседневная куртка",
      price: "4 100 сом",
      image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600",
    },
  ];

  return (
    <div className="storeinfo-page">
      <main className="storeinfo-container">
        <button className="storeinfo-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
          Назад
        </button>

        <div className="storeinfo-cover">
          <img src={store.image} alt={store.name} />
        </div>

        <div className="storeinfo-main">
          <div className="storeinfo-name">
            <div>
              <span>МАГАЗИН MARKETGO</span>
              <h1>{store.name}</h1>
              <p>{store.category}</p>
            </div>

            <div className="storeinfo-rating">
              <i className="fa-solid fa-star"></i>
              {store.rating}
              <span>({store.reviews} отзывов)</span>
            </div>
          </div>

          <p className="storeinfo-description">{store.description}</p>

          <div className="storeinfo-details">
            <div>
              <i className="fa-solid fa-location-dot"></i>
              <section>
                <span>Адрес магазина</span>
                <strong>{store.address}</strong>
              </section>
            </div>

            <div>
              <i className="fa-solid fa-user"></i>
              <section>
                <span>Продавец</span>
                <strong>{store.seller}</strong>
              </section>
            </div>

            <div>
              <i className="fa-solid fa-phone"></i>
              <section>
                <span>Телефон продавца</span>
                <strong>{store.phone}</strong>
              </section>
            </div>
          </div>
        </div>

        <div className="storeinfo-products-heading">
          <div>
            <span>КОЛЛЕКЦИЯ МАГАЗИНА</span>
            <h2>Все товары</h2>
          </div>
          <p>{products.length} товаров</p>
        </div>

        <div className="storeinfo-products">
          {products.map((product) => (
            <div className="storeinfo-product-card" key={product.id}>
              <div className="storeinfo-product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="storeinfo-product-text">
                <h3>{product.name}</h3>
                <strong>{product.price}</strong>
                <button onClick={() => navigate(`/product/${product.id}`)}>
                  Посмотреть товар
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Storeinfo;
