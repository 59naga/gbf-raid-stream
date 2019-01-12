import clipboardy from "clipboardy";

const origin = "https://gbf-raid-stream.now.sh";

document.head.innerHTML +=
  "<style>body{margin:0}iframe{width:100vw;height:100vh}</style>";
document.body.innerHTML = `<iframe src="${origin}" frameborder="0"></iframe>`;

const iframe = document.querySelector("iframe");
iframe.addEventListener("load", () => {
  iframe.contentWindow.postMessage("handshake", "*");
  window.addEventListener(
    "message",
    function(event) {
      if (event.origin !== origin) {
        return;
      }
      clipboardy.writeSync(event.data);
    },
    false
  );
});
