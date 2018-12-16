module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,

      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        validate: { isEmail: true }
      },
      phoneNumber: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      passwordHash: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      passwordResetToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      requirePasswordChange: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      firstName: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    })

    await migration.addIndex('users', ['email'], {
      indicesType: 'UNIQUE'
    })

    await migration.addIndex('users', ['phoneNumber'], {
      indicesType: 'UNIQUE'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('users')
  }
}
