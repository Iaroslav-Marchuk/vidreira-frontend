export const formatText = (item, glassOptions) => {
  if (!item) return '';

  const category = glassOptions[item.category];
  const type = category.types[item.type];

  let temper = item.temper ? 'V. Sec.' : '';
  let categoryLabel = '';
  let typeLabel = type.label;
  const sizeZ = item.sizeZ;

  if (item.category === 'sunguard' || item.category === 'coolLite') {
    categoryLabel = category.label;
  }

  if (item.category === 'incolor' && item.temper === true) {
    typeLabel = 'Incolor';
  }

  if (item.category === 'colorido' && item.temper === true) {
    typeLabel = type.label.slice(2);
  }

  return `${temper} ${categoryLabel} ${typeLabel} ${sizeZ} mm`;
};
