<script lang="ts">
  import type { IAction } from "../types";
  import Button from "./components/Button.svelte";

  let message = null;
  chrome.runtime.onMessage.addListener((action: IAction) => {
    message = action.data.message;
  });

  chrome.runtime.sendMessage<IAction>({ name: "popup-open" });
</script>

<main class="popup">
  <Button />
  <h1>Popup</h1>
  <div class="message">
    {message}
  </div>
</main>

<style>
  .popup {
    width: 200px;
    height: 200px;
    padding: 10px;
    margin: 0;
    border: none;
    font-family: sans-serif;
  }
  .message {
    padding: 10px;
  }
</style>
