<script lang="ts">
    import { PropType, ref, watch, nextTick } from 'vue'

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
            const canvasSize = window.innerWidth - 24
            let ctx: CanvasRenderingContext2D
            let isPainting = false
            let elementPosition = { x:0, y:0 }
            const result = ref('')

            function startPainting (e) {
                isPainting = true
                const clientX = e.clientX || e.touches[0].clientX;
                const clientY = e.clientY || e.touches[0].clientY;
                ctx.beginPath()
                ctx.moveTo(clientX - elementPosition.x, clientY - elementPosition.y)
            }

            function endPainting () {
                ctx.closePath()
                isPainting = false
            }

            function paint (e) {
                if (!isPainting) return

                const clientX = e.clientX || e.touches[0].clientX;
                const clientY = e.clientY || e.touches[0].clientY;
                ctx.lineTo(clientX - elementPosition.x, clientY - elementPosition.y)
                ctx.stroke()
            }

            function clear () {
                ctx.clearRect(0, 0, element.value.width, element.value.height)
                ctx.fillRect(0, 0, element.value.width, element.value.height)
                nextTick(setBrushPosition)
            }

            function setBrushPosition () {
                const {x, y} = element.value.getBoundingClientRect()
                elementPosition = { x, y }
                console.log(elementPosition)
            }

            watch(element, () => {
                if (element.value) {
                    ctx = element.value.getContext('2d')
                    setBrushPosition()
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
                result
            }
        }
    }
</script>

<template>
    <div class="Canvas">
        <canvas ref="element"
                :height="canvasSize*1.2"
                :width="canvasSize"
                @touchstart="startPainting"
                @touchend="endPainting"
                @touchmove="paint"
                @mousedown="startPainting"
                @mouseup="endPainting"
                @mousemove="paint" />
        <button class="Canvas__close"
                @click="clear">
            <img src="../assets/cross.svg" alt="closeBtn">
        </button>
    </div>
</template>

<style scoped lang="scss">
    canvas {
        border: 1px solid black;
    }

    .Canvas {
        position: relative;
        touch-action: none;

        &__close {
            background-color: #7171f4;
            border-radius: 50%;
            border: none;
            transform: rotateZ(45deg);
            position: absolute;
            top: 12px;
            right: 12px;
            height: 48px;
            width: 48px;

            img {
                height: 100%;
                width: 100%;
            }
        }
    }
</style>
