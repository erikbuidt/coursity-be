import type { Pagination } from "nestjs-typeorm-paginate"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function toSnakeCaseMeta(meta: Pagination<any>["meta"]) {
  return {
    total_items: meta.totalItems,
    item_count: meta.itemCount,
    items_per_page: meta.itemsPerPage,
    total_pages: meta.totalPages,
    current_page: meta.currentPage,
  }
}
