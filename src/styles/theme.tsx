import React from 'react'

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { Form } from 'formik'

import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/blue'
import indigo from '@material-ui/core/colors/indigo'
import orange from '@material-ui/core/colors/orange'
import yellow from '@material-ui/core/colors/yellow'

import GoogleFontLoader from 'react-google-font-loader'

//load this first
const fontLoader = () =>
    <GoogleFontLoader
      fonts={[
        {
          font: 'Barlow',
          weights: [400, '400i'],
        },
        {
          font: 'Lato',
          weights: [400, 500],
        },
      ]}
      subsets={['cyrillic-ext', 'greek']}
    />

let theme = createMuiTheme ({
  spacing: 8,
  typography: {
    fontFamily: [
      'Barlow',
      'Lato',
      'sans-serif',
      'Arial',
      'Roboto',
      '-apple-system',
    ].join(','),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    h1: {
      fontSize:  "3vh",
      fontWeight: 700,
      fontFamily: "\"Barlow\", \"Arial\", \"sans-serif\", \"Roboto\"",
      color: '#000000'
    },
    h2: {
      fontSize: "2.5vh",
      fontWeight: 600,
      fontFamily: "\"Barlow\", \"Arial\", \"sans-serif\", \"Roboto\"",
      color: '#000000'
    },
    h3: {
      fontSize: "2vh",
      fontWeight: 500,
      fontFamily: "\"Barlow\", \"Arial\", \"sans-serif\", \"Roboto\"",
      color: '#000000'
    },
    h4: {
      fontSize: "1.7vh",
      fontWeight: 400,
      fontFamily: "\"Barlow\", \"Arial\", \"sans-serif\", \"Roboto\"",
      color: '#000000'
    },
    h5: {
      fontSize: "1.6vh",
      fontWeight: 400,
      fontFamily: "\"Barlow\", \"Arial\", \"sans-serif\", \"Roboto\"",
      color: '#000000'
    },
    h6: {
      fontSize: "1.5vh",
      fontWeight: 400,
      fontFamily: "\"Barlow\", \"Arial\", \"sans-serif\", \"Roboto\"",
      color: '#000000'
    },
    subtitle1: {
      fontSize: "2vh",
      fontWeight: 400,
      fontFamily: "\"Barlow\", \"Arial\", \"sans-serif\", \"Roboto\"",
      lineHeight: "1.5em",
      color: '#000000'
    },
    subtitle2: {
      fontSize: "2vh",
      fontWeight: 400,
      fontFamily: "\"Barlow\", \"Arial\", \"sans-serif\", \"Roboto\"",
      lineHeight: "1.5em",
      color: '#000000'
    },
    body1: {
      fontSize: "1.3vh",
      fontWeight: 400,
      fontFamily: "\"Lato\", \"Arial\", \"sans-serif\", \"Roboto\"",
      lineHeight: "1.46429em",
      color: '#000000'
    },
    body2: {
      fontSize: "1.3vh",
      fontWeight: 400,
      fontFamily: "\"Lato\", \"Arial\", \"sans-serif\", \"Roboto\"",
      lineHeight: "1.4em",
      color: '#000000'
    },
    caption: {
      fontSize: "1.2vh",
      fontWeight: 400,
      fontFamily: "\"Lato\", \"Arial\", \"sans-serif\", \"Roboto\"",
      lineHeight: "1.375em",
      color: orange[900]
    },
    button: {
      fontSize: "1.2vh",
      textTransform: "uppercase",
      fontWeight: 500,
      fontFamily: "\"Lato\", \"Arial\", \"sans-serif\", \"Roboto\"",
      color: '#000000'
    }
  },
  palette: {
    type: 'dark',
    background: {
      default: '#FFFFFF',
    },
    text: {
      primary: "#000000",
      secondary: "#000000"
    },
    primary: {
      main: '#929396'
    },
    secondary: {
      main: '#ff671e'
    },
    error: red,
    warning: orange,
    info: yellow,
    success: green,
  }
})

theme = responsiveFontSizes(theme)
theme.spacing(4)

const themeStyles = makeStyles({
  root: {
    background: 'linear-gradient(#FFFFFF, #FFFFFF)',
    color: theme.palette.text.primary,
    height: "100vh",
    width: "100vw"
  },
  logo: {
    padding: theme.spacing(1),
    margin: theme.spacing(0)
  },
  header: {
    padding: theme.spacing(1),
    margin: theme.spacing(0),
    textAlign: 'left',
    background: 'linear-gradient(#27737e, #27737e)',
    height: "10vh",
    width: "100vw"
  },
  title: {
    padding: theme.spacing(1),
    margin: theme.spacing(0),
    textAlign: 'left',
    background: 'linear-gradient(#27737e, #27737e)'
  },
  subTitle: {
    padding: theme.spacing(1),
    margin: theme.spacing(0),
    textAlign: 'left',
    background: 'linear-gradient(#27737e, #27737e)'
  },
  content: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.primary,
    background: 'linear-gradient(#FFFFFF, #FFFFFF)',
    overflow: 'auto',
    height: '80vh',
    width: "100vw"
  },
  caption: {
    padding: theme.spacing(1),
    margin: theme.spacing(0),
    textAlign: 'center',
    background: 'linear-gradient(#27737e, #27737e)'
  },
  footer: {
    padding: theme.spacing(1),
    margin: theme.spacing(0),
    textAlign: 'center',
    background: 'linear-gradient(#27737e, #27737e)',
    height: "10vh",
    width: "100vw"
  },
  home: {
    background: 'linear-gradient(#FFFFFF, #FFFFFF)',
    textAlign: 'center'
  },
  homeLink: {
    color: theme.palette.text.primary,
    textDecoration: 'none'
  },
  menu: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    position: 'absolute',
    right: "1rem",
    fontSize: "5vh",
    textTransform: 'none',
    color: 'linear-gradient(#929396, #929396)',
    background: 'linear-gradient(#929396, #929396)'
  },
  spinner: {
     position: 'absolute',
     left: '50%',
     top: '50%',
     transform: 'translate(-50%, -50%)'
  }
})

export { fontLoader, theme, themeStyles }
