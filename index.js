require('dotenv').config()

const OBA = require('oba-api');

// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: process.env.PUBLIC,
  secret: process.env.SECRET
});

const maxData = 100;
const publicationYear = 2000;
var query = 'oorlog'
var genresStore = [];
var save = [];
var z = 1;



function getTotalBooks() {
  return client.get('search', {
    q: query,
    sort: 'title',
    librarian: 'true',
    refine: 'true',
    facet: `pubYear(${publicationYear})`,
  })
  .then(res => {
    console.log(JSON.parse(res).aquabrowser.meta)
    return Math.ceil(JSON.parse(res).aquabrowser.meta.count / 20);
  })
  .catch(error => console.log(error))
}

function getData(i) {
  return new Promise((resolve, reject) => {
    client.get('search', {
      q: query,
      sort: 'title',
      librarian: 'true',
      refine: 'true',
      facet: `pubYear(${publicationYear})`,
      page: i
    })
      .then(res => {
        var correctRes = JSON.parse(res).aquabrowser.results.result;
        const error = false;

        correctRes.forEach((book, ind, page) => {
          if (book.genres) {
            if (book.genres.genre.length > 1) {
              book.genres.genre.forEach(g => {
                if (!genresStore.includes(g.$t)) {
                  genresStore.push(g.$t);
                  save.push({
                    genre: g.$t,
                    amt: 1
                  })
                } else {
                  save.forEach((obj, index, arr) => {
                    if (g.$t == obj.genre) {
                      obj.amt++
                    }
                  })
                }
              })
            } else {
              if (!genresStore.includes(book.genres.genre.$t)) {
                genresStore.push(book.genres.genre.$t);
                save.push({
                  genre: book.genres.genre.$t,
                  amt: 1
                })
              } else {
                save.forEach((obj, index, arr) => {
                  if (book.genres.genre.$t == obj.genre) {
                    obj.amt++
                  }
                })
              }
            }
          }

        if (ind == page.length - 1) {
            if (!error) {
              resolve()
            } else {
              reject('error 2')
            }
          }
        })

        // ==============================

          // var structuredData = () => correctRes.map(x => {
          //
          //   return {
          //     title: (x.titles) ? (x.titles.title) ? (x.titles.title.length > 1) ? x.titles.title.shift().$t : x.titles.title.$t : undefined : undefined,
          //     format: (x.formats) ? (x.formats.format) ? (x.formats.format.length > 1) ? x.formats.format.pop().$t : x.formats.format.$t : undefined : undefined,
          //     author: (x.authors) ? (x.authors['main-author']) ? x.authors['main-author'].$t : undefined : undefined,
          //     publication: (x.publication) ? (x.publication.year) ? x.publication.year.$t : undefined : undefined,
          //     physicalInfo: (x.description) ? (x.description['physical-description']) ? x.description['physical-description'].$t : undefined : undefined,
          //     language: (x.languages) ? (x.languages.language) ? x.languages.language.$t : undefined : undefined,
          //     genre: (x.genres) ? (x.genres.genre.length > 1) ? x.genres.genre.map(g => g.$t) : x.genres.genre.$t : undefined,
          //     subject: (x.subjects) ? (x.subjects['topical-subject']) ? (x.subjects['topical-subject'].length > 1) ? x.subjects['topical-subject'].map(s => s.$t) : x.subjects['topical-subject'].$t : undefined : undefined,
          //     publisher: {
          //       name: (x.publication) ? (x.publication.publishers) ? x.publication.publishers.publisher.$t : undefined: undefined,
          //       place: (x.publication) ? (x.publication.publishers) ? x.publication.publishers.publisher.place : undefined : undefined
          //     }
          // }
          //
          //
          // })
          // if (!error) {
          //   resolve(structuredData())
          // } else {
          //   reject('error 2')
          // }
        })

      .catch(err => {
        z = temp.length / 20;
        updatePage()
      })
  })
}

async function updatePage() {
  var totalData = await getTotalBooks();
  var totalAmt;
  for (z; z <= totalData; z++) {
    console.log(totalAmt, save)

    // Set a max and stop the loop when reached
    if (totalAmt > maxData) {
      break;
    }
    await getData(z)
      // .then(res => {
        // console.log(res)
        // console.log(save)
        // res.forEach(x => {
          // save.push(x)
          // if (x.genre) {
        //   console.log(`
        //     Title: ${x.title}
        //     Format: ${x.format}
        //     Author: ${x.author}
        //     Publication: ${x.publication}
        //     Physical information: ${x.physicalInfo}
        //     Language: ${x.language}
        //     Genre(s): ${x.genre}
        //     Subject(s): ${x.subject}
        //     Publisher name: ${x.publisher.name} | Publisher place: ${x.publisher.place}
        //     `)
        // }
      // })
      // console.log(save.length)
    // })
      // .catch(error => console.log(error))

    totalAmt = save.map(x => {
      return x.amt
    }).reduce((a, b) => {
      return a + b
    })
    // console.log(totalAmt, save)
    // if (totalAmt == 100) {
    //   break;
    // }
  }
  // Get the total amt of genres


}


updatePage()
