<template>
    <h1>{{ currentTest.eng + currentTest.simp }}</h1>

    <Canvas ref="canvas" />

    <button @click="clearCanvas">
        Clear
    </button>
    <button @click="recognize">
        Recognize
    </button>
    <button @click="startSerie">
        Start serie
    </button>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import Canvas from './Canvas.vue'
    import { annotateImg, getWords } from '../api';

    const canvas = ref(null)
    let wordsToTest = ref([])
    let currentSerie = ref(-1)
    const series = ref([])
    const currentWordIndex = ref(0)

    const currentTest = computed(() => {
        if (currentSerie.value < 0 || currentSerie.value > series.value.length) return {}
        return wordsToTest.value[series.value[currentSerie.value][currentWordIndex.value]] || {}
    })

    function clearCanvas () {
        canvas.value.clear()
    }

    async function recognize () {
        const guess = await annotateImg(canvas.value.$el.toDataURL())
        if (guess == currentTest.value.simp) {
            alert('wow impressionnant')
            currentWordIndex.value += currentWordIndex.value < 10 ? 1 : 0
        }
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

    function startSerie () {

        currentSerie.value += 1
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
    })
</script>
