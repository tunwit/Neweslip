const docPath = "/documents";
export async function getDocumentPath(docId: string) {
  const filePath = docPath + `/${docId}.pdf`;
  const a = document.createElement("a");
  a.href = filePath;
  a.download = `${docId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
