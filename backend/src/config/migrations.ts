import { db } from '../config/database';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

async function ensureMigrationsTable(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id serial primary key,
      name text not null unique,
      executed_at timestamptz not null default now()
    );
  `);
}

async function getExecutedMigrations(): Promise<string[]> {
  const result = await db.query('SELECT name FROM _migrations ORDER BY name');
  return result.rows.map((r: { name: string }) => r.name);
}

export async function runMigrations(): Promise<void> {
  logger.info('Verificando migraciones pendientes...');

  await ensureMigrationsTable();
  const executed = await getExecutedMigrations();

  const migrationsDir = path.resolve(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  let pending = 0;

  for (const file of files) {
    if (executed.includes(file)) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    logger.info(`Ejecutando migración: ${file}`);

    try {
      await db.query(sql);
      await db.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      logger.info(`✅ Migración completada: ${file}`);
      pending++;
    } catch (error) {
      logger.error(`❌ Error en migración ${file}:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  if (pending === 0) {
    logger.info('No hay migraciones pendientes');
  }
}
