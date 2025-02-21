import { useState, useEffect } from 'react';
import './styles/App.css';
import ListaFacturas from './components/ListaFacturas';
import ListaNotasCredito from './components/ListaNotasCredito';
import ResumenAsignacion from './components/ResumenAsignacion';
import BotonAsignacion from './components/BotonAsignacion';
import { formatearMonto, convertirAUSD } from './utils/formatearMonto';

function App() {
  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [notasCreditoSeleccionadas, setNotasCreditoSeleccionadas] = useState([]);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [notasCreditoAsignadas, setNotasCreditoAsignadas] = useState([]);

  useEffect(() => {
    async function obtenerFacturas() {
      try {
        const respuesta = await fetch('https://recruiting.api.bemmbo.com/invoices/pending');
        if (!respuesta.ok) {
          throw new Error('Error al obtener facturas');
        }
        const datos = await respuesta.json();
        const facturasRecibidas = datos.filter(factura => factura.type === 'received');
        setFacturas(facturasRecibidas);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    obtenerFacturas();
  }, []);

  const handleSeleccionFactura = (factura) => {
    setFacturaSeleccionada(factura);
    setNotasCreditoSeleccionadas([]);
  };

  const handleSeleccionNotasCredito = (notas) => {
    setNotasCreditoSeleccionadas(notas);
  };

  const handleAsignar = () => {
    setNotasCreditoAsignadas(prev => [...prev, ...notasCreditoSeleccionadas]);
    setMostrarModalExito(true);
  };

  const handleCerrarModal = () => {
    console.log('Datos iniciales:');
    console.log('Factura Seleccionada:', facturaSeleccionada);
    console.log('Notas de Crédito Seleccionadas:', notasCreditoSeleccionadas);
    
    const montoAsignadoUSD = notasCreditoSeleccionadas.reduce(
      (total, nota) => total + convertirAUSD(nota.amount, nota.currency),
      0
    );
    
    console.log('Monto Total Asignado (USD):', montoAsignadoUSD);
    
    let nuevoMonto;
    if (facturaSeleccionada.currency === 'USD') {
      nuevoMonto = Math.max(facturaSeleccionada.amount - montoAsignadoUSD, 0);
    } else if (facturaSeleccionada.currency === 'CLP') {
      nuevoMonto = Math.max(facturaSeleccionada.amount - (montoAsignadoUSD * 800), 0);
    }
    
    console.log('Nuevo Monto:', nuevoMonto);
    
    const facturaActualizada = {
      ...facturaSeleccionada,
      amount: nuevoMonto
    };
  
    console.log('Factura Actualizada:', facturaActualizada);
  
    setFacturaSeleccionada(facturaActualizada);
    setFacturas(prevFacturas => 
      prevFacturas.map(factura => 
        factura.id === facturaActualizada.id ? facturaActualizada : factura
      )
    );
    setNotasCreditoSeleccionadas([]);
    setMostrarModalExito(false);
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
        facturas={facturas}
        onSeleccionarFactura={handleSeleccionFactura}
      />
      
      {facturaSeleccionada && (
        <ListaNotasCredito 
          facturaSeleccionada={facturaSeleccionada}
          onSeleccionNotasCredito={handleSeleccionNotasCredito}
          notasCreditoAsignadas={notasCreditoAsignadas}
        />
      )}
      
      {facturaSeleccionada && notasCreditoSeleccionadas.length > 0 && (
        <ResumenAsignacion 
          facturaSeleccionada={facturaSeleccionada}
          notasCreditoSeleccionadas={notasCreditoSeleccionadas}
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
                <p>{formatearMonto(calcularMontoRestante() * 800, 'CLP')}</p>
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