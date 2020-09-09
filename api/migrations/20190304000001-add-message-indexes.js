module.exports = {
  up: async function (migration, DataTypes) {
    await migration.addIndex('messages', ['createdAt', 'teamId', 'contactId'])
    await migration.addIndex('messages', ['teamId'])
    await migration.addIndex('messages', ['contactId'])

    await migration.addIndex('notes', ['createdAt', 'teamId', 'contactId'])
    await migration.addIndex('notes', ['teamId'])
    await migration.addIndex('notes', ['contactId'])
  },

  down: async function (migration, DataTypes) {
    await migration.dropIndex('messages', ['createdAt', 'teamId', 'contactId'])
    await migration.dropIndex('messages', ['teamId'])
    await migration.dropIndex('messages', ['contactId'])

    await migration.dropIndex('notes', ['createdAt', 'teamId', 'contactId'])
    await migration.dropIndex('notes', ['teamId'])
    await migration.dropIndex('notes', ['contactId'])
  }
}
