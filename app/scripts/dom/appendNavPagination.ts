export const LIMIT_OF_ITEMS_PER_PAGE = 500000;

const appendPages = (
  numberOfPages: number,
  loadPage: (page: number) => void,
  pagination: { currentPage: number },
  ul: HTMLUListElement
) => {
  for (let i = 1; i <= numberOfPages; i++) {
    const page = document.createElement("li");
    page.innerHTML = `<button id=page-${i} class="page-btn ${
      i === pagination.currentPage ? "active" : ""
    }">${i}</button>`;

    page.addEventListener("click", () => {
      document.querySelector(".page-btn.active")?.classList.remove("active");
      document.getElementById(`page-${i}`)?.classList.add("active");

      const nextPage = document.getElementById("nextPage") as HTMLButtonElement;
      const prevPage = document.getElementById("prevPage") as HTMLButtonElement;
      nextPage.disabled = i === numberOfPages;
      prevPage.disabled = i === 1;

      pagination.currentPage = i;
      loadPage(i);
    });

    ul.appendChild(page);
  }
};

const appendPrevPage = (
  loadPage: (page: number) => void,
  pagination: { currentPage: number },
  ul: HTMLUListElement
) => {
  const prevPage = document.createElement("li");
  prevPage.innerHTML = `<button id="prevPage" class="page-btn" ${
    pagination.currentPage > 1 ? "" : "disabled"
  }>Previous</button>`;

  prevPage.addEventListener("click", () => {
    if (pagination.currentPage > 1) {
      document
        .getElementById(`page-${pagination.currentPage}`)
        ?.classList.remove("active");
      document
        .getElementById(`page-${pagination.currentPage - 1}`)
        ?.classList.add("active");
      pagination.currentPage -= 1;
      loadPage(pagination.currentPage);

      const nextPage = document.getElementById("nextPage") as HTMLButtonElement;
      nextPage.disabled = false;
    } else {
      const prev = document.getElementById("prevPage") as HTMLButtonElement;
      prev.disabled = true;
    }
  });
  ul.appendChild(prevPage);
};

const appendNextPage = (
  numberOfPages: number,
  loadPage: (page: number) => void,
  pagination: { currentPage: number },
  ul: HTMLUListElement
) => {
  const nextPage = document.createElement("li");
  nextPage.innerHTML = `<button id="nextPage" class="page-btn" ${
    pagination.currentPage >= numberOfPages ? "disabled" : ""
  }>Next</button>`;

  nextPage.addEventListener("click", () => {
    if (pagination.currentPage < numberOfPages) {
      document
        .getElementById(`page-${pagination.currentPage}`)
        ?.classList.remove("active");
      document
        .getElementById(`page-${pagination.currentPage + 1}`)
        ?.classList.add("active");

      pagination.currentPage += 1;
      loadPage(pagination.currentPage);

      const prevPage = document.getElementById("prevPage") as HTMLButtonElement;
      prevPage.disabled = false;
    } else {
      const next = document.getElementById("nextPage") as HTMLButtonElement;
      next.disabled = true;
    }
  });
  ul.appendChild(nextPage);
};

export const appendNavPagination = (
  lengthOfFile: number,
  pagination: { currentPage: number },
  loadPage: (page: number) => void
) => {
  if (lengthOfFile <= LIMIT_OF_ITEMS_PER_PAGE) return;

  const ul = document.createElement("ul");
  ul.className = "pagination";

  const totalPages = Math.ceil(lengthOfFile / LIMIT_OF_ITEMS_PER_PAGE);

  appendPrevPage(loadPage, pagination, ul);
  appendPages(totalPages, loadPage, pagination, ul);
  appendNextPage(totalPages, loadPage, pagination, ul);

  const mainContainer = document.querySelector(".main-container")!;
  mainContainer.append(ul);
};
