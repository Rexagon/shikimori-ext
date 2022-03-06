function onFormLoaded(form, watchUrl) {
    const button = document.createElement('a');
    button.className += 'shikimori-ext__button';
    button.innerText = 'Watch';
    button.href = watchUrl;
    button.target = "_blank";

    form.prepend(button);
}

let initialized = null;

window.addEventListener('turbolinks:load', function () {
    const start = () => {
        const currentLocation = window.location.href

        if (initialized === currentLocation) {
            return true;
        }

        const watchMetaTag = document.querySelector('meta[name="shikimori-ext-url"]');
        const watchUrl = watchMetaTag?.content;
        if (watchUrl == null) {
            return false;
        }

        const form = document.querySelector('.b-db_entry > .c-image > .b-user_rate');
        if (form == null) {
            return false;
        }

        try {
            const data = JSON.parse(form.getAttribute('data-entry'));
            if (data?.id != null) {
                initialized = currentLocation;
                onFormLoaded(form, `${watchUrl}?id=${data?.id}`);
                return true;
            }
        } catch (e) {
            console.warn('Invalid `data-entry` value');
        }

        return false;
    }

    if (start()) {
        return
    }

    const observer = new MutationObserver(function (mutations, me) {
        start() && me.disconnect();
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
})
