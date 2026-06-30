import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '22px' }}>
    <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#2c1810', marginBottom: '6px' }}>
      {title}
    </h2>
    <div style={{ fontSize: '13.5px', color: '#7a5c4e', lineHeight: '1.7' }}>
      {children}
    </div>
  </div>
);

export default function PrivacyPolicyPage() {
  const [contact, setContact] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('key, value');
      const map: Record<string, string> = {};
      (data || []).forEach((row) => { map[row.key] = row.value; });
      setContact(map['privacy_contact'] || '');
      setWhatsapp(map['whatsapp_number'] || '');
    };
    load();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6ec', padding: '32px 16px', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{
          background: '#fffaf3', border: '1px solid #e8d5c0',
          borderRadius: '16px', padding: '32px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <ShieldCheck size={22} style={{ color: '#8b2635' }} />
            <h1 style={{ fontSize: '19px', fontWeight: 'bold', color: '#2c1810', margin: 0 }}>
              Política de Tratamiento de Datos
            </h1>
          </div>

          <Section title="Responsable">
            Tus datos son tratados directamente por el emprendimiento familiar que administra este menú,
            con el único fin de gestionar tus pedidos.
          </Section>

          <Section title="Qué datos recolectamos">
            Nombre, dirección de entrega, número de contacto, y el detalle del pedido que realizas (platos,
            cantidades y fecha de entrega).
          </Section>

          <Section title="Para qué los usamos">
            Exclusivamente para preparar, coordinar y entregar el pedido que solicitas. No se utilizan con
            fines de marketing, no se venden ni se comparten con terceros.
          </Section>

          <Section title="Base legal">
            El tratamiento es necesario para ejecutar el pedido que solicitas (relación contractual/precontractual),
            de conformidad con la Ley N° 21.719 sobre Protección de Datos Personales.
          </Section>

          <Section title="Plazo de conservación">
            Tus datos se eliminan automáticamente a los 30 días de haberse recibido el pedido.
          </Section>

          <Section title="Tus derechos">
            Puedes solicitar en cualquier momento el acceso, rectificación o eliminación de tus datos antes
            de que se cumplan los 30 días, escribiendo al contacto que aparece más abajo.
          </Section>

          <Section title="Contacto">
            {contact || whatsapp ? (
              <>{contact || `WhatsApp: +${whatsapp}`}</>
            ) : (
              'Contacta directamente a quien tomó tu pedido.'
            )}
          </Section>

          <Link to="/" style={{ fontSize: '12.5px', color: '#8b2635' }}>
            ← Volver al menú
          </Link>
        </div>
      </div>
    </div>
  );
}
