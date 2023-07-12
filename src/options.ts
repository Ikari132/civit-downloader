import Options from "./lib/Options.svelte";

const options = new Options({
  target: document.querySelector('#root'),
});

export default options;
