import { useState, useEffect } from 'react';
import '../styles/ListaNotasCredito.css';

function ListaNotasCredito({ facturaSeleccionada }) {
  const [notasCredito, setNotasCredito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tasaCambio, setTasaCambio] = useState(800);
  const [notasCreditoSeleccionadas, setNotasCreditoSeleccionadas] = useState([]);

  useEffect(() => {
    async function obtenerNotasCredito() {
      try {
        setCargando(true);
        const respuesta = await fetch('https://recruiting.api.bemmbo.com/invoices/pending');
        
        if (!respuesta.ok) {
          throw new Error('Error al obtener notas de crédito');
        }
        
        const datos = await respuesta.json();
        // Filtramos solo las notas de crédito que hacen referencia a la factura seleccionada
        const notasFiltradas = datos.filter(
          item => item.type === 'credit_note' && item.reference === facturaSeleccionada.id
        );
        setNotasCredito(notasFiltradas);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }
    
    if (facturaSeleccionada) {
      obtenerNotasCredito();
    }
  }, [facturaSeleccionada]);

  const formatearMonto = (monto, moneda) => {
    if (moneda === 'CLP') {
      const dolares = (monto / tasaCambio);
      return `${monto.toLocaleString()} CLP (USD ${dolares.toLocaleString()})`;
    } else if (moneda === 'USD') {
      return `${monto.toLocaleString()} USD`;
    }
    return `${monto.toLocaleString()} ${moneda}`;
  };

  const manejarSeleccionMultiple = (nota) => {
    setNotasCreditoSeleccionadas(prev => {
      const estaSeleccionada = prev.some(n => n.id === nota.id);
      if (estaSeleccionada) {
        return prev.filter(n => n.id !== nota.id);
      } else {
        return [...prev, nota];
      }
    });
  };

  if (!facturaSeleccionada) {
    return null;
  }

  if (cargando) {
    return <div className="mensaje-carga">Cargando notas de crédito...</div>;
  }

  if (error) {
    return <div className="mensaje-error">Error: {error}</div>;
  }

  if (notasCredito.length === 0) {
    return <div className="mensaje-info">No hay notas de crédito disponibles para esta factura.</div>;
  }

  return (
    <div>
      <h2>Seleccione una o más notas de crédito</h2>
      <div className="contenedor-tabla">
        <table className="tabla-notas-credito">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Monto</th>
              <th>Referencia</th>
            </tr>
          </thead>
          <tbody>
            {notasCredito.map(nota => (
              <tr 
                key={nota.id} 
                className={notasCreditoSeleccionadas.some(n => n.id === nota.id) ? 'fila-seleccionada' : ''}
                onClick={() => manejarSeleccionMultiple(nota)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={notasCreditoSeleccionadas.some(n => n.id === nota.id)}
                    onChange={() => manejarSeleccionMultiple(nota)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td>{nota.id}</td>
                <td>{formatearMonto(nota.amount, nota.currency)}</td>
                <td>{nota.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaNotasCredito;