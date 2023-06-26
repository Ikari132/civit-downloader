<script lang="ts">
  import Icon from "./components/Icon.svelte";
  import { getOptions } from "./helpers";

  let storagePromise = getOptions();

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
    width: 220px;
    height: 150px;
    margin: 0;
    border: none;
    font-family: sans-serif;

    background: #f8fafc;
    background: #fff;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    background: #f8fafc;
    color: #1e293b;
    margin: 5px 0;
    padding: 10px;
    cursor: pointer;
  }
  h4 {
    font-size: 0.8rem;
    margin: 0;
    padding: 20px 10px;
    display: flex;
    align-items: center;
    color: #64748b;
  }

  @media (prefers-color-scheme: dark) {
    .popup {
      background: #1e293b;
    }
    label {
      color: #e2e8f0;
      background: #0f172a;
    }
    h4 {
      color: #e2e8f0;
    }
  }
</style>
