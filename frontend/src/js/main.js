import "/css/style.css";

const urlDomain = "http://localhost:3000";
const urlImagesDomain = "https://ibb.co";
const imageBackgroundUrl = "https://ibb.co/offers/backgrounds/";

const appContainer = document.getElementById("appContainer");
const loginArea = document.getElementById("loginArea");
const loginText = document.getElementById("loginText");
const inputLoginPassword = document.getElementById("inputLoginPassword");
const loginTrustedSwitch = document.getElementById("loginTrustedSwitch");
const loginButton = document.getElementById("loginButton");

const modalDialog = document.getElementById("modalDialog");
const modalOverlay = document.getElementById("modalOverlay");
const modalRemoveConfirmation = document.getElementById(
  "modalRemoveConfirmation"
);
const modalCloseBatchConfirmation = document.getElementById(
  "modalCloseBatchConfirmation"
);
const btnAddOffer = document.getElementById("btnAddOffer");
const btnListOffers = document.getElementById("btnListOffers");
const btnCloseBatch = document.getElementById("btnCloseBatch");
const btnListClosedBatches = document.getElementById("btnListClosedBatches");
const btnLogout = document.getElementById("btnLogout");
const listTitle = document.getElementById("listTitle");
const tableOffers = document.getElementById("tableOffers");
const tableBatches = document.getElementById("tableBatches");

const formOffer = document.getElementById("formOffer");
const formWarning = document.getElementById("formWarning");
const formFieldTitle = document.getElementById("formFieldTitle");
const formFieldStore = document.getElementById("formFieldStore");
const formFieldDescription = document.getElementById("formFieldDescription");
const formFieldBadge = document.getElementById("formFieldBadge");
const formFieldCode = document.getElementById("formFieldCode");
const formFieldType = document.getElementById("formFieldType");
const formFieldCategories = document.getElementById("formFieldCategories");
const formFieldUrl = document.getElementById("formFieldUrl");
const formFieldInputImageFile = document.getElementById(
  "formFieldInputImageFile"
);
const btnCancelOffer = document.getElementById("btnCancelOffer");
const btnCancelOfferRemoving = document.getElementById(
  "btnCancelOfferRemoving"
);
const btnSaveOffer = document.getElementById("btnSaveOffer");
const btnConfirmOfferRemoving = document.getElementById(
  "btnConfirmOfferRemoving"
);
const btnCancelCloseBatch = document.getElementById("btnCancelCloseBatch");
const btnConfirmCloseBatch = document.getElementById("btnConfirmCloseBatch");
const formFieldLabelImage = document.getElementById("formFieldLabelImage");
const formHeaderTitle = document.getElementById("formHeaderTitle");
const btnFillAmazon = document.getElementById("btnFillAmazon");
const btnChangeDescription = document.getElementById("btnChangeDescription");
const btnChangeImage = document.getElementById("btnChangeImage");
const btnChangeBackground = document.getElementById("btnChangeBackground");
const loadingIcon = document.getElementById("loadingIcon");

const backgroundImage = document.getElementById("backgroundImage");
const productImage = document.getElementById("productImage");
const formFieldInputImage = document.getElementById("formFieldInputImage");
const checkImageFile = document.getElementById("checkImageFile");

const btnCopyOffer = document.getElementById("btnCopyOffer");

let imageFile,
  selectedOfferId,
  apiKey,
  configs = { stores: null, categories: null, clipboard: null },
  amazonProduct,
  amazonDescriptionIndex = 0,
  amazonImageIndex = 0,
  imageBackgroundId = 1,
  imageBackground =
    imageBackgroundUrl +
    `background-${imageBackgroundId.toString().padStart(2, "0")}.png`,
  pendingOffers = [];

// modalDialog.addEventListener("keyup", escapeFromModalDialog);
btnAddOffer.addEventListener("click", addOfferForm);
formFieldInputImageFile.addEventListener("change", handleFile);
formFieldInputImageFile.addEventListener("click", handleFile);
btnSaveOffer.addEventListener("click", saveOffer);
btnSaveOffer.addEventListener("keypress", saveOffer);
btnCancelOffer.addEventListener("click", hideModalDialog);
btnCancelOffer.addEventListener("keypress", cancelOffer);
btnListOffers.addEventListener("click", listOffers);
btnCancelOfferRemoving.addEventListener("click", hideModalRemoveConfirmation);
btnConfirmOfferRemoving.addEventListener("click", removeOffer);
btnCloseBatch.addEventListener("click", closeBatchConfirmationDialog);
btnCancelCloseBatch.addEventListener("click", hideModalCloseBatchConfirmation);
btnConfirmCloseBatch.addEventListener("click", closeBatch);
btnListClosedBatches.addEventListener("click", listClosedBatches);
formFieldType.addEventListener("change", setCodefield);

loginButton.addEventListener("click", submitApiKey);
inputLoginPassword.addEventListener("keyup", submitApiKey);
btnLogout.addEventListener("click", logout);

// scrap Amazon
btnFillAmazon.addEventListener("click", getAmazonProduct);
formFieldUrl.addEventListener("keyup", validateAmazon);
btnChangeDescription.addEventListener("click", changeDescription);
btnChangeImage.addEventListener("click", changeImage);
btnChangeBackground.addEventListener("click", changeBackground);
formFieldStore.addEventListener("change", clearAmazonData);
formFieldInputImage.addEventListener("input", changeImage);
checkImageFile.addEventListener("change", changeImageMethod);

// clipboard copy
btnCopyOffer.addEventListener("click", copyOfferToClipboard);

function startUp() {
  apiKey = localStorage.getItem("APIKEY");
  if (apiKey) {
    listOffers();
  } else {
    showLogin(true);
  }
  // showModalDialog(); // testing...
  changeBackground();
}

async function getConfigs() {
  if (!apiKey) {
    showLogin(true);
    return;
  }

  fetch(`${urlDomain}/configs?apiKey=${apiKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        populateConfigs(JSON.parse(data));
        formFieldCategoriesSelector();
      }
    })
    .catch(function (err) {
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
    });
}

function populateConfigs(data) {
  configs.stores = data.stores;
  configs.categories = data.categories;
  configs.clipboard = data.clipboard;

  formFieldStore.innerHTML = `<option hidden>Loja</option>`;
  for (const store of configs.stores) {
    const newStoreOption = document.createElement("option");
    newStoreOption.value = store.description;
    newStoreOption.textContent = store.description;
    formFieldStore.appendChild(newStoreOption);
  }

  formFieldCategories.innerHTML = null;
  for (const category of configs.categories) {
    const newCategoryOption = document.createElement("option");
    newCategoryOption.value = category.description;
    newCategoryOption.textContent = category.description;
    formFieldCategories.appendChild(newCategoryOption);
  }
}

function setCodefield(e) {
  if (e.target.selectedIndex != 1) {
    formFieldCode.value = null;
    formFieldCode.disabled = true;
    formFieldCode.classList.add("bg-gray-300");
  } else {
    formFieldCode.disabled = false;
    formFieldCode.classList.remove("bg-gray-300");
  }
}

function formFieldCategoriesSelector() {
  for (const option of formFieldCategories.options) {
    option.addEventListener("mousedown", (e) => {
      // e.preventDefault();
      // option.selected = !option.selected;
      // return false;
    });
  }
}

function submitApiKey(e) {
  if (
    (e &&
      e.key &&
      (e.key == "Enter" || e.keyCode == 13) &&
      inputLoginPassword.value) ||
    e.target.id == "loginButton"
  ) {
    apiKey = inputLoginPassword.value;
    if (loginTrustedSwitch.checked) {
      localStorage.setItem("APIKEY", `${apiKey}`);
    } else {
    }
    listOffers();
  }
}

function logout() {
  localStorage.removeItem("APIKEY");
  window.location.reload();
}

function showLogin(show) {
  if (show) {
    loginArea.classList.remove("hidden");
    appContainer.classList.add("hidden");
    inputLoginPassword.focus();
  } else {
    loginArea.classList.add("hidden");
    appContainer.classList.remove("hidden");
  }
}

function showModalDialog() {
  modalOverlay.classList.remove("hidden");
  modalDialog.classList.remove("hidden");
  modalDialog.focus();
}

function escapeFromModalDialog(e) {
  if (e && e.key && (e.key == "Escape" || e.keyCode == 27)) {
    hideModalDialog();
  }
}

function cancelOffer(e) {
  if (e && e.key && e.key != "Enter" && e.keyCode != 13) {
    hideModalDialog();
  }
}

function hideModalDialog(e) {
  modalOverlay.classList.add("hidden");
  modalDialog.classList.add("hidden");
  formWarningHide();
  imageFile = null;
  selectedOfferId = null;
  formOffer.reset();
  formFieldLabelImage.classList.remove("font-bold");
  formFieldLabelImage.textContent = "Imagem";
  hideModalRemoveConfirmation();
  hideModalCloseBatchConfirmation();
  clearAmazonData("clear");
}

function showModalRemoveConfirmation() {
  modalOverlay.classList.remove("hidden");
  modalRemoveConfirmation.classList.remove("hidden");
  modalRemoveConfirmation.classList.add("flex");
}

function hideModalRemoveConfirmation() {
  modalOverlay.classList.add("hidden");
  modalRemoveConfirmation.classList.add("hidden");
  modalRemoveConfirmation.classList.remove("flex");
}

function addOfferForm() {
  formFieldType.selectedIndex = 2;
  formFieldCode.disabled = true;
  formFieldCode.classList.add("bg-gray-300");
  formHeaderTitle.classList.remove("text-orange-500");
  formHeaderTitle.classList.add("text-blue-500");
  formHeaderTitle.textContent = "Nova oferta";
  productImage.src = "";
  backgroundImage.src = imageBackground;
  imageFile = null;
  showModalDialog();
}

function formWarningShow() {
  formWarning.classList.remove("hidden");
}

function formWarningHide() {
  resetInvalidFormFields();
  formWarning.classList.add("hidden");
}

function highlightInvalidFormFields() {
  const redOutline = "border-red-500";
  if (!formFieldTitle.value) formFieldTitle.classList.add(redOutline);
  if (!formFieldStore.selectedIndex > 0)
    formFieldStore.classList.add(redOutline);
  if (!formFieldDescription.value)
    formFieldDescription.classList.add(redOutline);
  if (!formFieldType.selectedIndex > 0) formFieldType.classList.add(redOutline);
  if (
    (formFieldType.options[formFieldType.selectedIndex].value == "code" &&
      !formFieldCode.value) ||
    (formFieldType.options[formFieldType.selectedIndex].value != "code" &&
      formFieldCode.value)
  ) {
    formFieldCode.classList.add(redOutline);
  }
  if (!formFieldCategories.selectedOptions.length > 0)
    formFieldCategories.classList.add(redOutline);
  if (!formFieldUrl.value) formFieldUrl.classList.add(redOutline);
  if (checkImageFile.checked) {
    if (!imageFile) {
      formFieldInputImageFile.classList.add(redOutline);
    }
  } else if (!formFieldInputImage.value) {
    formFieldInputImage.classList.add(redOutline);
  }
}

function resetInvalidFormFields() {
  const redOutline = "border-red-500";
  formFieldTitle.classList.remove(redOutline);
  formFieldStore.classList.remove(redOutline);
  formFieldDescription.classList.remove(redOutline);
  formFieldType.classList.remove(redOutline);
  formFieldCode.classList.remove(redOutline);
  formFieldCategories.classList.remove(redOutline);
  formFieldUrl.classList.remove(redOutline);
  formFieldInputImage.classList.remove(redOutline);
  formFieldInputImageFile.classList.remove(redOutline);
}

function checkForm() {
  if (
    !formFieldTitle.value ||
    !formFieldStore.selectedIndex > 0 ||
    !formFieldDescription.value ||
    !formFieldType.selectedIndex > 0 ||
    (formFieldType.options[formFieldType.selectedIndex].value == "code" &&
      !formFieldCode.value) ||
    (formFieldType.options[formFieldType.selectedIndex].value != "code" &&
      formFieldCode.value) ||
    !formFieldCategories.selectedOptions.length > 0 ||
    !formFieldUrl.value ||
    (checkImageFile.checked && !imageFile) ||
    (!checkImageFile.checked && !formFieldInputImage.value)
  ) {
    resetInvalidFormFields();
    highlightInvalidFormFields();
    formWarningShow();
    return false;
  }
  formWarningHide();
  return true;
}

function saveOffer(e) {
  if (e && e.key && (e.key == "Enter" || e.keyCode == 13)) {
    e.preventDefault();
    btnSaveOffer.click();
    return;
  }
  if (!checkForm()) return;

  let selectedOffer = {};

  selectedOffer.id = selectedOfferId ? selectedOfferId : null;
  selectedOffer.title = formFieldTitle.value;
  selectedOffer.description = formFieldDescription.value;
  selectedOffer.badge = formFieldBadge.value
    ? formFieldBadge.value
    : "Melhor Oferta";
  selectedOffer.type = formFieldType.options[formFieldType.selectedIndex].value;
  selectedOffer.code = formFieldCode.value ? formFieldCode.value : null;
  selectedOffer.store =
    formFieldStore.options[formFieldStore.selectedIndex].value;
  selectedOffer.categories =
    '"' +
    Array.from(formFieldCategories.selectedOptions).map(
      (option) => option.value
    ) +
    '"';
  selectedOffer.locations = null;
  selectedOffer.url = formFieldUrl.value;
  selectedOffer.valid_till = null;
  selectedOffer.priority = 0;
  selectedOffer.notes = null;
  selectedOffer.image_file = checkImageFile.checked ? imageFile : null;
  selectedOffer.imageBackground = !checkImageFile.checked
    ? imageBackground
    : null;
  selectedOffer.imageUrl =
    !checkImageFile.checked &&
    amazonProduct.imageUrls &&
    amazonProduct.imageUrls.length > 0
      ? amazonProduct.imageUrls[amazonImageIndex]
      : null;

  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(selectedOffer);
  const query = selectedOfferId ? "update" : "add";
  let requestOptions = {
    method: selectedOfferId ? "PUT" : "POST",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };
  fetch(`${urlDomain}/${query}?apiKey=${apiKey}`, requestOptions)
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        logout();
        showLogin(true);
        return false;
      }
      hideModalDialog();
      listOffers();
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
      formWarningShow();
    });
}

function listOffers() {
  if (!apiKey) {
    showLogin(true);
    return;
  }

  headerMessage("Ofertas adicionadas ao lote atual", false);

  fetch(`${urlDomain}/active?apiKey=${apiKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        tableOffers.classList.remove("hidden");
        tableBatches.classList.add("hidden");
        if (data.length > 0) {
          headerMessage(
            `Ofertas adicionadas ao lote atual: ${data.length}`,
            false
          );
          pendingOffers = [];
          for (const item of data) {
            pendingOffers.push(item);
          }
          createTable(pendingOffers);
          hideModalDialog();
        } else {
          createTableEmpty();
        }
        if (!configs.stores || !configs.categories) {
          getConfigs();
        }
      }
    })
    .catch(function (err) {
      headerMessage("Erro na consulta, tente mais tarde.", true);
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
    });
}

function removeOfferConfirmationDialog(e) {
  e.stopPropagation();
  showModalRemoveConfirmation();

  if (e.target.tagName == "svg") {
    selectedOfferId =
      e.target.parentElement.parentElement.querySelector(
        '[title="id"]'
      ).textContent;
  }
  if (e.target.tagName == "path") {
    selectedOfferId =
      e.target.parentElement.parentElement.parentElement.querySelector(
        '[title="id"]'
      ).textContent;
  }
}

function closeBatchConfirmationDialog() {
  if (
    tableOffers.querySelector("tbody").children.length > 0 &&
    tableOffers.querySelector("tbody").children[0].children[1] &&
    tableOffers.querySelector("tbody").children[0].children[1].title == "id"
  ) {
    showModalCloseBatchConfirmation();
  }
}

function showModalCloseBatchConfirmation() {
  modalOverlay.classList.remove("hidden");
  modalCloseBatchConfirmation.classList.remove("hidden");
  modalCloseBatchConfirmation.classList.add("flex");
}

function hideModalCloseBatchConfirmation() {
  modalOverlay.classList.add("hidden");
  modalCloseBatchConfirmation.classList.add("hidden");
  modalCloseBatchConfirmation.classList.remove("flex");
}

function closeBatch() {
  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const query = "batch";
  let requestOptions = {
    method: "POST",
    headers: defaultHeader,
    redirect: "follow",
  };
  btnCancelCloseBatch.textContent = "Fechar";
  btnConfirmCloseBatch.disabled = true;
  btnConfirmCloseBatch.classList.add("hidden");
  fetch(`${urlDomain}/${query}?apiKey=${apiKey}`, requestOptions)
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        logout();
        showLogin(true);
        return false;
      }
      btnCancelCloseBatch.textContent = "Cancelar";
      btnConfirmCloseBatch.disabled = false;
      btnConfirmCloseBatch.classList.remove("hidden");
      hideModalCloseBatchConfirmation();
      listClosedBatches();
      getConfigs();
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
      headerMessage("Erro no Processamento, tente mais tarde.", true);
      btnCancelCloseBatch.textContent = "Cancelar";
      btnConfirmCloseBatch.disabled = false;
      btnConfirmCloseBatch.classList.remove("hidden");
      hideModalCloseBatchConfirmation();
      formWarningShow();
    });
}

function headerMessage(message, danger) {
  if (danger) {
    listTitle.classList.add("text-red-500");
  } else {
    listTitle.classList.remove("text-red-500");
  }
  listTitle.textContent = message;
}

function listClosedBatches() {
  tableOffers.classList.add("hidden");
  tableBatches.classList.remove("hidden");
  listTitle.textContent = "Últimos arquivos de lote fechados";

  fetch(`${urlDomain}/uploaded?apiKey=${apiKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        loginField.value = "";
        logout();
        showLogin(true);
        return false;
      } else {
        if (data.length > 0) {
          data = data.match(/(?<=name\":\").*?(?=\".\"type\")/g);
          if (data) {
            data.sort();
            data.reverse();
            createTableBatches(data);
          } else {
            createTableEmptyBatches();
          }
        } else {
          createTableEmptyBatches();
        }
      }
    })
    .catch(function (err) {
      headerMessage("Erro no Processamento, tente mais tarde.", true);
      console.log("Something went wrong!", err);
    });
}

function removeOffer() {
  let selectedOffer = {};
  selectedOffer.id = selectedOfferId;

  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(selectedOffer);
  const query = "delete";
  let requestOptions = {
    method: "DELETE",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };
  fetch(`${urlDomain}/${query}?apiKey=${apiKey}`, requestOptions)
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        logout();
        showLogin(true);
        return false;
      }
      hideModalRemoveConfirmation();
      listOffers();
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
      formWarningShow();
    });
}

function editOffer(e) {
  e.stopPropagation();

  formHeaderTitle.classList.remove("text-blue-500");
  formHeaderTitle.classList.add("text-orange-500");
  formHeaderTitle.textContent = "Editar oferta";

  let selectedRowElement;
  if (e.target.tagName == "svg") {
    selectedRowElement = e.target.parentElement.parentElement;
    selectedOfferId =
      e.target.parentElement.parentElement.querySelector(
        '[title="id"]'
      ).textContent;
  }
  if (e.target.tagName == "path") {
    selectedRowElement = e.target.parentElement.parentElement.parentElement;
    selectedOfferId =
      e.target.parentElement.parentElement.parentElement.querySelector(
        '[title="id"]'
      ).textContent;
  }

  formFieldTitle.value =
    selectedRowElement.querySelector('[title="title"]').textContent;
  formFieldStore.value =
    selectedRowElement.querySelector('[title="store"]').textContent;
  formFieldDescription.value = selectedRowElement.querySelector(
    '[title="description"]'
  ).textContent;
  formFieldBadge.value =
    selectedRowElement.querySelector('[title="badge"]').textContent;
  if (
    selectedRowElement.querySelector('[title="type"]').textContent == "Código"
  ) {
    formFieldType.selectedIndex = 1;
    formFieldCode.disabled = false;
    formFieldCode.classList.remove("bg-gray-300");
  } else {
    formFieldType.selectedIndex = 2;
    formFieldCode.disabled = true;
    formFieldCode.classList.add("bg-gray-300");
  }
  formFieldCode.value =
    selectedRowElement.querySelector('[title="code"]').textContent == "null"
      ? ""
      : selectedRowElement.querySelector('[title="code"]').textContent;
  formFieldUrl.value =
    selectedRowElement.querySelector('[title="url"]').textContent;
  validateAmazon();
  const categories = selectedRowElement
    .querySelector('[title="categories"]')
    .textContent.replace(/"/g, "")
    .split(",");
  for (const option of formFieldCategories.options) {
    for (const category of categories) {
      if (option.textContent == category) {
        option.selected = true;
      }
    }
  }

  imageFile = selectedRowElement.querySelector(
    '[title="image_file"]'
  ).textContent;
  if (imageFile) {
    formFieldLabelImage.textContent = `Imagem existente. Escolha outra se necessário.`;
  } else {
    formFieldLabelImage.textContent = `Imagem inexistente. Escolha uma.`;
  }
  formFieldLabelImage.classList.add("font-bold");

  backgroundImage.src = imageFile;
  productImage.src = "";

  showModalDialog();
}

function createTable(offers) {
  let tableBody = tableOffers.querySelector("tbody");
  tableBody.innerHTML = null;

  offers.forEach(function (offer) {
    const row = document.createElement("tr");
    row.className =
      "bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100";

    let cellEditButton = document.createElement("td");
    cellEditButton.className =
      "text-sm flex justify-center text-gray-900 font-light px-6 py-4 whitespace-nowrap";
    cellEditButton.innerHTML = `<svg class="cursor-pointer h-5 fill-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z"/></svg>`;
    row.appendChild(cellEditButton);
    cellEditButton.querySelector("svg").addEventListener("click", editOffer);
    cellEditButton.querySelector("path").addEventListener("click", editOffer);

    Object.keys(offer).forEach(function (key) {
      var cell = document.createElement("td");
      if (
        key != "title" &&
        key != "badge" &&
        key != "type" &&
        key != "store" &&
        key != "categories"
      )
        cell.hidden = true;
      cell.title = key;
      cell.className =
        "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap";
      if (key == "type") {
        let typeValue;
        typeValue = offer[key] == "code" ? "Código" : "Oferta";
        cell.appendChild(document.createTextNode(typeValue));
      } else {
        cell.appendChild(document.createTextNode(offer[key]));
      }
      row.appendChild(cell);
    });

    let cellRemoveButton = document.createElement("td");
    cellRemoveButton.className =
      "text-sm flex justify-center text-gray-900 font-light px-6 py-4 whitespace-nowrap";
    cellRemoveButton.innerHTML =
      '<svg class="cursor-pointer h-5 fill-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"/></svg>';
    row.appendChild(cellRemoveButton);
    cellRemoveButton
      .querySelector("svg")
      .addEventListener("click", removeOfferConfirmationDialog);
    cellRemoveButton
      .querySelector("path")
      .addEventListener("click", removeOfferConfirmationDialog);

    tableBody.appendChild(row);
  });

  tableOffers.appendChild(tableBody);
}

async function createTableBatches(tableData) {
  const tableBody = tableBatches.querySelector("tbody");
  tableBody.innerHTML = null;
  for (let i = 0; i < tableData.length; i++) {
    if (i >= 100) break;
    const row = document.createElement("tr");
    if (i == 0) {
      row.className =
        "bg-green-300 border-b border-white font-bold transition duration-300 ease-in-out hover:bg-green-400";
    } else {
      row.className =
        "bg-green-100 border-b border-white transition duration-300 ease-in-out hover:bg-green-200";
    }

    let cell = document.createElement("td");
    if (i == 0) {
      cell.className =
        "text-center px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-800";
    } else {
      cell.className =
        "text-center px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800";
    }
    let aLink = document.createElement("a");
    aLink.href = `${urlImagesDomain}/offers/csv/${tableData[i]}`;
    aLink.textContent =
      "CSV - " +
      tableData[i].substring(8, 10) +
      "/" +
      tableData[i].substring(5, 7) +
      "/" +
      tableData[i].substring(0, 4) +
      " - " +
      tableData[i].substring(11, 13) +
      ":" +
      tableData[i].substring(14, 16) +
      ":" +
      tableData[i].substring(17, 19);
    cell.appendChild(aLink);
    row.appendChild(cell);
    tableBody.appendChild(row);
    if (i == 0) {
      const rowBlank = document.createElement("tr");
      rowBlank.className = "bg-white border-b border-white";
      const cellBlank = document.createElement("td");
      cellBlank.className = "py-2 whitespace-nowrap";
      rowBlank.appendChild(cellBlank);
      tableBody.appendChild(rowBlank);
    }
  }
  tableBatches.appendChild(tableBody);
}

function createTableEmpty() {
  listTitle.textContent = "Ofertas adicionadas ao lote atual";
  let tableBody = tableOffers.querySelector("tbody");
  tableBody.innerHTML = null;

  const row = document.createElement("tr");
  row.className =
    "bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100";

  let cellEditButton = document.createElement("td");
  cellEditButton.className =
    "text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800";
  cellEditButton.innerHTML = "Não há resultados para exibir";
  cellEditButton.colSpan = "7";
  row.appendChild(cellEditButton);

  tableBody.appendChild(row);
}

function createTableEmptyBatches() {
  headerMessage("Últimos arquivos de lote fechados", false);
  let tableBody = tableBatches.querySelector("tbody");
  tableBody.innerHTML = null;

  const row = document.createElement("tr");
  row.className =
    "bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100";

  let cellEditButton = document.createElement("td");
  cellEditButton.className =
    "text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800";
  cellEditButton.innerHTML = "Não há resultados para exibir";
  cellEditButton.colSpan = "6";
  row.appendChild(cellEditButton);

  tableBody.appendChild(row);
}

function handleFile(e) {
  if (e.type == "click") {
    imageFile = null;
    backgroundImage.src = "";
    productImage.src = "";
    formFieldLabelImage.textContent = "Imagem";
    formFieldLabelImage.classList.remove("font-bold");
  } else {
    imageFile = null;
    backgroundImage.src = "";
    productImage.src = "";
    formFieldLabelImage.textContent = "Imagem";
    formFieldLabelImage.classList.remove("font-bold");
    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      let fileReader = new FileReader();

      fileReader.onloadend = () => {
        imageFile = fileReader.result;
        backgroundImage.src = imageFile;
        productImage.src = "";
      };

      fileReader.readAsDataURL(file);
    }
  }
}

function validateAmazon() {
  if (
    formFieldUrl.value.indexOf("/amzn.") >= 0 ||
    formFieldUrl.value.indexOf("amazon.com") >= 0
  ) {
    btnFillAmazon.classList.remove("hidden");

    return true;
  } else {
    if (!btnFillAmazon.classList.contains("hidden")) {
      btnFillAmazon.classList.add("hidden");
    }

    return false;
  }
}

function getAmazonProduct(e) {
  e.preventDefault();
  if (validateAmazon()) {
    loadingIcon.classList.remove("hidden");
    fetch(
      `${urlDomain}/amazonproduct?apiKey=${apiKey}&url=${formFieldUrl.value}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length > 0 && data[0] == "password") {
          loginText.innerHTML = "Senha inválida!";
          loginText.classList.add("text-red-500");
          loginField.value = "";
          logout();
          showLogin(true);
          return false;
        } else {
          if (data.length > 0) {
            amazonProduct = JSON.parse(data);
            fillFormAmazon();
          }
        }
        !loadingIcon.classList.contains("hidden")
          ? loadingIcon.classList.add("hidden")
          : null;
      })
      .catch(function (err) {
        headerMessage("Erro no Processamento, tente mais tarde.", true);
        console.log("Something went wrong!", err);
        !loadingIcon.classList.contains("hidden")
          ? loadingIcon.classList.add("hidden")
          : null;
      });
  }
}

async function fillFormAmazon() {
  formFieldStore.selectedIndex = 1;
  amazonDescriptionIndex = 0;
  amazonImageIndex = 0;
  if (
    amazonProduct &&
    amazonProduct.descriptions &&
    amazonProduct.descriptions.length > 1
  ) {
    btnChangeDescription.classList.remove("hidden");
    formFieldDescription.classList.remove("pr-2");
    formFieldDescription.classList.add("pr-10");
  } else {
    btnChangeDescription.classList.add("hidden");
    formFieldDescription.classList.remove("pr-10");
    formFieldDescription.classList.add("pr-2");
  }
  if (
    amazonProduct &&
    amazonProduct.imageUrls &&
    amazonProduct.imageUrls.length > 1 &&
    !checkImageFile.checked
  ) {
    btnChangeImage.classList.remove("hidden");
  } else {
    btnChangeImage.classList.add("hidden");
  }
  formFieldTitle.value = amazonProduct.title.substring(0, 50);
  formFieldBadge.value =
    "R$ " +
    Number.parseFloat(amazonProduct.price.value).toLocaleString("pt-br", {
      style: "decimal",
      minimumIntegerDigits: 1,
      minimumFractionDigits: 2,
    });
  formFieldDescription.value = amazonProduct.price.sns
    ? `${configs.clipboard[1].content}

${amazonProduct.descriptions[amazonDescriptionIndex].substring(0, 8500)}`
    : amazonProduct.descriptions[amazonDescriptionIndex].substring(0, 8500);
  formFieldInputImage.value =
    amazonProduct.imageUrls &&
    amazonProduct.imageUrls.length > 0 &&
    !checkImageFile.checked
      ? amazonProduct.imageUrls[0]
      : "";
  imageFile = null;
  productImage.src = formFieldInputImage.value;
}

function changeDescription(e) {
  e.preventDefault();
  if (
    amazonProduct &&
    amazonProduct.descriptions &&
    amazonProduct.descriptions.length > 0
  ) {
    if (amazonDescriptionIndex > 0) {
      amazonDescriptionIndex = 0;
    } else {
      amazonDescriptionIndex = 1;
    }
    formFieldDescription.value = amazonProduct.price.sns
      ? `${configs.clipboard[1].content}

${amazonProduct.descriptions[amazonDescriptionIndex].substring(0, 8500)}`
      : amazonProduct.descriptions[amazonDescriptionIndex].substring(0, 8500);
  }
}

function changeImage(e) {
  if (e.type == "click") {
    e.preventDefault();
    if (
      amazonProduct &&
      amazonProduct.imageUrls &&
      amazonProduct.imageUrls.length > 0
    ) {
      if (amazonImageIndex >= amazonProduct.imageUrls.length - 1) {
        amazonImageIndex = 0;
      } else {
        amazonImageIndex++;
      }
      formFieldInputImage.value = amazonProduct.imageUrls[amazonImageIndex];
    }
  }
  backgroundImage.src = imageBackground;
  productImage.src = formFieldInputImage.value;
  formFieldLabelImage.textContent = "Imagem";
  formFieldLabelImage.classList.remove("font-bold");
}

function changeBackground(e) {
  if (e) {
    e.preventDefault();
  }
  if (imageBackgroundId >= 4) {
    imageBackgroundId = 1;
  } else {
    imageBackgroundId++;
  }
  imageBackground =
    imageBackgroundUrl +
    `background-${imageBackgroundId.toString().padStart(2, "0")}.png`;
  backgroundImage.src = imageBackground;
}

function changeImageMethod(e) {
  if (e.target.checked) {
    btnChangeBackground.classList.add("hidden");
    formFieldInputImage.classList.add("hidden");
    formFieldInputImageFile.classList.remove("hidden");
    btnChangeImage.classList.add("hidden");
    backgroundImage.src = imageFile ? imageFile : "";
    productImage.src = "";
  } else {
    btnChangeBackground.classList.remove("hidden");
    formFieldInputImage.classList.remove("hidden");
    formFieldInputImageFile.classList.add("hidden");
    if (amazonProduct && amazonProduct.imageUrls) {
      btnChangeImage.classList.remove("hidden");
    }
    backgroundImage.src = imageBackground;
    productImage.src = formFieldInputImage.value;
  }
}

function clearAmazonData(e) {
  if (
    (e.target && e.target.options[e.target.selectedIndex].value != "Amazon") ||
    e == "clear"
  ) {
    amazonProduct = null;
    amazonDescriptionIndex = 0;

    btnChangeDescription.classList.add("hidden");
    formFieldDescription.classList.remove("pr-10");
    formFieldDescription.classList.add("pr-2");
    btnFillAmazon.classList.add("hidden");
    btnChangeImage.classList.add("hidden");
  }
  formFieldInputImage.classList.remove("hidden");
  !formFieldInputImageFile.classList.contains("hidden")
    ? formFieldInputImageFile.classList.add("hidden")
    : null;
}

async function copyOfferToClipboard() {
  if (!btnAddOffer.classList.contains("animate-pulse"))
    btnCopyOffer.classList.add("animate-pulse");
  setTimeout(() => {
    btnCopyOffer.classList.remove("animate-pulse");
  }, 1000);

  const clipboardText1 = configs.clipboard[0].content
    ? `${configs.clipboard[0].content}

`
    : "";

  const clipboardText2 = `*${formFieldTitle.value}*
>>>>>> ${formFieldBadge.value} <<<<<<

${formFieldUrl.value}
`;
  const clipboardText3 =
    amazonProduct && amazonProduct.price.sns
      ? `
${configs.clipboard[1].content}
`
      : "";
  const clipboardText4 = configs.clipboard[2].content
    ? `
${configs.clipboard[2].content}
`
    : "";

  const clipboardText = `${clipboardText1}${clipboardText2}${clipboardText3}${clipboardText4}`;

  navigator.clipboard.writeText(clipboardText);
}

startUp();
