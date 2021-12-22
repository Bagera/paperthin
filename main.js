const tagMap = {};

function filterPassages(term) {
  const passages = document.querySelectorAll(".passage");

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
  const passageList = document.querySelector(".passages");

  passageData.forEach((passage) => {
    const passageTags = passage.getAttribute("tags") ? passage.getAttribute("tags").split(" ") : [];
    const listItem = document.createElement("li");
    listItem.classList.add("passage");
    listItem.setAttribute("tags", passage.getAttribute("tags"))
    
    listItem.innerHTML = `
    <h2 class="passage-title">Passage: ${passage.getAttribute("name")}</h2>
    <aside class="passage-meta">
      <dl>
        <dt>Id</dt>
        <dd>${passage.getAttribute("id")}</dd>
        <dt>Position</dt>
        <dd>${passage.getAttribute("position")}</dd>
        <dt>Size</dt>
        <dd>${passage.getAttribute("size")}</dd>
        <dt>Tags</dt>
        <dd>
          <ul class="passage-tags">
          ${passageTags.map(tag => `<li class="tag tag-${tagMap[tag]}">${tag}</li>`).join("")}
          </ul>
        </dd>
      </dl>
    </aside>
    <section class="passage-content">${marked.parse(passage.textContent)}</section>
    `
    passageList.append(listItem);
  
  });
  
}

window.onload = function () {


  createTagFilter();
  renderPassages();

};