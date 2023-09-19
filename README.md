# Time Max

**A Real-time auction and Ecommerce site for watches**

## Features

- Admin DashBoard
- Real-time auctions
- Search, Filtering, Pagination
- CRUD operations
- Forgot Password using nodemailer
- Purchase Coins
- Admin Dashboard

## Environment Variables

Make Sure to Create a config.env file in backend/config directory and add appropriate variables in order to use the app.

`PORT` `STRIPE_API_KEY` `STRIPE_SECRET_KEY` `FRONTEND_URL` `DB_URI` `JWT_SECRET` `JWT_EXPIRE` `COOKIE_EXPIRE`

`SMPT_MAIL=gmail`

`SMPT_PASSWORD=create an app password and fill it here`

`SMPT_SERVICE=gmail`

`SMPT_HOST=smtp@gmail.com`

`SMPT_PORT=465`
`CLOUDINARY_API_SECRET`

`CLOUDINARY_NAME`

`CLOUDINARY_API_KEY`

Change the proxy value in frontend/package.json to your network url:4000

## Installation Steps

- Use node version 16.0.0
- Clone the github repository
- Then run

```
 npm i
 cd frontend && npm i
```

- To run it locally

```
npm run dev
cd frontend && npm start
```

## Deployment

Deployment [link](https://time-max-app.onrender.com)
