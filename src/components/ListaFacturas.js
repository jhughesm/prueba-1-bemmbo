import { useState, useEffect } from 'react';
import '../styles/ListaFacturas.css';

function ListaFacturas() {
    const [facturas, setFacturas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function obtenerFacturas() {
          try {
            setCargando(true);
            const respuesta = await fetch('https://recruiting.api.bemmbo.com/invoices/pending');
            
            if (!respuesta.ok) {
              throw new Error('Error al obtener facturas');
            }
            
            const datos = await respuesta.json();
            setFacturas(datos);
          } catch (error) {
            setError(error.message);
          } finally {
            setCargando(false);
          }
        }
    
        obtenerFacturas();
      }, []);
    
      if (cargando) {
        return <div>Cargando facturas...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }

      return (
        <div>
          <h1>Seleccione una factura</h1>
          <div className="contenedor-tabla">
            <table className="tabla-facturas">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Monto</th>
                  <th>Moneda</th>
                  <th>Organización</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map(factura => (
                  <tr key={factura.id}>
                    <td>{factura.id}</td>
                    <td>{factura.amount}</td>
                    <td>{factura.currency}</td>
                    <td>{factura.organization_id}</td>
                    <td>{factura.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
}

export default ListaFacturas;