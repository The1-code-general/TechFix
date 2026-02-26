const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName:  { type: DataTypes.STRING(100), allowNull: false },
    email:     { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone:     { type: DataTypes.STRING(20), allowNull: true },
    password:  { type: DataTypes.STRING, allowNull: false },
    role:      { type: DataTypes.ENUM('customer', 'admin', 'technician'), defaultValue: 'customer' },
    isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    emailVerifyToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordToken:   { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
    address:  { type: DataTypes.TEXT, allowNull: true },
    avatar:   { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  });

  User.prototype.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpires;
    delete values.emailVerifyToken;
    return values;
  };

  return User;
};
