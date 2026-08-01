import { Pool, PoolClient } from 'pg';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

// ===================== CONFIG =====================

const DEMO_USERS = [
  { nombre: 'Admin Demo', email: 'admin@demo.com', contrasena: 'admin123', rol: 'admin' },
  { nombre: 'Vendedor Demo', email: 'vendedor@demo.com', contrasena: 'vend123', rol: 'vendedor' },
];

const CATEGORIES = [
  { nombre: 'Pollo', descripcion: 'Platos principales de pollo' },
  { nombre: 'Bebidas', descripcion: 'Bebidas frías y calientes' },
  { nombre: 'Acompañamientos', descripcion: 'Guarniciones y acompañamientos' },
  { nombre: 'Postres', descripcion: 'Postres y dulces' },
  { nombre: 'Promociones', descripcion: 'Combos y ofertas especiales' },
];

const PRODUCTS = [
  // Categoria: Pollo
  { nombre: '1 Pollo a la Brasa', descripcion: 'Pollo entero asado a la leña. Solo pollo, sin guarniciones.', precio: 52.00, stock: 40, categoria: 'Pollo', imgKey: 'pollo-entero' },
  { nombre: '1/2 Pollo a la Brasa', descripcion: 'Mitad de pollo asado a la leña. Solo pollo.', precio: 27.00, stock: 30, categoria: 'Pollo', imgKey: 'medio-pollo' },
  { nombre: '1/4 de Pollo', descripcion: 'Cuarto de pollo (pecho o pierna). Solo pollo.', precio: 15.00, stock: 50, categoria: 'Pollo', imgKey: 'cuarto-pollo' },

  // Categoria: Promociones (Combos)
  { nombre: 'Combo Familiar', descripcion: '1 Pollo a la brasa + Porción familiar de papas fritas + Ensalada clásica + Gaseosa 1.5L', precio: 75.00, stock: 25, categoria: 'Promociones', imgKey: 'combo-familiar' },
  { nombre: 'Combo Pareja', descripcion: '1/2 Pollo a la brasa + Porción mediana de papas fritas + Ensalada clásica + 2 Gaseosas 500ml', precio: 45.00, stock: 35, categoria: 'Promociones', imgKey: 'combo-pareja' },
  { nombre: 'El Mostrito', descripcion: '1/4 de pollo + Porción de arroz chaufa + Porción de papas fritas + Ensalada', precio: 24.00, stock: 40, categoria: 'Promociones', imgKey: 'mostrito' },

  // Categoria: Acompañamientos
  { nombre: 'Porción de Papas Fritas', descripcion: 'Papas fritas con corte delgado.', precio: 12.00, stock: 100, categoria: 'Acompañamientos', imgKey: 'papas-fritas' },
  { nombre: 'Ensalada Clásica', descripcion: 'Lechuga, tomate en rodajas y pepino con vinagreta de la casa.', precio: 10.00, stock: 60, categoria: 'Acompañamientos', imgKey: 'ensalada-clasica' },
  { nombre: 'Arroz Chaufa', descripcion: 'Arroz frito al wok con sillao, huevo y cebollita china.', precio: 12.00, stock: 50, categoria: 'Acompañamientos', imgKey: 'arroz-chaufa' },
  { nombre: 'Salchipapa Clásica', descripcion: 'Base de papas fritas crujientes con rodajas de hot dog tradicional.', precio: 16.00, stock: 50, categoria: 'Acompañamientos', imgKey: 'salchipapa' },

  // Categoria: Bebidas
  { nombre: 'Inka Kola personal', descripcion: 'Gaseosa Inka Kola 500ml.', precio: 7.50, stock: 80, categoria: 'Bebidas', imgKey: 'inka-kola' },
  { nombre: 'Coca Cola personal', descripcion: 'Gaseosa Coca Cola 500ml', precio: 7.50, stock: 80, categoria: 'Bebidas', imgKey: 'coca-cola' },
  { nombre: 'Vaso de Chicha Morada', descripcion: 'Chicha morada tradicional 500ml.', precio: 8.00, stock: 40, categoria: 'Bebidas', imgKey: 'chicha-morada' },

  // Categoria: Postres
  { nombre: 'Combinado Clásico', descripcion: 'Arroz con leche y mazamorra morada.', precio: 8.00, stock: 30, categoria: 'Postres', imgKey: 'combinado' },
  { nombre: 'Crema Volteada', descripcion: 'Porción de crema volteada tradicional.', precio: 8.00, stock: 20, categoria: 'Postres', imgKey: 'crema-volteada' },
];

const SEED_IMAGES: Record<string, string> = {
  'pollo-entero': '../seed-assets/pollo-entero.avif',
  'medio-pollo': '../seed-assets/medio-pollo.avif',
  'cuarto-pollo': '../seed-assets/cuarto-pollo.avif',
  'combo-familiar': '../seed-assets/combo-familiar.avif',
  'combo-pareja': '../seed-assets/combo-pareja.avif',
  'mostrito': '../seed-assets/mostrito.avif',
  'papas-fritas': '../seed-assets/papas-fritas.avif',
  'ensalada-clasica': '../seed-assets/ensalada-clasica.avif',
  'arroz-chaufa': '../seed-assets/arroz-chaufa.avif',
  'salchipapa': '../seed-assets/salchipapa.avif',
  'inka-kola': '../seed-assets/inka-cola.avif',
  'coca-cola': '../seed-assets/coca-cola.avif',
  'chicha-morada': '../seed-assets/chicha-morada.avif',
  'combinado': '../seed-assets/combinado.avif',
  'crema-volteada': '../seed-assets/crema-volteada.avif',
};

const SEED_IMAGE_FOLDER = 'el-paraiso/productos';
const SEED_IMAGE_TRANSFORMATION: { width: number; height: number; crop: string }[] = [
  { width: 600, height: 400, crop: 'fill' },
];
const SEED_FORCE_IMAGES = process.env.SEED_FORCE_IMAGES === '1';

const ORDER_STATUSES = ['pendiente', 'en preparación', 'en reparto', 'entregado', 'cancelado'] as const;
const STATUS_WEIGHTS = [0.15, 0.10, 0.10, 0.60, 0.05];

// ===================== HELPERS =====================

function weightedRandom<T>(items: readonly T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomDate(daysAgo: number): Date {
  const now = new Date();
  const offset = Math.random() * daysAgo;
  return new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
}

function getExistingImage(publicId: string): Promise<string | null> {
  return new Promise((resolve) => {
    cloudinary.api.resource(
      publicId,
      (error: unknown, result: { secure_url?: string } | undefined) => {
        if (error || !result?.secure_url) return resolve(null);
        resolve(result.secure_url);
      }
    );
  });
}

function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string,
  overwrite = false
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite,
        invalidate: overwrite,
        resource_type: 'image',
        transformation: SEED_IMAGE_TRANSFORMATION,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function cleanupOrphanSeedImages(): Promise<void> {
  const canonical = new Set(
    Object.keys(SEED_IMAGES).map((key) => `${SEED_IMAGE_FOLDER}/${key}`)
  );
  let nextCursor: string | undefined;
  let deleted = 0;

  do {
    const params: Record<string, unknown> = {
      type: 'upload',
      prefix: `${SEED_IMAGE_FOLDER}/`,
      max_results: 100,
    };
    if (nextCursor) params.next_cursor = nextCursor;

    const result = await new Promise<{
      resources?: { public_id: string }[];
      next_cursor?: string;
    }>((resolve, reject) => {
      cloudinary.api.resources(params, (error: unknown, res: unknown) => {
        if (error) return reject(error);
        resolve(res as { resources?: { public_id: string }[]; next_cursor?: string });
      });
    });

    for (const resource of result.resources ?? []) {
      if (canonical.has(resource.public_id)) continue;
      await new Promise<void>((resolve, reject) => {
        cloudinary.uploader.destroy(resource.public_id, { invalidate: true }, (error: unknown) => {
          if (error) return reject(error);
          resolve();
        });
      });
      console.log(`   🗑️  Imagen duplicada eliminada: ${resource.public_id}`);
      deleted++;
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  console.log(
    deleted > 0
      ? `   ✅ Se eliminaron ${deleted} imágenes duplicadas`
      : '   ✅ No hay imágenes duplicadas en Cloudinary'
  );
}

// ===================== SEED LOGIC =====================

export async function runSeed(client: PoolClient): Promise<void> {
  await client.query('BEGIN');

  try {
    console.log('🗑️  Limpiando imágenes duplicadas en Cloudinary...');
    try {
      await cleanupOrphanSeedImages();
    } catch (err) {
      console.warn(
        `   ⚠️  No se pudieron limpiar las imágenes de Cloudinary: ${err instanceof Error ? err.message : err}`
      );
    }

    console.log('🗑️  Limpiando tablas...');
    await client.query('DELETE FROM detallepedido');
    await client.query('DELETE FROM pedido');
    await client.query('DELETE FROM producto');
    await client.query('DELETE FROM categorias');
    await client.query('DELETE FROM cliente');
    await client.query('DELETE FROM usuario');

    await client.query("ALTER SEQUENCE IF EXISTS usuario_idusuario_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE IF EXISTS cliente_idcliente_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE IF EXISTS categorias_idcategoria_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE IF EXISTS producto_idproducto_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE IF EXISTS pedido_idpedido_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE IF EXISTS detallepedido_iddetalle_seq RESTART WITH 1");

    console.log('👤 Creando usuarios demo...');
    const userIds: number[] = [];
    for (const u of DEMO_USERS) {
      const hash = await bcrypt.hash(u.contrasena, 10);
      const res = await client.query(
        'INSERT INTO usuario (nombre, email, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING idusuario',
        [u.nombre, u.email, hash, u.rol]
      );
      userIds.push(res.rows[0].idusuario);
      console.log(`   ✅ ${u.email} (${u.rol})`);
    }

    console.log('📁 Creando categorías...');
    const categoryIds: Record<string, number> = {};
    for (const c of CATEGORIES) {
      const res = await client.query(
        'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING idcategoria',
        [c.nombre, c.descripcion]
      );
      categoryIds[c.nombre] = res.rows[0].idcategoria;
      console.log(`   ✅ ${c.nombre}`);
    }

    console.log('🍗 Creando productos (reutilizando/subiendo imágenes a Cloudinary)...');
    const productIds: number[] = [];
    const productPrices: number[] = [];
    for (const p of PRODUCTS) {
      let imgUrl = '';
      const seedImage = SEED_IMAGES[p.imgKey];
      if (seedImage) {
        try {
          const publicId = `${SEED_IMAGE_FOLDER}/${p.imgKey}`;
          const existingUrl = SEED_FORCE_IMAGES ? null : await getExistingImage(publicId);
          if (existingUrl) {
            imgUrl = existingUrl;
            console.log(`   ↩️  Reutilizando ${p.imgKey} → ${existingUrl.substring(0, 50)}...`);
          } else {
            const imagePath = path.resolve(__dirname, seedImage);
            console.log(`   ⬆️  Subiendo ${p.imgKey}...`);
            const buffer = await fs.promises.readFile(imagePath);
            imgUrl = await uploadToCloudinary(buffer, SEED_IMAGE_FOLDER, p.imgKey, SEED_FORCE_IMAGES);
            console.log(`   ✅ ${p.nombre} → ${imgUrl.substring(0, 50)}...`);
          }
        } catch (err) {
          console.warn(`   ⚠️  Error procesando imagen para ${p.nombre}: ${err}`);
        }
      }

      const res = await client.query(
        'INSERT INTO producto (nombre, descripcion, precio, "imgUrl", categoria_id, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING idproducto',
        [p.nombre, p.descripcion, p.precio, imgUrl, categoryIds[p.categoria], p.stock]
      );
      productIds.push(res.rows[0].idproducto);
      productPrices.push(p.precio);
    }

    console.log('👤 Creando clientes demo...');
    const clientIds: number[] = [];
    for (let i = 0; i < 10; i++) {
      const nombre = faker.person.fullName();
      const telefono = faker.phone.number({ style: 'national' });
      const direccion = faker.location.streetAddress();
      const email = faker.internet.email({ firstName: nombre.split(' ')[0], lastName: nombre.split(' ')[1] || 'X' }).toLowerCase();
      const res = await client.query(
        'INSERT INTO cliente (nombre, telefono, direccion, email) VALUES ($1, $2, $3, $4) RETURNING idcliente',
        [nombre, telefono, direccion, email]
      );
      clientIds.push(res.rows[0].idcliente);
      console.log(`   ✅ ${nombre} (${email})`);
    }

    console.log('📦 Creando 50 pedidos...');
    const vendId = userIds[1];

    for (let i = 0; i < 50; i++) {
      const isRecent = i < 35;
      const fecha = isRecent ? randomDate(7) : randomDate(30);
      fecha.setDate(fecha.getDate() - (isRecent ? 0 : 7));

      const isToday = fecha.toDateString() === new Date().toDateString();
      const estado = isToday
        ? weightedRandom(ORDER_STATUSES, STATUS_WEIGHTS)
        : weightedRandom(['entregado', 'cancelado'] as const, [0.90, 0.10]);
      const clienteId = clientIds[Math.floor(Math.random() * clientIds.length)];
      const clienteName = faker.person.fullName();

      const itemCount = Math.floor(Math.random() * 4) + 1;
      const usedIndices = new Set<number>();
      let total = 0;

      const createdAt = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate(),
        12 + Math.floor(Math.random() * 11),
        Math.floor(Math.random() * 60)
      );

      const orderRes = await client.query(
        `INSERT INTO pedido (fecha, created_at, estado, nombrecliente, direccion, notas, total, idcliente, idusuario)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING idpedido`,
        [fecha.toISOString().split('T')[0], createdAt, estado, clienteName, faker.location.streetAddress(), '', 0, clienteId, vendId]
      );
      const pedidoId = orderRes.rows[0].idpedido;

      for (let j = 0; j < itemCount; j++) {
        let idx: number;
        do { idx = Math.floor(Math.random() * productIds.length); } while (usedIndices.has(idx));
        usedIndices.add(idx);

        const cantidad = Math.floor(Math.random() * 3) + 1;
        const subtotal = Number(productPrices[idx]) * cantidad;
        total += subtotal;

        await client.query(
          'INSERT INTO detallepedido (idpedido, idproducto, cantidad, subtotal) VALUES ($1, $2, $3, $4)',
          [pedidoId, productIds[idx], cantidad, subtotal]
        );
      }

      await client.query('UPDATE pedido SET total = $1 WHERE idpedido = $2', [total, pedidoId]);

      if (i < 5 || i === 49) {
        const fechaStr = fecha.toISOString().split('T')[0];
        console.log(`   ✅ Pedido #${pedidoId} | ${fechaStr} | ${estado} | S/ ${total.toFixed(2)}`);
      }
    }
    console.log('   ... (50 pedidos creados en total)');

    await client.query('COMMIT');
    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('   Usuarios: admin@demo.com / admin123, vendedor@demo.com / vend123');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error durante el seed:', error);
    throw error;
  }
}
