import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./AuctionProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAuctionProductDetails,
  updateBid,
} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

import AuctionProductCard from "./AuctionProductCard";
import { addAuctionItemsToCart } from "../../actions/cartAction";
import { RiCopperCoinLine } from "react-icons/ri";
import io from "socket.io-client";

// const socket = io("http://localhost:4000"); //deployed url
const socket = io("https://timemax.onrender.com"); //deployed url

const AuctionProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const { product, loading, error, similarProducts } = useSelector(
    (state) => state.auctionProductDetails
  );
  const { isUpdated, error: bidError } = useSelector((state) => state.bid);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bid, setBid] = useState(0);
  const [activeAuctionTab, setActiveAuctionTab] = useState("description");

  const [latestBid, setLatestBid] = useState(null);
  const [currentWinner, setCurrentWinner] = useState(null);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (bidError) {
      alert.error(bidError);
      dispatch(clearErrors());
    }

    dispatch(getAuctionProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert, bidError, isUpdated]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const endTime = new Date(product.auctionEndTime).getTime();
      setTimeRemaining(endTime - currentTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [product.auctionEndTime]);

  useEffect(() => {
    socket.on("bidUpdate", ({ productId, newBid, userId }) => {
      console.log(productId, newBid, userId);
      if (productId === product._id) {
        setLatestBid(newBid);
        setCurrentWinner(userId);
        // console.log(latestBid, currentWinner);
      }
      // dispatch(getAuctionProductDetails(match.params.id));

      // window.location.reload();
    });

    return () => {
      socket.off("bidUpdate");
    };
  }, [product._id, latestBid, currentWinner]);

  const bidHandler = () => {
    dispatch(updateBid(product._id, bid, user._id));
    socket.emit("placeBid", {
      productId: product._id,
      newBid: bid,
      userId: user._id,
      currentBid: product.currentBid,
    });
  };

  const addToCartHandler = () => {
    dispatch(addAuctionItemsToCart(match.params.id, 1));
    alert.success("Item Added To Cart");
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `  ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} --Outfitify`} />
          <div className="auctionProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="auction-detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>

              <div className="auction-detailsBlock-2">
                <span>Minimum Bid </span>

                <span>
                  <RiCopperCoinLine />
                  {`${product.startingBid}`}
                </span>
              </div>

              <div className="auction-detailsBlock-2">
                <span>Maximum Bid </span>

                <span>
                  {" "}
                  <RiCopperCoinLine /> 25000
                </span>
              </div>

              {latestBid !== null && latestBid >= product.currentBid ? (
                <div className="auction-detailsBlock-2">
                  <span>Current Bid </span>

                  <span>
                    <RiCopperCoinLine />
                    {`${latestBid}`}
                  </span>
                </div>
              ) : (
                <div className="auction-detailsBlock-2">
                  <span>Current Bid </span>

                  <span>
                    <RiCopperCoinLine />
                    {`${product.currentBid}`}
                  </span>
                </div>
              )}

              {latestBid !== null && latestBid >= product.currentBid && (
                <div className="auction-detailsBlock-3">
                  <span>Winner</span>
                  <span>{currentWinner}</span>
                </div>
              )}

              {latestBid === null && product.winner && (
                <div className="auction-detailsBlock-3">
                  <span>Winner</span>
                  <span>{product.winner}</span>
                </div>
              )}

              {product.auctionEndTime && timeRemaining > 0 ? (
                <div className="auction-detailsBlock-3">
                  <span>Time Left </span>
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              ) : (
                <div className="auction-detailsBlock-2">
                  <span>Auction Ended</span>
                </div>
              )}

              {product.winner &&
                product.auctionEndTime &&
                isAuthenticated &&
                timeRemaining <= 0 &&
                user._id.toString() === product.winner.toString() && (
                  <div className="auction-detailsBlock-3">
                    <button
                      disabled={product.Stock < 1 ? true : false}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </button>
                  </div>
                )}

              {product.auctionEndTime &&
                isAuthenticated &&
                timeRemaining > 0 &&
                product.currentBid < 25000 && (
                  <div className="auction-detailsBlock-4">
                    <span>Enter Bid </span>
                    <input
                      type="number"
                      value={bid}
                      onChange={(e) => setBid(e.target.value)}
                    />
                    <button onClick={bidHandler}>Bid</button>
                  </div>
                )}
            </div>
          </div>

          <div className="tabbed">
            <div className="tabbed-buttons">
              <button
                className={`tab-button ${
                  activeAuctionTab === "description" ? "active" : "inactive"
                }`}
                onClick={() => setActiveAuctionTab("description")}
              >
                Description
              </button>
              <button
                className={`tab-button ${
                  activeAuctionTab === "SimilarProducts" ? "active" : "inactive"
                }`}
                onClick={() => setActiveAuctionTab("SimilarProducts")}
              >
                Similar Products
              </button>
            </div>

            <div className="tab-content">
              {activeAuctionTab === "description" && (
                <div className="detailsBlock-4">
                  <p>{product.description}</p>
                </div>
              )}

              {activeAuctionTab === "SimilarProducts" && (
                <div>
                  {similarProducts && similarProducts[0] ? (
                    <div className="reviews">
                      {similarProducts &&
                        similarProducts.map((product) => (
                          <AuctionProductCard
                            key={product._id}
                            product={product}
                          />
                        ))}
                    </div>
                  ) : (
                    <p className="noReviews">No Similar Products Yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default AuctionProductDetails;
