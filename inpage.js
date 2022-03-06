function onFormLoaded(form, watchUrl) {
    const button = document.createElement('a');
    button.className += 'shikimori-ext__button';
    button.innerText = 'Watch';
    button.href = watchUrl;
    button.target = "_blank";

    form.prepend(button);
}

window.addEventListener('load', function () {
    const observer = new MutationObserver(function (mutations, me) {
        const watchMetaTag = document.querySelector('head > meta[name="shikimori-ext-url"]')
        const watchUrl = watchMetaTag?.content
        if (watchUrl == null) {
            return;
        }

        const form = document.querySelector('.b-db_entry > .c-image > .b-user_rate');
        if (form == null) {
            return
        }

        try {
            const data = JSON.parse(form.getAttribute('data-entry'))
            if (data?.id != null) {
                onFormLoaded(form, `${watchUrl}?id=${data?.id}`);
                me.disconnect();
            }
        } catch (e) {
            console.warn('Invalid `data-entry` value')
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
})
