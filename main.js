const tagMap = {};

function filterPassages(term) {
  const passages = document.querySelectorAll("tw-passagedata");

  passages.forEach((passage) => {
    const passageTags = passage.getAttribute("tags") ? passage.getAttribute("tags").split(" ") : [];
    if(term === "showAllTags" || passageTags.includes(term)) {
      passage.removeAttribute("hidden")
    }
    else {
      passage.setAttribute("hidden", true)
    }
  });
}

function createTagFilter() {
  const tags = document.querySelectorAll("tw-tag");
  const tagList = document.querySelector(".tagFilter-list");

  tags.forEach((tag) => {
    const tagName = tag.getAttribute("name")
    const tagItem = document.createElement("li");

    tagMap[tagName] = tag.getAttribute("color");
    tagItem.textContent = tagMap[tagName];
    tagItem.innerHTML = `<button class="tagFilter-button" data-tag="${tagName}">${tagName}</button>`;
    tagItem.classList.add("tagFilter-tag", "tagFilter-tag_" + tagMap[tagName]);
    tagList.append(tagItem);
  });
  tagList.addEventListener("click", (e) => {
    console.log(e.target);
    filterPassages(e.target.dataset.tag)
  })
}

function renderPassages() {
  const passageData = document.querySelectorAll("tw-passagedata");

  passageData.forEach((passage) => {
    const listItem = document.createElement("li");
    listItem.classList.add("passage");
    const passageAside = document.createElement("aside");
    const passageTags = passage.getAttribute("tags") ? passage.getAttribute("tags").split(" ") : [];
    console.log(passageTags);

    passageAside.innerHTML = `
    <h2 class="passageAside-title">Passage: ${passage.getAttribute("name")}</h2>
    <ul class="passageAside-tags">
    ${passageTags.map(tag => `<li class="tag tag-${tagMap[tag]}">${tag}</li>`).join("")}
    </ul>
    `
    passage.innerHTML = marked.parse(passage.innerHTML);
    passage.prepend(passageAside);
  
  });
  
}

window.onload = function () {


  createTagFilter();
  

};