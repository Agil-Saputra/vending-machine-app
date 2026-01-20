"use client";

import { useState, useEffect } from "react";
import { Product, Transaction } from "../types";

const MONEY_OPTIONS = [2000, 5000, 10000, 20000, 50000];

type Step = 1 | 2 | 3;

export default function VendingMachine() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [moneyInserted, setMoneyInserted] = useState(0);
  const [change, setChange] = useState(0);
  const [error, setError] = useState("");
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [pendingMoney, setPendingMoney] = useState(0);
  const [addingMoney, setAddingMoney] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      setError("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    if (product.stock === 0) {
      setError("Maaf, produk ini stok habis!");
      return;
    }
    setSelectedProduct(product);
    setError("");
  };

  const handleNext = () => {
    if (step === 1 && selectedProduct) {
      setStep(2);
    }
  };

  const insertMoney = (amount: number) => {
    setPendingMoney(amount);
    setShowMoneyModal(true);
  };

  const confirmAddMoney = async () => {
    setAddingMoney(true);

    // Simulate money insertion with animation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMoneyInserted((prev) => prev + pendingMoney);
    setAddingMoney(false);
    setShowMoneyModal(false);
    setPendingMoney(0);
    setError("");
  };

  const cancelAddMoney = () => {
    setShowMoneyModal(false);
    setPendingMoney(0);
  };

  const handleConfirmPayment = async () => {
    if (!selectedProduct) return;

    if (moneyInserted < selectedProduct.price) {
      setError(
        `Uang tidak cukup! Kurang Rp${(selectedProduct.price - moneyInserted).toLocaleString("id-ID")}`,
      );
      return;
    }

    const calculatedChange = moneyInserted - selectedProduct.price;
    setChange(calculatedChange);

    try {
      // Update stock
      await fetch(`http://localhost:3001/products/${selectedProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: selectedProduct.stock - 1 }),
      });

      // Create transaction
      const transaction: Omit<Transaction, "id"> = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price: selectedProduct.price,
        moneyInserted,
        change: calculatedChange,
        timestamp: new Date().toISOString(),
      };

      await fetch("http://localhost:3001/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      setStep(3);
      setError("");
    } catch (error) {
      setError("Gagal melakukan pembelian");
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedProduct(null);
    setMoneyInserted(0);
    setChange(0);
    setError("");
    fetchProducts();
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setMoneyInserted(0);
      setError("");
    }
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen ">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-gray-600">
          {step === 1 &&
            "Dengan 3 langkah mudah, dapatkan camilan dan minuman favoritmu!"}
          {step === 2 && "Masukkan uang untuk pembayaran"}
          {step === 3 && "Transaksi berhasil!"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
            <div className="text-sm ml-2 mr-4 font-semibold">Pilih Produk</div>
          </div>
          <div
            className={`h-1 w-16 ${step >= 2 ? "bg-indigo-600" : "bg-gray-300"}`}
          ></div>
          <div className="flex items-center mx-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <div className="text-sm ml-2 font-semibold">Pembayaran</div>
          </div>
          <div
            className={`h-1 w-16 ${step >= 3 ? "bg-indigo-600" : "bg-gray-300"}`}
          ></div>
          <div className="flex items-center ml-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              3
            </div>
            <div className="text-sm ml-2 font-semibold">Selesai</div>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="max-w-6xl border-10 border-gray-600 rounded-2xl mx-auto shadow-md p-6">
          <div className="bg-white rounded-2xl mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Pilih Item Yang Kamu Inginkan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={`border-2 relative rounded-xl p-4 cursor-pointer transition-all ${
                    product.stock === 0
                      ? "border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed"
                      : selectedProduct?.id === product.id
                        ? "border-indigo-600 bg-indigo-50 shadow-lg"
                        : "border-gray-200 hover:border-indigo-400 hover:shadow-md"
                  }`}
                >
                  <img src={product.image} alt={product.name} className="object-contain w-full rounded-lg h-40" />
                  <h3 className="font-bold text-lg mb-1 text-center">
                    {product.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-1 text-center">
                    {formatPrice(product.price)}
                  </p>
                  <p
                    className={`text-sm text-center ${product.stock === 0 ? "text-red-500" : "text-gray-600"}`}
                  >
                    Stok: {product.stock}
                  </p>
                  {selectedProduct?.id === product.id && (
                    <div className="mt-2 text-center absolute top-2 right-2">
                      <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                        ✓ Dipilih
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedProduct && (
              <button
                onClick={handleNext}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Lanjut ke Pembayaran →
              </button>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && selectedProduct && (
        <div className="max-w-6xl mx-auto border-10 border-gray-600 rounded-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Detail Pembelian
              </h3>
              <div className="text-center mb-4">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="object-contain w-full rounded-lg h-40" />
               
                <p className="font-bold text-xl mb-2">{selectedProduct.name}</p>
                <p className="text-indigo-600 font-bold text-2xl">
                  {formatPrice(selectedProduct.price)}
                </p>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Harga:</span>
                  <span className="font-semibold">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Uang Dimasukkan:</span>
                  <span className="font-semibold text-indigo-600">
                    {formatPrice(moneyInserted)}
                  </span>
                </div>
                {moneyInserted >= selectedProduct.price && (
                  <div className="flex justify-between text-lg font-bold text-indigo-600 pt-2 border-t">
                    <span>Kembalian:</span>
                    <span>
                      {formatPrice(moneyInserted - selectedProduct.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Money Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Masukkan Nominal Uang Kamu
              </h3>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Total Uang</p>
                <p className="text-3xl font-bold text-indigo-700">
                  {formatPrice(moneyInserted)}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {MONEY_OPTIONS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => insertMoney(amount)}
                    className="w-full py-3 px-4 bg-indigo-400 text-white rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105"
                  >
                    + {formatPrice(amount)}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleConfirmPayment}
                  disabled={moneyInserted < selectedProduct.price}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                    moneyInserted < selectedProduct.price
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {moneyInserted < selectedProduct.price
                    ? `Kurang ${formatPrice(selectedProduct.price - moneyInserted)}`
                    : "Konfirmasi Pembayaran ✓"}
                </button>
                <button
                  onClick={handleBack}
                  className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  ← Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && selectedProduct && (
        <div className="max-w-6xl rounded-2xl border-10 border-gray-600 mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            
            <h2 className="text-3xl font-bold text-indigo-600 mb-4">
              Pembelian Berhasil!
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="object-contain w-full rounded-lg h-40" />

              <p className="font-bold text-xl mb-4">{selectedProduct.name}</p>

              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga:</span>
                  <span className="font-semibold">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uang Dibayar:</span>
                  <span className="font-semibold">
                    {formatPrice(moneyInserted)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-indigo-600 pt-2 border-t-2 border-gray-300">
                  <span>Kembalian:</span>
                  <span>{formatPrice(change)}</span>
                </div>
              </div>
            </div>


            <div className="flex flex-col gap-2">
              <a
                href="/history"
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Lihat History Pembelian
              </a>
              <button
                onClick={handleReset}
                className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Selesai - Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-center">{error}</p>
        </div>
      )}

      {/* Money Confirmation Modal */}
      {showMoneyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Konfirmasi Pemasukan Uang
              </h3>
              <p className="text-gray-600">
                Apakah Anda yakin ingin memasukkan uang?
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Nominal Uang</p>
              <p className="text-3xl font-bold text-indigo-700">
                {formatPrice(pendingMoney)}
              </p>
            </div>

            {addingMoney ? (
              <div className="flex flex-col items-center py-4">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-indigo-500 font-semibold animate-pulse">
                  Memproses uang...
                </p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={cancelAddMoney}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Batal
                </button>
                <button
                  onClick={confirmAddMoney}
                  className="flex-1 py-3 px-4 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Konfirmasi
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
