import * as yup from 'yup';

export const productSchema = yup.object({
  name: yup
    .string()
    .required('Nama produk wajib diisi')
    .min(3, 'Nama minimal 3 karakter')
    .max(50, 'Nama maksimal 50 karakter'),
  price: yup
    .number()
    .required('Harga wajib diisi')
    .positive('Harga harus positif')
    .min(1000, 'Harga minimal Rp1.000')
    .typeError('Harga harus berupa angka'),
  stock: yup
    .number()
    .required('Stok wajib diisi')
    .integer('Stok harus bilangan bulat')
    .min(0, 'Stok tidak boleh negatif')
    .typeError('Stok harus berupa angka'),
  image: yup
    .string()
    .required('URL gambar wajib diisi')
    .url('Format URL tidak valid'),
  category: yup
    .string()
    .required('Kategori wajib diisi')
    .oneOf(['makanan', 'minuman'], 'Kategori harus makanan atau minuman'),
});
