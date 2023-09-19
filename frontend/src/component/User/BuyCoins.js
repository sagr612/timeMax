import React, { Fragment, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadUser } from "../../actions/userAction";

import axios from "axios";
import "./buyCoins.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import EventIcon from "@material-ui/icons/Event";
import { RiCopperCoinLine } from "react-icons/ri";

const BuyCoins = ({ history }) => {
  const [coins, setCoins] = useState(0);
  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { user } = useSelector((state) => state.user);

  const paymentData = {
    amount: parseInt(coins),
    userId: user._id,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/payment/coinPurchase",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          alert.success("Coins purchased successfully!");
          dispatch(loadUser());

          history.push("/account");
        } else {
          alert.error("There's some issue while processing payment");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };

  return (
    <Fragment>
      <MetaData title="Purchase Coins" />
      <div className="BuyContainer">
        <form className="CoinForm" onSubmit={(e) => submitHandler(e)}>
          <h1>Purchase Coins</h1>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="CoinInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="CoinInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="CoinInput" />
          </div>

          <div>
            <RiCopperCoinLine />
            <input
              type="number"
              // value={coins}
              onChange={(e) => setCoins(e.target.value)}
              className="CoinInput"
              placeholder="Coins"
              min={60}
            />
          </div>

          <input
            type="submit"
            value={`Purchase Coins - ₹${coins}`}
            ref={payBtn}
            className="CoinFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default BuyCoins;
