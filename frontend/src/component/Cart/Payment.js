import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import axios from "axios";
import "./payment.css";

import { createOrder, clearErrors } from "../../actions/orderAction";
import { clearCart } from "../../actions/cartAction";
import { loadUser } from "../../actions/userAction";

const Payment = ({ history }) => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
    userId: user._id,
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/v1/payment/process",
      paymentData,
      config
    );

    if (data.success) {
      alert.success(data.message);
      order.paymentInfo = {
        id: "12",
        status: "Success",
      };
      // console.log(cartItems);
      // console.log(order.orderItems);
      // console.log(order);
      await dispatch(createOrder(order));
      dispatch(clearCart());
      dispatch(loadUser());

      history.push("/success");
    } else {
      alert.error(data.message);
      payBtn.current.disabled = false;
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <h1>Payment</h1>

          <input
            type="submit"
            value={`Pay - ${orderInfo && orderInfo.totalPrice} Coins `}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
