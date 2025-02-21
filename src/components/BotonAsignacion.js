import React from 'react';
import '../styles/BotonAsignacion.css';

function BotonAsignacion({ 
  facturaSeleccionada, 
  notasCreditoSeleccionadas, 
  onAsignar 
}) {
  const estaHabilitado = facturaSeleccionada && notasCreditoSeleccionadas.length > 0;

  const handleClick = () => {
    if (estaHabilitado) {
      onAsignar();
    }
  };

  return (
    <div className="contenedor-boton-asignacion">
      <div 
        className={`boton-asignacion-contenedor ${estaHabilitado ? 'habilitado' : 'deshabilitado'}`}
        title={!estaHabilitado ? "Selecciona una factura y al menos una nota de crédito para asignar" : ""}
      >
        <button 
          className="boton-asignacion"
          onClick={handleClick}
          disabled={!estaHabilitado}
        >
          Asignar
        </button>
      </div>
    </div>
  );
}

export default BotonAsignacion;