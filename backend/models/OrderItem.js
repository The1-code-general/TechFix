const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('OrderItem', {
    id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId:   { type: DataTypes.UUID, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    quantity:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    subtotal:  { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    productSnapshot:   { type: DataTypes.TEXT('long'),  allowNull: true, comment: 'Product details at time of order',
                  get() {
                    const raw = this.getDataValue('productSnapshot');
                    return raw ? JSON.parse(raw) : null;
                  },
                  set(value) {
                    this.setDataValue('productSnapshot', JSON.stringify(value));
                  },
                 },
  }, {
    tableName: 'order_items',
    timestamps: true,
  });
};
