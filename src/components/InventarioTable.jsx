import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography
} from "@mui/material";

function InventarioTable({ inventario }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ m: 2 }}>
        📦 Inventario
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: "#4a148c", // Cambia este color para el fondo del header
            "& th": {
              color: "#ffffff", // Color del texto del header
              fontWeight: "bold",
              fontSize: "1rem"
            }
          }}>
            <TableCell>Diámetro (mm)</TableCell>
            <TableCell>Peso (kg)</TableCell>
            <TableCell>Longitud total (m)</TableCell>
            <TableCell>Barras de 12 (m)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventario.map((item, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: "#6e1818ff", // Fondo blanco para todas las filas
                "&:hover": { backgroundColor: "#f5f5f5" }, // Efecto hover más suave
                "& td": {
                  color: "#333333" // Color del texto del cuerpo
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
  );
}

export default InventarioTable;