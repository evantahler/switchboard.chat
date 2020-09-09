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
    }, {
      charset: 'utf8mb4'
    })

    await migration.addIndex('users', ['email'], {
      unique: true,
      fields: 'email'
    })

    await migration.addIndex('users', ['phoneNumber'], {
      unique: true,
      fields: 'phoneNumber'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('users')
  }
}
