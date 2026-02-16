'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePhase } from '@/context/PhaseContext';
import { translations } from '@/lib/mockData';
import { CategorySection, ProductModal, TableNumberModal, PromoPopup, PoweredBy } from '@/components';

import { Product, Category } from '@/types';
import { Bell, Globe, MapPin, RefreshCw, ArrowLeft } from 'lucide-react';

export default function MenuPage() {
  const router = useRouter();
  const {
    language,
    setLanguage,
    currentPhase,
    features,
    hasSetTable,
    setTableNumber,
    tableNumber,
    showToast
  } = usePhase();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const t = translations[language];

  // Handle category click - navigate to URL
  const handleCategoryClick = (category: Category) => {
    router.push(`/category/${category.id}`);
  };

  // Handle product click - navigate to URL
  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  // Fetch categories from database
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  // Show welcome popup on first visit (Phase 3 only)
  useEffect(() => {
    if (features.showAddToCart && !hasSetTable && !loading) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [features.showAddToCart, hasSetTable, loading]);

  const handleWelcomeConfirm = (number: string) => {
    setTableNumber(number);
    setShowWelcomeModal(false);
  };

  const handleCallWaiter = () => {
    showToast('Garson çağrıldı! Birazdan yanınızda olacak. 🔔');
  };

  // Get first product image as category image
  const getCategoryImage = (category: Category) => {
    if (category.products.length > 0) {
      return category.products[0].image;
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  // If a category is selected, show its products
  if (selectedCategory) {
    return (
      <main className="min-h-screen pb-32 bg-[#f5f0e8]">
        {/* Header */}
        <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-white font-medium"
            >
              <ArrowLeft size={20} />
              Geri
            </button>
            <div className="flex items-center gap-2">
              {tableNumber && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full">
                  <MapPin size={14} className="text-white" />
                  <span className="text-white text-sm font-medium">Masa {tableNumber}</span>
                </div>
              )}
              <button
                onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full"
              >
                <Globe size={14} className="text-white" />
                <span className="text-white text-sm font-medium">{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Category Title */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{selectedCategory.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{selectedCategory.name[language]}</h1>
              <p className="text-gray-500 text-sm">{selectedCategory.products.length} ürün</p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedCategory.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleProductClick(product)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name[language]}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=🍽️'; }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name[language]}</h3>
                  <p className="text-orange-500 font-bold">₺{product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onProductChange={(product) => setSelectedProduct(product)}
        />
      </main>
    );
  }

  // Main category grid view
  return (
    <main className="min-h-screen pb-32 bg-[#f5f0e8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/piiyuu-logo-beyaz-yazi.svg" alt="piiyuu" className="h-10" />
          </div>
          <div className="flex items-center gap-2">
            {tableNumber && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full">
                <MapPin size={14} className="text-white" />
                <span className="text-white text-sm font-medium">Masa {tableNumber}</span>
              </div>
            )}
            {features.showWaiterButton && (
              <button
                onClick={handleCallWaiter}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full"
              >
                <Bell size={14} className="text-white" />
                <span className="text-white text-sm font-medium hidden sm:inline">Garson</span>
              </button>
            )}
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full"
            >
              <Globe size={14} className="text-white" />
              <span className="text-white text-sm font-medium">{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <div className="px-4 py-6">
        <h2 className="text-orange-500 font-bold text-lg mb-4">Kategoriler</h2>

        {/* Category Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 mobile-grid-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCategoryClick(category)}
              className="cursor-pointer group"
            >
              {/* Category Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-shadow mb-2">
                <img
                  src={getCategoryImage(category)}
                  alt={category.name[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=' + category.icon; }}
                />
              </div>

              {/* Category Name */}
              <h3 className="text-orange-500 font-bold text-xs sm:text-sm text-center uppercase leading-tight">
                {category.name[language]}
              </h3>

              {/* Product Count */}
              <p className="text-gray-400 text-[10px] sm:text-xs text-center">
                {category.products.length} Ürün
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Phase Badge */}
      <div className="fixed bottom-24 left-4 z-40">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${currentPhase === 1 ? 'bg-blue-500 text-white' :
          currentPhase === 2 ? 'bg-purple-500 text-white' :
            'bg-green-500 text-white'
          }`}>
          <div className="w-2 h-2 rounded-full animate-pulse bg-white" />
          Phase {currentPhase}
        </div>
      </div>

      <PoweredBy />
      <PromoPopup />

      {/* Welcome Modal (Phase 3) */}
      <TableNumberModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onConfirm={handleWelcomeConfirm}
        mode="welcome"
      />
    </main>
  );
}
