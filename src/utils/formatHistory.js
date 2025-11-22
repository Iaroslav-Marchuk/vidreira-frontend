export function formatHistoryEntry(history, options = {}, t) {
  const { simplified = false, glassOptions, actualX, actualY } = options;

  const date = new Date(history.changedAt).toLocaleString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const user = history.changedBy.name;

  const action = history.action;
  const changes = history.changes;
  const lines = [];
  const displayEP = changes.EP;

  const getCategoryLabel = category => {
    const key =
      typeof category === 'string' ? category : category?.old ?? category?.new;
    return glassOptions[key]?.label ?? key;
  };

  const getTypeLabel = (category, type) => {
    const categoryKey =
      typeof category === 'string' ? category : category?.old ?? category?.new;
    const typeKey = typeof type === 'string' ? type : type?.old ?? type?.new;
    return glassOptions[categoryKey]?.types?.[typeKey]?.label ?? typeKey;
  };

  switch (action) {
    case 'ORDER_CREATED':
      if (simplified) {
        lines.push(`${date} — ${user} ${t('HISTORY_TEXT_1')} EP-${displayEP}.`);
      } else {
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_2')} ${changes.itemsCount} ${t(
            'HISTORY_TEXT_3'
          )} (${changes.unitsCount} ${t('HISTORY_TEXT_4')}).`
        );
      }
      break;

    case 'ORDER_EDITED': {
      if (simplified) {
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_5')} EP-${changes.displayEP}.`
        );
      } else {
        if (changes.EP && changes.EP.old !== changes.EP.new) {
          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_6')} ${changes.EP.old} ${t(
              'HISTORY_TEXT_7'
            )} ${changes.EP.new}.`
          );
        }
        if (changes.client && changes.client.old !== changes.client.new) {
          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_8')} "${
              changes.client.old
            }" ${t('HISTORY_TEXT_7')} "${changes.client.new}".`
          );
        }
        if (
          changes.local &&
          changes.local.old.zona !== changes.local.new.zona
        ) {
          lines.push(
            `${date} — ${user} ${t(
              'HISTORY_TEXT_9'
            )} ${`LINE_${changes.local.old.zona}`} ${t('HISTORY_TEXT_7')} ${
              changes.local.new.zona
            }.`
          );
        }
        if (changes.addedItemsCount && changes.addedItemsCount > 0) {
          const addedUnitsCount = changes.addedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_10')} ${
              changes.addedItemsCount
            } ${t('HISTORY_TEXT_11')} (${addedUnitsCount} ${t(
              'HISTORY_TEXT_4'
            )}).`
          );
        }
        if (lines.length === 0) {
          lines.push(`${date} — ${user} ${t('HISTORY_TEXT_12')}.`);
        }
      }
      break;
    }
    case 'ORDER_DELETED':
      lines.push(`${date} — ${user} ${t('HISTORY_TEXT_13')} EP-${displayEP}`);
      break;

    case 'STATUS_OF_ORDER_CHANGED':
      if (simplified) {
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_14')} EP-${displayEP} ${t(
            'HISTORY_TEXT_15'
          )} "${t(`STATUS_${changes.status.old}`)}" ${t('HISTORY_TEXT_7')} "${t(
            `STATUS_${changes.status.new}`
          )}".`
        );
      } else {
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_16')} "${t(
            `STATUS_${changes.status.old}`
          )}" ${t('HISTORY_TEXT_7')} "${t(`STATUS_${changes.status.new}`)}".`
        );
      }

      break;

    case 'ITEM_DELETED':
      if (simplified) {
        lines.push(`${date} — ${user} ${t('HISTORY_TEXT_17')} EP-${displayEP}`);
      } else {
        const deletedTypeLabel = getTypeLabel(
          changes.deletedItem?.category,
          changes.deletedItem?.type
        );
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_18')}: ${deletedTypeLabel} ${
            changes.deletedItem?.sizeX
          }x${changes.deletedItem?.sizeY} ${changes.deletedItem?.sizeZ}, ${
            changes.deletedItem.quantity
          } ${t('HISTORY_TEXT_4')}.`
        );
      }
      break;

    case 'ITEM_ADDED_TO_ORDER':
      if (simplified) {
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_19')} EP-${displayEP}.`
        );
      } else {
        lines.push(`${date} — ${user} ${t('HISTORY_TEXT_20')}.`);
      }
      break;

    case 'ITEM_EDITED': {
      if (simplified) {
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_21')} EP-${displayEP}.`
        );
      } else {
        const oldCategoryLabel = getCategoryLabel(
          changes.category?.old ?? changes.category
        );
        const newCategoryLabel = getCategoryLabel(
          changes.category?.new ?? changes.category
        );

        const oldTypeLabel = getTypeLabel(
          changes.category?.old ?? changes.category,
          changes.type?.old ?? changes.type
        );
        const newTypeLabel = getTypeLabel(
          changes.category?.new ?? changes.category,
          changes.type?.new ?? changes.type
        );

        if (
          oldCategoryLabel !== newCategoryLabel ||
          oldTypeLabel !== newTypeLabel
        ) {
          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_21')} "${oldTypeLabel}" ${t(
              'HISTORY_TEXT_7'
            )} "${newTypeLabel}".`
          );
        }

        if (changes.sizeZ?.old !== changes.sizeZ?.new) {
          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_23')} "${
              changes.sizeZ?.old ?? ''
            }" ${t('HISTORY_TEXT_7')} "${changes.sizeZ?.new}".`
          );
        }
        if (
          changes.sizeX?.old !== changes.sizeX?.new ||
          changes.sizeY?.old !== changes.sizeY?.new
        ) {
          const oldX = changes.sizeX?.old ?? changes.sizeX?.new ?? actualX;
          const oldY = changes.sizeY?.old ?? changes.sizeY?.new ?? actualY;
          const newX = changes.sizeX?.new ?? changes.sizeX?.old ?? actualX;
          const newY = changes.sizeY?.new ?? changes.sizeY?.old ?? actualY;

          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_24')} "${oldX}x${oldY}" ${t(
              'HISTORY_TEXT_7'
            )} "${newX}x${newY}".`
          );
        }

        if (
          'temper' in changes &&
          changes.temper?.old !== changes.temper?.new
        ) {
          const oldValue = changes.temper?.old
            ? t('HISTORY_TEXT_25')
            : t('HISTORY_TEXT_26');
          const newValue = changes.temper?.new
            ? t('HISTORY_TEXT_25')
            : t('HISTORY_TEXT_26');
          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_22')} "${oldValue}" ${t(
              'HISTORY_TEXT_7'
            )} "${newValue}".`
          );
        }

        if (changes.quantity?.old !== changes.quantity?.new) {
          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_27')} "${
              changes.quantity?.old ?? ''
            }" ${t('HISTORY_TEXT_7')} "${changes.quantity?.new}".`
          );
        }

        if (changes.reason?.old !== changes.reason?.new) {
          lines.push(
            `${date} — ${user} ${t('HISTORY_TEXT_28')} "${
              changes.reason?.old ?? ''
            }" ${t('HISTORY_TEXT_7')} "${changes.reason?.new}".`
          );
        }
      }
      break;
    }

    case 'STATUS_OF_ITEM_CHANGED':
      if (simplified) {
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_29')} EP-${displayEP} ${t(
            'HISTORY_TEXT_15'
          )} "${t(`STATUS_${changes.status?.old}`)}" ${t(
            'HISTORY_TEXT_7'
          )} "${t(`STATUS_${changes.status?.new}`)}".`
        );
      } else {
        lines.push(
          `${date} — ${user} ${t('HISTORY_TEXT_30')} "${t(
            `STATUS_${changes.status?.old}`
          )}" ${t('HISTORY_TEXT_7')} "${t(`STATUS_${changes.status?.new}`)}".`
        );
      }

      break;
  }

  return lines;
}
