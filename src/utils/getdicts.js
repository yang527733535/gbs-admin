export function getDictsByName(type) {
  let dicts = JSON.parse(localStorage.getItem('dicts'));
  let redata = null;
  dicts.forEach((element) => {
    if (element.dict_code === type) {
      redata = element.dict_label;
    }
  });
  return redata;
}
