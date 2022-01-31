popup_latex = function(latex_str) {
    alert(latex_str)
}

grab_latex = async function(data) {
    src_url = data.srcUrl
    console.log(src_url.startsWith('https://wikimedia.org/api/rest_v1/media/math/render/svg'))
    if (src_url.startsWith('https://wikimedia.org/api/rest_v1/media/math/render/svg')) {
        fetch(src_url).then(async function (response) {
            return response.text()
        }).then(async function (html) {
            let start = 'id=\"MathJax-SVG-1-Title\">'
            let end = '</title>'
            let startIndex = html.indexOf(start) + start.length
            let endIndex = html.indexOf(end)
            latex_string = html.substring(startIndex, endIndex)
            let [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true
            })

            console.log(tab)
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: popup_latex,
                args: [latex_string],
            });
            

        }).catch(function (err) {
            console.warn('invalid Wikimedia link', err);
        });
    }
}

chrome.contextMenus.onClicked.addListener(grab_latex)

chrome.contextMenus.create({
    title: 'copy TeX to clipboard',
    contexts: ['image'],
    id: 't'
})
