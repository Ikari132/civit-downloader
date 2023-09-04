<script lang="ts">
  import type { TWritableStore } from "../helpers";
  import { TrashBinOutline } from "flowbite-svelte-icons";
  export let settingsStore: TWritableStore;

  function getLink(versionId: string, meta: any) {
    return `https://civitai.com/models/${meta?.modelId}?modelVersionId=${versionId}`;
  }

  function handleDelete(versionId: string) {
    const { downloadHistory, downloadHistoryMeta } = $settingsStore.state;

    $settingsStore.state.downloadHistory = downloadHistory.filter(
      (d) => d !== versionId
    );

    $settingsStore.state.downloadHistoryMeta = Object.keys(downloadHistoryMeta)
      .filter((k) => `${k}` !== `${versionId}`)
      .reduce((obj, key) => {
        obj[key] = downloadHistoryMeta[key];
        return obj;
      }, {});
  }
</script>

<h1>Downloads</h1>

{#each $settingsStore.state.downloadHistory as download}
  {@const meta = $settingsStore.state?.downloadHistoryMeta[download]}
  <div class="item">
    {#if meta}
      <div class="description">
        <a target="_blank" href={getLink(download, meta)}>
          <img width="50" height="50" src={meta?.preview?.url} alt="preview" />
          <h3>{meta?.modelName || meta?.name}</h3>
        </a>
      </div>
    {:else}
      No data found. Model version id - {download}
    {/if}
    <div style="cursor:pointer;">
      <TrashBinOutline
        width="20"
        height="20"
        on:click={() => handleDelete(download)}
      />
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
