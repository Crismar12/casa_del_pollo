import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SALT_ROUNDS = 10;
const isDryRun = process.argv.includes('--dry-run');

async function hashExistingPasswords() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log(`Modo: ${isDryRun ? 'DRY RUN (sin cambios)' : 'PRODUCCIÓN (se aplicarán cambios)'}`);
    console.log('Conectando a la base de datos...');

    const result = await pool.query('SELECT idusuario, email, contrasena FROM usuario');
    const users = result.rows;

    console.log(`Usuarios encontrados: ${users.length}`);

    let hashed = 0;
    let skipped = 0;

    for (const user of users) {
      if (user.contrasena.startsWith('$2b$')) {
        console.log(`  SKIP  ${user.email} — ya hasheada`);
        skipped++;
        continue;
      }

      const newHash = await bcrypt.hash(user.contrasena, SALT_ROUNDS);

      if (!isDryRun) {
        await pool.query('UPDATE usuario SET contrasena = $1 WHERE idusuario = $2', [newHash, user.idusuario]);
      }

      console.log(`  HASH  ${user.email} — ${isDryRun ? '(sin guardar)' : '(guardado)'}`);
      hashed++;
    }

    console.log(`\nResumen: ${hashed} hasheadas, ${skipped} saltadas`);
    if (isDryRun) {
      console.log('Ejecuta sin --dry-run para aplicar los cambios.');
    }
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

hashExistingPasswords();
