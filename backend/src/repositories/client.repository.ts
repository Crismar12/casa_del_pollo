import { db } from '../config/database';
import { Client, CreateClientPayload } from '../types/client.types';

export const clientRepository = {
  async createClient(clientData: CreateClientPayload): Promise<Client> {
    const result = await db.query(
      'INSERT INTO cliente (nombre, telefono, direccion, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [clientData.nombre, clientData.telefono, clientData.direccion, clientData.email]
    );
    return result.rows[0] as Client;
  },

  async findClientByEmail(email: string): Promise<Client | null> {
    const result = await db.query('SELECT * FROM cliente WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Client;
  },
};
