export async function getOptions() {
  return new Promise<{ saveAll: boolean, saveModel: boolean }>((resolve) => {
    chrome.storage.local.get(["save-all", "save-model"], (result) => {
      const saveAll =
        result["save-all"] === undefined ? "true" : result["save-all"];
      const saveModel =
        result["save-model"] === undefined ? "true" : result["save-model"];

      resolve({
        saveAll: saveAll === "true",
        saveModel: saveModel === "true",
      });
    })
  });
}