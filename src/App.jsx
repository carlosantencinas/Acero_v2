// ConversorAcero.jsx
import React, { useState } from 'react';
import {
  Container, Typography, TextField, MenuItem, Button,
  Alert, Box, LinearProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
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
  const [customDiam, setCustomDiam] = useState(0);
  const [pesoKg, setPesoKg] = useState(10);
  const [resultado, setResultado] = useState(null);
  const [inventario, setInventario] = useState([]);

  const getDiametroFinal = () => diametro === "" ? customDiam : diametro;

  const calcularDesdePeso = () => {
    const d = getDiametroFinal();
    const diam_m = d / 1000;
    const pesoPorMetro = (Math.PI * Math.pow(diam_m, 2) / 4) * DENSIDAD_ACERO;
    const metros = pesoKg / pesoPorMetro;
    const barras = metros / LARGO_BARRA;
    const barraRestante = metros % LARGO_BARRA;

    setResultado({ modo: "peso", pesoPorMetro, metros, barras, barraRestante });
  };

  const calcularDesdeBarras = (numBarras) => {
    const d = getDiametroFinal();
    const diam_m = d / 1000;
    const pesoPorMetro = (Math.PI * Math.pow(diam_m, 2) / 4) * DENSIDAD_ACERO;
    const metros = numBarras * LARGO_BARRA;
    const peso = metros * pesoPorMetro;

    setResultado({ modo: "barras", pesoPorMetro, metros, barras: numBarras, peso });
  };

  const exportarCSV = (data) => {
    const encabezados = ["Diámetro (mm)", "Peso (kg)", "Longitud total (m)", "Barras de 12m"];
    const filas = data.map(i => [i.diametro, i.peso.toFixed(2), i.longitud.toFixed(2), i.barras.toFixed(2)]);
    const csv = [encabezados, ...filas].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventario_acero.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>🔧 Conversor de Acero</Typography>

      <TextField
        fullWidth select label="🔩 Diámetro"
        value={diametro}
        onChange={(e) => {
          const val = e.target.value;
          setDiametro(val === "custom" ? "" : parseFloat(val));
        }}
        margin="normal"
      >
        {diametros.map(d => (
          <MenuItem key={d.valor} value={d.valor}>{d.etiqueta}</MenuItem>
        ))}
        <MenuItem value="custom">Otro (personalizado)</MenuItem>
      </TextField>

      {diametro === "" && (
        <TextField
          fullWidth
          label="Introduce diámetro personalizado (mm)"
          type="number"
          value={customDiam}
          onChange={e => setCustomDiam(parseFloat(e.target.value))}
          margin="normal"
        />
      )}

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
        const num = parseFloat(prompt("¿Cuántas barras de 12m?"));
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

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              setInventario(prev => [
                ...prev,
                {
                  diametro: getDiametroFinal(),
                  peso: resultado.modo === "barras" ? resultado.peso : pesoKg,
                  longitud: resultado.metros,
                  barras: resultado.barras
                }
              ]);
            }}
          >
            💾 Agregar al inventario
          </Button>
        </Alert>
      )}

      {inventario.length > 0 && (
  <Box mt={4}>
    <Typography variant="h6" gutterBottom>📦 Inventario</Typography>

    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: '#1976d2', // Color de fondo del header
            '& th': {
              color: '#fff', // Color del texto del header
              fontWeight: 'bold',
              fontSize: '1rem'
            }
          }}>
            <TableCell>Diámetro (mm)</TableCell>
            <TableCell>Peso (kg)</TableCell>
            <TableCell>Longitud total (m)</TableCell>
            <TableCell>Barras de 12m</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventario.map((item, idx) => (
            <TableRow 
              key={idx}
              sx={{
                backgroundColor: '#fff', // Fondo blanco para todas las filas
                '&:hover': { backgroundColor: '#f5f5f5' }, // Efecto hover
                '& td': {
                  color: '#333' // Color del texto del cuerpo
                }
              }}
            >
              <TableCell>{item.diametro}</TableCell>
              <TableCell>{item.peso.toFixed(2)}</TableCell>
              <TableCell>{item.longitud.toFixed(2)}</TableCell>
              <TableCell>{item.barras.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Button
      variant="contained"
      color="secondary"
      onClick={() => exportarCSV(inventario)}
    >
      📥 Exportar CSV
    </Button>
  </Box>
)}
    </Container>
  );
}
