import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IconButton, Drawer, Badge, Box, useTheme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BasketComp from "./BasketComp";

export default function BasketDrawer() {
  const [open, setOpen] = useState(false);
  const addedToBasket = useSelector((state) => state.basket.addedToBasket || []);
  const totalItems = addedToBasket.reduce((acc, item) => acc + item.quantity, 0);

  const theme = useTheme();

  const toggleDrawer = (state) => () => setOpen(state);

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        size="large"
        sx={{
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.action.hover,
          "&:hover": { backgroundColor: theme.palette.action.selected },
        }}
      >
        <Badge badgeContent={totalItems} color="error">
          <ShoppingCartIcon htmlColor={theme.palette.text.primary} />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: "90vw", sm: 420 },
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderLeft: `1px solid ${theme.palette.divider}`,
            boxShadow: "-8px 0 20px rgba(0,0,0,0.3)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <BasketComp />
        </Box>
      </Drawer>
    </>
  );
}
