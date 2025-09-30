export const LIMIT_OF_ITEMS_PER_PAGE = 500000;

export const appendNavPagination = (
  lengthOfFile: number,
  currentPage: number
) => {
  const mainContainer = document.querySelector(".main-container")!;
  console.log(mainContainer, "mainContainer");
  if (lengthOfFile < LIMIT_OF_ITEMS_PER_PAGE) return;
  const ul = document.createElement("ul");
  ul.className = "pagination";
  const totalPages = Math.ceil(lengthOfFile / LIMIT_OF_ITEMS_PER_PAGE);
  console.log(totalPages, "totalPages");
  const prevPage = document.createElement("li");
  prevPage.innerHTML = `<li><button class="page-btn" ${
    currentPage > 1 ? "" : "disabled"
  }>Previous</button></li>`;

  prevPage.addEventListener("click", () => {
    //logic here
  });

  ul.appendChild(prevPage);
  for (let i = 0; i < totalPages; i++) {
    const page = document.createElement("li");
    const pageNumber = i + 1;
    page.innerHTML = `<li><button class="page-btn ${
      pageNumber === currentPage ? "active" : ""
    }" >${pageNumber}</button></li>`;

    page.addEventListener("click", () => {
      console.log("other logic here");
    });

    ul.appendChild(page);
  }

  const nextPage = document.createElement("li");
  nextPage.innerHTML = `<li><button class="page-btn" ${
    currentPage > totalPages ? "disabled" : ""
  }>Next</button></li>`;

  nextPage.addEventListener("click", () => {
    //logic here
  });

  ul.appendChild(nextPage);
  mainContainer.append(ul);
};
