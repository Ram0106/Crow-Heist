export function getSelectedTotals(selectedObjects) {
  return selectedObjects.reduce(
    (totals, object) => ({
      value: totals.value + Number(object.value || 0),
      weight: totals.weight + Number(object.weight || 0)
    }),
    { value: 0, weight: 0 }
  );
}

export function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
