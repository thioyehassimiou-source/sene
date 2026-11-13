'use client';

import React from 'react';
import { 
  Sprout, 
  Users, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  MapPin, 
  Activity, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { label: 'Tableau de bord', icon: Activity, active: true },
    { label: 'Productrices & Scores', icon: Users, count: '48' },
    { label: 'Offres & Récoltes', icon: Sprout, count: '12' },
    { label: 'Commandes Acheteurs', icon: ShoppingBag, count: '6' },
    { label: 'Logistique Corridor', icon: Truck, count: '3' },
    { label: 'Paiements & Séquestre', icon: CreditCard },
    { label: 'Localités & Villages', icon: MapPin },
    { label: 'Paramètres & Agents', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-900/50">
          SÈ
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Sènè Admin</h1>
          <p className="text-xs text-brand-400 font-medium">Corridor Labé ➔ Conakry</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.count && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    item.active
                      ? 'bg-brand-700 text-brand-100'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sync Status Badge */}
      <div className="p-4 m-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-300">File de Synchro Offline</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <p className="text-xs text-slate-400">14 actions synchronisées avec succès aujourd'hui.</p>
      </div>

      {/* Agent User Info */}
      <div className="p-4 border-t border-slate-800 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
          MD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Mamadou Diallo</p>
          <p className="text-xs text-slate-400 truncate">Superviseur Corridor Labé</p>
        </div>
      </div>
    </aside>
  );
}

