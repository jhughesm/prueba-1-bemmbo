import React from 'react';
import '../styles/ResumenAsignacion.css';

function ResumenAsignacion({ 
  facturaSeleccionada, 
  notasCreditoSeleccionadas, 
  formatearMonto 
}) {
  if (!facturaSeleccionada || notasCreditoSeleccionadas.length === 0) {
    return null;
  }

  const montoTotalNotasCredito = notasCreditoSeleccionadas.reduce(
    (total, nota) => total + nota.amount, 
    0
  );

  const montoRestante = Math.max(
    facturaSeleccionada.amount - montoTotalNotasCredito, 
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
            {formatearMonto(montoTotalNotasCredito, facturaSeleccionada.currency)}
          </p>
        </div>
        <div>
          <strong>Monto Restante:</strong>
          <p>
            {formatearMonto(montoRestante, facturaSeleccionada.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResumenAsignacion;