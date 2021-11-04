export const range = (start=0, end=0) => {
  let list = [];
  for (var i = start; i < end; i++) {
    list.push(i)
  }
  return list;
}

export const currencyValue = (value) => {
  return value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
}