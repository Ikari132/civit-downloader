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
    <nav>
      <h4 class="logo"><Icon /> Civit Downloader</h4>
    </nav>
    <section>
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

      <h4>Images</h4>
      <label>
        <div class="description">
          <h3>Save all images</h3>
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
    </section>
  {/await}
</main>

<style>
  :global(html) {
    background: #fff;
  }
  :global(*) {
    box-sizing: border-box;
  }
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .logo {
    padding: 10px;
  }
  main {
    margin: 0;
    border: none;
    font-family: sans-serif;

    display: flex;

    padding: 10px;
    background: #f8fafc;

    min-height: 100vh;
    max-height: 100vh;
  }
  nav {
    width: 200px;
    height: 100%;
  }
  section {
    flex: 1;
    overflow: auto;
    padding: 10px;
    background: #fff;
    border-radius: 10px;
    max-height: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

  input,
  select {
    border-radius: 4px;
    border: solid 1px #f2f2f2;
    min-height: 32px;
    padding: 8px;

    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px inset,
      rgb(209, 213, 219) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  }
  input[type="checkbox"] {
    box-shadow: none;
    border: none;
  }
  @media (prefers-color-scheme: dark) {
    :global(html) {
      background: #1e293b;
    }
    main {
      background: #1e293b;
      overflow: hidden;
    }
    section {
      background: #000;
    }
    label {
      color: #e2e8f0;
      background: #0f172a;
    }
    h4 {
      color: #e2e8f0;
    }

    input,
    select {
      border: solid 1px #f2f2f2;
      color: #e2e8f0;
      background: #000;

      box-shadow: none;
    }
  }
</style>
