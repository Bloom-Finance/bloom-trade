import { m, motion } from 'framer-motion'
import { alpha, styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import React from 'react'
//

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}))

// ----------------------------------------------------------------------

const Logo = () => {
  //64x64
  return (
    <svg width='52' height='31' viewBox='0 0 52 31' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M17.2732 0.342882C19.658 0.31452 22.0275 0.669779 24.2552 1.38972C26.2722 2.04403 28.0988 3.0577 29.6109 4.36182C31.1299 5.7054 32.2937 7.30647 33.0252 9.05893C34.6335 13.0884 34.6335 17.4526 33.0252 21.4821C32.2881 23.2411 31.1252 24.8509 29.6109 26.2088C28.1101 27.5258 26.2868 28.5495 24.2687 29.2082C19.7549 30.604 14.8022 30.604 10.2885 29.2082C8.25646 28.5516 6.41857 27.528 4.90319 26.2088C3.37877 24.852 2.20423 23.2425 1.45391 21.4821C-0.176043 17.4556 -0.176043 13.0854 1.45391 9.05893C2.19848 7.305 3.37402 5.70419 4.90319 4.36182C6.42604 3.05692 8.26248 2.04341 10.2885 1.38972C12.518 0.672211 14.8877 0.31704 17.2732 0.342882ZM17.2732 24.8775C20.1292 24.8775 22.2447 24.0666 23.6198 22.4448C24.9948 20.8229 25.6814 18.4455 25.6796 15.3126C25.6796 12.1812 24.993 9.79474 23.6198 8.15318C22.2465 6.51163 20.131 5.69084 17.2732 5.69084C14.3687 5.69084 12.2254 6.51921 10.8432 8.17594C9.46093 9.83267 8.76983 12.2146 8.76983 15.3217C8.76983 18.4349 9.46093 20.8078 10.8432 22.4402C12.2254 24.0727 14.3687 24.8851 17.2732 24.8775Z'
        fill='#525251'
      />
      <path
        d='M49.8686 9.06182C49.1368 7.30867 47.9726 5.70697 46.453 4.36285C44.9447 3.05908 43.1219 2.04501 41.1087 1.38957C36.5931 -0.00680983 31.6384 -0.00680983 27.1229 1.38957C26.6279 1.55503 26.1432 1.74197 25.671 1.94963C26.8089 2.42808 27.8632 3.03714 28.8038 3.75954C29.699 4.44117 30.4956 5.20995 31.1769 6.04984C32.1367 5.80141 33.1364 5.68082 34.14 5.6924C36.9972 5.6924 39.1126 6.51351 40.4864 8.15572C41.8602 9.79793 42.5471 12.1854 42.5471 15.318C42.5471 18.4522 41.8602 20.8305 40.4864 22.453C39.1126 24.0754 36.9972 24.8867 34.14 24.8867C31.2362 24.8867 29.092 24.0709 27.7074 22.4393C26.3229 20.8077 25.6306 18.4339 25.6306 15.318C25.6279 14.3895 25.7045 13.462 25.8596 12.5428C25.8218 12.372 24.8844 9.97703 23.9389 8.62471C22.4736 6.52338 20.1839 6.01341 20.1516 6.05439C19.3951 6.98986 18.7763 7.99978 18.3091 9.06182C16.6821 13.0904 16.6821 17.4613 18.3091 21.4899C19.0565 23.2502 20.2278 24.8603 21.7489 26.2185C23.2654 27.5377 25.1039 28.5617 27.1364 29.2191C31.6519 30.6155 36.6066 30.6155 41.1221 29.2191C43.1415 28.5608 44.9657 27.5366 46.4665 26.2185C47.9814 24.86 49.1447 23.2496 49.8821 21.4899C51.4911 17.4588 51.4911 13.0929 49.8821 9.06182H49.8686Z'
        fill='#FF0083'
      />
    </svg>
  )
}

export default function ScreenLoader() {
  return (
    <RootStyle>
      <motion.div
        animate={{
          scale: [1, 0.9, 0.9, 1, 1],
          opacity: [1, 0.48, 0.48, 1, 1],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeatDelay: 1,
          repeat: Infinity,
        }}
      >
        <Logo />
      </motion.div>

      <Box
        component={motion.div}
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          width: 100,
          height: 100,
          borderRadius: '25%',
          position: 'absolute',
          border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity,
        }}
        sx={{
          width: 120,
          height: 120,
          borderRadius: '25%',
          position: 'absolute',
          border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />
    </RootStyle>
  )
}
