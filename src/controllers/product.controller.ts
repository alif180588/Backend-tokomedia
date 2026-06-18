import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProductService } from '../services/product.service';
import { validateCreateProduct, validateUpdateProduct } from '../validators/product.validator';
import { BadRequestError } from '../utils/errors';

export class ProductController {

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { error, value } = validateCreateProduct(req.body);
      if (error) {
        const messages = error.details.map((d: any) => d.message).join(', ');
        throw new BadRequestError(messages);
      }

      // Parse boolean/number fields from multipart form data
      const data = ProductController.parseFormData(value);

      const product = await ProductService.createProduct(data, req.file, req.user!.userId);
      res.status(201).json({
        success: true,
        message: 'Produk berhasil dibuat',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
      const search = req.query.search as string | undefined;

      const result = await ProductService.getProducts(page, limit, search);
      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { error, value } = validateUpdateProduct(req.body);
      if (error) {
        const messages = error.details.map((d: any) => d.message).join(', ');
        throw new BadRequestError(messages);
      }

      const data = ProductController.parseFormData(value);

      const product = await ProductService.updateProduct(req.params.id, data, req.file, req.user!.userId);
      res.json({
        success: true,
        message: 'Produk berhasil diperbarui',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.deleteProduct(req.params.id, req.user!.userId);
      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  // Multipart form-data sends everything as strings; parse booleans and numbers
  private static parseFormData(data: any): any {
    const parsed = { ...data };

    const boolFields = ['free_shipping', 'is_official', 'is_power_shop', 'use_price_badge', 'show_discount_beside'];
    for (const field of boolFields) {
      if (parsed[field] !== undefined) {
        parsed[field] = parsed[field] === true || parsed[field] === 'true' || parsed[field] === '1';
      }
    }

    const intFields = ['price', 'original_price', 'discount', 'sold'];
    for (const field of intFields) {
      if (parsed[field] !== undefined) {
        parsed[field] = parseInt(parsed[field], 10);
      }
    }

    const floatFields = ['rating'];
    for (const field of floatFields) {
      if (parsed[field] !== undefined) {
        parsed[field] = parseFloat(parsed[field]);
      }
    }

    return parsed;
  }
}
