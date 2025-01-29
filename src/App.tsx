import { CssBaseline, Typography } from "@mui/material"
import { AppLayout } from "./styled-components/app-layout.styled.component"


function App() {
  

  return (
    <>
    <AppLayout>

      <CssBaseline/>
      <div>
       <Typography variant="h1">Hello World</Typography>
      </div>
    </AppLayout>
    </>
  )
}

export default App
