let posts = [];
let filterButton;

function createElement(type, props = [], ...childs) {
    /**@type {HTMLElement} */
    const ele = document.createElement(type);
    for (let [key, val] of props) {
        ele.setAttribute(key, val);
    }
    childs && ele.append(...childs);
    return ele;
}

function createCard(title = "", url = "", score = "", content = "") {
    const postCard = createElement("article", [["class", "post-card"]]);
    const postTitle = createElement("h3", [["class", "post-title"]], title);
    const postContent = createElement(
        "div",
        [["class", "post-content"]],
        content
    );
    postContent.innerHTML = content;
    const postUrl = createElement(
        "a",
        [
            ["class", "post-url"],
            ["href", url],
        ],
        url
    );

    const postScore = createElement("div", [["class", "post-score"]], score);
    postCard.append(postTitle, postUrl, postContent, postScore);

    return postCard;
}

async function renderPosts() {
    try {
        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = "";
        for (let post of posts) {
            let { title, url, score, selftext_html } = post.data;
            var doc = new DOMParser().parseFromString(
                selftext_html ?? "",
                "text/html"
            );
            const content = doc.documentElement.textContent;
            const postCard = createCard(title, url, `Score: ${score}`, content);
            postsContainer.append(postCard);
        }
    } catch (error) {
        console.error("Error fetching Reddit data:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    filterButton = document.querySelector(".filter-button");
    const header = document.querySelector("header");
    const req = await fetch("https://www.reddit.com/r/reactjs.json");
    const res = await req.json();
    posts = res.data.children;
    posts?.sort((a, b) => {
        return b.data.score - a.data.score;
    });
    header.style.display = "flex";
    renderPosts();

    filterButton.addEventListener("click", () => {
        posts.reverse();
        renderPosts();
    });
});
