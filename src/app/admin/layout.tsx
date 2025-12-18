'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    BarChart3,
    Settings,
    RefreshCw
} from 'lucide-react';

const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'menu', label: 'Menü Yönetimi', icon: UtensilsCrossed, href: '/admin/menu' },
    { id: 'orders', label: 'Siparişler', icon: ShoppingBag, href: '/admin/orders' },
    { id: 'analytics', label: 'Analitik', icon: BarChart3, href: '/admin/analytics' },
    { id: 'settings', label: 'Ayarlar', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isActiveTab = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 hidden lg:block">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold">Cemil Pub</h1>
                        <p className="text-gray-500 text-xs">Admin Panel</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActiveTab(tab.href)
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </Link>
                    ))}
                </nav>

                {/* Back to Menu Link */}
                <Link
                    href="/"
                    className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 text-sm transition-colors"
                >
                    ← Menüye Dön
                </Link>
            </aside>

            {/* Mobile Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 px-2 py-2">
                <div className="flex justify-around">
                    {tabs.slice(0, 4).map((tab) => (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isActiveTab(tab.href) ? 'text-rose-400' : 'text-gray-500'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span className="text-[10px]">{tab.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
