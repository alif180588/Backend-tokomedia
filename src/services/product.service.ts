/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import prisma from '../config/database';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import 'multer';

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount?: number;
  rating?: number;
  sold?: number;
  sold_label?: string;
  location: string;
  promo_text?: string;
  free_shipping?: boolean;
  meta_icon?: string;
  is_official?: boolean;
  is_power_shop?: boolean;
  use_price_badge?: boolean;
  show_discount_beside?: boolean;
}

export class ProductService {

  static async createProduct(data: CreateProductData, file: Express.Multer.File | undefined, userId: string) {
    if (!file) {
      throw new BadRequestError('Foto produk wajib diunggah');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const product = await tx.product_232035.create({
          data: {
            name: data.name,
            description: data.description,
            price: data.price,
            original_price: data.original_price,
            discount: data.discount || 0,
            rating: data.rating || 5.0,
            sold: data.sold || 0,
            sold_label: data.sold_label || null,
            location: data.location,
            promo_text: data.promo_text || '',
            free_shipping: data.free_shipping || false,
            meta_icon: data.meta_icon || 'none',
            is_official: data.is_official || false,
            is_power_shop: data.is_power_shop || false,
            use_price_badge: data.use_price_badge || false,
            show_discount_beside: data.show_discount_beside || false,
            user_id: userId,
          },
        });

        const imageUrl = `/uploads/products/${file.filename}`;
        const image = await tx.productImage_232035.create({
          data: {
            product_id: product.id,
            url: imageUrl,
            storage_path: file.path,
            file_name: file.filename,
            mime_type: file.mimetype,
            file_size: file.size,
            is_primary: true,
          },
        });

        return { ...product, images: [image] };
      });

      return result;
    } catch (err) {
      // Rollback: delete uploaded file if transaction failed
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        logger.info(`Rolled back uploaded file: ${file.path}`);
      }
      throw err;
    }
  }

  static async getProducts(page: number = 1, limit: number = 12, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search && search.trim()) {
      where.name = { contains: search.trim() };
    }

    const [products, total] = await Promise.all([
      prisma.product_232035.findMany({
        where,
        include: { images: true },
        orderBy: { created_at: 'asc' },
        skip,
        take: limit,
      }),
      prisma.product_232035.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        has_more: skip + products.length < total,
      },
    };
  }

  static async getProductById(id: string) {
    const product = await prisma.product_232035.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw new BadRequestError('Produk tidak ditemukan');
    }

    return product;
  }

  static async updateProduct(id: string, data: Partial<CreateProductData>, file: Express.Multer.File | undefined, userId: string) {
    const existing = await prisma.product_232035.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      throw new BadRequestError('Produk tidak ditemukan');
    }

    if (existing.user_id !== userId) {
      throw new UnauthorizedError('Anda tidak memiliki akses untuk mengubah produk ini');
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.product_232035.update({
        where: { id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.price !== undefined ? { price: data.price } : {}),
          ...(data.original_price !== undefined ? { original_price: data.original_price } : {}),
          ...(data.discount !== undefined ? { discount: data.discount } : {}),
          ...(data.rating !== undefined ? { rating: data.rating } : {}),
          ...(data.sold !== undefined ? { sold: data.sold } : {}),
          ...(data.sold_label !== undefined ? { sold_label: data.sold_label } : {}),
          ...(data.location !== undefined ? { location: data.location } : {}),
          ...(data.promo_text !== undefined ? { promo_text: data.promo_text } : {}),
          ...(data.free_shipping !== undefined ? { free_shipping: data.free_shipping } : {}),
          ...(data.meta_icon !== undefined ? { meta_icon: data.meta_icon } : {}),
          ...(data.is_official !== undefined ? { is_official: data.is_official } : {}),
          ...(data.is_power_shop !== undefined ? { is_power_shop: data.is_power_shop } : {}),
          ...(data.use_price_badge !== undefined ? { use_price_badge: data.use_price_badge } : {}),
          ...(data.show_discount_beside !== undefined ? { show_discount_beside: data.show_discount_beside } : {}),
        },
      });

      if (file) {
        // Delete old images
        const oldImages = existing.images;
        for (const img of oldImages) {
          if (fs.existsSync(img.storage_path)) {
            fs.unlinkSync(img.storage_path);
          }
        }
        await tx.productImage_232035.deleteMany({ where: { product_id: id } });

        // Create new image record
        const imageUrl = `/uploads/products/${file.filename}`;
        await tx.productImage_232035.create({
          data: {
            product_id: id,
            url: imageUrl,
            storage_path: file.path,
            file_name: file.filename,
            mime_type: file.mimetype,
            file_size: file.size,
            is_primary: true,
          },
        });
      }

      return await tx.product_232035.findUnique({
        where: { id },
        include: { images: true },
      });
    });

    return result;
  }

  static async deleteProduct(id: string, userId: string) {
    const existing = await prisma.product_232035.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      throw new BadRequestError('Produk tidak ditemukan');
    }

    if (existing.user_id !== userId) {
      throw new UnauthorizedError('Anda tidak memiliki akses untuk menghapus produk ini');
    }

    // Delete image files from disk
    for (const img of existing.images) {
      if (fs.existsSync(img.storage_path)) {
        fs.unlinkSync(img.storage_path);
        logger.info(`Deleted image file: ${img.storage_path}`);
      }
    }

    // Cascade delete will handle ProductImage_232035 records
    await prisma.product_232035.delete({ where: { id } });

    return { message: 'Produk berhasil dihapus' };
  }
}
