const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Order', {
    id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderRef:       { type: DataTypes.STRING(20), allowNull: false, unique: true },
    userId:         { type: DataTypes.UUID, allowNull: false },
    status:         {
      type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
      defaultValue: 'pending',
    },
    paymentStatus:  { type: DataTypes.ENUM('unpaid', 'paid', 'refunded'), defaultValue: 'unpaid' },
    totalAmount:    { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    shippingFee:    { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    shippingAddress: { type: DataTypes.TEXT('long'),  allowNull: true,
                  get() {
                    const raw = this.getDataValue('shippingAddress');
                    return raw ? JSON.parse(raw) : null;
                  },
                  set(value) {
                    this.setDataValue('shippingAddress', JSON.stringify(value));
                  },
                 },
    notes:          { type: DataTypes.TEXT, allowNull: true },
    deliveredAt:    { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'orders',
    timestamps: true,
  });
};
