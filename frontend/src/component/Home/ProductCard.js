import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";
import { RiCopperCoinLine } from "react-icons/ri";

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options} style={{ color: "#6200ea" }} />{" "}
        <span className="productCardSpan">
          {" "}
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>
        {/* <FontAwesomeIcon icon={faCoins} /> */}
        <RiCopperCoinLine />
        {`${product.price}`}
      </span>
    </Link>
  );
};

export default ProductCard;
