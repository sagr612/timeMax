import React, { Fragment, useEffect, useState } from "react";
import "./AuctionProducts.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAuctionProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import Pagination from "react-js-pagination";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import AuctionProductCard from "./AuctionProductCard";

const categories = [
  "Sport",
  "Pocket",
  "Smart",
  "Diver ",
  "Luxury",
  "Fitness",
  "Fashion",
  "Military",
];

const AuctionProducts = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [filterByEndTime, setFilterByEndTime] = useState("");

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.auctionProducts);

  const keyword = match.params.keyword;
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };
  let count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(
      getAuctionProduct(keyword, currentPage, category, filterByEndTime)
    );
  }, [dispatch, keyword, currentPage, category, filterByEndTime, alert, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="AUCTION PRODUCTS -- Time Max" />
          <h2 className="auctionHeading">Auction Products</h2>
          <div className="auctionContainer">
            <div className="auctionfilterBox">
              <div>
                <p className="heading">Categories</p>
                <ul className="auctioncategoryBox">
                  {categories.map((category) => (
                    <li
                      className="auctioncategory-link"
                      key={category}
                      onClick={() => setCategory(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="heading">Auctions</p>

                <label>
                  <input
                    type="radio"
                    value="previous"
                    checked={filterByEndTime === "previous"}
                    onClick={() => setFilterByEndTime("previous")}
                    className="radio-input"
                  />
                  Previous
                </label>
                <label>
                  <input
                    type="radio"
                    value="current"
                    checked={filterByEndTime === "current"}
                    onClick={() => setFilterByEndTime("current")}
                    className="radio-input"
                  />
                  Current
                </label>
                <label>
                  <input
                    type="radio"
                    value=""
                    checked={filterByEndTime === ""}
                    onClick={() => setFilterByEndTime("")}
                    className="radio-input"
                  />
                  All
                </label>
              </div>
            </div>
            <div className="auctions">
              {products &&
                products.map((product) => (
                  <AuctionProductCard key={product._id} product={product} />
                ))}
            </div>
          </div>

          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default AuctionProducts;
