export function checkUrlSpreadSheet(url: string) {
  const re =
    /^(?:https?:\/\/)(?:docs|sheets)\.google\.com\/spreadsheets\/(?:(?:u\/\d+\/)?d\/[A-Za-z0-9_-]{10,}(?:\/(?:edit|view|copy|preview)?)?(?:[?#].*)?|d\/e\/[A-Za-z0-9_-]{10,}\/.*)$/;
  return re.test(url.trim());
}

export function getSpreadSheetId(url: string) {
  const re =
    /^(?:https?:\/\/)(?:docs|sheets)\.google\.com\/spreadsheets\/(?:(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{10,}))(?:\/(?:edit|view|copy|preview)?)?(?:[?#].*)?$/;
  const match = url.trim().match(re);
  return match?.[1] || "";
}
