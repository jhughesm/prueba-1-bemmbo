export const convertirAUSD = (monto, moneda, tasaCambio = 800) => {
  if (moneda === 'CLP') {
    return monto / tasaCambio;
  } else if (moneda === 'USD') {
    return monto;
  }
  throw new Error(`Moneda no soportada: ${moneda}`);
};

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