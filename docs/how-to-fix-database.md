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


#### Backup Docker volume

- Store the data in a new volume

```bash
docker container run --rm -it -v backup_db:/to -v xela_timeseries-data:/from ubuntu bash -c "cd /from ;cp -av . /to"
```

- Restore the data from the volume

```bash
docker container run --rm -it -v backup_db:/from -v xela_timeseries-data:/to ubuntu bash -c "cd /from ;cp -av . /to"
``` 


#### Backend Sentry

```bash
&& yarn sentry:sourcemaps
```
