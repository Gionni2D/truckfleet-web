import * as React from 'react'
import { ThemeProvider, Theme, createMuiTheme } from '@material-ui/core'
import { light } from '@material-ui/core/styles/createPalette'

const theme : Theme = createMuiTheme({
  palette: {
    primary: {
      light: '#808080',
      main: '#606060',
      dark: '#404040'
    },
    secondary: {
      light: '#ffffff',
      main: '#f9f9f9',
      dark: '#f0f0f0'
    }
  }
})


export default function App(props: React.PropsWithChildren<{}>) {

  return <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
}