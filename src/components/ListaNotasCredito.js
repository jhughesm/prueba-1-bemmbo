import { useState, useEffect } from 'react';
import '../styles/ListaNotasCredito.css';
import { formatearMonto } from '../utils/formatearMonto';

function ListaNotasCredito({ 
  facturaSeleccionada, 
  onSeleccionNotasCredito 
}) {
  const [notasCredito, setNotasCredito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
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
        const notasFiltradas = datos.filter(
          item => item.type === 'credit_note' && item.reference === facturaSeleccionada.id
        );
        setNotasCredito(notasFiltradas);
        setNotasCreditoSeleccionadas([]);
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

  const manejarSeleccionMultiple = (nota) => {
    const nuevaSeleccion = notasCreditoSeleccionadas.some(n => n.id === nota.id)
      ? notasCreditoSeleccionadas.filter(n => n.id !== nota.id)
      : [...notasCreditoSeleccionadas, nota];
    
    setNotasCreditoSeleccionadas(nuevaSeleccion);
    onSeleccionNotasCredito(nuevaSeleccion);
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