<script lang="ts">
  import type { TWritableStore } from "../helpers";

  export let settingsStore: TWritableStore;

  console.log($settingsStore.state);

  function getLink(versionId: string, meta: any) {
    return `https://civitai.com/models/${meta.modelId}?modelVersionId=${versionId}`;
  }
</script>

<h1>Downloads</h1>

{#each $settingsStore.state.downloadHistory as download}
  <div class="item">
    <div class="description">
      <a
        target="_blank"
        href={getLink(
          download,
          $settingsStore.state.downloadHistoryMeta[download]
        )}
      >
        <img
          width="50"
          height="50"
          src={$settingsStore.state.downloadHistoryMeta[download].preview.url}
          alt="preview"
        />
        <h3>{$settingsStore.state.downloadHistoryMeta[download].name}</h3>
      </a>
    </div>
  </div>
{/each}

<style>
  h3 {
    font-size: 14px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
    background: #f8fafc;
    color: #1e293b;
    margin: 5px 0;
    padding: 10px;
    font-size: 16px;

    border-radius: 10px;
  }
  .item:first-child {
    margin-top: 0;
  }
  .item:last-child {
    margin-bottom: 0;
  }
  a {
    display: flex;
    gap: 10px;
    color: #1e293b;
  }
  img {
    border-radius: 4px;
    object-fit: cover;
  }
  @media (prefers-color-scheme: dark) {
    .item {
      color: #e2e8f0;
      background: #0f172a;
    }
    a {
      color: #e2e8f0;
    }
  }
</style>
