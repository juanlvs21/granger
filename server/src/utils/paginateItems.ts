const paginateItems = (items: any, perPage: number) => {
  const perPageBetweenTotal: any = items.length / perPage;
  let itemCounter = 0;
  let paginatedItems: any = [];
  let page: any = [];

  items.map((item: any) => {
    page.push(item);

    itemCounter++;

    if (itemCounter === perPage) {
      paginatedItems.push(page);
      page = [];
      itemCounter = 0;
    }

    if (paginatedItems.length === parseInt(perPageBetweenTotal)) {
      paginatedItems.push(page);
    }
  });

  // This filter is to eliminate empty arrangements created by poor function formulation
  paginatedItems = paginatedItems.filter((paginated: any) =>
    paginated.length ? true : false
  );

  return paginatedItems;
};

export default paginateItems;
