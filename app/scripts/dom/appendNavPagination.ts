export const LIMIT_OF_ITEMS_PER_PAGE = 500000;

export const appendNavPagination = (
  lengthOfFile: number,
  pagination: { currentPage: number },
  loadPage: (page: number) => void
) => {
  const mainContainer = document.querySelector(".main-container")!;
  if (lengthOfFile < LIMIT_OF_ITEMS_PER_PAGE) return;

  const oldPagination = mainContainer.querySelector(".pagination");
  if (oldPagination) oldPagination.remove();

  const ul = document.createElement("ul");
  ul.className = "pagination";
  const totalPages = Math.ceil(lengthOfFile / LIMIT_OF_ITEMS_PER_PAGE);

  const prevPage = document.createElement("li");
  prevPage.innerHTML = `<button class="page-btn" ${
    pagination.currentPage > 1 ? "" : "disabled"
  }>Previous</button>`;

  prevPage.addEventListener("click", () => {
    if (pagination.currentPage > 1) {
      pagination.currentPage -= 1;
      loadPage(pagination.currentPage);
      appendNavPagination(lengthOfFile, pagination, loadPage);
    }
  });
  ul.appendChild(prevPage);

  for (let i = 1; i <= totalPages; i++) {
    const page = document.createElement("li");
    page.innerHTML = `<button class="page-btn ${
      i === pagination.currentPage ? "active" : ""
    }">${i}</button>`;

    page.addEventListener("click", () => {
      pagination.currentPage = i;
      loadPage(i - 1);
      appendNavPagination(lengthOfFile, pagination, loadPage);
    });

    ul.appendChild(page);
  }

  const nextPage = document.createElement("li");
  nextPage.innerHTML = `<button class="page-btn" ${
    pagination.currentPage >= totalPages ? "disabled" : ""
  }>Next</button>`;

  nextPage.addEventListener("click", () => {
    if (pagination.currentPage < totalPages) {
      pagination.currentPage += 1;
      loadPage(pagination.currentPage);
      appendNavPagination(lengthOfFile, pagination, loadPage);
    }
  });
  ul.appendChild(nextPage);

  mainContainer.append(ul);
};
