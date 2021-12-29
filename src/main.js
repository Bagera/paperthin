const tagMap = {};
const icons = {
  tag: `<svg class="icon icon-tag" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path
            d="M15.09,7.12,8.88.91a1.6,1.6,0,0,0-1-.41h-6A1.41,1.41,0,0,0,.5,1.91v6a1.6,1.6,0,0,0,.41,1l6.21,6.21a1.41,1.41,0,0,0,2,0l6-6A1.41,1.41,0,0,0,15.09,7.12ZM4,5.42A1.41,1.41,0,1,1,5.42,4,1.41,1.41,0,0,1,4,5.42Z" />
        </svg>`,
  search: `<svg class="icon icon-search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path
              d="M15.4,14.73l-.67.67a.36.36,0,0,1-.49,0l-3.56-3.56a.37.37,0,0,1-.1-.25V11.2a6.11,6.11,0,1,1,.62-.62h.39a.33.33,0,0,1,.25.1l3.56,3.56A.36.36,0,0,1,15.4,14.73ZM11.28,6.59a4.69,4.69,0,1,0-4.69,4.69A4.68,4.68,0,0,0,11.28,6.59Z" />
          </svg>`,
};
const SHOWALL = "showAllTags";

function filterPassages(term) {
  const passages = document.querySelectorAll(".passage");
  const tags = document.querySelectorAll(".tagFilter-button");

  if (term === SHOWALL) {
    tags.forEach((tag) => {
      tag.removeAttribute("selected");
      tag.removeAttribute("inactive");
    });
  } else {
    tags.forEach((tag) => {
      if (tag.dataset["tag"] === term) {
        tag.setAttribute("selected", true);
        tag.removeAttribute("inactive");
      } else {
        tag.setAttribute("inactive", true);
        tag.removeAttribute("selected");
      }
    });
  }

  passages.forEach((passage) => {
    const passageTags = passage.getAttribute("tags")
      ? passage.getAttribute("tags").split(" ")
      : [];
    if (term === "showAllTags" || passageTags.includes(term)) {
      passage.removeAttribute("tag-hidden");
    } else {
      passage.setAttribute("tag-hidden", true);
    }
  });
}

function handleFilterClick(e) {
  let button = e.target;
  let term = SHOWALL;
  if (!button.classList.contains("tagFilter-button")) {
    button = button.closest(".tagFilter-button");
  }
  if (!button.getAttribute("selected")) {
    term = button.dataset.tag;
  }
  filterPassages(term);
}

function createTagFilter() {
  const tags = document.querySelectorAll("tw-tag");
  const tagList = document.querySelector(".tagFilter-list");

  tags.forEach((tag) => {
    const tagName = tag.getAttribute("name");
    const tagItem = document.createElement("li");

    tagMap[tagName] = tag.getAttribute("color");
    tagItem.textContent = tagMap[tagName];
    tagItem.innerHTML = `<button class="tagFilter-button" data-tag="${tagName}">${icons.tag}${tagName}</button>`;
    tagItem.classList.add("tagFilter-tag", "tagFilter-tag_" + tagMap[tagName]);
    tagList.append(tagItem);
  });
  tagList.addEventListener("click", handleFilterClick);
}

function renderPassages() {
  const passageData = document.querySelectorAll("tw-passagedata");
  const passageList = document.querySelector(".passages");

  passageData.forEach((passage) => {
    console.log(passage);
    const passageTags = passage.getAttribute("tags")
      ? passage.getAttribute("tags").split(" ")
      : [];
    const listItem = document.createElement("li");
    listItem.classList.add("passage");
    listItem.setAttribute("tags", passage.getAttribute("tags"));

    listItem.innerHTML = `
    <h2 class="passage-title">Passage: ${passage.getAttribute("name")}</h2>
    <aside class="passage-meta">
      <p>Id: ${passage.getAttribute("pid")}, Position: ${passage.getAttribute("position")}, Size: ${passage.getAttribute("size")}, Tags: ${passageTags
        .map((tag) => `<span class="tag tag-${tagMap[tag]}">${icons.tag}${tag}</span>`)
        .join(", ")}</p>
    </aside>
    <section class="passage-content">${marked.parse(
      passage.textContent
    )}</section>
    `;
    passageList.append(listItem);
  });
}

function filterByText(e) {
  const passages = document.querySelectorAll(".passage");
  passages.forEach((passage) => {
    if (passage.innerHTML.toLowerCase().includes(e.target.value.toLowerCase())) {
      passage.removeAttribute("text-hidden");
    } else {
      passage.setAttribute("text-hidden", true);
    }
  });
  console.log(e.target.value);
}

function bindTextFilter() {
  const input = document.querySelector(".textFilter-input");
  input.addEventListener("input", filterByText)

}

window.onload = function () {
  createTagFilter();
  renderPassages();
  bindTextFilter();
};
