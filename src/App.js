import { useState } from 'react';
import './styles/App.css';
import ListaFacturas from './components/ListaFacturas';
import ListaNotasCredito from './components/ListaNotasCredito';
import ResumenAsignacion from './components/ResumenAsignacion';
import { formatearMonto } from './utils/formatearMonto';

function App() {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [notasCreditoSeleccionadas, setNotasCreditoSeleccionadas] = useState([]);

  const handleSeleccionFactura = (factura) => {
    setFacturaSeleccionada(factura);
    // Resetear notas de crédito cuando se selecciona una nueva factura
    setNotasCreditoSeleccionadas([]);
  };

  const handleSeleccionNotasCredito = (notas) => {
    setNotasCreditoSeleccionadas(notas);
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
    </div>
  );
}

export default App;