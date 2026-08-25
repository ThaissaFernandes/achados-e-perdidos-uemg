import { MapPin, Calendar, Tag } from 'lucide-react';

export default function ItemCard({ title, category, location, date, status, imageUrl }) {
  const isPerdido = status === 'perdido';

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-3 items-center hover:shadow-md transition-shadow">
      {/* Imagem do Item ou Placeholder */}
      <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Tag className="text-gray-400" size={28} />
        )}
      </div>

      {/* Informações Principais (Hierarquia Visual Otimizada) */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-1 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
            isPerdido ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {status}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <Tag size={12} /> {category}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1 truncate">
            <MapPin size={12} className="text-indigo-600 shrink-0" />
            {location}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Calendar size={12} />
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}