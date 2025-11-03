export function formatHistoryEntry(history, options = {}) {
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
    return glassOptions[key]?.label ?? key ?? 'Desconhecido';
  };

  const getTypeLabel = (category, type) => {
    const categoryKey =
      typeof category === 'string' ? category : category?.old ?? category?.new;
    const typeKey = typeof type === 'string' ? type : type?.old ?? type?.new;
    return (
      glassOptions[categoryKey]?.types?.[typeKey]?.label ??
      typeKey ??
      'Desconhecido'
    );
  };

  switch (action) {
    case 'criou pedido':
      if (simplified) {
        lines.push(`${date} — ${user} criou o pedido EP-${displayEP}.`);
      } else {
        lines.push(
          `${date} — ${user} criou o pedido com ${changes.itemsCount} posição(ões) (${changes.unitsCount} vidro(s)).`
        );
      }
      break;

    case 'corrigiu pedido': {
      if (simplified) {
        lines.push(
          `${date} — ${user} alterou os dados do pedido EP-${changes.displayEP}.`
        );
      } else {
        if (changes.EP && changes.EP.old !== changes.EP.new) {
          lines.push(
            `${date} — ${user} alterou o número de EP de ${changes.EP.old} para ${changes.EP.new}.`
          );
        }
        if (changes.client && changes.client.old !== changes.client.new) {
          lines.push(
            `${date} — ${user} alterou o cliente de "${changes.client.old}" para "${changes.client.new}".`
          );
        }
        if (
          changes.local &&
          changes.local.old.zona !== changes.local.new.zona
        ) {
          lines.push(
            `${date} — ${user} alterou a zona de ${changes.local.old.zona} para ${changes.local.new.zona}.`
          );
        }
        if (changes.addedItemsCount && changes.addedItemsCount > 0) {
          const addedUnitsCount = changes.addedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          lines.push(
            `${date} — ${user} adicionou ${changes.addedItemsCount} artigo(s) (${addedUnitsCount} vidro(s)).`
          );
        }
        if (lines.length === 0) {
          lines.push(`${date} — ${user} corrigiu o pedido.`);
        }
      }
      break;
    }
    case 'eliminou pedido':
      lines.push(`${date} — ${user} eliminou o pedido EP-${displayEP}`);
      break;

    case 'mudou estado do pedido':
      if (simplified) {
        lines.push(
          `${date} — ${user} mudou o estado da encomenda EP-${displayEP} de "${changes.status.old}" para "${changes.status.new}".`
        );
      } else {
        lines.push(
          `${date} — ${user} mudou o estado do pedido de "${changes.status.old}" para "${changes.status.new}".`
        );
      }

      break;

    case 'eliminou artigo':
      if (simplified) {
        lines.push(
          `${date} — ${user} eliminou um artigo da encomenda EP-${displayEP}`
        );
      } else {
        const deletedTypeLabel = getTypeLabel(
          changes.deletedItem?.category,
          changes.deletedItem?.type
        );
        lines.push(
          `${date} — ${user} eliminou um artigo: ${deletedTypeLabel} ${changes.deletedItem?.sizeX}x${changes.deletedItem?.sizeY} ${changes.deletedItem?.sizeZ}, ${changes.deletedItem.quantity} vidro(s).`
        );
      }
      break;

    case 'adicionou artigo no pedido':
      if (simplified) {
        lines.push(
          `2${date} — ${user} criou artigo na encomenda EP-${displayEP}.`
        );
      } else {
        lines.push(`${date} — ${user} adicionou artigo.`);
      }
      break;

    case 'corrigiu artigo': {
      if (simplified) {
        lines.push(
          `${date} — ${user} alterou os dados do vidro de encomenda EP-${displayEP}.`
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
            `${date} — ${user} alterou o tipo de vidro de "${oldTypeLabel}" para "${newTypeLabel}".`
          );
        }

        if (changes.sizeZ?.old !== changes.sizeZ?.new) {
          lines.push(
            `${date} — ${user} alterou a espessura do vidro de "${
              changes.sizeZ?.old ?? ''
            }" para "${changes.sizeZ?.new}".`
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
            `${date} — ${user} alterou a medida de "${oldX}x${oldY}" para "${newX}x${newY}".`
          );
        }

        if (
          'temper' in changes &&
          changes.temper?.old !== changes.temper?.new
        ) {
          const oldValue = changes.temper?.old
            ? 'vidro temperado'
            : 'vidro normal';
          const newValue = changes.temper?.new
            ? 'vidro temperado'
            : 'vidro normal';
          lines.push(
            `${date} — ${user} alterou o tipo do vidro de "${oldValue}" para "${newValue}".`
          );
        }

        if (changes.quantity?.old !== changes.quantity?.new) {
          lines.push(
            `${date} — ${user} alterou a quantidade de vidro de "${
              changes.quantity?.old ?? ''
            }" para "${changes.quantity?.new ?? ''}".`
          );
        }

        if (changes.reason?.old !== changes.reason?.new) {
          lines.push(
            `${date} — ${user} alterou o motivo do pedido de vidro de "${
              changes.reason?.old ?? ''
            }" para "${changes.reason?.new ?? ''}".`
          );
        }
      }
      break;
    }

    case 'mudou estado do artigo':
      if (simplified) {
        lines.push(
          `${date} — ${user} mudou o estado do artigo da encomenda EP-${displayEP} de "${
            changes.status?.old ?? ''
          }" para "${changes.status?.new ?? ''}".`
        );
      } else {
        lines.push(
          `${date} — ${user} mudou o estado do artigo de "${
            changes.status?.old ?? ''
          }" para "${changes.status?.new ?? ''}".`
        );
      }

      break;
  }

  return lines;
}
