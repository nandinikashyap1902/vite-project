import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const rows = [
  {
    id: 1,
    locationId: "1003",
    locationName: "Test Location Pump House Testing",
    lastData: "22/4/2025 15:08:22",
    status: "Online",
    ui: "Live (UI)",
  },
];

export default function LocationTable() {
  const navigate = useNavigate();
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <div className="table-header">
        <h3>Pump House Location List</h3>
        <span style={{ color: "#f9a825" }}>Auto Refresh Data Refresh In: 3 Seconds</span>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>LOCATION ID</TableCell>
              <TableCell>LOCATION NAME</TableCell>
              <TableCell>LAST DATA RECEIVED</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>UI</TableCell>
              <TableCell>LIVE DATA</TableCell>
              <TableCell>REPORT</TableCell>
              <TableCell>SETTINGS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>1</TableCell>
                <TableCell>{row.locationId}</TableCell>
                <TableCell>{row.locationName}</TableCell>
                <TableCell>{row.lastData}</TableCell>
                <TableCell>
                  <Chip label={row.status} color="success" size="small" />
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small" color="primary" onClick={() => navigate("/pumphouse")}>
                    {row.ui}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">
                    <MoreVertIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">
                    <MoreVertIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">
                    <MoreVertIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}