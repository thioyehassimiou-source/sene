import React from 'react';
import { 
  Users, 
  Sprout, 
  TrendingUp, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowUpRight 
} from 'lucide-react';

export default function DashboardPage() {
  const kpis = [
    {
      title: 'Productrices Accompagnées',
      value: '48',
      subtitle: 'Villages de Timbi-Madina & Dinguiraye',
      change: '+12 ce mois',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Récoltes Sécurisées',
      value: '24.8 T',
      subtitle: 'Pomme de terre (92%) & Fonio (8%)',
      change: 'Zéro perte signalée',
      icon: Sprout,
      trend: 'up',
    },
    {
      title: 'Volume sous Séquestre',
      value: '186 250 000 GNF',
      subtitle: 'Orange Money & MTN MoMo',
      change: '100% garanti',
      icon: TrendingUp,
      trend: 'up',
    },
    {
      title: 'Rotations Corridor Conakry',
      value: '8 convois',
      subtitle: 'Arrivée marché Madina & Entag',
      change: 'Délai moyen: 14h',
      icon: Truck,
      trend: 'neutral',
    },
  ];

  const corridorBatches = [
    {
      id: 'LIV-2026-0042',
      product: 'Pomme de terre (Belle de Guinée)',
      origin: 'Timbi-Madina (Pita/Labé)',
      destination: 'Hangar Légumes, Marché Madina (Conakry)',
      quantity: '120 sacs (6 000 kg)',
      agent: 'Mamadou Diallo (AGT-LAB-01)',
      transporter: 'Camion RC-9214-A (Chauffeur: Ibrahima Barry)',
      status: 'EN TRANSIT (MAMOU)',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'LIV-2026-0041',
      product: 'Fonio précuit artisanal',
      origin: 'Tambikounda (Dinguiraye)',
      destination: 'Entrepôt Entag Nord (Conakry)',
      quantity: '40 sacs (1 000 kg)',
      agent: 'Abdoulaye Sow (AGT-DIN-02)',
      transporter: 'Fourgonnette RC-3410-B',
      status: 'LIVRÉ & VALIDÉ',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'LIV-2026-0040',
      product: 'Pomme de terre Grade A',
      origin: 'Kaganya (Timbi-Madina)',
      destination: 'Restaurant Saveurs de Guinée (Kipé)',
      quantity: '25 sacs (1 250 kg)',
      agent: 'Mamadou Diallo (AGT-LAB-01)',
      transporter: 'Groupage Conakry Express',
      status: 'FONDS DÉCAISSÉS PRODUCTRICE',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-800 mb-2">
            <span className="w-2 h-2 rounded-full bg-brand-600"></span>
            <span>Pilote Corridor Phase 1 : Fouta Djallon ➔ Conakry</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Supervision des Opérations Sènè</h2>
          <p className="text-sm text-slate-500 mt-1">
            Traçabilité de bout-en-bout : de la pesée au champ par l'agent local jusqu'au paiement final décaissé à la productrice.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Swagger API</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="http://localhost:9001"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <span>Console MinIO</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{kpi.title}</span>
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</span>
                <p className="text-xs text-slate-500 mt-1">{kpi.subtitle}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-700">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-brand-600" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Corridor Operations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Expéditions Actives sur le Corridor</h3>
            <p className="text-xs text-slate-500 mt-0.5">Suivi des chargements pesés et scellés avec tickets de pont-bascule dans MinIO.</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
            3 convois sous surveillance GPS/Agent
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="py-3.5 px-6">Lot & Produit</th>
                <th className="py-3.5 px-6">Origine ➔ Destination</th>
                <th className="py-3.5 px-6">Quantité Pesée</th>
                <th className="py-3.5 px-6">Agent & Transport</th>
                <th className="py-3.5 px-6">Statut Logistique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {corridorBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{batch.product}</p>
                    <p className="text-xs font-mono text-slate-400">{batch.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                      <span>{batch.origin}</span>
                    </div>
                    <div className="text-xs text-slate-400 ml-5">➔ {batch.destination}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-900">{batch.quantity}</span>
                  </td>
                  <td className="py-4 px-6 text-xs">
                    <p className="font-medium text-slate-800">{batch.agent}</p>
                    <p className="text-slate-400">{batch.transporter}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${batch.statusColor}`}>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

