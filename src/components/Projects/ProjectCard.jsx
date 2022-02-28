import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as styles from './ProjectCard.module.scss'

export default function ProjectCard({ title, description, url, src }) {
  const image = getImage(src.childImageSharp)

  return (
    <div className={styles.root}>
      <GatsbyImage image={image} alt={title} />
      <h3>{title}</h3>
      <h4>{description}</h4>
    </div>
  )
}
