import { Request, Response } from 'express';
import * as MetadataService from '../services/metadata.service';

export const getAllMetadata = async (req: Request, res: Response) => {
  try {
    const data = await MetadataService.fetchAllMetadata();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createMetadata = async (req: Request, res: Response) => {
  try {
    const newItem = await MetadataService.createNewMetadata(req.body);
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMetadata = async (req: Request, res: Response) => {
  try {
    const updated = await MetadataService.updateMetadataById(req.params.id as string, req.body.name);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMetadata = async (req: Request, res: Response) => {
  try {
    await MetadataService.deleteMetadataById(req.params.id as string);
    res.json({ message: 'Deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
