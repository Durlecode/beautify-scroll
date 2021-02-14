import {BeautifyScroll} from './index'

const appendItems = (container, nbItems) => {
    const array = Array(nbItems).fill('item')
    const nodes = []

    array.forEach(item => {
        const div = document.createElement('div')
        div.classList.add(item)
        // div.dataset.delay = Math.floor(Math.random() * 100).toString()
        nodes.push(div)
    })

    container.append(...nodes)
}

const render = () => {
    const container = document.getElementById('container')

    appendItems(container, 50)

    const bs = BeautifyScroll.init({
        selector: '.item'
    })

    bs.on('update', () => bs.reset())

    setInterval(() => appendItems(container, 10), 1000)
}

window.addEventListener('load', render)

