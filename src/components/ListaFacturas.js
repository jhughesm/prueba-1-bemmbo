import { useState, useEffect } from 'react';
import '../styles/ListaFacturas.css';
import { formatearMonto } from '../utils/formatearMonto';

function ListaFacturas({ onSeleccionarFactura }) {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  useEffect(() => {
    async function obtenerFacturas() {
      try {
        setCargando(true);
        const respuesta = await fetch('https://recruiting.api.bemmbo.com/invoices/pending');
        
        if (!respuesta.ok) {
          throw new Error('Error al obtener facturas');
        }
        
        const datos = await respuesta.json();
        const facturasRecibidas = datos.filter(factura => factura.type === 'received');
        setFacturas(facturasRecibidas);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }
    
    obtenerFacturas();
  }, []);

  const manejarSeleccion = (factura) => {
    setFacturaSeleccionada(factura);
    onSeleccionarFactura(factura);
  };

  if (cargando) {
    return <div className="mensaje-carga">Cargando facturas...</div>;
  }

  if (error) {
    return <div className="mensaje-error">Error: {error}</div>;
  }

  return (
    <div>
      <h1>Seleccione una factura</h1>
      <div className="contenedor-tabla">
        <table className="tabla-facturas">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Monto</th>
              <th>Organización</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map(factura => (
              <tr 
                key={factura.id} 
                className={facturaSeleccionada && facturaSeleccionada.id === factura.id ? 'fila-seleccionada' : ''}
                onClick={() => manejarSeleccion(factura)}
              >
                <td>
                  <input
                    type="radio"
                    name="factura"
                    checked={facturaSeleccionada && facturaSeleccionada.id === factura.id}
                    onChange={() => manejarSeleccion(factura)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td>{factura.id}</td>
                <td>{formatearMonto(factura.amount, factura.currency)}</td>
                <td>{factura.organization_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaFacturas;