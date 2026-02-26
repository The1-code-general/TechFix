const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Category', {
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name:        { type: DataTypes.STRING(100), allowNull: false, unique: true },
    slug:        { type: DataTypes.STRING(120), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    image:       { type: DataTypes.STRING, allowNull: true },
    isActive:    { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'categories',
    timestamps: true,
  });
};
