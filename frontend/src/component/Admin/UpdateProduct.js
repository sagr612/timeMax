import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetailsForAll,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";

const UpdateProduct = ({ history, match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, product } = useSelector((state) => state.productDetailsForAll);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  // const [isAuction, setIsAuction] = useState("Yes");

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  // const [startingBid, setStartingBid] = useState(0);
  // const [auctionEndTime, setAuctionEndTime] = useState("");

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

  const productId = match.params.id;

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetailsForAll(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.Stock);
      setOldImages(product.images);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");
      history.push("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    history,
    isUpdated,
    productId,
    product,
    updateError,
  ]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", Stock);
    // myForm.set("isAuction", isAuction);
    // myForm.set("startingBid", startingBid);
    // myForm.set("auctionEndTime", auctionEndTime);

    images.forEach((image) => {
      myForm.append("images", image);
    });
    dispatch(updateProduct(productId, myForm));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };
  const removeImage = (index) => {
    const newImagesPreview = [...imagesPreview];
    const newImages = [...images];

    newImagesPreview.splice(index, 1);
    newImages.splice(index, 1);

    setImagesPreview(newImagesPreview);
    setImages(newImages);
  };
  const removeOldImages = (index) => {
    // Create a copy of the oldImages array
    const newOldImages = [...oldImages];

    // Remove the image at the specified index
    newOldImages.splice(index, 1);

    // Update the state with the new oldImages array
    setOldImages(newOldImages);
  };

  const clearImages = () => {
    setImagesPreview([]); // Clear the images preview
    setImages([]); // Clear the images array
    setOldImages([]);
  };
  return (
    <Fragment>
      <MetaData title="Update Product" />

      <div className="newProductContainer">
        <form
          className="createProductForm"
          encType="multipart/form-data"
          onSubmit={updateProductSubmitHandler}
        >
          <h1>Update Product</h1>

          <div>
            <SpellcheckIcon />
            <input
              type="text"
              placeholder="Product Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <DescriptionIcon />

            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols="30"
              rows="1"
            ></textarea>
          </div>

          <div>
            <AccountTreeIcon />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose Category</option>
              {categories.map((cate) => (
                <option key={cate} value={cate}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <AttachMoneyIcon />
            <input
              type="number"
              placeholder="Price"
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <StorageIcon />
            <input
              type="number"
              placeholder="Stock"
              required
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div id="createProductFormImage">
            {oldImages &&
              oldImages.map((image, index) => (
                <div key={index} className="selectedImageContainer">
                  <img src={image.url} alt="Old Product Preview" />
                  <button
                    type="button"
                    className="clearImageButton"
                    onClick={() => removeOldImages(index)}
                  >
                    Clear
                  </button>
                </div>
              ))}
          </div>

          <div id="createProductFormImage">
            {imagesPreview.map((image, index) => (
              <div key={index} className="selectedImageContainer">
                <img src={image} alt="Product Preview" />
                <button
                  type="button"
                  className="clearImageButton"
                  onClick={() => removeImage(index)}
                >
                  Clear
                </button>
              </div>
            ))}
          </div>

          {/* Add a clear button for selected images */}
          {(imagesPreview.length > 0 || oldImages.length > 0) && (
            <div id="clearImagesButtonContainer">
              <button
                type="button"
                className="clearImageButton"
                onClick={clearImages}
              >
                Clear All Images
              </button>
            </div>
          )}

          {(!imagesPreview || imagesPreview.length <= 0) &&
            (!oldImages || oldImages.length <= 0) && (
              <div id="createProductFormFile">
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={updateProductImagesChange}
                  multiple
                />
              </div>
            )}

          <Button
            id="createProductBtn"
            type="submit"
            disabled={loading ? true : false}
          >
            Update
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
