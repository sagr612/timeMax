import React, { Fragment, useEffect } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import {
  getAdminProduct,
  getAuctionAdminProduct,
} from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";
const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);

  const { auctionProducts } = useSelector((state) => state.auctionProducts);

  const { orders } = useSelector((state) => state.allOrders);

  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
    dispatch(getAuctionAdminProduct());
  }, [dispatch]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <Fragment>
      <MetaData title="Dashboard - Admin Panel" />

      <div className="dashboardContainer">
        <h1>Dashboard</h1>

        <div className="Summary">
          <div className="Summary1">
            <p>Total Amount</p>
            <p> ₹{totalAmount}</p>
          </div>

          <div className="Summary2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
            </Link>

            <Link to="/admin/auction/products">
              <p>Auctions</p>
              <p>{auctionProducts && auctionProducts.length}</p>
            </Link>

            <Link className="colorChange" to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>

            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        <div className="charts">
          <div className="lineChart">
            <Line data={lineState} />
          </div>

          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
