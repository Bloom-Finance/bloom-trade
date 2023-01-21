## Themes

Is a package that contains all the themes for the Bloom application.

## Example code

```javascript
import { DarkTheme } from '@bloom-trade/themes';
import { ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


function App() {
  return (
    <ThemeProvider theme={DarkTheme}>
      <CssBaseline />
      <main>This app is using the dark mode</main>
    </ThemeProvider>
  );
}

export default App;
});
```
