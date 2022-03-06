const API_URL = 'https://anime.bytie.moe'

function showError(root, error) {
    root.textContent = error
}

function onLoad(root, response) {
    const player = document.createElement('div');
    player.className = 'player';
    root.appendChild(player)

    const inner = document.createElement('div');
    inner.className = 'player__inner';
    player.appendChild(inner);

    if (Array.isArray(response.result) && response.result.length > 0) {
        const label = document.createElement('label');
        label.textContent = 'Select translation';
        label.setAttribute('for', 'transaction-select');
        inner.appendChild(label);

        const select = document.createElement('select');
        select.name = 'transaction-select';
        inner.appendChild(select);

        for (let i = 0; i < response.result.length; ++i) {
            const item = response.result[i];

            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = `${item.quality} | ${item.translation.title}`;

            select.appendChild(option);
        }

        const iframe = document.createElement('iframe');
        iframe.src = `https:${response.result[0].link}`;
        inner.appendChild(iframe);

        select.addEventListener('change', (event) => {
            iframe.src = `https:${response.result[event.target.value]?.link}`
        })
    } else {
        const message = document.createElement('label');
        message.textContent = 'No results'
        inner.appendChild(message)
    }
}

function onInit(root) {
    const params = new URLSearchParams(window.location.search)
    const titleId = params.get('id')
    if (titleId == null) {
        return showError(root, 'Unknown title id')
    }

    fetch(`${API_URL}/ext/search_by_id?shikimori_id=${titleId}`)
        .then((response) => response.json())
        .then((response) => {
            onLoad(root, response)
        })
        .catch((e) => {
            showError(`Failed to load title info: ${e}`)
        })
}

let initialized = false

window.addEventListener('load', function () {
    const start = () => {
        if (initialized) {
            return false;
        }

        const root = document.getElementById('root')
        if (root != null) {
            initialized = true
            onInit(root)
            return true
        } else {
            return false
        }
    }

    if (start()) {
        return
    }

    const observer = new MutationObserver(function (mutations, me) {
        start() && me.disconnect();
    });

    observer.observe(document, {
        childList: true, subtree: true
    });
})
