import '../styles/ListaFacturas.css';

function ListaFacturas() {
  const datosFacturas = [
    {
      "id": "inv_MRlj0lt95XyQjvPY",
      "amount": 40000000,
      "organization_id": "piedpiper",
      "currency": "CLP",
      "type": "received"
    }
  ];

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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{datosFacturas[0].id}</td>
              <td>{datosFacturas[0].amount}</td>
              <td>{datosFacturas[0].currency}</td>
              <td>{datosFacturas[0].organization_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaFacturas;