<template>
    <div class="Series" v-if="currentSeries === -1">
        pick a serie
        <div v-for="(ResultSerie, index) in results"
             class="Series__resultSerie" @click="() => startSerie(index)">
            <span class="Series__number">#{{index+1}}</span>
            <div v-for="result in ResultSerie" class="Series__result"
                 :class="{'Series__result--correct': result}"></div>
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
    import { annotateImg } from '../api'
    import { useSeries } from '../composables'

    const canvas = ref(null)

    const {
        wordsToTest,
        series,
        results,
        getResults,
        getSeries,
        resetCurrentResults,
        currentSeries,
        addTestResult,
        confirmCurrentResults
    } = useSeries()

    const currentWordIndex = ref(0)
    const showHint = ref(false)

    const currentTest = computed(() => {
        if (currentSeries.value < 0 || currentSeries.value > series.value.length) return {}
        return wordsToTest.value[series.value[currentSeries.value][currentWordIndex.value]] || {}
    })

    function clearCanvas () {
        canvas.value.clear()
    }

    async function recognize () {
        const guess = await annotateImg(canvas.value.$el.querySelector('canvas').toDataURL())
        const success = guess == currentTest.value.simp
        // if (guess == currentTest.value.simp) {
        //     alert('wow impressionnant')
        // if (currentWordIndex.value >= series.value[currentSeries.value].length - 1) {
        //     alert('serie terminée')
        //     console.log(results.value)
        //     currentSeries.value = -1
        //     // const resultsEasy = JSON.parse(localStorage.getItem('results-easy'))
        //     results.value[currentSeries.value] = localStorage.getItem('current-results').split(',').map(x => x.length ? JSON.parse(x) : Boolean(x))
        //
        //     localStorage.setItem('results-easy', results.value)
        // } else {
            addTestResult({
                index: currentWordIndex.value,
                success
            })
            currentWordIndex.value += 1

            if (currentWordIndex.value > series.value[currentSeries.value].length - 1) {
                alert('serie terminée')
                currentSeries.value = -1
                confirmCurrentResults('easy')
            }
        // }
        clearCanvas()

        // }
    }

    function startSerie (index) {
        currentSeries.value = index
        // localStorage.setItem('current-results', results.value[currentSerie.value].map(x => null))
        resetCurrentResults()
    }

    onMounted(async () => {
        // const { getSeries } = useSeries()
        getSeries('easy')
        const test = await getResults('easy')
        console.log({test, series, results})
        // localStorage.setItem('current-results', series)
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

            &--correct {
                background-color: seagreen;
            }
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
