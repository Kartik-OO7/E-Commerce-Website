require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const items = [
  ['Wireless Mouse', 'Electronics', 799, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKWA0zjcx4AI5vFs53Ae_d_MjJ-xZYWKdJQmrlfHnKg&s=10'],
  ['Mechanical Keyboard', 'Electronics', 3499, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLvYIYBMv-63uayh0LndFWrqOawmqSBY9O_4FbG1MAQQ&s=10'],
  ['USB-C Hub', 'Electronics', 1299, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAcTPzTgAFppZTf3V6-LseyDpwYMTFZP3iBM2NYbiVFg&s=10'],
  ['Laptop Stand', 'Accessories', 999, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmHG5RipB5wZGmZZK4IRBtrORWcS1uW6w13ufZc-FXOg&s=10'],
  ['Noise Cancelling Headphones', 'Electronics', 5999, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHXPyeIYFJqE1EEKk6cu5HuDGaWC_UKV9I_viWf6Voig&s=10'],
  ['Webcam 1080p', 'Electronics', 2199, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKQ54GXoZ5sSRWM2reXOwSvLCAqyv68lpDB3-3yWOT_Q&s=10'],
  ['Desk Lamp', 'Home', 899, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbcSC5ZBB_qBz8zuSAuB6XGWfQpn6BE6W-Vxl2hVyQew&s=10'],
  ['Notebook Pack (3)', 'Stationery', 249, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz-j4rIxaD8RiBQw9dVzdEun1XgBco17b48tTu3fFmOQ&s=10'],
  ['Gel Pen Set', 'Stationery', 149, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnhMtDxQLlhM_LKFC21RkOGkUAjEk8MJtWCgi440bQJg&s=10'],
  ['Backpack 30L', 'Accessories', 1799, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZaKvIV3CQ56ILYBqYcyeVE-de7A8gr5tZtOvgqm-Onw&s=10'],
  ['Water Bottle', 'Home', 399, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmFN0UFI0310wOQP9VCmQSYYOmJCcLSqHwpFQ5tRabdw&s=10'],
  ['Phone Tripod', 'Accessories', 599, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHHe2RqXYKhdr2plFZJL5NJ3DOj-bfrQC6SD49IUf45g&s=10'],
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(items.map(([name, category, price, image]) => ({
  name, category, price, stock: 25,
  description: `${name} - good quality, built for daily student and developer use.`,
  image,
})));
  if (!(await User.findOne({ email: 'admin@shop.com' })))
    await User.create({ name: 'Admin', email: 'admin@shop.com', password: 'admin123', isAdmin: true });
  console.log('Seeded. Admin login: admin@shop.com / admin123');
  process.exit();
})();
