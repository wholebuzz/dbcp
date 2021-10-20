# pg-watch

Create Postgres triggers and watch notify listeners.

## Example

```
// Add to migrations
// for (const query of setupQueries) await knex.raw(query)

// After CREATE TABLE users
// await knex.raw(createNotifyRowFunction('users', 'updated', "'username', orig.username"))
// await knex.raw(createNotifyTrigger('users', 'updated'))

// Maximum PostgreSQL NOTIFY payload is 8192 bytes.
// await knex.raw(createNotifyRowFieldsFunction('event', 'updated', "'date', orig.date, 'guid', orig.guid))
// await knex.raw(createNotifyTrigger('event', 'updated'))
```
