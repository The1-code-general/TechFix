const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Product', {
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    categoryId:  { type: DataTypes.UUID, allowNull: false },
    name:        { type: DataTypes.STRING(200), allowNull: false },
    slug:        { type: DataTypes.STRING(220), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    price:       { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    stock:       { type: DataTypes.INTEGER, defaultValue: 0 },
    images:      { type: DataTypes.TEXT('long'),  allowNull: true,
                  get() {
                    const raw = this.getDataValue('images');
                    return raw ? JSON.parse(raw) : null;
                  },
                  set(value) {
                    this.setDataValue('images', JSON.stringify(value));
                  },
                 },
    brand:       { type: DataTypes.STRING(100), allowNull: true },
    model:       { type: DataTypes.STRING(100), allowNull: true },
    specifications: { type: DataTypes.TEXT('long'),  allowNull: true,
                  get() {
                    const raw = this.getDataValue('specifications');
                    return raw ? JSON.parse(raw) : null;
                  },
                  set(value) {
                    this.setDataValue('specifications', JSON.stringify(value));
                  },
                 },
    isFeatured:  { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive:    { type: DataTypes.BOOLEAN, defaultValue: true },
    sku:         { type: DataTypes.STRING(100), allowNull: true, unique: true },
  }, {
    tableName: 'products',
    timestamps: true,
  });
};
