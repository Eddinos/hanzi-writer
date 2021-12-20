enum Complexity {
    easy = 'easy',
    medium = 'medium'
}

async function annotateImg (base64Img: string) {
    const imgContent = base64Img.replace('data:image/png;base64,', '')
    let visionRes = await fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAWCiWnDk6vP8uSpKMSGPOX_kaxnpEpiZc', {
        method: 'POST',
        body: JSON.stringify({
            requests: [{
                imageContext: {
                    languageHints: ['zh-Hans', 'zh-Hant']
                },
                features: [{type: 'DOCUMENT_TEXT_DETECTION'}],
                image: {
                    content: imgContent
                }
            }]
        })
    })
    const { responses } = await visionRes.json()
    return responses[0]?.fullTextAnnotation?.text.trim()
}

async function getWords (complexity: Complexity) {
    const res = await fetch(`data-${complexity}.json`)
    const { data } = await res.json()
    return data
}

export {
    annotateImg,
    getWords
}
