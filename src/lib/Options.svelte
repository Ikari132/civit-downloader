<script lang="ts">
  import Icon from "./components/Icon.svelte";
  import { currentVersion } from "./constants";
  import { getSettingsStore } from "./helpers";
  import Downloads from "./optionsViews/Downloads.svelte";
  import Settings from "./optionsViews/Settings.svelte";
  import { LinkOutline } from "flowbite-svelte-icons";

  const settingsStore = getSettingsStore();

  let view = "general";
  let showWhatsNew = false;

  $settingsStore.loading.then(
    () =>
      (showWhatsNew = $settingsStore.state.whatsnewVersion !== currentVersion),
  );

  function handleCloseWhatsNew() {
    if ($settingsStore.state.whatsnewVersion !== currentVersion) {
      $settingsStore.state.whatsnewVersion = currentVersion;
    }

    showWhatsNew = false;
  }
</script>

<main>
  <!-- {#await $settingsStore.updating}
    Updating
  {/await} -->
  {#if showWhatsNew}
    <div class="whats-new">
      <h4>
        What's new in version {currentVersion}
      </h4>
      <div style="flex:1;">
        <ul>
          <li>
            <h3>
              Temporary fix: until <a
                href="https://github.com/civitai/civitai/issues/1005"
                >Civitai API is fixed</a
              >, the extension will skip gallery images. Settings &rarr; Images
              from &rarr; Model card is currently unaffected by API bug, so you
              can use it instead
            </h3>
          </li>
          <li>
            <h3>Fix the flickering badge on the settings button</h3>
          </li>
        </ul>
      </div>
      <button class="support-btn" on:click={handleCloseWhatsNew}>Got it</button>
    </div>
  {/if}

  {#await $settingsStore.loading}
    <p>Loading...</p>
  {:then _}
    <nav>
      <div class="nav-main">
        <h4 class="logo">
          <Icon /> Civit Downloader
        </h4>
      </div>
      <div class="menu">
        <button
          class="support-btn"
          class:active={view === "general"}
          on:click={() => (view = "general")}>General</button
        >
        <button
          class="support-btn"
          class:active={view === "downloads"}
          on:click={() => (view = "downloads")}>Downloads</button
        >
      </div>
      <div class="nav-footer">
        <button class="support-btn" on:click={() => (showWhatsNew = true)}>
          What's new
        </button>
        <a href="https://ko-fi.com/L3L4HYJ79" target="_blank">
          <button type="button" class="support-btn">
            <span class="beat">❤️</span> Support
          </button>
        </a>
        <a
          href="https://www.ayamaru.com/more"
          target="_blank"
          style="text-decoration: none;"
        >
          <button
            type="button"
            class="support-btn"
            style="display: flex;align-items: center;justify-content: center;"
            ><LinkOutline width="14" height="14" />
            <span style="padding-left: 5px;">More apps</span>
          </button>
        </a>
      </div>
    </nav>
    <section>
      {#if view === "general"}
        <Settings {settingsStore} />
      {:else if view === "downloads"}
        <Downloads {settingsStore} />
      {/if}
    </section>
  {/await}
</main>

<style>
  :global(html) {
    background: #fff;
    color: #000;
  }
  a {
    color: #000;
  }
  :global(*) {
    box-sizing: border-box;
  }
  :global(.disabled) {
    opacity: 0.5;
    pointer-events: none;
  }
  .whats-new {
    position: fixed;
    top: calc(50% - 150px);
    left: calc(50% - 200px);
    background: #fff;
    width: 400px;
    min-height: 300px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
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

    height: 100%;
    min-height: 100vh;
    max-height: 100vh;
  }
  nav {
    width: 200px;
    min-height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 10px;
  }
  .menu {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 10px;
  }
  .nav-footer {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    padding-bottom: 0;
  }
  .nav-footer a {
    width: 100%;
  }
  .support-btn {
    border-radius: 4px;
    border: none;

    width: 100%;
    min-width: 100%;

    height: 36px;
    font-weight: 600;
    font-size: 14px;

    background: #e2e8f0;
    color: #000;
    transition: all 0.3s;

    cursor: pointer;
  }
  .support-btn:hover {
    background: #cbd5e1;
  }
  .support-btn.active {
    border: solid 1px #0f172a;
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
  p {
    font-size: 14px;
    margin: 0;
    margin-bottom: 1em;
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

  .beat {
    display: inline-block;
    animation: 4s beat infinite;
  }
  @keyframes beat {
    0%,
    50%,
    100% {
      transform: scale(1, 1);
    }
    30%,
    80% {
      transform: scale(0.92, 0.95);
    }
  }

  @media (prefers-color-scheme: dark) {
    :global(html) {
      background: #1e293b;
      color: #fff;
    }
    a {
      color: #fff;
    }
    main {
      background: #1e293b;
      overflow: hidden;
    }
    section {
      background: #000;
    }
    h4 {
      color: #e2e8f0;
    }

    .support-btn {
      color: #fff;
      background: #334155;
    }
    .support-btn:hover {
      background: #0f172a;
    }
    .support-btn.active {
      border: solid 1px #f2f2f2;
    }

    .whats-new {
      background: #1e293b;
      color: #fff;
    }
  }
</style>
