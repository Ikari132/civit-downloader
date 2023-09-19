<script lang="ts">
  import type { TWritableStore } from "../helpers";

  export let settingsStore: TWritableStore;
</script>

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
    <h3>Group by folder</h3>
  </div>
  <input
    type="checkbox"
    name="group-folder"
    id="group-folder"
    bind:checked={$settingsStore.state.groupByFolder}
  />
</label>
{#if $settingsStore.state.groupByFolder}
  <h4>Folder names</h4>
  {#each Object.keys($settingsStore.state.modelTypes) as modelTypeKey}
    <label>
      <div class="description">
        <h3>{modelTypeKey}</h3>
      </div>
      <input
        type="text"
        bind:value={$settingsStore.state.modelTypes[modelTypeKey]}
      />
    </label>
  {/each}
{/if}

<h4>Images</h4>
<label>
  <div class="description">
    <h3>Save images</h3>
  </div>
  <input
    type="checkbox"
    name="save-images"
    id="save-images"
    bind:checked={$settingsStore.state.saveImages}
  />
</label>
<label class:disabled={!$settingsStore.state.saveImages}>
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
<label class:disabled={!$settingsStore.state.saveImages}>
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
<label class:disabled={!$settingsStore.state.imageFrom}>
  <div class="description">
    <h3>Images from</h3>
  </div>
  <select
    name="image-from"
    id="image-from"
    bind:value={$settingsStore.state.imageFrom}
  >
    <option value="creator">Creator</option>
    <option value="gallery">Gallery</option>
    <option value="all">Creator and Gallery</option>
    <option value="model">Model card(first 10 images only)</option>
  </select>
</label>
<label class:disabled={!$settingsStore.state.saveImages}>
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

<h4>Model info</h4>
<label>
  <div class="description">
    <h3>Save version info</h3>
  </div>
  <input
    type="checkbox"
    name="save-version"
    id="save-version"
    bind:checked={$settingsStore.state.saveVersionData}
  />
</label>
<label class:disabled={!$settingsStore.state.saveVersionData}>
  <div class="description">
    <h3>Version info extension</h3>
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
    <h3>Save full model info</h3>
  </div>
  <input
    type="checkbox"
    name="save-full"
    id="save-full"
    bind:checked={$settingsStore.state.saveFullData}
  />
</label>
<label class:disabled={!$settingsStore.state.saveFullData}>
  <div class="description">
    <h3>Full model info extension</h3>
  </div>
  <input
    type="text"
    name="full-data-ext"
    id="full-data-ext"
    bind:value={$settingsStore.state.fullDataExt}
  />
</label>

<style>
  h3 {
    font-size: 14px;
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

    border-radius: 10px;
  }
  label:first-child {
    margin-top: 0;
  }
  label:last-child {
    margin-bottom: 0;
  }
  input,
  select {
    border-radius: 4px;
    border: solid 1px #f2f2f2;
    min-height: 32px;
    padding: 8px;

    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px inset,
      rgb(209, 213, 219) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  }

  select {
    background-image: linear-gradient(45deg, transparent 50%, gray 50%),
      linear-gradient(135deg, gray 50%, transparent 50%),
      linear-gradient(to right, #ccc, #ccc);
    background-position: calc(100% - 15px) calc(1em + 2px),
      calc(100% - 10px) calc(1em + 2px), calc(100% - 2.2em) 0.5em;
    background-size: 5px 5px, 5px 5px, 1px 1.5em;
    background-repeat: no-repeat;

    margin: 0;
    appearance: none;
    padding-right: 45px;
  }

  input[type="checkbox"] {
    box-shadow: none;
    border: none;
  }

  @media (prefers-color-scheme: dark) {
    label {
      color: #e2e8f0;
      background: #0f172a;
    }
    input,
    select {
      border: solid 1px #f2f2f2;
      color: #e2e8f0;
      background-color: #000;

      box-shadow: none;
    }

    h4 {
      color: #e2e8f0;
    }
  }
</style>
