import express from 'express';
import * as MetadataController from '../controllers/metadata.controller';

const router = express.Router();

router.get('/', MetadataController.getAllMetadata);
router.post('/', MetadataController.createMetadata);
router.put('/:id', MetadataController.updateMetadata);
router.delete('/:id', MetadataController.deleteMetadata);

export default router;
