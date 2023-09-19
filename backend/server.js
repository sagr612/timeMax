const app = require("./app");
const server = require("http").Server(app);
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend's URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
});

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Socket.io
io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);

  // Handle bid updates here
  const handleBidUpdate = ({ productId, newBid, userId, currentBid }) => {
    // You can add your conditional logic here to check if the bid is valid
    const limit = currentBid + 200;
    if (newBid <= 25000 && limit <= newBid) {
      // Update the product's bid details in your database
      // Emit the updated product details to all connected clients
      io.emit("bidUpdate", { productId, newBid, userId });
    }
  };

  socket.on("placeBid", handleBidUpdate);

  socket.on("disconnect", () => {
    console.log("Socket disconnected: " + socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

module.exports = { io, server };
