export function AddUrl(url: string) {
  localStorage.setItem("url", url);
}

export function getUrl() {
  return localStorage.getItem("url");
}

export function removeUrl() {
  localStorage.removeItem("url");
}

export function AddCustomData(key: string, data: string[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getCustomData(key: string) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function removeCustomData(key: string, values: string | string[]) {
  const customData = getCustomData(key);
  const arr = Array.isArray(values) ? values : [values];

  const removeSet = new Set(arr.map((v) => v.trim().toLowerCase()));

  const newData = customData.filter(
    (i: string) => !removeSet.has(i.trim().toLowerCase())
  );

  AddCustomData(key, newData);
}

export function clearCustomData() {
  localStorage.clear();
}
