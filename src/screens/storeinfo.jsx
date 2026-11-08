import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const USERS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/users";
const PRODUCTS_URL = "https://6af02a41b9925b27ce173abb.mockapi.io/products";
const BUSINESS_URL = "https://6aedd445a677fe0fc14f8ae2.mockapi.io/buisness";

function Storeinfo() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [store, setStore] = useState(null);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const getStoreInfo = async () => {
      try {
        // Получаем магазин по ID
        const storeResponse = await axios.get(`${BUSINESS_URL}/${id}`);
        const currentStore = storeResponse.data;

        if (cancelled) return;

        setStore(currentStore);

        // Получаем продавца и товары магазина
        const [usersResponse, productsResponse] = await Promise.all([
          axios.get(USERS_URL),
          axios.get(PRODUCTS_URL),
        ]);

        if (cancelled) return;

        // Находим продавца магазина
        const currentSeller = usersResponse.data.find(
          (item) => String(item.id) === String(currentStore.userId),
        );

        setSeller(currentSeller || null);

        // Получаем только товары этого магазина
        const storeProducts = productsResponse.data.filter(
          (item) => String(item.userId) === String(currentStore.userId),
        );

        setProducts(storeProducts);
      } catch (error) {
        console.error("Ошибка загрузки магазина:", error);

        if (!cancelled) {
          alert("Не удалось загрузить магазин");
          navigate("/stores");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getStoreInfo();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="storeinfo-page">
        <main className="storeinfo-container">
          <p>Загрузка магазина...</p>
        </main>
      </div>
    );
  }

  if (!store) {
    return null;
  }

  return (
    <div className="storeinfo-page">
      <main className="storeinfo-container">
        <button className="storeinfo-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
          Назад
        </button>

        <div className="storeinfo-cover">
          <img
            src={store.avatar || "https://placehold.co/900x350?text=Store"}
            alt={store.name}
          />
        </div>

        <div className="storeinfo-main">
          <div className="storeinfo-name">
            <div>
              <span>МАГАЗИН MARKETGO</span>
              <h1>{store.name}</h1>
              <p>{store.category}</p>
            </div>

            <div className="storeinfo-rating">
              <i className="fa-solid fa-store"></i>
              Магазин
            </div>
          </div>

          <p className="storeinfo-description">
            {store.description ||
              "Добро пожаловать в наш магазин! Здесь вы можете ознакомиться с нашей коллекцией товаров."}
          </p>

          <div className="storeinfo-details">
            <div>
              <i className="fa-solid fa-location-dot"></i>
              <section>
                <span>Адрес магазина</span>
                <strong>{store.adrescompany || "Адрес не указан"}</strong>
              </section>
            </div>

            <div>
              <i className="fa-solid fa-user"></i>
              <section>
                <span>Продавец</span>
                <strong>
                  {seller
                    ? `${seller.firstname || ""} ${seller.lastname || ""}`.trim()
                    : "Не указан"}
                </strong>
              </section>
            </div>

            <div>
              <i className="fa-solid fa-phone"></i>
              <section>
                <span>Телефон продавца</span>
                <strong>{seller?.numberphone || "Не указан"}</strong>
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
          {products.length === 0 ? (
            <div className="storeinfo-empty">
              <i className="fa-solid fa-box-open"></i>
              <h3>Пока нет товаров</h3>
              <p>Этот магазин ещё не добавил товары</p>
            </div>
          ) : (
            products.map((product) => (
              <div className="storeinfo-product-card" key={product.id}>
                <div className="storeinfo-product-image">
                  <img
                    src={
                      product.avatar ||
                      "https://placehold.co/600x600?text=Product"
                    }
                    alt={product.name}
                  />
                </div>

                <div className="storeinfo-product-text">
                  <h3>{product.name}</h3>

                  <strong>
                    {Number(product.price || 0).toLocaleString("ru-RU")} сом
                  </strong>

                  <button onClick={() => navigate(`/product/${product.id}`)}>
                    Посмотреть товар
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Storeinfo;
