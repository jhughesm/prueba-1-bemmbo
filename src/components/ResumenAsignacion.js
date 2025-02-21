import React from 'react';
import '../styles/ResumenAsignacion.css';
import { formatearMonto, convertirAUSD } from '../utils/formatearMonto';

function ResumenAsignacion({ 
  facturaSeleccionada, 
  notasCreditoSeleccionadas
}) {
  if (!facturaSeleccionada || notasCreditoSeleccionadas.length === 0) {
    return null;
  }

  const montoTotalNotasCredito = notasCreditoSeleccionadas.reduce(
    (total, nota) => total + convertirAUSD(nota.amount, nota.currency), 
    0
  );

  const montoRestante = Math.max(
    convertirAUSD(facturaSeleccionada.amount, facturaSeleccionada.currency) - montoTotalNotasCredito, 
    0
  );

  return (
    <div className="resumen-asignacion">
      <h3>Resumen de Asignación</h3>
      <div className="detalles-asignacion">
        <div>
          <strong>Factura Original:</strong>
          <p>ID: {facturaSeleccionada.id}</p>
          <p>Monto: {formatearMonto(facturaSeleccionada.amount, facturaSeleccionada.currency)}</p>
        </div>
        <div>
          <strong>Notas de Crédito Seleccionadas:</strong>
          {notasCreditoSeleccionadas.map(nota => (
            <p key={nota.id}>
              ID: {nota.id} | Monto: {formatearMonto(nota.amount, nota.currency)}
            </p>
          ))}
        </div>
        <div>
          <strong>Monto Total de Notas de Crédito:</strong>
          <p>
            {formatearMonto(
              montoTotalNotasCredito * 800, 
              'CLP'
            )}
          </p>
        </div>
        <div>
          <strong>Monto Restante:</strong>
          <p>
            {formatearMonto(
              montoRestante * 800, 
              'CLP'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResumenAsignacion;