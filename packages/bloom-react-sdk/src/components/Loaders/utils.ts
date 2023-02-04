export type SizeOptions = 'sm' | 'md' | 'lg' | 'xl'

export const hex2rgba = (hex: any, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x: any) => parseInt(x, 16))
  return `rgba(${r},${g},${b},${alpha})`
}

export const getSize = (size: string) => {
  switch (size) {
    case 'sm':
      return {
        width: '24px',
        height: '24px',
      }
    case 'md':
      return {
        width: '36px',
        height: '36px',
      }
    case 'lg':
      return {
        width: '48px',
        height: '48px',
      }
    case 'xl':
      return {
        width: '56px',
        height: '56px',
      }
    default:
      return {
        width: '48px',
        height: '48px',
      }
  }
}
