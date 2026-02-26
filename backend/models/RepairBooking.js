const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RepairBooking', {
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticketRef:   { type: DataTypes.STRING(20), allowNull: false, unique: true },
    userId:      { type: DataTypes.UUID, allowNull: true },
    // Customer info (for guest bookings)
    customerName:  { type: DataTypes.STRING(200), allowNull: false },
    customerEmail: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING(20), allowNull: false },
    // Device info
    deviceType:  { type: DataTypes.STRING(100), allowNull: false },
    deviceBrand: { type: DataTypes.STRING(100), allowNull: true },
    deviceModel: { type: DataTypes.STRING(100), allowNull: true },
    issueType:   { type: DataTypes.STRING(200), allowNull: false },
    issueDescription: { type: DataTypes.TEXT, allowNull: false },
    deviceImages: { type: DataTypes.TEXT('long'),  allowNull: true, comment: 'Array of uploaded image URLs',
                  get() {
                    const raw = this.getDataValue('deviceImages');
                    return raw ? JSON.parse(raw) : null;
                  },
                  set(value) {
                    this.setDataValue('deviceImages', JSON.stringify(value));
                  },
                 },
    // Status tracking
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'awaiting_parts', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    assignedTechnicianId: { type: DataTypes.UUID, allowNull: true },
    technicianNotes: { type: DataTypes.TEXT, allowNull: true },
    estimatedCost:   { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    finalCost:       { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    estimatedCompletion: { type: DataTypes.DATE, allowNull: true },
    completedAt:     { type: DataTypes.DATE, allowNull: true },
    invoiceUrl:      { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'repair_bookings',
    timestamps: true,
  });
};
