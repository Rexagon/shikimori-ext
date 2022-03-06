const injectScript = () => {
    try {
        const container = document.head || document.documentElement

        const metaTag = document.createElement('meta')
        metaTag.name = "shikimori-ext-url"
        metaTag.content = chrome.runtime.getURL('watch.html')
        container.insertBefore(metaTag, container.children[0])

        const scriptTag = document.createElement('script')
        scriptTag.src = chrome.runtime.getURL('inpage.js')
        scriptTag.setAttribute('async', 'false')
        container.insertBefore(scriptTag, container.children[0])
        container.removeChild(scriptTag)
    } catch (e) {
        console.error('Provider injection failed', e)
    }
}

injectScript()
