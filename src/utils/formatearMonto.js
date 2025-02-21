export const formatearMonto = (monto, moneda, tasaCambio = 800) => {
    const montoSinDecimales = Math.round(monto);
    if (moneda === 'CLP') {
      const dolares = Math.round(montoSinDecimales / tasaCambio);
      return `${montoSinDecimales.toLocaleString()} CLP (USD ${dolares.toLocaleString()})`;
    } else if (moneda === 'USD') {
      return `${montoSinDecimales.toLocaleString()} USD`;
    }
    return `${montoSinDecimales.toLocaleString()} ${moneda}`;
  };