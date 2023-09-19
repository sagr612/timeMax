import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AuctionProductCard.css";
import { RiCopperCoinLine } from "react-icons/ri";

const AuctionProductCard = ({ product }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const endTime = new Date(product.auctionEndTime).getTime();
      setTimeRemaining(endTime - currentTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [product.auctionEndTime]);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Link className="auctionCard" to={`/auction/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>

      <span>
        {"Starting Bid "}
        <RiCopperCoinLine />
        {`${product.startingBid}`}
      </span>
      <span>
        {"Current Bid "}
        <RiCopperCoinLine />
        {`${product.currentBid}`}
      </span>
      {product.auctionEndTime && timeRemaining > 0 ? (
        <div className="timeLeft">
          <span>Time Left</span>
          <span>{formatTime(timeRemaining)}</span>
        </div>
      ) : (
        <span>Auction Ended</span>
      )}
    </Link>
  );
};

export default AuctionProductCard;
