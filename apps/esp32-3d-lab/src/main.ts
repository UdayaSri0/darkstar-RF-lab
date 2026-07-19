import "./styles/main.css";
import { LabApp } from "./app/LabApp";

const root = document.getElementById("esp32-3d-lab-root");

if (!root) {
  throw new Error("DarkStar ESP32 3D Lab root element was not found.");
}

try {
  new LabApp(root);
} catch (error) {
  console.error("DarkStar ESP32 3D Lab failed to start", error);
  root.innerHTML = `<div class="ds3d-error" role="alert"><strong>The 3D laboratory could not start.</strong><span></span><button type="button">Reload</button></div>`;
  const message = root.querySelector("span");
  if (message) message.textContent = error instanceof Error ? error.message : "Unknown startup error";
  root.querySelector("button")?.addEventListener("click", () => window.location.reload());
}
