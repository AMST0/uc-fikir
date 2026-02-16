'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye, BarChart3, ShoppingCart, Check } from 'lucide-react';
import { usePhase } from '@/context/PhaseContext';
import { Phase } from '@/types';

const phases: { phase: Phase; label: string; description: string; icon: React.ReactNode; gradient: string; features: string[] }[] = [
    {
        phase: 1,
        label: 'Faz 1 - Menü',
        description: 'Sadece menü görüntüleme modu',
        icon: <Eye size={20} />,
        gradient: 'from-blue-500 to-cyan-500',
        features: ['QR Menü', 'Kategori ve ürün görüntüleme', 'Çoklu dil desteği']
    },
    {
        phase: 2,
        label: 'Faz 2 - Analitik',
        description: 'Menü + analitik ve geri bildirim',
        icon: <BarChart3 size={20} />,
        gradient: 'from-violet-500 to-purple-500',
        features: ['Faz 1 özellikleri', 'Ürün görüntüleme takibi', 'Müşteri geri bildirimi', 'Analitik raporlar']
    },
    {
        phase: 3,
        label: 'Faz 3 - Sipariş',
        description: 'Tam sipariş sistemi',
        icon: <ShoppingCart size={20} />,
        gradient: 'from-emerald-500 to-green-500',
        features: ['Faz 1 & 2 özellikleri', 'Sepet sistemi', 'Sipariş verme', 'Garson çağırma', 'Stok durumu']
    },
];

export default function SettingsPage() {
    const [seeding, setSeeding] = useState(false);
    const { currentPhase, setPhase } = usePhase();
    const [stats, setStats] = useState<{ categories: number; products: number } | null>(null);

    useEffect(() => {
        // Fetch menu stats
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/menu');
                const data = await res.json();
                if (data.success) {
                    const categories = data.data.length;
                    const products = data.data.reduce((sum: number, cat: { products: unknown[] }) => sum + cat.products.length, 0);
                    setStats({ categories, products });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const handleReseed = async () => {
        setSeeding(true);
        try {
            await fetch('/api/seed', { method: 'POST' });
            window.location.reload();
        } catch (error) {
            console.error('Error seeding:', error);
        }
        setSeeding(false);
    };

    const handlePhaseChange = (phase: Phase) => {
        setPhase(phase);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
                <p className="text-gray-400 text-sm">Uygulama yapılandırması ve faz yönetimi</p>
            </div>

            {/* Phase Management */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Faz Yönetimi</h3>
                <p className="text-gray-400 text-sm mb-6">
                    Uygulamanın hangi özellikleri göstereceğini belirleyin. Her faz farklı özellikler sunar.
                </p>

                <div className="space-y-4">
                    {phases.map((p) => (
                        <div
                            key={p.phase}
                            onClick={() => handlePhaseChange(p.phase)}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${currentPhase === p.phase
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${p.gradient} text-white`}>
                                    {p.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-white font-semibold">{p.label}</h4>
                                        {currentPhase === p.phase && (
                                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">
                                                Aktif
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">{p.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {p.features.map((feature, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {currentPhase === p.phase && (
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Database Actions */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Veritabanı</h3>
                <p className="text-gray-400 text-sm mb-4">
                    Vercel Postgres veritabanı kullanılıyor. Verileri sıfırlamak ve demo verileri ile yeniden yüklemek için:
                </p>
                <button
                    onClick={handleReseed}
                    disabled={seeding}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={18} className={seeding ? 'animate-spin' : ''} />
                    {seeding ? 'Yükleniyor...' : 'Veritabanını Sıfırla'}
                </button>
            </div>

            {/* Info */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Hakkında</h3>
                <div className="space-y-2 text-gray-400 text-sm">
                    <p>• <span className="text-white">{stats?.categories ?? '...'}</span> kategori</p>
                    <p>• <span className="text-white">{stats?.products ?? '...'}</span> ürün</p>
                    <p>• <span className="text-white">Vercel Postgres</span> veritabanı</p>
                    <p>• <span className="text-white">Serverless</span> altyapı</p>
                    <p>• Aktif Faz: <span className="text-orange-400 font-medium">Faz {currentPhase}</span></p>
                </div>
            </div>
        </div>
    );
}
