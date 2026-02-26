
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
  process.env.DB_NAME || 'techfix_db',
  process.env.DB_USER || 'sa',
  process.env.DB_PASS || '1234',
  {
    host: process.env.DB_HOST || 'DESKTOP-NICTN2T',
    dialect: 'mssql',
    dialectOptions: {
      options: {
        instanceName: process.env.DB_INSTANCE || 'MSSQLSERVER01',
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 30000,
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);


// ─── Import Models ────────────────────────────────────────────────────────────
const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const RepairBooking = require('./RepairBooking')(sequelize);
const Payment = require('./Payment')(sequelize);

// ─── Associations ─────────────────────────────────────────────────────────────

// User & Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

// Order & OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product & OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Category & Product
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User & RepairBooking
User.hasMany(RepairBooking, { foreignKey: 'userId', as: 'repairBookings' });
RepairBooking.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

// Order & Payment
Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  RepairBooking,
  Payment,
};
