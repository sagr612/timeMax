const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const { userId, amount } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(201).json({ success: false, message: "User not found" });
  }

  if (user.coins < amount) {
    return res
      .status(201)
      .json({ success: false, message: "Insufficient coins" });
  }

  user.coins -= amount;
  await user.save();

  res.status(200).json({ success: true, message: "Purchase Succesful" });
});

exports.purchaseCoins = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.body.userId);

  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });
  // console.log(typeof user.coins);
  // console.log(typeof req.body.amount);

  user.coins = user.coins + req.body.amount;
  // console.log(typeof user.coins);

  await user.save();

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
