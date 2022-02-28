import React from "react"
import Layout from "./Layouts"
import Hero from "./Hero"
import Projects from "./Projects"
import * as styles from "./Home.module.scss"

export default function Home() {
  return (
    <Layout>
      <div className={styles.root}>
        <Hero />
        <Projects />
      </div>
    </Layout>
  )
}
