/* ---------------------------------------------------------
   PRODUCT DATA
--------------------------------------------------------- */
const products = [
  {
    id: "gebuk-pantas",
    name: "Gebuk Pantas",
    version: "GP_LLN v1.0",
    diagram: "../images/gebuk-pantas-diagram.png"
  },
  {
    id: "gebuk-ketuk",
    name: "Gebuk Ketuk",
    version: "",
    diagram: "images/gebuk-ketuk-diagram.png"
  },
  {
    id: "gebuk-ofis",
    name: "Gebuk Ofis",
    version: "",
    diagram: "images/gebuk-ofis-diagram.png"
  }
];

/* ---------------------------------------------------------
   TOOLTIP: follow cursor
--------------------------------------------------------- */
document.querySelectorAll('.logo-wrap').forEach((wrap) => {
    const tooltip = wrap.querySelector('.tooltip');
    if (!tooltip) return;

    wrap.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.clientX + 'px';
        tooltip.style.top  = e.clientY + 'px';
    });
});

/* ---------------------------------------------------------
   BUILD RADIO BUTTONS
--------------------------------------------------------- */
const productList = document.getElementById("productList");

products.forEach((product, index) => {
  const wrapper = document.createElement("div");
  wrapper.className = "product-option";

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "product";
  radio.id = product.id;
  radio.value = product.id;
  radio.dataset.index = index;

  const label = document.createElement("label");
  label.htmlFor = product.id;
  label.textContent = product.name;

  if (product.version) {
    const versionSpan = document.createElement("span");
    versionSpan.className = "version";
    versionSpan.textContent = ` (${product.version})`;
    label.appendChild(versionSpan);
  }

  wrapper.appendChild(radio);
  wrapper.appendChild(label);
  productList.appendChild(wrapper);
});

/* ---------------------------------------------------------
   HANDLE SELECTION -> SHOW DIAGRAM
--------------------------------------------------------- */
const diagramBox = document.getElementById("diagramBox");
const diagramImage = document.getElementById("diagramImage");
const diagramPlaceholder = document.getElementById("diagramPlaceholder");

productList.addEventListener("change", (e) => {
  if (e.target.name !== "product") return;

  const selected = products[e.target.dataset.index];

  if (selected && selected.diagram) {
    diagramImage.src = selected.diagram;
    diagramImage.alt = `${selected.name} Operational Diagram`;
    diagramImage.style.display = "block";
    diagramPlaceholder.style.display = "none";

    diagramImage.onerror = () => {
      diagramImage.style.display = "none";
      diagramPlaceholder.style.display = "block";
      diagramPlaceholder.innerHTML = `<p>Diagram for <strong>${selected.name}</strong> not available yet.</p>`;
    };
  }
});