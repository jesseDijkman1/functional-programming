require('dotenv').config()

const OBA = require('oba-api');

// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: process.env.PUBLIC,
  secret: process.env.SECRET
});


// General usage:
// client.get({ENDPOINT}, {PARAMS});
// ENDPOINT = search | details | refine | schema | availability | holdings
// PARAMS = API url parameter options (see api docs for more info)

// Client returns a promise which resolves the APIs output in JSON
const data = [];
const dataAmount = Math.round(100 / 20);
var pages = [];

for (let i = 1; i <= dataAmount; i++) {
  pages.push(i);
}

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
        title: (x.titles) ? (x.titles.title) ? (x.titles.title.length > 1) ? x.titles.title.shift().$t : x.titles.title.$t : undefined : undefined,
        author: (x.authors) ? (x.authors['main-author']) ? x.authors['main-author'].$t : undefined : undefined,
        publication: (x.publication) ? (x.publication.year) ? x.publication.year.$t : undefined : undefined,
        physicalInfo: (x.description) ? (x.description['physical-description']) ? x.description['physical-description'].$t : undefined : undefined,
        language: (x.languages) ? (x.languages.language) ? x.languages.language.$t : undefined : undefined
      })
    })
    if ((data.length / 20) == pages.length) {
      structureData()
    }
  })
  .catch(err => console.log('error', err)) // Something went wrong in the request to the API
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
