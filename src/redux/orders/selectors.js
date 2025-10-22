export const selectAllOrders = state => state.orders.allOrders;
export const selectCurrentOrder = state => state.orders.currentOrder;
export const selectIsOrdersLoading = state => state.orders.isOrdersLoading;

export const selectCurrentPage = state => state.orders.currentPage;
export const selectTotalPages = state => state.orders.totalPages;
export const selectPerPage = state => state.orders.perPage;

export const selectSearchQuery = state => state.orders.searchQuery;

export const selectSortBy = state => state.orders.sortBy;
export const selectSortOrder = state => state.orders.sortOrder;

export const selectClientsList = state => state.orders.clientsList;
export const selectisClientsLoading = state => state.orders.isClientsLoading;

export const selectRolesList = state => state.orders.rolesList;
export const selectIsRolesLoading = state => state.orders.isRolesLoading;

export const selectHistory = state => state.orders.history;
export const selectIsHistoryLoading = state => state.orders.isHistoryLoading;

export const selectArchive = state => state.orders.archive;
export const selectIsArchiveLoading = state => state.orders.isArchiveLoading;
