import { MantineThemeOverride } from '@mantine/core'

export const appTheme: MantineThemeOverride = {
  colorScheme: 'light',
  fontFamily: 'var(--font-sans), "Hiragino Sans", "Noto Sans JP", sans-serif',
  headings: {
    fontFamily:
      'var(--font-display), "Hiragino Mincho ProN", "Yu Mincho", serif',
    fontWeight: 600,
  },
  primaryColor: 'coffee',
  primaryShade: 6,
  defaultRadius: 'md',
  globalStyles: () => ({
    body: {
      backgroundColor: '#f3ece3',
      color: '#2a1c14',
    },
  }),
  colors: {
    coffee: [
      '#FBF6F0',
      '#F3E6D8',
      '#E6CDB0',
      '#D4B08A',
      '#C48C5A',
      '#B07038',
      '#8B4E2A',
      '#6F3D21',
      '#542F1A',
      '#3A2112',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        overlayBlur: 4,
        overlayOpacity: 0.4,
        overlayColor: '#2A1C14',
        padding: 'lg',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        label: {
          fontWeight: 600,
          marginBottom: 6,
          color: '#2A1C14',
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        label: {
          fontWeight: 600,
          marginBottom: 6,
          color: '#2A1C14',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
      },
    },
  },
}
