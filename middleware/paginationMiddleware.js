const paginationMiddleware = (
  defaultSort = "updatedAt",
  defaultLimit = 2,
  defaultSortOrder = "desc",
) => {
  return (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || defaultLimit);
    const sortBy = req.query.sortBy || defaultSort;
    const sortOrderParam = req.query.sortOrder || defaultSortOrder;
    const sortOrder = sortOrderParam === "asc" ? 1 : -1;

    res.locals.pagination = {
      page,
      limit,
      skip: (page - 1) * limit,
    };

    res.locals.sort = {
      sortBy,
      sortOrder,
    };

    next();
  };
};

module.exports = paginationMiddleware;
