<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "./Icon.svelte";

  export let state: "loading" | "success" | "error" | null = null;

  let top = 180;
  let left = 20;

  onMount(() => {
    document.addEventListener("scroll", () => {
      if (scrollY > 0) {
        top = 80;
      } else {
        top = 180;
      }
    });
  });

  $: loading = state === "loading";
  $: success = state === "success";
</script>

<div style="top:{top}px;right:{left}px;">
  <button class:loading class:success on:click>
    <Icon />
    <div class="loading" />
    Download all
  </button>
</div>

<style>
  div {
    z-index: 999999;
    position: fixed;
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
  button:hover {
    cursor: pointer;
    background: #0f172a;
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
