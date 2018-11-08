# functional-programming

## Introduction ✌️
For this project we're fetching data from the oba (public library of Amsterdam) api and creating a research case. With the data we're going to make visualizations with d3.js (which I have never used before). Main point of the project is this README. This README contains the research questions, sub-questions, hypotheses and code (screenshots).

## Table of Contents 🗄
- [To-do](#to-do)
- [Installation Guide](#installation-guide)
- [Process](#process)
  - [Research Questions](#research-questions)
  - [Picked Questions](#picked-questions)
  - [Sub-Questions](#sub-questions)
  - [Hypotheses](#hypotheses)
  - [Researching the data](#researching-the-data)
- [Sources](#sources)

## To-do 📋
- [ ] Write down the research questions and pick the best ones 🤓
- [ ] Write down the sub-questions 🤓
- [ ] Write down the hypotheses 🤓
- [ ] Fetch all the data I'm going to need 👐
- [ ] Implement d3.js to make visual representations 📊
- [ ] Finish this readme 👀

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

## Process 📝

### Research Questions 🔍
- Is there a connection between the publication-date and the thickness of books? (Were thicker books more popular?
- Is there a connection between the size of a book and the publication-date? (Were bigger books more popular?
- Does the publication-date have a connection with the length of the titles? (Were titles back in the day longer?
- Were there trends in subjects/genres per year?
- 👉**How long are books borrowed on average per year?**
- Did books get more popular or not, (or) did movies get more populair to borrow??
- 👉**Are certain genres returned too late more often than others?**
- 👉**Which genres have have emerged since 1950?**

#### Picked Questions 📍
- How long are books borrowed on average per year?
  - **v.2** How long are books from certain genres borrowed per year on average?
- Are certain genres returned too late more often than others?
- 👉Which genres have have emerged since 1950?
  - **v.2** How has the popularity changed of certain genres since 1950?
  - **v.3** Which genres are there from the year 2000?

Which version I'm going to pick from the question: "Which genres have emerged since 1950?", depends on the data I have at the end. Now I can get v.3 done, but v.2 might be possible when I loop through different years.

### Sub-Question(s) 👶
- What has the publication year have to do with the most popular genre?


### Hypotheses 🤓
- The publication year has nothing to do with the most popular genres.
- Our interests have shifted over the years.

### Researching the data
To come up with research questions we had to research the data we we're served. The data comes to us in JSON, but is originally XML. Thanks to rijkvanzanten's package we can talk to the api and get JSON. From there we had to see what data we got.
Analyzing the data I saw that a lot was missing, and trying to look certain things that aren't there gives errors. To prevent such errors I wrote some code that checks if there is a key, and check if it's an array. With this code I was able to push it into my own array in the format I wanted. The only problem is that I didn't need all that data.

[screenshot]

The next step was to get multiple pages. Trying to get multiple pages I ran into "asynchronous problems". Where I tried to loop through the pages with a forEach loop. Getting different pages with data would work but they wouldn't be returned in the same order.

[screenshot]

With the previous step taken I had to make it so I would get the data in the same order each time. That's where async and await comes in. With async and await I forced my code to wait until all the data from a page is fetched and then go to the next page.

[screenshot]

Now that I was able to get data in the same order each time. I wanted to get ALL the data, which differs per search-query. First I needed to know how many results I could get. This information can be found in the meta from aquabrowser (JSON.parse(res).aquabrowser.meta.count).

[screenshot]

Now that I knew how much data there is, I can loop through the pages, right? NOPE. Looping through the pages worked but the api threw an error randomly, because they don't support that many requests. So I wrote some code that would restart the loop by looking at where it crashed. Finding the spot was easy, just getting the length from my array with data and dividing it by 20 would give me the page where I was. Then I just restarted the code but now with a different starting value for the loop.

[screenshot]

Now it works. But it's not fast. Now my goal was to get data from different years. But this proved to be trickier than expected. I couldn't wrap my head around it, plus I was running into errors all day long and just lost my focus. That's why I changed my research question to something simpler.

**Question before:** _How has the popularity changed of certain genres since 1950?_
**Question after:** _Which genres are there from the year 2000?_

Focusing on just one year made it really easy. The big problem is that I needed to search for something, so I just searched for the letter 'a'. This would give me around 9000 books, so I knew that I needed a max amount.

[screenshot]???

Now that I was getting more specific. I realised that I need to specify my data to try and answer my research question. So I just commented-out most of the code, and just started to gather the genres. And from there I wroted code that would count how many times a certain genre would come up. This data is pushed to the array, and would stop pushing to the array when I had a totalAmt of at least 100.

With this data I tried to make a first visualization on Observable (link). Most of the code was already there so I just needed to replace the data. And it worked. But that was too easy, because that would mean I was almost done. So now I wanted to (re)try and get data from different years.


## Code 🤓🤓🤓


## Source(s)
- https://github.com/rijkvanzanten/node-oba-api
