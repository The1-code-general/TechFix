const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Payment', {
    id:              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId:         { type: DataTypes.UUID, allowNull: false },
    reference:       { type: DataTypes.STRING, allowNull: false, unique: true },
    paystackReference: { type: DataTypes.STRING, allowNull: true },
    amount:          { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    currency:        { type: DataTypes.STRING(5), defaultValue: 'NGN' },
    status:          { type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'), defaultValue: 'pending' },
    channel:         { type: DataTypes.STRING(50), allowNull: true, comment: 'card, bank_transfer, ussd, etc.' },
    gatewayResponse: { type: DataTypes.TEXT, allowNull: true },
    paidAt:          { type: DataTypes.DATE, allowNull: true },
    metadata:        { type: DataTypes.TEXT('long'),  allowNull: true,
                        get() {
                          const raw = this.getDataValue('metadata');
                          return raw ? JSON.parse(raw) : null;
                        },
                        set(value) {
                          this.setDataValue('metadata', JSON.stringify(value));
                        },
                      },
  }, {
    tableName: 'payments',
    timestamps: true,
  });
};
