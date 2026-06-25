import { Category, Dish } from '../hooks/useMenuData';

interface MenuPreviewProps {
  categories: Category[];
  dishes: Dish[];
  getDishesByCategory: (categoryId: string) => Dish[];
}

export const MenuPreview = ({ categories, dishes, getDishesByCategory }: MenuPreviewProps) => {
  const hasContent = dishes.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl mb-4">Vista Previa del Menú</h2>

      <div
        className="mx-auto bg-white"
        style={{
          width: '380px',
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          border: '1px solid #ddd',
          padding: '28px 24px',
        }}
      >
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '9px', color: '#666', letterSpacing: '2px', marginBottom: '2px' }}>
            EST. 2024
          </p>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '4px', margin: '0 0 4px' }}>
            MENÚ
          </h1>
          <p style={{ fontSize: '10px', letterSpacing: '3px', color: '#555', marginBottom: '4px' }}>
            EMPRENDIMIENTO FAMILIAR
          </p>
          <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#777' }}>
            Porciones para 6 personas
          </p>
        </div>

        {/* Línea separadora header */}
        <hr style={{ borderColor: '#222', borderTopWidth: '1px', margin: '10px 0 14px' }} />

        {/* Categorías y platos */}
        {hasContent ? (
          <div>
            {categories.map((category) => {
              const categoryDishes = getDishesByCategory(category.id);
              if (categoryDishes.length === 0) return null;

              return (
                <div key={category.id} style={{ marginBottom: '14px' }}>
                  <h3
                    style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      letterSpacing: '1.5px',
                      marginBottom: '4px',
                    }}
                  >
                    {category.name.toUpperCase()}
                  </h3>
                  <hr style={{ borderColor: '#333', borderTopWidth: '0.5px', margin: '0 0 8px' }} />

                  {categoryDishes.map((dish) => (
                    <div key={dish.id} style={{ marginBottom: '10px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                        }}
                      >
                        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>
                          {dish.name.toUpperCase()}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            marginLeft: '8px',
                          }}
                        >
                          ${Number(dish.price).toLocaleString('es-CL')} .-
                        </span>
                      </div>
                      {dish.description && (
                        <p style={{ fontSize: '8px', fontStyle: 'italic', color: '#666', margin: '2px 0 0' }}>
                          {dish.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Footer */}
            <hr style={{ borderColor: '#222', borderTopWidth: '0.5px', margin: '10px 0 8px' }} />
            <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
              — ¡BUEN PROVECHO! —
            </p>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic', padding: '32px 0', fontSize: '12px' }}>
            El menú aparecerá aquí cuando agregues platos
          </p>
        )}
      </div>
    </div>
  );
};
