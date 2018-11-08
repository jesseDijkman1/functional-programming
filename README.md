# functional-programming

## Introduction ✌️
For this project we're fetching data from the oba (public library of Amsterdam) api and creating a research case. With the data we're going to make visualizations with d3.js (which I have never used before). Main point of the project is this README. This README contains the research questions, sub-questions, hypotheses and overall process.

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
To come up with research questions we had to research the data we we're served. The data comes to us in JSON, but is originally XML. Thanks to rijkvanzanten's package we can connnect to the api and get JSON. From there we had to see what data we got.
But seeing what we got was trickier than I thought, because there are a lot of keys, nested objects and arrays. Getting the data I had to get into aquabrowser, then in results and then in result (aquabrowser.results.result).
This would give and array of objects, each object is a book, movie or something else. And not all the objects had the same data; a lot was missing.
Looking for something that is not there gives errors, so I had to check everything.

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
**It then became this**

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

Now that I had collected most of the data. It was time to write down research questions.

---

### Research Questions 🔍
- Is there a connection between the publication-date and the thickness of books? (Were thicker books more popular?
- Is there a connection between the size of a book and the publication-date? (Were bigger books more popular?
- Does the publication-date have a connection with the length of the titles? (Were titles back in the day longer?
- Were there trends in subjects/genres per year?
- 👉 **How long are books borrowed on average per year?**
- Did books get more popular or not, (or) did movies get more populair to borrow??
- 👉 **Are certain genres returned too late more often than others?**
- 👉 **Which genres have have emerged since 1950?**

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

I know, I know it's not a big interval. But that's because the api isn't very reliable.

---

### Sub-Question 👶
- What has the publication year have to do with the most popular genre?

---

### Hypotheses 🤓
- The publication year has nothing to do with the most popular genres.
- Our interests have shifted over the years.

---

### What data do I need?
With my focus on the genres and publications years I needed to specify the gathering of data. Because now I get too much.

So I removed some code and added the following one for getting genres:

```js
  if (book.genres) {
     // Do something with this book
  }
```

This line excludes all the data without a genre object.

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

With my research question I went into the sketching fase. How am I going to show what I want. Well I had a few ideas.

[img]

Although I couldn't realise my sketches, I did found a   suitable and ready one on Observable (link).

[img]

---

### D3.js Testing

Althouhg I wanted to make my first choice, I didn't have a way to loop through different years. So I started with a simple pie chart. Which is actually a donut chart but without an inner-radius.

![Pie chart](https://i.imgur.com/iyoFIV7.png)

Because I don't have any experience with d3 I just started to replace some things and experiment. First thing I did was replace the data.

[img]

Then alter the code so it would look for the new data.

[img]

... and I removed the donut gap.

[img]

Because this was really easy I wanted to realise my first choice for the visualization. But because this visualization uses and external package it was kinda hard to understand. I just looked at how the data was structured. I then added data relevant to my case. But wasn't the data I would get from the api.

I first tried to make the data work in the visualization. I tried to get the date (year) with Object.keys but this wouldn't work because you need to have the date in each object. The data needed to be served as a single array with objects.

The data had to be structured in the following way:

```js
[ { genre: '...', amt: 1, date: '1900' },
  { genre: '...', amt: 2, date: '1901' },
  { genre: '...', amt: 3, date: '1902' },
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

And now I wanted to get random colors for the genres. I also added a function for this:

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
With the visualization working I knew how I needed to structure my data. So I updated my code (which is the current code in index.js) and I got this in my terminal.

[screenshot of data in terminal]

So I copied this code and inserted it into my data variable on Observable. And ended up with the following visualization:

[screenshot of final visualization]

---

### Findings and conclusion

[img]

With this visualization comes a top three for each year:

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

Looking at this top three, I almost no changes, except for nr 3 in 2000 being 'Thriller' and in 2001 and 2002 'Protestants milieu'.

Something else I noticed from the graph is that 2001, and 2002 have science-fiction and 2000 has not. I don't know if there's a reason for this, because I can't get all the data (because of the api). But the amount of science-fiction books I found in 2002 is bigger than in 2001 and 2000 (in which none were found).

Looking back at my research question: **How has the popularity changed of certain genres between the year 2000 and 2002?**

I can say that from this visualization, science-fiction has become more popular. But in the long run I can't tell.

The same goes for my subquestion and hypotheses

The data can't give a good answer but from what I can tell from what I have is that it might have become more popular to give a twist to 'oorlogs verhalen' (stories about war).

---

## Source(s)
- https://github.com/rijkvanzanten/node-oba-api
- https://beta.observablehq.com/@jessedijkman1/exploring-data-with-vega-lite
- https://zoeken.oba.nl/api/v1/
