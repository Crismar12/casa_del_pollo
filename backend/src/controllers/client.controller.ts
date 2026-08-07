import { Request, Response } from 'express';
import { clientService } from '../services/client.service';
import { CreateClientPayload } from '../types/client.types';

export const clientController = {
  async createClient(req: Request, res: Response): Promise<void> {
    const clientPayload: CreateClientPayload = req.body;
    const newClient = await clientService.processNewClient(clientPayload);
    res.status(201).json(newClient);
  },
};
