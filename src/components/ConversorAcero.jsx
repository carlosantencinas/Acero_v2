import React, { useState } from 'react';
import {
  Container, Typography, TextField, MenuItem, Button, Alert, Box, LinearProgress
} from '@mui/material';

const DENSIDAD_ACERO = 7850;
const LARGO_BARRA = 12; // metros

const diametros = [
  { valor: 6, etiqueta: '6 mm eq. 1/4"' },
  { valor: 8, etiqueta: '8 mm eq. 5/16"' },
  { valor: 9.525, etiqueta: '9.5 mm eq. 3/8"' },
  { valor: 12, etiqueta: '12 mm eq. 1/2"' },
  { valor: 16, etiqueta: '16 mm eq. 5/8"' },
  { valor: 19, etiqueta: '19 mm eq. 3/4"' }
];

export default function ConversorAcero() {
  const [diametro, setDiametro] = useState(12);
  const [pesoKg, setPesoKg] = useState(10);
  const [resultado, setResultado] = useState(null);

  const calcularDesdePeso = () => {
    const diam_m = diametro / 1000;
    const pesoPorMetro = (Math.PI * Math.pow(diam_m, 2) / 4) * DENSIDAD_ACERO;
    const metros = pesoKg / pesoPorMetro;
    const barras = metros / LARGO_BARRA;
    const barraRestante = metros % LARGO_BARRA;

    setResultado({
      modo: "peso",
      pesoPorMetro,
      metros,
      barras,
      barraRestante
    });
  };

  const calcularDesdeBarras = (numBarras) => {
    const diam_m = diametro / 1000;
    const pesoPorMetro = (Math.PI * Math.pow(diam_m, 2) / 4) * DENSIDAD_ACERO;
    const metros = numBarras * LARGO_BARRA;
    const peso = metros * pesoPorMetro;

    setResultado({
      modo: "barras",
      pesoPorMetro,
      metros,
      barras: numBarras,
      peso
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>🔧 Conversor de Acero</Typography>
      <Typography variant="body1" gutterBottom>
        Convierte kilogramos en barras de acero y viceversa según el diámetro.
      </Typography>

      <TextField
        fullWidth select label="🔩 Diámetro"
        value={diametro} onChange={e => setDiametro(parseFloat(e.target.value))}
        margin="normal"
      >
        {diametros.map(d => (
          <MenuItem key={d.valor} value={d.valor}>{d.etiqueta}</MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth label="⚖️ Peso (kg)"
        type="number"
        value={pesoKg}
        onChange={e => setPesoKg(parseFloat(e.target.value))}
        margin="normal"
      />

      <Button fullWidth variant="contained" onClick={calcularDesdePeso} sx={{ my: 2 }}>
        📐 Calcular desde peso
      </Button>

      <Button fullWidth variant="outlined" onClick={() => {
        const num = parseInt(prompt("¿Cuántas barras de 12m?"));
        if (!isNaN(num)) calcularDesdeBarras(num);
      }}>
        🔁 Calcular desde barras
      </Button>

      {resultado && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6">✅ Resultado</Typography>
          <Typography><strong>Peso por metro:</strong> {resultado.pesoPorMetro.toFixed(3)} kg/m</Typography>
          <Typography><strong>Metros:</strong> {resultado.metros.toFixed(2)} m</Typography>
          {resultado.modo === "peso" && (
            <Typography><strong>Barras de 12m:</strong> {resultado.barras.toFixed(2)}</Typography>
          )}
          {resultado.modo === "barras" && (
            <Typography><strong>Peso total:</strong> {resultado.peso.toFixed(2)} kg</Typography>
          )}
          <Box mt={2}>
            {Array.from({ length: Math.floor(resultado.barras) }).map((_, i) => (
              <Box key={i} sx={{ my: 0.5 }}>
                <Typography variant="caption">Barra {i + 1}</Typography>
                <LinearProgress variant="determinate" value={100} color="success" />
              </Box>
            ))}
            {resultado.modo === "peso" && resultado.barraRestante > 0.1 && (
              <Box sx={{ my: 0.5 }}>
                <Typography variant="caption">Barra parcial ({resultado.barraRestante.toFixed(2)} m)</Typography>
                <LinearProgress variant="determinate" value={(resultado.barraRestante / LARGO_BARRA) * 100} />
              </Box>
            )}
          </Box>
        </Alert>
      )}
    </Container>
  );
}
