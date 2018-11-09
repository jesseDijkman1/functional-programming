# functional-programming

_**Student:** jesse Dijkman_

## Introduction ✌️
For this project we're fetching data from the oba (public library of Amsterdam) API and creating a research case. With the data from the API we're going to make visualizations using D3.js (which I have never used before). Main point of the project is this README. This README contains the research questions, sub-questions, hypotheses and overall process.

---

## Table of Contents 🗄
- [Installation Guide](#installation-guide)
- [Process](#process)
  - [The Data](#the-data)
  - [Research Questions](#research-questions)
  - [Picked Questions](#picked-questions)
  - [Final Research Question](#final-research-question)
  - [Sub-Question(s)](#sub-question)
  - [Hypotheses](#hypotheses)
  - [What data do I need?](#what-data-do-i-need?)
  - [Sketches](#sketches)
  - [D3.js Testing](#d3.js-testing)
  - [Returning the right Data](#returning-the-right-data)
  - [Findings and conclusion](#findings-and-conclusion)
- [The Code](#the-code)
- [Reflection](#reflection)
- [Sources](#sources)

---

## Installation Guide 📖
#### 1. Clone the repository 📥
```
https://github.com/jesseDijkman1/functional-programming.git
```
#### 2. Navigate to the repository 🚗
```
cd functional-programming
```
#### 3. Install the NPM packages 📥
```
npm install
```

---

## Process 📝

### The Data
To come up with research questions we had to research the data we were served. The data comes to us in JSON, but is originally XML. Thanks to rijkvanzanten's package we can make requests to the API and get data back in JSON. From there we had to see what data we got.
But seeing what we got was trickier than expected, because there are a lot of keys, nested objects and arrays. To get the data I first had to get into aquabrowser (top level object), then in results and then in result (aquabrowser.results.result).
This would give an array of objects, each object is a book, movie or something else. And not all the objects had the same data; a lot was missing.
And looking for something that is not there gives errors, so I had to check everything.

**First piece of code for checking availability**
```js
{
  title: (x.titles) ? (x.titles.title) ? (x.titles.title.length > 1) ? x.titles.title.shift().$t : x.titles.title.$t : undefined : undefined,
  author: (x.authors) ? (x.authors['main-author']) ? x.authors['main-author'].$t : undefined : undefined,
  publication: (x.publication) ? (x.publication.year) ? x.publication.year.$t : undefined : undefined,
  physicalInfo: (x.description) ? (x.description['physical-description']) ? x.description['physical-description'].$t : undefined : undefined,
  language: (x.languages) ? (x.languages.language) ? x.languages.language.$t : undefined : undefined
}
```

**It then became this** 👇

```js
{
  title: (x.titles) ? (x.titles.title) ? (x.titles.title.length > 1) ? x.titles.title.shift().$t : x.titles.title.$t : undefined : undefined,
  format: (x.formats) ? (x.formats.format) ? (x.formats.format.length > 1) ? x.formats.format.pop().$t : x.formats.format.$t : undefined : undefined,
  author: (x.authors) ? (x.authors['main-author']) ? x.authors['main-author'].$t : undefined : undefined,
  publication: (x.publication) ? (x.publication.year) ? x.publication.year.$t : undefined : undefined,
  physicalInfo: (x.description) ? (x.description['physical-description']) ? x.description['physical-description'].$t : undefined : undefined,
  language: (x.languages) ? (x.languages.language) ? x.languages.language.$t : undefined : undefined,
  genre: (x.genres) ? (x.genres.genre.length > 1) ? x.genres.genre.map(g => g.$t) : x.genres.genre.$t : undefined,
  subject: (x.subjects) ? (x.subjects['topical-subject']) ? (x.subjects['topical-subject'].length > 1) ? x.subjects['topical-subject'].map(s => s.$t) : x.subjects['topical-subject'].$t : undefined : undefined,
  publisher: {
    name: (x.publication) ? (x.publication.publishers) ? x.publication.publishers.publisher.$t : undefined: undefined,
    place: (x.publication) ? (x.publication.publishers) ? x.publication.publishers.publisher.place : undefined : undefined
}
```

Now that I collected most of the data; it was time to write down research questions.

---

### Research Questions 🔍
- Is there a connection between the publication-date and the thickness of books? (Were thicker books more popular?
- Is there a connection between the size of a book and the publication-date? (Were bigger books more popular?
- Does the publication-date have a connection with the length of the titles? (Were titles back in the day longer?
- Were there trends in subjects/genres per year?
- 👉 **How long are books borrowed on average per year?**
  (Maybe people are reading slower and not so often with the rise of technology, compared to the past?)
- Did books get more popular or not, (or) did movies get more populair to borrow?
- 👉 **Are certain genres returned too late more often than others?**
  (Maybe some books are very slow reads and maybe could be grouped per genre?)
- 👉 **Which genres have have emerged since 1950?**
  (Was it taboo to write about certain subjects in the past, maybe you can say a change in a visual way?)

---

### Picked Questions 📍
- How long are books borrowed on average per year?
  - **v.2** How long are books from certain genres borrowed per year on average?
- Are certain genres returned too late more often than others?
- 👉 Which genres have emerged since 1950?
  - **v.2** How has the popularity changed of certain genres since 1950?
  - **v.3** Which genres are there from the year 2000?

Which version I'm going to pick of the question: "Which genres have emerged since 1950?", depends on the data I eventually have. Now I can get v.3 done, but v.2 might be possible when I can get the data from different years.

---

### Final Research Question
- How has the popularity changed of certain genres between the year 2000 and 2002?

I know, I know, it's not a big interval. But that's because the API isn't very reliable.

---

### Sub-Question 
- What has the publication year have to do with the most popular genre?

---

### Hypotheses 
- The publication year has nothing to do with the most popular genres.
- Our interests have shifted over the years.

---

### What data do I need?
With my focus on the genres and publication years I needed to specify the gathering of data. Because now I get too much data.

So I removed some code and added the following one for filtering my results to get books that have a genres object.

```js
  if (book.genres) {
     // Do something with this book
  }
```

This line excludes all the data without a genre object, this meant that I would get less data and needed to search for more pages which a was already able to do (luckily).

And for getting books from a certain year I just had to add a facet to the query:

```js
client.get('search', {
// q: query,
// sort: 'title',
// librarian: 'true',
  refine: 'true', // Without refine true you can't use a facet
  facet: `pubYear(${publicationYear})`, // pubYear made it easy to search by year
})
```

---

### Sketches

With my research question done, I went into the sketching fase. How am I going to show what I want. Well I had a few ideas.

#### Sketch 1
![Idea 1: Data visualization genres](https://i.imgur.com/lVjTXV9.jpg?1)

_**Translation:** "The amount of times a genre pops up per year"_

This graph gives a nice visual presentation but is most suitable when you know more specific dates. And I only get the publication years.

---

#### Sketch 2
![Idea 2: Data visualization genres](https://i.imgur.com/jwkYxXv.jpg?1)

_**Translation:** "The biggest genres per year"_

This graph doesn't show amounts because it's not important in this case. This graph shows the biggest genres in a year and how they changed in size over the years. 

Although I couldn't realise my sketches, I did find a suitable and ready one on Observable [Observable](https://beta.observablehq.com/@mbostock/exploring-data-with-vega-lite). This graph looks like the second sketch, but this one shows the amounts aswell. 

[![Chart I want to use](https://i.imgur.com/cpW4vBB.png)](https://beta.observablehq.com/@mbostock/exploring-data-with-vega-lite)

---

### D3.js Testing

Although I wanted to make my first choice (Sketch 2), I didn't have a way to loop through different years (yet 😎). So I started with a simple pie chart just to get familiar. The pie chart is actually a donut chart but without an inner-radius (Not really important).

[![Pie chart](https://i.imgur.com/iyoFIV7.png)](https://beta.observablehq.com/d/2a0d9ba99673ba8e)

Because I don't have any experience with D3 I just started to replace some things and experiment a little. First thing I did was replace the data with my own.

[![Pie chart data](https://i.imgur.com/AdZbVDM.png)](https://beta.observablehq.com/d/2a0d9ba99673ba8e)

Then alter the code so it would look for the new data.

[![Pie chart code](https://i.imgur.com/je9hM4V.png)](https://beta.observablehq.com/d/2a0d9ba99673ba8e)

---

[![Pie chart code](https://i.imgur.com/aFnSS5u.png?1)](https://beta.observablehq.com/d/2a0d9ba99673ba8e)

Because this was really easy, I wanted to realise my first choice for the visualization. But because this visualization uses an "external" package it was kind of difficult to understand. I just looked at how the data was structured. I then added data relevant to my case. I first tried to pass in the dates by getting the Object.keys, but this wouldn't work. Then added a date property to all the objects in the array and it then showed something on the x-axis. 

This is probably because each piece of data must have all the properties for d3 to know where to put them.

The data had to be structured in the following way:

```js
[ { genre: 'something', amt: 1, date: '1900' },
  { genre: 'something', amt: 2, date: '1901' },
  { genre: 'something', amt: 3, date: '1902' },
  ...
]
```

And when I did this and replaced variables in the code, it worked. Now I wanted to get the genres in the legend.
I did this by adding the following function to the code:

```js
function allGenres() {
  let temp = [];
  data.forEach(d => (!temp.includes(d.genre)) ? temp.push(d.genre) : '')
  return temp;
}
```

And now I wanted to get random colors for the genres, because each genre needs to be distinguishable from the others. I also added a function for this:

```js
 function genColors(arr) {
  let temp = [];
  arr.forEach(() => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    temp.push(`rgb(${r}, ${g}, ${b})`)
  })
  return temp
}
```

---

### Returning the right Data
With the visualization working I knew how I needed to structure my data. I did this in the following way: 

```js 
if (book.genres) {
  if (Array.isArray(book.genres.genre)) {
    // Now loop through the genres of book
    book.genres.genre.forEach(genreInArray => {
      let search = temp.find(obj => obj.genre === genreInArray.$t); // Check if temp already has the genre
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
    // book.genres.genre is a single object
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
```

When I returned temp I would concat it with save just to avoid having to check the date.

The index.js would now log the following in my terminal:

![Data in terminal](https://i.imgur.com/yemhfin.png?1)

So I copied this code and inserted it into my data variable on [Observable](https://beta.observablehq.com/@jessedijkman1/exploring-data-with-vega-lite). And ended up with the following visualization:

[![Final visualization](https://i.imgur.com/r9Vp8Cu.png)](https://beta.observablehq.com/@jessedijkman1/exploring-data-with-vega-lite)

---

### Findings and conclusion
Now that the visualization was working (with the small amount of data I had), I looked at it to see if there was anything going on. Are there certain changes, transitions. 

[![Final visualization](https://i.imgur.com/r9Vp8Cu.png)](https://beta.observablehq.com/@jessedijkman1/exploring-data-with-vega-lite)

With the main goal of the visualization: 'showing the biggest genres in each year and how they change', I could write down a top three for each year.

#### 2000:
1. **'Oorlog en verzet'** (war and resistance)
2. **'Psychologisch verhaal'** (psychological story)
3. **'Thriller'**

#### 2001:
1. **'Oorlog en verzet'** (war and resistance)
2. **'Psychologisch verhaal'** (psychological story)
3. **'Protestants milieu'** (Protestant environment)

#### 2002:
1. **'Oorlog en verzet'** (war and resistance)
2. **'Psychologisch verhaal'** (psychological story)
3. **'Protestants milieu'** (Protestant environment)

Looking at this top three, I almost see no changes, except for nr 3 in 2000 being: 'Thriller', and in 2001 and 2002 being: 'Protestants milieu'.

Something else I noticed from the graph is that 2001, and 2002 have science-fiction and 2000 has not. I don't know if there's a reason for this, because I can't get all the data (because of the API). But the amount of science-fiction books I found in 2002 is bigger than in 2001 and 2000 (in which none were found). Seeing such changes over a small time period I think in a long time period it could show some interesting things.

Looking back at my research question: **How has the popularity changed of certain genres between the year 2000 and 2002?**
I can say that from this visualization, science-fiction has become more popular. But in the long run I can't tell.

The same goes for my subquestion and hypotheses

**Subquestion:**
- What has the publication year have to do with the most popular genre?
  - **Answer:** Can't be answered because this data is from searching 'war', and I dont' have enough data to jump to conclusions.

**Hypotheses:**
- The publication year has nothing to do with the most popular genres.
  - **Answer:** Although the data doesn't show much, I think that certain genres have become more accepted and more popular over the years. Human interests are always changing, so it would be logical that preferences in genres are changing aswell.

- Our interests have shifted over the years.
  - **Answer:** Insufficient data.

The data can't give a good answer but what I can tell from what I have is that it might have become more popular to give a twist to 'oorlogs verhalen' (stories about war).

---

## The Code

```js
require('dotenv').config()

const OBA = require('oba-api');

// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: process.env.PUBLIC,
  secret: process.env.SECRET
});
```
Code included with rijkvanzanten's [package](https://github.com/rijkvanzanten/node-oba-api)

```js
const maxData = 50;
let publicationYear = 2000;
let yearRange = 2002;
var save = [];

var query = 'oorlog'

var rememberPage = 0;
```
`const maxData` is the "max" amount of genres.amt I want. Just to speed up the data gathering. The only problem with this is that it's checked in the `updatePage()` function and can only check when temp is returned. This means that it won't stop at 50, but somewhere near it. Because not each page of data has the same amount of genres. 

`var save` Is the array where the usable data is stored. So all the data (`temp`) that is returned to the `updatePage()` function is concatenated with save to avoid conflicts surrounding the date.

`var rememberPage` Isn't being used in the final code, but it was used to restart the gathering of data everytime the API would throw me out. It stored the amount of pages by getting the res.length and dividing that by 20 (the pagesize). When I got thrown out I would restart `updatePage()` in the reject.

```js
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
```

`getTotalBooks()` Is the function executed after `updatePage()`. `getTotalBooks()` returns the `aquabrowser.meta.count` which contains the amount of data the query found. Dividing this by 20 gives me the amount of pages and using `Math.ceil()` rounds it up.

```js
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
```

Making a promise in `getData()` was my first real try at using promises. It makes it easier for returning the data when it's done. 
Now I can resolve `temp` and then do the next step(s). I set `error` to `false` just because it can't fail. When an error is giving it is catched; (`client.get` is also a promise, so I have a promise inside another promise)


Now the most fun and interesting part; `async` and `await` 😀

```js
async function updatePage() {
  var totalData = await getTotalBooks();
  let temp = []; // Another temp array for storing the genres until the maxData is reached
  let totalAmt;
  for (let z = 1; z <= totalData; z++) {
    if (temp.length) {
      totalAmt = temp.map(t => t.amt).reduce((a, c) => a + c);
    }
    ...
```
The main reason for using `async` and `await` is getting the data in the right order each time. Before using `async` and `await` I had a forEach loop that went through an array of pages. But I noticed that it wouldn't return the data in the same order each time and this was confusing. I looked it up and found some helpful information: 
- [JavaScript loops — how to handle async/await](https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795)

Using a `forEach()` might be more functional but in this case it's definitely better to use `for` loop or maybe `for in` loop (which I haven't used before). Combining `async` and `await` paused the iteration of the loop, because it first needed to `await` `getData()` (see next code block).

```js
    var con = await getData(z).then(res => {
      // Add res to final data save (save)
      if (!temp.length) {
        temp = temp.concat(res);
      } else if (totalAmt <= maxData) {

        res.forEach(r => {
          let search = temp.find(t => t.genre === r.genre);
          if (!search) {
            temp.push(r)
          } else {
            search.amt += r.amt;
          }
        })
      } else { // When totalAmt isn't smaller than maxData concat temp to save and return true
        save = save.concat(temp);
        return true
      }
      }).catch(err => console.log(err))
      if (con) {

        if (publicationYear < yearRange) {
          publicationYear++

          updatePage()
          break; // Stop the loop, I don't know if it's necessary because updatePage() is called first and probably 
        } else { // won't even get to the break
          console.log(save)
          break;
        }
      }
  }
}

updatePage()

```

## Reflection
Not trying to be a suck-up but I really liked this course. I learned more about promises, and async and await. This was also the first time I worked with an API. I also learned alot about higher-order-functions. Now I now better which one to choose; before this course I would always use forEach and now I tried to use as many as possible and be sematically correct.

## Sources
- https://github.com/rijkvanzanten/node-oba-api
- https://beta.observablehq.com/
- https://zoeken.oba.nl/api/v1/
- https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795

## Licence
MIT © [Jesse Dijkman](https://github.com/jesseDijkman1)
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
