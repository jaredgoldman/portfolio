import React from 'react'
import * as styles from './index.module.scss'
import ProjectCard from './ProjectCard'
import { graphql, useStaticQuery } from 'gatsby'

export default function Projects() {
  const {
    allFile: { edges },
  } = useStaticQuery(graphql`
    query {
      allFile {
        edges {
          node {
            relativeDirectory
            ext
            childImageSharp {
              gatsbyImageData(width: 200)
            }
            childJson {
              title
              url
              description
            }
          }
        }
      }
    }
  `)

  // Organize data by project
  const extractPreviewData = () => {
    const projects = {}
    edges.forEach(node => {
      node = node.node
      if (projects[node.relativeDirectory]) {
        projects[node.relativeDirectory][node.ext] = node
      } else {
        projects[node.relativeDirectory] = {
          [node.ext]: node,
        }
      }
    })

    return Object.values(projects)
  }

  const projects = extractPreviewData().map(project => {
    const json = project['.json']
    const imageSrc = project['.png']
    const { title, url, description } = json.childJson

    return (
      <ProjectCard
        key={title}
        title={title}
        url={url}
        description={description}
        src={imageSrc}
      />
    )
  })

  // console.log(projects)

  return (
    <section className={styles.root}>
      <div className={styles.heading}>
        <h2>Latest Projects</h2>
      </div>
      <div className={styles.projects}>{projects}</div>
    </section>
  )
}
