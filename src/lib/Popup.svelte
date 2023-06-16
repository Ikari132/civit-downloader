<script lang="ts">
  import Icon from "./components/Icon.svelte";

  let storagePromise = new Promise<{
    saveAll: boolean;
    saveModel: boolean;
  }>((resolve) => {
    chrome.storage.local.get(["save-all", "save-model"], (result) => {
      console.log(result);

      resolve({
        saveAll: result["save-all"] === "true",
        saveModel: result["save-model"] === "true",
      });
    });
  });
  function handleCheckboxChange(name: string, e: Event) {
    const checked: boolean = (e.target as any).checked;

    chrome.storage.local.set({ [name]: `${checked}` });
  }
</script>

<main class="popup">
  {#await storagePromise}
    <p>Loading...</p>
  {:then r}
    <h4><Icon /> Civit Downloader</h4>
    <label>
      <h3>Save all images</h3>
      <input
        type="checkbox"
        name="save-all"
        id="save-all"
        checked={r.saveAll}
        on:change={(e) => handleCheckboxChange("save-all", e)}
      />
    </label>
    <label>
      <h3>Save model</h3>
      <input
        type="checkbox"
        name="save-model"
        id="save-model"
        checked={r.saveModel}
        on:change={(e) => handleCheckboxChange("save-model", e)}
      />
    </label>
  {/await}
</main>

<style>
  .popup {
    width: 200px;
    height: 150px;
    /* padding: 10px; */
    margin: 0;
    border: none;
    font-family: sans-serif;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    background: #f2f2f2;
    margin: 5px 0;
    padding: 10px;
    cursor: pointer;
  }
  h4 {
    font-size: 0.8rem;
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
