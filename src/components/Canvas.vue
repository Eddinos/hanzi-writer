<script lang="ts">
    import { PropType, ref, computed, onMounted, watch } from 'vue'
    import { createWorker, PSM, OEM } from 'tesseract.js';
    import Tesseract from 'tesseract.js';

    // const client = new vision.ImageAnnotatorClient()

    const worker = createWorker({
        logger: console.log,
        langPath: 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_best'
    });
    type Settings = {
        volume: number
    }

    export default {
        name: 'Canvas',
        props: {
            settings: {
                type: Object as PropType<Settings>,
                default: () => ({ volume: 99 })
            }
        },
        setup () {
            const element = ref()
            const canvasSize = 800
            let ctx: CanvasRenderingContext2D
            let isPainting = false
            let elementPosition = { x:0, y:0 }
            const result = ref('')
            function startPainting (e) {
                isPainting = true
                ctx.beginPath()
                ctx.moveTo(e.clientX - elementPosition.x, e.clientY - elementPosition.y)
                // paint(e)
            }

            function endPainting () {
                ctx.closePath()
                isPainting = false
                // context.beginPath()
            }

            function paint (e) {
                if (!isPainting) return

                // ctx.beginPath()
                // ctx.moveTo(e.clientX - elementPosition.x, e.clientY - elementPosition.y)
                ctx.lineTo(e.clientX - elementPosition.x, e.clientY - elementPosition.y)
                ctx.stroke()
                // ctx.closePath()

                // context.lineTo(e.clientX - elementPosition.x, e.clientY - elementPosition.y)
                // context.stroke()
                // context.beginPath()
                // context.moveTo(e.clientX - elementPosition.x, e.clientY - elementPosition.y)
            }

            function clear () {
                ctx.clearRect(0, 0, element.value.width, element.value.height)
                ctx.fillRect(0, 0, element.value.width, element.value.height)
            }

            async function recognize () {
                const img = new Image()
                img.src = element.value.toDataURL()

                /*await worker.load()
                await worker.loadLanguage('chi_sim')
                await worker.initialize('chi_sim')
                await worker.setParameters({
                    tessedit_pageseg_mode: PSM.PSM_SINGLE_CHAR,
                    tessedit_char_whitelist: '中国火人'
                })
                const res = await worker.recognize(img)
                document.body.append(img)
                console.log(res)
                result.value = res.data.text*/

                let visionRes = await fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAWCiWnDk6vP8uSpKMSGPOX_kaxnpEpiZc', {method: 'POST', body: JSON.stringify({requests: [{imageContext: {languageHints: ['zh-Hans', 'zh-Hant']}, features: [{type: 'DOCUMENT_TEXT_DETECTION'}], image: {content: img.src.replace('data:image/png;base64,', '')}}]})})
                visionRes = await visionRes.json()
                console.log({visionRes})
                // Tesseract.recognize(
                // img,
                // 'chi_sim',
                // { logger: m => console.log(m) }
                // ).then(({ data: { text } }) => {
                // console.log(text);
                // })
                // await worker.terminate()
            }

            watch(element, () => {
                if (element.value) {
                    ctx = element.value.getContext('2d')
                    const {x, y} = element.value.getBoundingClientRect()
                    elementPosition = { x, y }
                    console.log(elementPosition)
                    ctx.lineWidth = 10
                    ctx.lineCap = "round"
                    ctx.strokeStyle = "#2c3e50"
                    ctx.fillStyle = 'white'
                    ctx.fillRect(0, 0, element.value.width, element.value.height)
                }
            })

            return {
                element,
                canvasSize,
                startPainting,
                endPainting,
                paint,
                clear,
                recognize,
                result
            }
        }
    }
</script>

<template>
    <canvas ref="element"
            :height="canvasSize"
            :width="canvasSize"
            @mousedown="startPainting"
            @mouseup="endPainting"
            @mousemove="paint" />
</template>

<style scoped>
    canvas {
        /* background-color: burlywood; */
        border: 1px solid black;
    }
</style>
