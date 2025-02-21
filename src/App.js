import { useState } from 'react';
import './styles/App.css';
import ListaFacturas from './components/ListaFacturas';
import ListaNotasCredito from './components/ListaNotasCredito';

function App() {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const handleSeleccionFactura = (factura) => {
    console.log("Factura seleccionada en App:", factura);
    setFacturaSeleccionada(factura);
  };

  return (
    <div className="App">
      <ListaFacturas 
        onSeleccionarFactura={handleSeleccionFactura} 
      />
      {facturaSeleccionada && (
        console.log("Renderizando ListaNotasCredito con factura:", facturaSeleccionada),
        <ListaNotasCredito 
          facturaSeleccionada={facturaSeleccionada} 
        />
      )}
    </div>
  );
}

export default App;
