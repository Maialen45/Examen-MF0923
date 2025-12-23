const apiUrl = "https://694a4f401282f890d2d84336.mockapi.io/api/producto";

function loadProducts() {
  document.getElementById("server-cards").innerHTML = "";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        data.forEach((product) => {
          const card = `
              <div class="card" id="${product.id}">
                <h5 class="card-title">${product.servidor}</h5>
                <p><strong>CPU:</strong> ${product.cpu}</p>
                <p><strong>RAM:</strong> ${product.ram}</p>
                <p><strong>Almacenamiento:</strong> ${product.almacenamiento}</p>
                <p><strong>Precio Total:</strong> ${product.precio}€</p>
                <button class="btn-delete" onclick="deleteProduct('${product.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `;
          document.getElementById("server-cards").innerHTML += card;
        });
      } else {
        document.getElementById("server-cards").innerHTML =
          "<p>No hay productos disponibles.</p>";
      }
    })
    .catch((error) => {
      document.getElementById("server-cards").innerHTML =
        "<p>No se pudo cargar los servidores.</p>";
    });
}

loadProducts()

let totalPrice = 0;

function calculateTotal() {
  const cpu = document.getElementById("cpu");
  const ram = document.getElementById("ram");
  const almacenamiento = document.getElementById("almacenamiento");

  const cpuValue = cpu.value.split("|");
  const ramValue = ram.value.split("|");
  const almacenamientoValue = almacenamiento.value.split("|");

  const cpuName = cpuValue[1] || "Ninguno";
  const ramName = ramValue[1] || "Ninguno";
  const almacenamientoName = almacenamientoValue[1] || "Ninguno";

  const cpuPrice = parseInt(cpuValue[0]) || 0;
  const ramPrice = parseInt(ramValue[0]) || 0;
  const storagePrice = parseInt(almacenamientoValue[0]) || 0;

  totalPrice = cpuPrice + ramPrice + storagePrice;

  const totalPriceText = document.getElementById("total-price-text");
  if (totalPriceText) {
    totalPriceText.textContent = `Precio total: ${totalPrice}€`;
  }

  const cpuNameText = document.getElementById("cpu-name");
  const ramNameText = document.getElementById("ram-name");
  const storageNameText = document.getElementById("storage-name");

  if (cpuNameText) cpuNameText.textContent = `CPU: ${cpuName}`;
  if (ramNameText) ramNameText.textContent = `RAM: ${ramName}`;
  if (storageNameText)
    storageNameText.textContent = `Almacenamiento: ${almacenamientoName}`;

  const submitButton = document.querySelector("button[type='submit']");
  if (totalPrice > 700) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}

document.getElementById("cpu").addEventListener("change", calculateTotal);
document.getElementById("ram").addEventListener("change", calculateTotal);
document
  .getElementById("almacenamiento")
  .addEventListener("change", calculateTotal);

calculateTotal();

document
  .getElementById("server-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const servidor = document.getElementById("servidor").value;
    const cpu = document.getElementById("cpu").value.split("|")[1];
    const ram = document.getElementById("ram").value.split("|")[1];
    const almacenamiento = document
      .getElementById("almacenamiento")
      .value.split("|")[1];
    const newServer = {
      servidor: servidor,
      cpu: cpu,
      ram: ram,
      almacenamiento: almacenamiento,
      precio: totalPrice,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newServer),
    })
      .then((response) => response.json())
      .then((data) => {
        const card = `
          <div class="card" id="${data.id}">
            <h5 class="card-title">${data.servidor}</h5>
            <p><strong>CPU:</strong> ${data.cpu}</p>
            <p><strong>RAM:</strong> ${data.ram}</p>
            <p><strong>Almacenamiento:</strong> ${data.almacenamiento}</p>
            <p><strong>Precio Total:</strong> ${data.precio}€</p>
            <button class="btn-delete" onclick="deleteProduct('${data.id}')">
                  <i class="fas fa-trash"></i> 
                </button>
          </div>
        `;
        document.getElementById("server-cards").innerHTML += card;

        document.getElementById("server-form").reset();
        calculateTotal();
      })
      .catch((error) => {
      });
  });

function deleteProduct(id) {
  const cardToDelete = document.getElementById(id);
  if (cardToDelete) {
    cardToDelete.remove();
  } 

  fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .catch((error) => {
    });
}
