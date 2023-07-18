<script lang="ts">
  import Icon from "./components/Icon.svelte";
  import { getOptions, getSettingsStore } from "./helpers";

  const settingsStore = getSettingsStore();
</script>

<main>
  <!-- {#await $settingsStore.updating}
    Updating
  {/await} -->

  {#await $settingsStore.loading}
    <p>Loading...</p>
  {:then _}
    <h4><Icon /> Civit Downloader</h4>

    <label>
      <div class="description">
        <h3>Save model</h3>
      </div>
      <input
        type="checkbox"
        name="save-model"
        id="save-model"
        bind:checked={$settingsStore.state.saveModel}
      />
    </label>
    <label>
      <div class="description">
        <h3>Save all images</h3>
      </div>
      <input
        type="checkbox"
        name="save-model"
        id="save-model"
        bind:checked={$settingsStore.state.saveImages}
      />
    </label>

    <label>
      <div class="description">
        <h3>Image size</h3>
      </div>
      <select
        name="image-size"
        id="image-size"
        bind:value={$settingsStore.state.imageSize}
      >
        <option value="preview">Preview</option>
        <option value="original">Original</option>
      </select>
    </label>
    <label>
      <div class="description">
        <h3>Image name</h3>
      </div>
      <select
        name="image-name"
        id="image-name"
        bind:value={$settingsStore.state.imageName}
      >
        <option value="model">Use model name</option>
        <option value="original">Original</option>
      </select>
    </label>
    <label>
      <div class="description">
        <h3>Full data file extension</h3>
      </div>
      <input
        type="text"
        name="full-data-ext"
        id="full-data-ext"
        bind:value={$settingsStore.state.fullDataExt}
      />
    </label>
    <label>
      <div class="description">
        <h3>Version data file extension</h3>
      </div>
      <input
        type="text"
        name="version-data-ext"
        id="version-data-ext"
        bind:value={$settingsStore.state.versionDataExt}
      />
    </label>
    <label>
      <div class="description">
        <h3>Images download limit</h3>
      </div>
      <input
        type="number"
        name="images-limit"
        id="images-limit"
        bind:value={$settingsStore.state.imagesLimit}
      />
    </label>
  {/await}
</main>

<style>
  :global(html) {
    background: #fff;
  }
  main {
    margin: 0;
    border: none;
    font-family: sans-serif;

    background: #fff;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
    background: #f8fafc;
    color: #1e293b;
    margin: 5px 0;
    padding: 10px;
    cursor: pointer;
    font-size: 16px;
  }
  h4 {
    font-size: 0.8rem;
    font-size: 14px;
    margin: 0;
    padding: 20px 10px;
    display: flex;
    align-items: center;
    color: #64748b;
  }
  h3 {
    font-size: 14px;
  }
  p {
    font-size: 14px;
    margin: 0;
    margin-bottom: 1em;
  }

  @media (prefers-color-scheme: dark) {
    :global(html) {
      background: #1e293b;
    }
    main {
      background: #1e293b;
      overflow: hidden;
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
