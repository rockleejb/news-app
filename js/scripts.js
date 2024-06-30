const apiKey = process.env.NEWS_API_KEY;
const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`

async function fetchNews() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        displayNews(data.articles);
    } catch (error) {
        console.error(error);
    }
}

fetchNews();

function displayNews(articles) {
    const newsDiv = document.querySelector("#news");
    const maxRowLength = 3;
    let i = 0;
    // next lines ensure each row has 3 articles
    const lastRowLength = articles.length % 3;
    while (i < articles.length - lastRowLength) {
        if (i % maxRowLength === 0) {
            // create breaks then new row
            const br = document.createElement("br");
            newsDiv.appendChild(br);
            newsDiv.appendChild(br);
            const row = document.createElement("div");
            row.classList.add("row");
            const col = document.createElement("div");
            col.classList.add("col");
            const articleCard = checkNullNode(createArticle(articles[i]));
            if (!articleCard) continue;
            col.appendChild(articleCard);
            row.appendChild(col);
            newsDiv.appendChild(row);
        } else {
            const row = newsDiv.lastElementChild;
            const col = document.createElement("div");
            col.classList.add("col-sm-4");
            const articleCard = checkNullNode(createArticle(articles[i]));
            if (!articleCard) continue;
            col.appendChild(articleCard);
            row.appendChild(col);
        }
        i++;
    }
}

function checkNullNode(card) {
    if (!card.firstChild) return null;
    for (let node of card.childNodes) {
        if (node === null) {
            return null;
        }
    }
    return card;
}

function createArticle(article) {
    const articleCard = document.createElement("div");
    articleCard.classList.add("card");
    articleCard.style.width = "18rem";
    const cardImg = document.createElement("img");
    cardImg.classList.add("card-img-top");
    if (article.urlToImage === null) return;
    cardImg.src = article.urlToImage;
    cardImg.alt = "Card image cap";
    cardImg.style.width = "18rem";
    cardImg.style.height = "12rem";
    articleCard.appendChild(cardImg);
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const title = document.createElement("h5");

    title.classList.add("card-title");
    const maxTitleLength = 40;
    title.innerText = truncatePastMaxLength(article.title, maxTitleLength);
    const link = createLinkedArticleIfUrlAvailable(article);
    if (link !== null) {
        link.appendChild(title);
        cardBody.appendChild(link);
    } else {
        cardBody.appendChild(title);
    }
    const description = document.createElement("p");
    description.classList.add("card-text");
    const maxDescriptionLength = 80;
    description.textContent = truncatePastMaxLength(article.description, maxDescriptionLength);
    cardBody.appendChild(description);
    articleCard.appendChild(cardBody);
    return articleCard;
}

function createLinkedArticleIfUrlAvailable(article) {
    if (article.url != null) {
        const link = document.createElement("a");
        link.href = article.url;
        link.target = "_blank";
        return link;
    }
    return null;
}

function truncatePastMaxLength(text, maxLength) {
    if (text === null) return null;
    if (text.length > maxLength) {
        text = text.substring(0, maxLength).concat("...");
    }
    return text;
}