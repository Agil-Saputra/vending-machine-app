'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from '../lib/validation';
import { Product, ProductFormData } from '../types';
import Link from 'next/link';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3001/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      setMessage('Gagal memuat produk');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingId) {
        // Update
        await fetch(`http://localhost:3001/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...data }),
        });
        setMessage('Produk berhasil diperbarui!');
        setEditingId(null);
      } else {
        // Create
        await fetch('http://localhost:3001/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        setMessage('Produk berhasil ditambahkan!');
      }
      reset();
      fetchProducts();
    } catch (error) {
      setMessage('Gagal menyimpan produk');
    }
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setValue('name', product.name);
    setValue('price', product.price);
    setValue('stock', product.stock);
    setValue('image', product.image);
    setValue('category', product.category);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      await fetch(`http://localhost:3001/products/${id}`, {
        method: 'DELETE',
      });
      setMessage('Produk berhasil dihapus!');
      fetchProducts();
    } catch (error) {
      setMessage('Gagal menghapus produk');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset();
  };

  return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
            <Link
              href="/"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              ← Kembali ke Vending Machine
            </Link>
          </div>
          <p className="text-gray-600 mt-2">Kelola produk vending machine</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center">{message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 border-10 border-gray-600 rounded-2xl">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingId ? 'Edit Produk' : 'Tambah Produk'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Produk
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Contoh: Coca Cola"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harga (Rp)
                </label>
                <input
                  {...register('price')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="8000"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stok
                </label>
                <input
                  {...register('stock')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="10"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Gambar
                </label>
                <input
                  {...register('image')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="/images/product.jpg"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Pilih kategori</option>
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  {editingId ? 'Perbarui' : 'Tambah'} Produk
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="py-3 px-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Daftar Produk</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Belum ada produk</p>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-indigo-600 font-semibold">
                          Rp{product.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Stok: {product.stock}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="flex-1 py-2 px-3 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
