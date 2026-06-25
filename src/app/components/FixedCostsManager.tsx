import { useState } from 'react';
import { Plus, Trash2, Pencil, Flame } from 'lucide-react';
import { FixedCost } from '../hooks/useMenuData';
import { formatCLP } from '../utils/formatCLP';

const SUGERENCIAS = [
  'Gas', 'Luz / Electricidad', 'Agua', 'Arriendo', 'Personal / Sueldo',
  'Empaques / Bolsas', 'Internet', 'Transporte', 'Limpieza', 'Otro',
];

interface Props {
  fixedCosts: FixedCost[];
  onAdd: (name: string, amount: number) => void;
  onUpdate: (id: string, updates: Partial<FixedCost>) => void;
  onDelete: (id: string) => void;
}

export const FixedCostsManager = ({ fixedCosts, onAdd, onUpdate, onDelete }: Props) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const total = fixedCosts.reduce((s, f) => s + f.amount, 0);

  const handleAdd = () => {
    if (name.trim() && parseFloat(amount) > 0) {
      onAdd(name.trim(), parseFloat(amount));
      setName('');
      setAmount('');
    }
  };

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: '#fffaf3', border: '1px solid #e8d5c0' }}>
      <div className="px-6 py-4 flex items-center gap-2" style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0' }}>
        <Flame size={18} style={{ color: '#8b2635' }} />
        <h2 className="font-semibold" style={{ color: '#2c1810' }}>Costos Fijos Mensuales</h2>
      </div>

      <div className="p-6">
        <p className="text-sm mb-5" style={{ color: '#7a5c4e' }}>
          Ingresa todos los gastos que tienes cada mes aunque no vendas nada: gas, luz, personal, arriendo, etc.
          Estos se distribuyen automáticamente en el precio de cada plato.
        </p>

        {/* Sugerencias rápidas */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGERENCIAS.map((s) => (
            <button key={s} onClick={() => setName(s)}
              className="px-3 py-1 rounded-full text-xs transition-all hover:opacity-80"
              style={{ background: name === s ? '#8b2635' : '#e8d5c0', color: name === s ? '#fff' : '#2c1810' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <div className="flex gap-2 mb-5">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del gasto"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="$ mensual"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="w-32 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', color: '#2c1810' }} />
          <button onClick={handleAdd}
            className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
            style={{ background: '#8b2635', color: '#fff' }}>
            <Plus size={15} /> Agregar
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-2 mb-4">
          {fixedCosts.map((fc) => (
            <div key={fc.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: '#fdf6ec', border: '1px solid #e8d5c0' }}>
              {editingId === fc.id ? (
                <>
                  <input type="text" defaultValue={fc.name}
                    onBlur={(e) => onUpdate(fc.id, { name: e.target.value })}
                    className="flex-1 px-2 py-1 rounded-lg text-sm outline-none"
                    style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} autoFocus />
                  <input type="number" defaultValue={fc.amount}
                    onBlur={(e) => { onUpdate(fc.id, { amount: parseFloat(e.target.value) || 0 }); setEditingId(null); }}
                    className="w-28 px-2 py-1 rounded-lg text-sm outline-none text-right"
                    style={{ background: '#fffaf3', border: '1px solid #e8d5c0', color: '#2c1810' }} />
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm" style={{ color: '#2c1810' }}>{fc.name}</span>
                  <span className="text-sm font-semibold" style={{ color: '#8b2635' }}>{formatCLP(fc.amount)}</span>
                  <button onClick={() => setEditingId(fc.id)}
                    className="px-2 py-1 rounded-lg transition-all hover:opacity-80"
                    style={{ background: '#e8d5c0', color: '#2c1810' }}>
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => confirm(`¿Eliminar "${fc.name}"?`) && onDelete(fc.id)}
                    className="px-2 py-1 rounded-lg transition-all hover:opacity-80"
                    style={{ background: '#8b2635', color: '#fff' }}>
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          ))}
          {fixedCosts.length === 0 && (
            <p className="text-center py-6 text-sm" style={{ color: '#7a5c4e' }}>
              Sin costos fijos registrados. Agrega gas, luz, personal, etc.
            </p>
          )}
        </div>

        {/* Total */}
        {fixedCosts.length > 0 && (
          <div className="flex justify-between items-center px-4 py-3 rounded-xl font-semibold"
            style={{ background: '#8b2635', color: '#fff' }}>
            <span>Total costos fijos mensuales</span>
            <span>{formatCLP(total)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
