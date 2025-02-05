import { Box } from "@mui/material";
import React from "react";
import { Provider } from "react-redux";
import Dashboard from "./pages/Dashboard";
import { store } from "./store/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Box p={2}>
        <Dashboard />
      </Box>
    </Provider>
  );
};

export default App;
