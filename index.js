require('dotenv').config()

const OBA = require('oba-api');

// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: process.env.PUBLIC,
  secret: process.env.SECRET
});


const data = [];
// Get the amount of pages by dividing the amount of date you want by 20
var dataAmount = Math.round(100 / 20);
// Array for the indexes of the data pages
const pages = [];

for (let i = 1; i <= dataAmount; i++) {
  pages.push(i);
}

// For each loop to go through the different pages (var i);
pages.forEach((i) => {
client.get('search', {
  q: 'rijk',
  sort: 'title',
  page: i
})
  .then(res => {
    var correctRes = JSON.parse(res).aquabrowser.results.result;

    correctRes.forEach(x => {
      data.push({
        // Check if there is a titles key, then check if titles has a title key, then check if there are more; if so remove the first and select $t (title). If one of the first conditions fails return undefined.
        title: (x.titles) ? (x.titles.title) ? (x.titles.title.length > 1) ? x.titles.title.shift().$t : x.titles.title.$t : undefined : undefined,
        author: (x.authors) ? (x.authors['main-author']) ? x.authors['main-author'].$t : undefined : undefined,
        publication: (x.publication) ? (x.publication.year) ? x.publication.year.$t : undefined : undefined,
        physicalInfo: (x.description) ? (x.description['physical-description']) ? x.description['physical-description'].$t : undefined : undefined,
        language: (x.languages) ? (x.languages.language) ? x.languages.language.$t : undefined : undefined
      })
    })
    // Check if data divided by 20 is equal to the amount of pages. If so call structureData()
    if ((data.length / 20) == pages.length) {
      structureData()
    }
  })
  .catch(err => console.log('error', err))
})

function structureData() {
  data.forEach(x => {
    console.log(`
      ${x.title}
      ${x.author}
      ${x.publication}
      ${x.physicalInfo}
      ${x.language}
      `)
  })
}
