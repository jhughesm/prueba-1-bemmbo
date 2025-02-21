import { useState } from 'react';
import './styles/App.css';
import ListaFacturas from './components/ListaFacturas';
import ListaNotasCredito from './components/ListaNotasCredito';
import ResumenAsignacion from './components/ResumenAsignacion';
import BotonAsignacion from './components/BotonAsignacion';
import { formatearMonto, convertirAUSD } from './utils/formatearMonto';

function App() {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [notasCreditoSeleccionadas, setNotasCreditoSeleccionadas] = useState([]);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const handleSeleccionFactura = (factura) => {
    setFacturaSeleccionada(factura);
    setNotasCreditoSeleccionadas([]);
  };

  const handleSeleccionNotasCredito = (notas) => {
    setNotasCreditoSeleccionadas(notas);
  };

  const handleAsignar = () => {
    setMostrarModalExito(true);
  };

  const handleCerrarModal = () => {
    setMostrarModalExito(false);
    setFacturaSeleccionada(null);
    setNotasCreditoSeleccionadas([]);
  };

  const calcularMontoRestante = () => {
    const montoFacturaUSD = convertirAUSD(facturaSeleccionada.amount, facturaSeleccionada.currency);
    const montoTotalNotasCreditoUSD = notasCreditoSeleccionadas.reduce(
      (total, nota) => total + convertirAUSD(nota.amount, nota.currency), 
      0
    );
  
    return Math.max(montoFacturaUSD - montoTotalNotasCreditoUSD, 0);
  };

  return (
    <div className="App">
      <ListaFacturas 
        onSeleccionarFactura={handleSeleccionFactura} 
      />
      
      {facturaSeleccionada && (
        <ListaNotasCredito 
          facturaSeleccionada={facturaSeleccionada}
          onSeleccionNotasCredito={handleSeleccionNotasCredito}
        />
      )}
      
      {facturaSeleccionada && notasCreditoSeleccionadas.length > 0 && (
        <ResumenAsignacion 
          facturaSeleccionada={facturaSeleccionada}
          notasCreditoSeleccionadas={notasCreditoSeleccionadas}
          formatearMonto={formatearMonto}
        />
      )}

      <BotonAsignacion
        facturaSeleccionada={facturaSeleccionada}
        notasCreditoSeleccionadas={notasCreditoSeleccionadas}
        onAsignar={handleAsignar}
      />

      {mostrarModalExito && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-check-icon">✓</div>
            <h2>Nota de crédito asignada correctamente</h2>
            
            <div className="modal-details">
              <div className="detail-section">
                <strong>Factura Original</strong>
                <p>ID: {facturaSeleccionada.id}</p>
                <p>Monto: {formatearMonto(facturaSeleccionada.amount, facturaSeleccionada.currency)}</p>
              </div>

              <div className="detail-section">
                <strong>Notas de Crédito Asignadas</strong>
                {notasCreditoSeleccionadas.map(nota => (
                  <div key={nota.id}>
                    <p>ID: {nota.id}</p>
                    <p>Monto: {formatearMonto(nota.amount, nota.currency)}</p>
                  </div>
                ))}
              </div>

              <div className="detail-section">
                <strong>Monto Restante</strong>
                <p>{formatearMonto(calcularMontoRestante(), facturaSeleccionada.currency)}</p>
              </div>
            </div>

            <button 
              className="modal-continue-button"
              onClick={handleCerrarModal}
            >
              Seguir Asignando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;