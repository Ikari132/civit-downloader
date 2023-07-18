<script lang="ts">
  import { CogOutline } from "flowbite-svelte-icons";
  import Icon from "./components/Icon.svelte";

  function handleOptionsOpen() {
    chrome.runtime.sendMessage({ name: "showOptions" });
  }
</script>

<main class="popup">
  <h4><Icon /> Civit Downloader</h4>

  <div class="controls">
    <button on:click={handleOptionsOpen}>
      <CogOutline width="20" height="20" />
      <span style="padding-left: 10px;">Options</span>
    </button>
  </div>
</main>

<style>
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

    width: 100%;
    height: 36px;
    font-weight: 600;
    font-size: 14px;

    background: #f8fafc;
    color: #000;
    transition: all 0.3s;

    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica,
      Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;

    cursor: pointer;
  }
  button:hover {
    background: #cbd5e1;
  }
  :global(html) {
    background: #fff;
  }
  .popup {
    width: 150px;
    /* height: 200px; */
    margin: 0;
    border: none;
    font-family: sans-serif;

    background: #fff;
    padding: 0 10px;
  }
  .controls {
    padding: 10px 0;
  }
  h4 {
    font-size: 0.8rem;
    font-size: 14px;
    margin: 0;
    padding: 20px 0;
    display: flex;
    align-items: center;
    color: #64748b;
  }

  @media (prefers-color-scheme: dark) {
    :global(html) {
      background: #1e293b;
    }
    .popup {
      background: #1e293b;
      overflow: hidden;
    }
    button {
      color: #fff;
      background: #334155;
    }
    button:hover {
      background: #0f172a;
    }
    h4 {
      color: #e2e8f0;
    }
  }
</style>
