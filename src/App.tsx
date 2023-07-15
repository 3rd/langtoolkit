import { useState } from "react";
import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { RouterProvider } from "react-router-dom";

import { router } from "./router";
import { theme } from "./theme";

export const App = () => {
  // color scheme
  const preferredColorScheme = useColorScheme();
  const [storedColorScheme, setStoredColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    getInitialValueInEffect: false,
  });
  const [colorScheme, setColorScheme] = useState<ColorScheme>(storedColorScheme ?? preferredColorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value ?? (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(newColorScheme);
    setStoredColorScheme(newColorScheme);
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
        <RouterProvider router={router} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
