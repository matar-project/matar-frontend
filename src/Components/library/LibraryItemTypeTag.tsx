import type { LibraryItem } from '../../api/library';
import { LIBRARY_ITEM_TYPE_META } from '../../constants/library.constants';

export function LibraryItemTypeTag({
  type,
}: {
  type: LibraryItem['itemType'];
}) {
  const itemType = LIBRARY_ITEM_TYPE_META[type];
  const Icon = itemType.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${itemType.color}`}
    >
      <Icon size={12} aria-hidden="true" />
      {itemType.label}
    </span>
  );
}
