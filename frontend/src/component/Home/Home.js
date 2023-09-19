import React, { Fragment, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import image1 from "../../images/watch3.jpg";
import image2 from "../../images/6.jpg";
import image3 from "../../images/5.jpg";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Time Max" />

          <Carousel
            showStatus={false}
            showThumbs={false}
            autoPlay={true}
            interval={1000}
            showArrows={false}
          >
            <div className="carousel-slide">
              <img className="carousel-image" src={image1} alt="image1" />
              <a className="links" href="#container">
                <button> See Popular products </button>
              </a>
            </div>

            <div className="carousel-slide">
              <img className="carousel-image" src={image2} alt="image2" />
              <Link className="links" to="/products">
                <button>Browse products </button>
              </Link>
            </div>

            <div className="carousel-slide">
              <img className="carousel-image" src={image3} alt="image3" />
              <Link className="links" to="/auction/products">
                <button>Bid </button>
              </Link>
            </div>
          </Carousel>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
