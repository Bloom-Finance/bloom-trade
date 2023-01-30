import React from 'react'
import styles from './styles.module.css'

export interface FindLoaderProps {
  color: string
}
const FindLoader = (props: FindLoaderProps): JSX.Element => {
  const { color } = props

  if (color) return <span className={styles.loader} style={{ borderColor: color, border: `3px solid ${color}` }}></span>
  return <span className={styles.loader}></span>
}

export default FindLoader
