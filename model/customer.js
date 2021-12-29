const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "username_UNIQUE"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING(11),
      allowNull: true,
      unique: "telephone_UNIQUE"
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "inactive"
    }
  }, {
    sequelize,
    tableName: 'customer',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "username_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "telephone_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "telephone" },
        ]
      },
    ]
  });
};
