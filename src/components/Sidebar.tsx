import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import BdeLogo from '../assets/bdeLogo.png'
const menuItems = [
  { text: "Home", icon: <HomeIcon /> },
  { text: "Data Settings", icon: <SettingsIcon /> },
  { text: "Change Password", icon: <LockIcon /> },
  { text: "Logout", icon: <LogoutIcon /> },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerContent = (
    <div style={{
      height: "100%",
      background: "linear-gradient(135deg,rgb(77, 82, 85) 0%, #414345 100%)",
      color: "#fff",
      minWidth: 220,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 24,
      paddingBottom: 24,
      overflow: "hidden"
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
        <img
          src={BdeLogo}
          alt="BDE Logo"
          width={80}
          style={{ borderRadius: "50%", marginBottom: 8 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
          Konfidance
        </Typography>
      </div>
      <List sx={{ width: "100%" }}>
        {menuItems.map((item) => (
          <ListItem  key={item.text} sx={{ borderRadius: 1, mx: 1, my: 0.5 }} component={Button}>
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <AppBar position="fixed" sx={{ background: "#232526", zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Konfidance
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: 220, overflow: 'hidden' } }}
        >
          {drawerContent}
        </Drawer>
        <Toolbar /> {/* Push content below AppBar */}
      </>
    );
  }
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{ '& .MuiDrawer-paper': { width: 220, boxSizing: 'border-box', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#fff', overflow: 'hidden' } }}
    >
      {drawerContent}
    </Drawer>
  );
}