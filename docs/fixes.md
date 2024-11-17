### Prisma

#### Checksum change leads to reset entire database

- Regenerate checksum manually

```bash
cat prisma/migrations/20241110103009_fix_created_date_of_expense/migration.sql | shasum -a 256
```

- Update the checksum in the `migration` table

```sql
UPDATE "_prisma_migrations" SET checksum = 'new_checksum' WHERE name = '20241110103009_fix_created_date_of_expense';
```

