import React from 'react'
import * as styles from './Hero.module.scss'
import { StaticImage } from 'gatsby-plugin-image'

export default function Hero() {
  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h1>Jared Goldman</h1>
        <h1>Full-Stack Web Developer / Drummer</h1>
        <h1>Based in Toronto, Ontario</h1>
      </div>
      <div className={styles.image}>
        <StaticImage
          src="../images/me.jpg"
          alt="picture of me, Jared Goldman"
          placeholder="blurred"
          layout="fixed"
          width={200}
          height={200}
        />
      </div>
    </div>
  )
}
