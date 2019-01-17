import { clipboard } from "electron";

// const origin = "https://gbf-raid-stream.now.sh";
// const origin = "http://localhost:8080";
const origin = "https://gbf-raid-stream-brdjvcbcre.now.sh";

document.head.innerHTML +=
  "<style>body{margin:0}iframe{width:100vw;height:100vh}</style>";
document.body.innerHTML = `<iframe src="${origin}" frameborder="0"></iframe>`;

const iframe = document.querySelector("iframe");
iframe.addEventListener("load", () => {
  iframe.contentWindow.postMessage("handshake", "*");
  window.addEventListener(
    "message",
    (event) => {
      if (event.origin !== origin) {
        return;
      }
      try {
        const data = event.data[0] === '{' ? JSON.parse(event.data) : {id: event.data}
        clipboard.writeText(data.id);

        const opts = {}
        if(data.name){
          opts.body = `${data.name} ${data.memo}`
        }
        if(data.image){
          opts.icon = data.image
        }
        new Notification(data.id, { silent: true, ...opts });
      } catch (error){
        console.error(error)
      }
    },
    false
  );
});
