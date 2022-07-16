import { ref } from 'vue'
import { getWords, Complexity } from '../api'
import { shuffle } from '../utils'

const series = ref<any[][]>([])
const wordsToTest = ref<any[]>([])
const results = ref<any[][]>([])
const currentResults = ref<TestState[]>([])
const currentSeries = ref<number>(-1)

export enum TestState {
    failed,
    succeed,
    todo
}

export default function useSeries () {
    async function getSeries ({complexity = Complexity.easy}) {
        const storedSeries = localStorage.getItem(`series-${complexity}`)
        wordsToTest.value = await getWords(complexity)

        if (storedSeries) {
            series.value = JSON.parse(storedSeries)
            return series.value
        }

        series.value = shuffle(wordsToTest.value.map((e,i) => i)).reduce(splitIndexesInSeries, [])
        localStorage.setItem('series-easy', JSON.stringify(series.value))
        return series.value
    }

    async function getResults ({complexity = Complexity.easy}) {
        const storedResults = localStorage.getItem(`results-${complexity}`)

        if (storedResults) {
            results.value = JSON.parse(storedResults)
            return results.value
        }

        const retrievedSeries = await getSeries({ complexity })
        results.value = retrievedSeries.map(series => series.map(w => TestState.todo))
        localStorage.setItem(`results-${complexity}`, JSON.stringify(results.value))
        return results.value
    }

    function setCurrentResults (value: TestState[]) {
        currentResults.value = value
        localStorage.setItem('current-results', JSON.stringify(value))
    }

    function resetCurrentResults () {
        setCurrentResults(results.value[currentSeries.value].map(() => TestState.todo))
    }

    function addTestResult ({ index, success }: { index: number, success: boolean }) {
        currentResults.value[index] = success ? TestState.succeed : TestState.failed
        localStorage.setItem('current-results', JSON.stringify(currentResults.value))
        console.log(success, currentResults.value)
    }

    function confirmCurrentResults (complexity: Complexity) {
        debugger
        results.value[currentSeries.value] = currentResults.value
        localStorage.setItem(`results-${complexity}`, JSON.stringify(results.value))
    }

    return {
        getSeries,
        getResults,
        series,
        wordsToTest,
        results,
        TestState,
        resetCurrentResults,
        currentSeries,
        confirmCurrentResults,
        addTestResult
    }
}

const splitIndexesInSeries = (acc: number[][], value: number, valueIdx: number) => {
    const serieIndex = Math.floor(valueIdx/10)
    if (!acc[serieIndex]) acc[serieIndex] = []
    acc[serieIndex].push(value)
    return acc
}
