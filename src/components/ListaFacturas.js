import { useState, useEffect } from 'react';
import '../styles/ListaFacturas.css';

function ListaFacturas() {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tasaCambio, setTasaCambio] = useState(800);
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
        // Filtramos solo las facturas recibidas
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

  const formatearMonto = (monto, moneda) => {
    if (moneda === 'CLP') {
      const dolares = (monto / tasaCambio).toFixed(2);
      return `${monto.toLocaleString()} CLP (USD ${dolares})`;
    } else if (moneda === 'USD') {
      return `${monto.toLocaleString()} USD`;
    }
    return `${monto.toLocaleString()} ${moneda}`;
  };

  const manejarSeleccion = (factura) => {
    setFacturaSeleccionada(factura);
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
              >
                <td>
                  <input
                    type="radio"
                    name="factura"
                    checked={facturaSeleccionada && facturaSeleccionada.id === factura.id}
                    onChange={() => manejarSeleccion(factura)}
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