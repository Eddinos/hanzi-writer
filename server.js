/* Data from https://github.com/glxxyz/hskhsk.com/tree/main/data/lists
 * Replace spacing between words with split markers, then perform */

const axios = require('axios').default
const fs = require('fs')

function dataWord (pties) {
    return {
        simp: pties[0],
        trad: pties[1],
        pinToneNb: pties[2],
        pinToneAccent: pties[3],
        eng: pties[4],
    }
}

function formatHSKData (str) {
    const data = str.split('\r\n')
        .map(w => {
            pties = w.split('\t')
            return new dataWord(pties)
        })

    return {
        data
    }
}

async function main () {
    const hsklvl = process.argv.splice(2)[0]
    const res = await axios.get(`https://raw.githubusercontent.com/glxxyz/hskhsk.com/main/data/lists/HSK%20Official%20With%20Definitions%202012%20L${hsklvl}.txt`)
    // console.log(formatHSKData(res.data))
    fs.writeFile('public/hsk'+hsklvl+'.json', JSON.stringify(formatHSKData(res.data)), console.error)
}

main()
