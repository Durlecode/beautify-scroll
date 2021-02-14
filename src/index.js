import EventEmitter from 'events'

class BeautifyScrollInstance {
    constructor(props) {
        this._eventBus = new EventEmitter()
        this._selector = props.selector
        this._callback = props.callback ?? this.#intersectionCallback
        this._wrapItems = props.wrapItems
        this._animationClassName = props.animationClassName
        this._targets = document.querySelectorAll(this._selector)
        this._container = this._targets[0].parentNode
        this._blocks = this._wrapItems ? this.#wrap(this._container, this._targets) : Array.prototype.slice.call(this._targets)
        this._opts = {rootMargin: props.margin + 'px', threshold: props.threshold}
        this.#observeMutations()
        this.#observeTargets()
        this.#ready()
    }

    #addClass(entry) {
        const item = this._wrapItems ? entry.target.children[0] : entry.target
        setTimeout(() => item.classList.add(this._animationClassName), item.dataset.delay ?? 0)
    }

    #removeClass(entry) {
        const item = this._wrapItems ? entry.target.children[0] : entry.target
        setTimeout(() => {
            item.classList.remove(this._animationClassName);
        }, item.dataset.delay ?? 0)
    }

    #intersectionCallback = entries => {
        entries.forEach(entry => !entry.isIntersecting ? this.#addClass(entry) : this.#removeClass(entry))
    }

    #mutationCallback = (mutationsList, observer) => {
        observer.disconnect()
        for (const mutation of mutationsList) {
            if (!mutation.addedNodes.length) continue;
            if (mutation.type === 'childList') {
                this._blocks = this._blocks.concat(
                    this._wrapItems ?
                        this.#wrap(this._container, mutation.addedNodes) : Array.prototype.slice.call(mutation.addedNodes)
                )
            }
        }

        this._eventBus.emit('update')
    }

    #observeMutations() {
        this._mutationsObserver = new MutationObserver(this.#mutationCallback)
        this._mutationsObserver.observe(this._container, {childList: true})
    }

    #observeTargets() {
        if (this._targetsObserver) this._targetsObserver.disconnect()
        this._targetsObserver = new IntersectionObserver(this._callback, this._opts)
        this._blocks.forEach(target => this._targetsObserver.observe(target))
    }

    #ready() {
        setTimeout(() => this._eventBus.emit('ready'))
    }

    #wrap = (container, targets) => {
        const blocks = []

        targets.forEach(item => {
            const div = document.createElement('span')

            div.append(item)

            container.append(div)

            blocks.push(div)
        })

        return blocks
    }

    on(event, callback) {
        return this._eventBus.on(event, callback)
    }

    reset() {
        this._targets = document.querySelectorAll(this._selector)
        this.#observeMutations()
        this.#observeTargets()
    }
}


export const BeautifyScroll = {
    init({
             selector = null,
             margin = 0,
             wrapItems = true,
             callback = null,
             threshold = 0,
             animationClassName = 'scroll-animated'
         }) {

        if (!selector) throw 'I need items ! Put a "targets" key in options.'
        if (!document.querySelectorAll(selector).length) throw 'No items for ' + selector + ' selector'

        return new BeautifyScrollInstance({
            selector,
            margin,
            callback,
            wrapItems,
            threshold,
            animationClassName
        })
    }
}