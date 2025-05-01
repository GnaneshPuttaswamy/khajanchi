import { SortInfo } from '../components/pages/add-transaction-page/AddTransactionPage'; // Adjust path if needed

/**
 * Parses a sort parameter string from the URL into a SortInfo array.
 * Example input: "date:descend,amount:ascend"
 * Example output: [{ field: 'date', order: 'descend' }, { field: 'amount', order: 'ascend' }]
 */
export function parseSortParams(sortParam: string | null): SortInfo {
  if (!sortParam) {
    return [];
  }

  const parts = sortParam.split(',');
  const sortInfo: SortInfo = [];

  parts.forEach((part) => {
    const [field, order] = part.split(':');
    if (field && (order === 'ascend' || order === 'descend')) {
      sortInfo.push({ field, order });
    }
  });

  return sortInfo;
}

/**
 * Serializes a SortInfo array into a URL-friendly string.
 * Example input: [{ field: 'date', order: 'descend' }, { field: 'amount', order: 'ascend' }]
 * Example output: "date:descend,amount:ascend"
 */
export function serializeSortParams(sortInfo: SortInfo): string {
  if (!sortInfo || sortInfo.length === 0) {
    return '';
  }

  return sortInfo.map((sorter) => `${sorter.field}:${sorter.order}`).join(',');
}
