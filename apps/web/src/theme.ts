import { createTheme } from '@mantine/core';
export const theme = createTheme({
  primaryColor: 'forest',
  colors: { forest: ['#edf5f0', '#dceadf', '#b6d3c1', '#8fbda4', '#6ca889', '#519972', '#3d8961', '#2e7653', '#275d4a', '#1d4838'] },
  primaryShade: 8,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '400' },
  defaultRadius: 'md',
  components: { Button: { defaultProps: { size: 'md' } }, TextInput: { defaultProps: { size: 'md' } }, Select: { defaultProps: { size: 'md' } } },
});
