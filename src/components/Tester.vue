<template>
    <div class="Series" v-if="currentSerie === -1">
        pick a serie
        <div v-for="(ResultSerie, index) in results"
             class="Series__resultSerie" @click="currentSerie = index">
            <span class="Series__number">#{{index+1}}</span>
            <div v-for="result in ResultSerie" class="Series__result"></div>
        </div>
    </div>

    <div v-else>
        <h1>{{ currentTest.eng }}</h1>

        <div class="Tester__inputArea">
            <Canvas ref="canvas"
                    class="Tester__canvas"/>
            <transition name="fade"
                        @after-enter="showHint = false">
                <div class="Tester__hint"
                     v-if="showHint">
                    {{ currentTest.simp }}
                </div>
            </transition>
        </div>

        <button class="Tester__button Tester__button--submit"
                @click="recognize">
            Recognize
        </button>
        <button class="Tester__button Tester__button--hint"
                @click="showHint = true"
                @animationEnd="showHint = false">
            Hint
        </button>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import Canvas from './Canvas.vue'
    import { annotateImg, getWords } from '../api';

    const canvas = ref(null)
    let wordsToTest = ref([])
    let currentSerie = ref(-1)
    const series = ref([])
    const results = ref([])
    const currentWordIndex = ref(0)
    const showHint = ref(false)

    const currentTest = computed(() => {
        if (currentSerie.value < 0 || currentSerie.value > series.value.length) return {}
        return wordsToTest.value[series.value[currentSerie.value][currentWordIndex.value]] || {}
    })

    function clearCanvas () {
        canvas.value.clear()
    }

    async function recognize () {
        const guess = await annotateImg(canvas.value.$el.querySelector('canvas').toDataURL())
        const success = guess == currentTest.value.simp
        // if (guess == currentTest.value.simp) {
        //     alert('wow impressionnant')
        clearCanvas()
        if (currentWordIndex.value >= series.value[currentSerie.value].length - 1) {
            alert('serie terminée')
            console.log(results.value)
        } else {
            results.value[currentSerie.value][currentWordIndex.value] = success
            currentWordIndex.value += 1
            console.log(success)
        }

        // }
    }

    function shuffle(arr) {
        let j, x, i;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = arr[i];
            arr[i] = arr[j];
            arr[j] = x;
        }
        return arr;
    }

    function displayHint () {
        // showHint = true
    }

    onMounted(async () => {
        wordsToTest.value = await getWords('easy')
        const splitIndexesInSeries = (acc, value, valueIdx) => {
            const serieIndex = Math.floor(valueIdx/10)
            if (!acc[serieIndex]) acc[serieIndex] = []
            acc[serieIndex].push(value)
            return acc
        }
        series.value = shuffle(wordsToTest.value.map((e,i) => i)).reduce(splitIndexesInSeries, [])
        results.value = series.value.map(serie => serie.map(w => false))
    })
</script>

<style lang="scss" scoped>
    .Series {

        &__resultSerie {
            display: flex;
            justify-content: space-evenly;
            margin: 4% 14%;
            padding: 12px 8px;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid transparent;

            &:hover {
                background-color: #fefefe;
                border-color: rgba(115, 177, 219, .6);
            }
        }

        &__result {
            width: 12px;
            height: 12px;
            border: 2px solid;
            border-radius: 50%;
        }

        &__number {
            margin-right: 24px;
        }
    }

    .Tester {

        &__button {
            display: block;
            width: 80%;
            border: none;
            padding: 12px;
            font-size: 24px;
            font-family: inherit;
            border-radius: 12px;
            cursor: pointer;
            margin: 8px auto;

            &--submit {
                background-color: lightgreen;
            }

            &--hint {
                background-color: #ddd;
            }

            &:hover {
                opacity: .8;
            }
        }

        &__inputArea {
            position: relative;
        }

        &__hint {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 120px;
            opacity: 1;
        }

        &__canvas {
            z-index: 2;
            opacity: .8;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 4s linear;
    }

    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
</style>
