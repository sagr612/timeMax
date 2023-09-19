import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import "./Search.css";
const Search = ({ history }) => {
  const [keyword, setKeyword] = useState("");
  const [auction, setAuction] = useState("No");

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (auction === "auction" && keyword.trim()) {
      history.push(`/auction/products/${keyword}`);
    } else if (keyword.trim()) {
      history.push(`/products/${keyword}`);
    } else {
      history.push("/products");
    }
  };

  const close = () => {
    history.goBack();
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- Time Max" />
      <form className="searchForm" onSubmit={searchSubmitHandler}>
        <AiOutlineCloseCircle className="closeButton" onClick={close} />
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search a Product ..."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={searchSubmitHandler}>
            <AiOutlineSearch />
          </button>
        </div>

        <div className="radio-buttons">
          <label className="radio-label">
            <input
              type="radio"
              className="radio-input"
              value="No"
              checked={auction === "No"}
              onChange={() => setAuction("No")}
            />
            Product
          </label>
          <label className="radio-label">
            <input
              type="radio"
              className="radio-input"
              value="auction"
              checked={auction === "auction"}
              onChange={() => setAuction("auction")}
            />
            Auction
          </label>
        </div>
      </form>
    </Fragment>
  );
};

export default Search;
