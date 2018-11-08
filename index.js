require('dotenv').config()

const OBA = require('oba-api');

// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: process.env.PUBLIC,
  secret: process.env.SECRET
});

const maxData = 50;
let publicationYear = 2000;
let yearRange = 2002;
var save = [];

var query = 'oorlog'

var rememberPage = 0;

function getTotalBooks() {
  return client.get('search', {
    q: query,
    sort: 'title',
    librarian: 'true',
    refine: 'true',
    facet: `pubYear(${publicationYear})`
  })
  .then(res => {
    return Math.ceil(JSON.parse(res).aquabrowser.meta.count / 20);
  })
  .catch(error => console.log(error, 'oi'))
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
        // Temp is just to keep the different years separated
        var temp = [];
        correctRes.forEach((book, ind, page) => {
          if (book.genres) {
            if (Array.isArray(book.genres.genre)) {
              // Now loop through the genres of book
              book.genres.genre.forEach(genreInArray => {
                let search = temp.find(obj => obj.genre === genreInArray.$t);
                if (!search) {
                  // Not found? Push to temp
                  temp.push({
                    genre: genreInArray.$t,
                    amt: 1,
                    date: `${publicationYear}`
                  })
                } else {
                  // Found it? Add 1 to amt
                  search.amt++
                }
              })
            } else {
              // book.genres.genre is a single genre
              let search = temp.find(obj => obj.genre === book.genres.genre.$t);
              if (!search) {
                temp.push({
                  genre: book.genres.genre.$t,
                  amt: 1,
                  date: `${publicationYear}`
                })
              } else {
                search.amt++
              }
            }
          }
        })
        if (!error) {
          // Send temp back for concat with save
          resolve(temp)
        } else {
          reject('Error in correctRes.forEach')
        }
      })
      .catch(err => {
        console.log(err)

      })

  })
}

async function updatePage() {
  // console.log(publicationYear)
  var totalData = await getTotalBooks();
  let temp = [];
  let totalAmt;
  for (let z = 1; z <= totalData; z++) {
    if (temp.length) {
      totalAmt = temp.map(t => t.amt).reduce((a, c) => a + c);
    }
    var con = await getData(z).then(res => {
      // Add res to final data save (save)
      if (!temp.length) {
        temp = temp.concat(res);
      } else if (totalAmt <= maxData) {

        // console.log(totalAmt)

        res.forEach(r => {
          let search = temp.find(t => t.genre === r.genre);
          if (!search) {
            temp.push(r)
          } else {
            search.amt += r.amt;
          }
        })
      } else {
        save = save.concat(temp);
        return true

      }
      }).catch(err => console.log(err))
      if (con) {

        if (publicationYear < yearRange) {
          publicationYear++

          updatePage()
          break;
        } else {
          console.log(save)
          break;
        }
      }
  }
}

updatePage()
