import { useState } from 'react';
import '../styles/ListaFacturas.css';

function ListaFacturas({facturas, onSeleccionarFactura}) {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [tasaCambio] = useState(800);

  const formatearMonto = (monto, moneda) => {
    if (moneda === 'CLP') {
      const dolares = (monto / tasaCambio);
      return `${monto.toLocaleString()} CLP (USD ${dolares.toLocaleString()})`;
    } else if (moneda === 'USD') {
      return `${monto.toLocaleString()} USD`;
    }
    return `${monto.toLocaleString()} ${moneda}`;
  };

  const manejarSeleccion = (factura) => {
    setFacturaSeleccionada(factura);
    onSeleccionarFactura(factura);
  };

  if (!facturas.length) {
    return <div className="mensaje-carga">Cargando facturas...</div>;
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
                    onChange={() => {}}
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