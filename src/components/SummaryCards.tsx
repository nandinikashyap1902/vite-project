
import Grid from '@mui/material/Grid';
  import{ Card, CardContent, Typography } from "@mui/material";

const cards = [
  { label: "Total Devices", value: 1, color: "#2196f3" },
  { label: "Online Devices", value: 1, color: "#4caf50" },
  { label: "Offline Devices", value: 0, color: "#f44336" },
];

export default function SummaryCards() {
  return (
    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
      {cards.map((card) => (
        <Grid key={card.label} component={Card}>
          <Card sx={{ background: card.color, color: "#fff" }}>
            <CardContent>
              <Typography variant="h4">{card.value}</Typography>
              <Typography>{card.label}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}