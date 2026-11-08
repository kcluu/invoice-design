import pg from 'pg'
import { config } from '../config'

// keep date columns as yyyy-mm-dd strings instead of js dates shifted by timezone
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value)

export const pool = new pg.Pool({ connectionString: config.databaseUrl })
