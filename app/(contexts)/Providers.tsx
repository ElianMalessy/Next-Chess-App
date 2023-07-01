'use client';
import {CacheProvider} from '@chakra-ui/next-js';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {mode} from '@chakra-ui/theme-tools';
import {ColorModeScript} from '@chakra-ui/react';

import {AuthProvider} from './authContext';

const styles = {
  global: (props: any) => ({
    body: {
      bg: mode('#f0e7db', '#202023')(props),
    },
  }),
};
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};
const theme = extendTheme({config, styles});
export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
