const btnsStepers = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");
const headerTitle = document.getElementById("page-title");
const headerSubTitle = document.getElementById("page-subtitle");
const form = document.getElementById("event-form");
const variantRowList = document.getElementById("variants-list");
const btnAddVariant = document.getElementById("btn-add-variant");
const formErrors = document.getElementById("form-errors");
const eventsTable = document.getElementById("events-table");
const eventsPagination = document.getElementById("events-pagination");
const eventModal = document.getElementById("event-modal");
const searchEventsInput = document.getElementById("search-events");
const sortEventsSelection = document.getElementById("sort-events");
const modalBody = document.getElementById("modal-body");
const modalTitle = document.getElementById("modal-title");
const archiveTable = document.getElementById("archive-table");

//form inputs
const eventTitle = document.getElementById("event-title");
const eventImg = document.getElementById("event-image");
const eventDescription = document.getElementById("event-description");
const eventSeats = document.getElementById("event-seats");
const eventPrice = document.getElementById("event-price");

const sortEnum = {
    asc: true,
    desc: false
}

let id;
let editMode = false;
let editEventId = null;
// Your app's data structure
let events = [];
let archive = [];
// ============================================
// DATA MANAGEMENT
// ============================================

//titles and subtitles of the header
const headerTitles = {
    stats: {
        title: "Statistics",
        subTitle: "Overview of your events"
    },

    add: {
        title: "Add Event",
        subTitle: "Create and schedule a new event"
    },

    list: {
        title: "Events",
        subTitle: "Manage your upcoming and active events"
    },

    archive: {
        title: "Archive",
        subTitle: "View your past and completed events"
    }
}

// Save/load from localStorage
function loadData() {
    const savedEvents = localStorage.getItem("events");
    const savedArchive = localStorage.getItem("archive");
    try {
        events = savedEvents ? JSON.parse(savedEvents) : [];
        archive = savedArchive ? JSON.parse(savedArchive) : [];
    } catch (error) {
        console.error("error loading data",);
        events = [];
        archive = [];
    }
    //get the last id
    let lastSavedEventsId = events.length > 0 ? Number(events[events.length - 1].id) : 0;
    let lasrSavedArchiveId = archive.length > 0 ? Number(archive[archive.length - 1].id) : 0;
    id = Math.max(lastSavedEventsId, lasrSavedArchiveId) + 1;
}

function saveData() {
    try {
        localStorage.setItem("events", JSON.stringify(events));
        localStorage.setItem("archive", JSON.stringify(archive));
    } catch (error) {
        console.error("error saving data");
    }
}

// ============================================
// SCREEN SWITCHING
// ============================================

function switchScreen(screenId) {
    for (const btn of btnsStepers) {
        btn.classList.remove("is-active");

        if (btn.dataset.screen == `${screenId}`) {
            btn.classList.add("is-active");
        }
    }
    for (const screen of screens) {
        screen.classList.remove("is-visible");
        if (screen.dataset.screen == `${screenId}`) {
            screen.classList.add("is-visible");
        }
    }
    headerTitle.textContent = headerTitles[screenId].title;
    headerSubTitle.textContent = headerTitles[screenId].subTitle;
}

btnsStepers.forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen))
})

// ============================================
// STATISTICS SCREEN
// ============================================

function turnNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderStats() {

    const totalEvents = events.length;
    const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);

    try {
        document.getElementById('stat-total-events').textContent = turnNumberWithCommas(totalEvents);
        document.getElementById('stat-total-seats').textContent = turnNumberWithCommas(totalSeats);
        document.getElementById('stat-total-price').textContent = '$' + turnNumberWithCommas(totalPrice.toFixed(2));
    } catch (error) {
        console.error("error to update the statistic data");
    }
}

// ============================================
// ADD EVENT FORM
// ============================================

//image url validation
function isValidImageUrl(url) {
    return /^https?:\/\/[^?]+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?(#.*)?$/i.test(url);
}

function handleFormSubmit(e) {
    formErrors.innerHTML = "";
    e.preventDefault();
    const eventVariants = document.querySelectorAll(".variant-row");

    let isValid = true;

    //validation title
    if (eventTitle.value.trim() === "") {
        formErrors.innerHTML += `<span>the title is empty</br> </span>`;
        isValid = false;
    }

    //validation image url
    if (!isValidImageUrl(eventImg.value)) {
        formErrors.innerHTML += `<span>the url is invalid</br> </span>`;
        isValid = false;
    }

    //velidation discreption
    if (eventDescription.value.trim() === "") {
        formErrors.innerHTML += `<span>the Description is empty</br> </span>`;
        isValid = false;
    }

    //validation Seats
    if (Number(eventSeats.value) <= 0) {
        formErrors.innerHTML = `<span>the Seats must be Positive</br> </span>`;
        isValid = false;
    }

    //validation Price
    if (Number(eventPrice.value) <= 0) {
        formErrors.innerHTML = `<span>the price must be Positive</br> </span>`;
        isValid = false;
    }

    //validation variant
    const variants = [];
    eventVariants.forEach((variant, index) => {
        const variantsName = document.querySelectorAll(".variant-row__name");
        const variantQuantity = document.querySelectorAll(".variant-row__qty");
        const variantsValue = document.querySelectorAll(".variant-row__value");
        const variantsType = document.querySelectorAll(".variant-row__type");

        if (variantsName[index].value.trim() === "") {
            formErrors.innerHTML += `<div>Variant #${index + 1}: Name is required.</div>`;
            isValid = false;
        }
        if (Number(variantQuantity[index].value) < 0 || variantQuantity[index].value === "") {
            formErrors.innerHTML += `<div>Variant #${index + 1}: invalid quantity.</div>`;
            isValid = false;
        }
        if (Number(variantsValue[index].value) < 0 || variantsValue[index].value === "") {
            formErrors.innerHTML += `<div>Variant #${index + 1}: invalid value.</div>`;
            isValid = false;
        }
        variants.push({ id: index + 1, name: variantsName[index].value, qty: variantQuantity[index].value, value: variantsValue[index].value, type: variantsType[index].value });
    });

    if (!isValid) {

        formErrors.classList.remove("is-hidden", "alert--success");
        formErrors.classList.add("alert--error");

        clearTimeout(window.hideErrorTimeout);

        window.hideErrorTimeout = setTimeout(() => {
            formErrors.innerHTML = "";
            formErrors.classList.add("is-hidden");
        }, 4000);
        return;
    }
    //edit mode
    if (editMode && editEventId !== null) {
        let index;
        events.forEach((event, i) => {
            if (event.id === editEventId) {
                index = i;
                return;
            }
        });

        // Replace the old event
        events[index].id = editEventId;
        events[index].title = eventTitle.value;
        events[index].image = eventImg.value;
        events[index].description = eventDescription.value;
        events[index].seats = Number(eventSeats.value);
        events[index].price = Number(eventPrice.value);
        events[index].variants = variants;

        //Save + re-render
        saveData();
        renderStats();
        renderEventsTable(events);

        //Reset
        editMode = false;
        editEventId = null;
        form.querySelector('button[type="submit"]').textContent = "Add Event";
        variantRowList.innerHTML = "";
        form.reset();

        //success message
        formErrors.innerHTML = "Event updated successfully!";
        formErrors.classList.remove("is-hidden");
        formErrors.classList.add("alert--success");

        clearTimeout(window.hideErrorTimeout);
        window.hideErrorTimeout = setTimeout(() => {
            formErrors.innerHTML = "";
            formErrors.classList.add("is-hidden");
        }, 3000);

        //skip new event creation
        return;
    }


    const newEvent = {
        id: id++,
        title: eventTitle.value,
        image: eventImg.value,
        description: eventDescription.value.trim(),
        seats: Number(eventSeats.value),
        price: Number(eventPrice.value),
        variants,
    };

    formErrors.innerHTML = "";
    formErrors.innerHTML += "Form submitted successfully!";
    formErrors.classList.remove("is-hidden");
    formErrors.classList.add("alert--success");
    formErrors.classList.remove("alert--error");

    clearTimeout(window.hideErrorTimeout);

    window.hideErrorTimeout = setTimeout(() => {
        formErrors.innerHTML = "";
        formErrors.classList.add("is-hidden");
    }, 3000);

    events.push(newEvent)
    saveData();
    renderStats();
    renderEventsTable(events);
    variantRowList.innerHTML = "";
    form.reset();
}

form.addEventListener('submit', handleFormSubmit)

function addVariantRow() {

    const divVariantRow = document.createElement("div");
    divVariantRow.classList.add("variant-row")

    divVariantRow.innerHTML = `
    <input type="text" class="input variant-row__name" placeholder="Variant name (e.g., 'Early Bird')" />
    <input type="number" class="input variant-row__qty" placeholder="Qty" min="1" />
    <input type="number" class="input variant-row__value" placeholder="Value" step="0.01" />
    <select class="select variant-row__type">
        <option value="fixed">Fixed Price</option>
        <option value="percentage">Percentage Off</option>
    </select>
    <button type="button" class="btn btn--danger btn--small variant-row__remove">Remove</button>
    `;

    variantRowList.appendChild(divVariantRow);

    const removeVariantRowBtns = divVariantRow.querySelector(".variant-row__remove");
    removeVariantRowBtns.addEventListener("click", () => removeVariantRow(removeVariantRowBtns));
}

btnAddVariant.addEventListener('click', addVariantRow);

function removeVariantRow(button) {
    button.closest(".variant-row").remove();
}

// ============================================
// EVENTS LIST SCREEN
// ============================================

function renderEventsTable(eventList, page = 1, perPage = 10) {

    let eventsOnPage = [];

    const firstEventOnPage = (page - 1) * perPage;
    const tbody = eventsTable.querySelector(".table__body");

    if (eventList.length === 0) {
        tbody.innerHTML = `<tr><td style="text-align:center;">No events found.</td></tr>`;
        return;
    }

    for (let i = 0; i < perPage; i++) {
        const event = eventList[i + firstEventOnPage];
        if (!event) break;
        eventsOnPage[i] = event;
    }

    let numberOfEvent = 1 + Number(firstEventOnPage);

    tbody.innerHTML = "";
    eventsOnPage.forEach((enventOnPage) => tbody.innerHTML +=
        `<tr class="table__row" data-event-id="${enventOnPage.id}">
                                    <td>${numberOfEvent++}</td>
                                    <td><img src="${enventOnPage.image}" alt="${enventOnPage.title}" width="50" /></td>
                                    <td>${enventOnPage.title}</td>
                                    <td>${enventOnPage.seats}</td>
                                    <td>$${enventOnPage.price}</td>
                                    <td><span class="badge">${enventOnPage.variants.length}</span></td>
                                    <td>
                                        <button class="btn btn--small" data-action="details" data-event-id="${enventOnPage.id}">Details</button>
                                        <button class="btn btn--small" data-action="edit" data-event-id="${enventOnPage.id}">Edit</button>
                                        <button class="btn btn--danger btn--small" data-action="archive" data-event-id="${enventOnPage.id}">Delete</button>
                                        </td>
                                </tr>`
    )
    renderPagination(eventList.length, page, perPage);
}

function renderPagination(totalItems, currentPage, perPage) {

    let nuberOfPages = Math.ceil(totalItems / perPage);

    eventsPagination.innerHTML = "";
    eventsPagination.innerHTML += `<button class="pagination__btn" data-action="prev">← Prev</button>`;
    for (let i = 1; i <= nuberOfPages; i++) {
        eventsPagination.innerHTML += `<button class="pagination__btn ${(i === currentPage) ? 'is-active' : ''}" data-page="${i}">${i}</button>`;
    }
    eventsPagination.innerHTML += `<button class="pagination__btn" data-action="next">Next →</button>`

    const paginationDetailsBtns = document.querySelectorAll(".pagination__btn");

    if (currentPage === 1) {
        paginationDetailsBtns[0].classList.add("is-disabled");
    }
    if (currentPage === nuberOfPages) {
        paginationDetailsBtns[paginationDetailsBtns.length - 1].classList.add("is-disabled");
    }

    eventsPagination.addEventListener("click", (e) => {
        const btn = e.target.closest(".pagination__btn");
        if (btn.classList.contains("is-disabled")) return;
        let newPage = currentPage;

        if (!isNaN(Number(btn.dataset.page))) {
            newPage = Number(btn.dataset.page);
        } else if (btn.dataset.action === "prev") {
            newPage--;
        } else if (btn.dataset.action === "next") {
            newPage++;
        }

        renderEventsTable(events, newPage);
    });
}

function handleTableActionClick(e) {

    const actionBtns = e.target.closest("[data-action]");
    if (!actionBtns) return;

    const action = actionBtns.dataset.action;
    const eventId = actionBtns.dataset.eventId;

    switch (action) {
        case "details":
            showEventDetails(eventId);
            break;
        case "edit":
            editEvent(eventId);
            break;
        case "archive":
            archiveEvent(eventId);
            break;
        case "restore":
            restoreEvent(eventId);

    }
}

eventsTable.addEventListener('click', handleTableActionClick);
archiveTable.addEventListener('click', handleTableActionClick);

function showEventDetails(eventId) {

    let eventById;
    events.forEach((e) => {
        if (e.id == eventId) {
            eventById = e
        }
    });

    modalTitle.innerHTML = eventById.title;
    modalBody.innerHTML = `
        <div>
                    <p><strong>Description:</strong> ${eventById.description}</p>
                    <p><strong>Seats Available:</strong> ${eventById.seats}</p>
                    <p><strong>Image URL:</strong> <img src="${eventById.image}" alt="${eventById.title}" width="500"></p>
    `;

    if (eventById.variants.length !== 0) {
        modalBody.innerHTML += `
        <h4>Variants:</h4>
        <ul>`
        eventById.variants.forEach((variant) => {
            modalBody.innerHTML += `<li style="list-style: none;">
                                        <strong>${variant.name}</strong>
                                        (Qty: ${variant.qty}, Discount: ${variant.value} ${variant.type})
                                     </li>`
        })
        modalBody.innerHTML += `</ul>`
    }


    modalBody.innerHTML += `</div>`;
    eventModal.classList.remove("is-hidden");
}

function editEvent(eventId) {
    let eventToEdit;
    events.forEach((event) => {
        if (event.id == eventId) {
            eventToEdit = event;
        }
    });

    editMode = true;
    editEventId = eventToEdit.id;

    eventTitle.value = eventToEdit.title;
    eventImg.value = eventToEdit.image;
    eventDescription.value = eventToEdit.description;
    eventSeats.value = eventToEdit.seats;
    eventPrice.value = eventToEdit.price;

    variantRowList.innerHTML = "";

    eventToEdit.variants.forEach((variant) => {
        const divVariantRow = document.createElement("div");
        divVariantRow.classList.add("variant-row")
        divVariantRow.innerHTML = `
            <input type="text" class="input variant-row__name" value="${variant.name}" placeholder="Variant name" />
            <input type="number" class="input variant-row__qty" value="${variant.qty}" min="1" />
            <input type="number" class="input variant-row__value" value="${variant.value}" step="0.01" />
            <select class="select variant-row__type">
                <option value="fixed" ${variant.type}>Fixed Price</option>
                <option value="percentage" ${variant.type}>Percentage Off</option>
            </select>
            <button type="button" class="btn btn--danger btn--small variant-row__remove">Remove</button>
        `;
        variantRowList.appendChild(divVariantRow);

        const removeVariantRowBtns = divVariantRow.querySelector(".variant-row__remove");
        removeVariantRowBtns.addEventListener("click", () => removeVariantRow(removeVariantRowBtns));
    });

    form.querySelector('button[type="submit"]').textContent = "Update Event";

    switchScreen("add");
}

function archiveEvent(eventId) {

    let eventById;
    events.forEach((e) => {
        if (e.id == eventId) {
            eventById = e;
            return;
        }
    });
    archive.push(eventById);

    events = events.filter((event) => event.id != eventId)

    saveData();
    renderStats();
    renderEventsTable(events);
    renderArchiveTable(archive);
}

// ============================================
// ARCHIVE SCREEN
// ============================================

function renderArchiveTable(archivedList) {

    let archiveOnPage = [];

    const tbody = archiveTable.querySelector(".table__body");

    if (archivedList.length === 0) {
        tbody.innerHTML = `<tr><td style="text-align:center;">No events found.</td></tr>`;
        return;
    }
    for (let i = 0; i < archivedList.length; i++) {
        const archive = archivedList[i];
        if (!archive) break;
        archiveOnPage[i] = archive;
    }

    let numberOfArchives = 1;

    tbody.innerHTML = "";
    archiveOnPage.forEach((archiveOnPage) => tbody.innerHTML +=
        `<tr class="table__row" data-event-id="${archiveOnPage.id}">
                                    <td>${numberOfArchives++}</td>
                                    <td><img src="${archiveOnPage.image}" alt="${archiveOnPage.title}" width="50" /></td>
                                    <td>${archiveOnPage.title}</td>
                                    <td>${archiveOnPage.seats}</td>
                                    <td>$${archiveOnPage.price}</td>
                                    <td><span class="badge">${archiveOnPage.variants.length}</span></td>
                                    <td>
                                        <button class="btn btn--small" data-action="restore" data-event-id="${archiveOnPage.id}">Restore</button>
                                    </td>
                                </tr>`
    )
}

function restoreEvent(eventId) {
    let archiveById;
    archive.forEach((e) => {
        if (e.id == eventId) {
            archiveById = e;
            return;
        }
    });
    events.push(archiveById);

    archive = archive.filter((arch) => arch.id != eventId)

    saveData();
    renderStats();
    renderEventsTable(events);
    renderArchiveTable(archive);
}

// ============================================
// MODAL
// ============================================

function closeModal() {
    eventModal.classList.add("is-hidden");
}

eventModal.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'close-modal' || e.target.classList.contains('modal__overlay')) {
        closeModal()
    }
})

// ============================================
// SEARCH & SORT
// ============================================

function searchEvents(query) {

    let filteredEvents = events.filter((event) => {
        return event.title.toLowerCase().includes(query.toLowerCase());
    });
    return filteredEvents;
}

function bubbleSort(array, sortOrder, key) {
    let temp;
    let isSorted;
    let isThereAkey = key ? `.${key}` : "";
    let comparisonSymbol = sortOrder ? ">" : "<";
    for (let i = 0; i < array.length - 1; i++) {
        isSorted = true;
        for (let j = 0; j < array.length - 1 - i; j++) {
            if (eval(`array[j]${isThereAkey} ${comparisonSymbol} array[j + 1]${isThereAkey}`)) {
                temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                isSorted = false;
            }
        }
        if (isSorted === true) return;
    }
}

function sortEvents(eventList, sortType) {
    switch (sortType) {
        case "title-asc":
            bubbleSort(eventList, sortEnum.asc, "title")
            break;

        case "title-desc":
            bubbleSort(eventList, sortEnum.desc, "title")
            break;

        case "price-asc":
            bubbleSort(eventList, sortEnum.asc, "price")
            break;

        case "price-desc":
            bubbleSort(eventList, sortEnum.desc, "price")
            break;

        case "seats-asc":
            bubbleSort(eventList, sortEnum.asc, "seats")
            break;

    }
    return eventList;
}

searchEventsInput.addEventListener("input", (e) => {
    const filtered = searchEvents(e.target.value);
    renderEventsTable(filtered);
})

sortEventsSelection.addEventListener("change", (e) => {
    const sorted = sortEvents(events, e.target.value);
    renderEventsTable(sorted);
})

// ============================================
// INITIALIZATION
// ============================================

function init() {

    loadData();
    renderStats();
    renderEventsTable(events);
    renderArchiveTable(archive);
}

document.addEventListener('DOMContentLoaded', init);