import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).required()
    .messages({ 'any.required': 'Nama produk wajib diisi', 'string.min': 'Nama produk minimal 3 karakter' }),
  description: Joi.string().trim().min(10).max(5000).required()
    .messages({ 'any.required': 'Deskripsi produk wajib diisi', 'string.min': 'Deskripsi minimal 10 karakter' }),
  price: Joi.number().integer().min(100).required()
    .messages({ 'any.required': 'Harga wajib diisi', 'number.min': 'Harga minimal Rp100' }),
  original_price: Joi.number().integer().min(100).required()
    .messages({ 'any.required': 'Harga asli wajib diisi' }),
  discount: Joi.number().integer().min(0).max(100).default(0)
    .messages({ 'number.max': 'Diskon maksimal 100%' }),
  rating: Joi.number().min(0).max(5).default(5.0),
  sold: Joi.number().integer().min(0).default(0),
  sold_label: Joi.string().trim().max(50).allow('', null).optional(),
  location: Joi.string().trim().min(2).max(255).required()
    .messages({ 'any.required': 'Lokasi/nama toko wajib diisi' }),
  promo_text: Joi.string().trim().max(255).allow('', null).default(''),
  free_shipping: Joi.boolean().default(false),
  meta_icon: Joi.string().valid('none', 'officialStore', 'powerMerchant', 'legacy').default('none'),
  is_official: Joi.boolean().default(false),
  is_power_shop: Joi.boolean().default(false),
  use_price_badge: Joi.boolean().default(false),
  show_discount_beside: Joi.boolean().default(false),
});

export const updateProductSchema = createProductSchema.fork(
  ['name', 'description', 'price', 'original_price', 'location'],
  (schema) => schema.optional()
);

export function validateCreateProduct(data: any) {
  return createProductSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateUpdateProduct(data: any) {
  return updateProductSchema.validate(data, { abortEarly: false, stripUnknown: true });
}
