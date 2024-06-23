<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Icon from "./Icon.svelte";
  import { CogOutline, CheckCircleOutline } from "flowbite-svelte-icons";
  import { getSettingsStore, messageStore } from "../helpers";
  import { currentVersion } from "../constants";

  export let state: "loading" | "success" | "error" | null = null;
  export let alreadyDownloaded = false;

  const dispatch = createEventDispatcher();

  const settingsStore = getSettingsStore();

  let top = 180;
  let right = 18;

  onMount(() => {
    document.addEventListener("scroll", () => {
      if (scrollY > 10) {
        top = 80;
      } else {
        top = 180;
      }
    });
  });

  $: loading = state === "loading";
  $: success = state === "success";
  $: error = state === "error";

  let popupError = null;

  messageStore.subscribe((data) => {
    switch (data.status) {
      case "warning":
      case "error":
        popupError = data.message;
        break;

      default:
        popupError = null;
        break;
    }
  });
</script>

{#if popupError}
  <div class="error-popup">
    <h5 class="error-title">Civit downloader</h5>
    <div class="error-text">
      {popupError}
    </div>
  </div>
{/if}
<div class="contanier" style="top:{top}px;right:{right}px;">
  {#if alreadyDownloaded}
    <div class="icon icon_success" title="Already downloaded">
      <CheckCircleOutline width="20" height="20" />
    </div>
  {/if}
  <button class:loading class:success class:error on:click>
    <Icon />
    <div class="loading" />
    Download
  </button>

  <button on:click={() => dispatch("options")}>
    {#await $settingsStore.loading then _}
      {#if $settingsStore.state.whatsnewVersion !== currentVersion}
        <div class="whats-new">New</div>
      {/if}
    {/await}
    <CogOutline width="20" height="20" />
  </button>
</div>

<style>
  .whats-new {
    position: absolute;
    top: -16px;
    left: 4px;
    background: linear-gradient(var(--angle), red, orange);
    border-radius: 4px;
    padding: 2px;
  }
  .contanier {
    z-index: 999999;
    position: fixed;

    display: flex;
    gap: 10px;
  }
  .icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    height: 36px;
  }
  .icon_success {
    color: #22c55e;
  }
  button {
    position: relative;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 10px;

    border-radius: 4px;
    border: none;

    height: 36px;
    font-weight: 600;
    font-size: 14px;

    background: #1e293b;
    color: #fff;
    transition: all 0.3s;

    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica,
      Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
  }

  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  button:before {
    transition: all 0.3s;
    --angle: 45deg;
    --size: -0.1rem;

    content: "";
    display: block;
    position: absolute;
    border-radius: 4px;
    top: var(--size);
    bottom: var(--size);
    right: var(--size);
    left: var(--size);
    z-index: -1;
    background: linear-gradient(var(--angle), red, orange);
  }

  .loading:before {
    --angle: 0deg;
    --size: -0.2rem;
    background: linear-gradient(var(--angle), red, orange);
    animation: flow-gradient 3s infinite;
  }
  .success:before {
    --size: -0.3rem;
    background: linear-gradient(var(--angle), #22c55e, #10b981);
  }

  .error:before {
    --size: -0.3rem;
    background: #ae0000;
  }

  button:hover {
    cursor: pointer;
    background: #0f172a;
  }

  .error-popup {
    position: fixed;
    background: #1e293b;
    border-radius: 6px;
    top: 6px;
    left: 50%;
    z-index: 99999;
    padding: 12px 12px;
    color: #ef4444;
    transform: translate(-50%, 0);
  }
  .error-text:before{
    content: "";
    display: inline-block;
    width: 14px;
    height: 14px;
    background-color: #ef4444;
    border-radius: 50%;
    margin-right: 5px;
  }
  .error-popup .error-title{
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 6px;
    opacity: 0.9;

    color: #fff;
  }

  @keyframes flow-gradient {
    from {
      --angle: 0deg;
    }
    to {
      --angle: 360deg;
    }
  }
</style>
