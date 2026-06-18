import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadProductImage } from '../middleware/upload.middleware';

const router = Router();

// Public endpoints
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Protected endpoints (require auth)
router.post('/', authMiddleware, uploadProductImage, ProductController.create);
router.put('/:id', authMiddleware, uploadProductImage, ProductController.update);
router.delete('/:id', authMiddleware, ProductController.delete);

export default router;
