export const loadTitleComponent = (title, subtitle) => {
    const titleComponent = document.createElement('div')
    titleComponent.className = 'title-component'
    const cardTitle = document.createElement('h2')
    cardTitle.innerText = title
    cardTitle.className = 'card-title'
    const cardSubtitle = document.createElement('h3')
    cardSubtitle.innerText = subtitle
    cardSubtitle.className = 'card-subtitle'
    titleComponent.appendChild(cardTitle)
    titleComponent.appendChild(cardSubtitle)
    return titleComponent
}
