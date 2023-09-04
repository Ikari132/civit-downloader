<script lang="ts">
  import Icon from "./components/Icon.svelte";
  import { getSettingsStore } from "./helpers";
  import Downloads from "./optionsViews/Downloads.svelte";
  import Settings from "./optionsViews/Settings.svelte";

  const settingsStore = getSettingsStore();

  let view = "general";
</script>

<main>
  <!-- {#await $settingsStore.updating}
    Updating
  {/await} -->

  {#await $settingsStore.loading}
    <p>Loading...</p>
  {:then _}
    <nav>
      <div class="nav-main">
        <h4 class="logo"><Icon /> Civit Downloader</h4>
      </div>
      <div class="menu">
        <button class="support-btn" on:click={() => (view = "general")}
          >General</button
        >
        <button class="support-btn" on:click={() => (view = "downloads")}
          >Downloads</button
        >
      </div>
      <div class="nav-footer">
        <a href="https://ko-fi.com/L3L4HYJ79" target="_blank">
          <button type="button" class="support-btn"> Support ❤️ </button>
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
  :global(*) {
    box-sizing: border-box;
  }
  :global(.disabled) {
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

  @media (prefers-color-scheme: dark) {
    :global(html) {
      background: #1e293b;
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
  }
</style>
