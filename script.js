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
    // TODO: Load events and archive from localStorage
    const savedEvents = localStorage.getItem("events");
    const savedArchive = localStorage.getItem("archive");

    try {
        // JSON.parse(localStorage.getItem('events'))
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
    // TODO: Save events and archive to localStorage
    // localStorage.setItem('events', JSON.stringify(events))
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
    // TODO:
    // 1. Remove .is-active from all .sidebar__btn
    for (const btn of btnsStepers) {
        btn.classList.remove("is-active");
        // 2. Add .is-active to [data-screen="${screenId}"]
        if (btn.dataset.screen == `${screenId}`) {
            btn.classList.add("is-active");
        }
    }
    // 3. Remove .is-visible from all .screen
    for (const screen of screens) {
        screen.classList.remove("is-visible");
        // 4. Add .is-visible to [data-screen="${screenId}"]
        if (screen.dataset.screen == `${screenId}`) {
            screen.classList.add("is-visible");
        }
    }
    // 5. Update #page-title and #page-subtitle based on screenId
    headerTitle.textContent = headerTitles[screenId].title;
    headerSubTitle.textContent = headerTitles[screenId].subTitle;
}

// Listen to sidebar button clicks
btnsStepers.forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen))
})

// ============================================
// STATISTICS SCREEN
// ============================================

//turn number to a commas for thousands
function turnNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderStats() {
    // TODO:
    // Calculate from events array:
    const totalEvents = events.length;
    const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);

    // Update DOM:
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
    // TODO:
    formErrors.innerHTML = "";
    // 1. Prevent default
    e.preventDefault();
    // 2. Validate form inputs
    const eventVariants = document.querySelectorAll(".variant-row");

    let isValid = true;
    // 3. If valid: create new event object, add to events array, save data, reset form  

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

    // 4. If invalid: show errors in #form-errors
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

        events[index].id = editEventId,
        events[index].title = eventTitle.value,
        events[index].image = eventImg.value,
        events[index].description = eventDescription.value,
        events[index].seats = Number(eventSeats.value),
        events[index].price = Number(eventPrice.value),
        events[index].variants = variants,

        console.log(events[index].variants);
        console.log(variants);
        
        // Save + re-render
        saveData();
        renderStats();
        renderEventsTable(events);

        // Reset
        editMode = false;
        editEventId = null;
        form.querySelector('button[type="submit"]').textContent = "Add Event";
        variantRowList.innerHTML = "";
        form.reset();

        // Show success message
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

// document.getElementById('event-form').addEventListener('submit', handleFormSubmit)
form.addEventListener('submit', handleFormSubmit)

function addVariantRow() {
    // TODO:
    // 1. Clone .variant-row template
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
    // 2. Append to #variants-list
    variantRowList.appendChild(divVariantRow);

    // 3. Add remove listener to new row's remove button
    const removeVariantRowBtns = divVariantRow.querySelector(".variant-row__remove");
    removeVariantRowBtns.addEventListener("click", () => removeVariantRow(removeVariantRowBtns));
}

// document.getElementById('btn-add-variant').addEventListener('click', addVariantRow)
btnAddVariant.addEventListener('click', addVariantRow);

function removeVariantRow(button) {
    // TODO:
    // Find closest .variant-row and remove it
    button.closest(".variant-row").remove();
}

// ============================================
// EVENTS LIST SCREEN
// ============================================

function renderEventsTable(eventList, page = 1, perPage = 10) {
    // TODO:
    // 1. Paginate eventList by page and perPage
    let eventsOnPage = [];

    const firstEventOnPage = (page - 1) * perPage;
    const tbody = eventsTable.querySelector(".table__body");

    if (eventList.length === 0) {
        tbody.innerHTML = `<tr><td style="text-align:center;">No events found.</td></tr>`;
        return;
    }
    // 2. Generate table rows for each event
    for (let i = 0; i < perPage; i++) {
        const event = eventList[i + firstEventOnPage];
        if (!event) break;
        eventsOnPage[i] = event;
    }
    // 3. Add data-event-id to each row
    // 4. Inject into #events-table tbody

    let numberOfEvent = 1 + Number(firstEventOnPage);

    tbody.innerHTML = "";
    eventsOnPage.forEach((enventOnPage) => tbody.innerHTML +=
        `<tr class="table__row" data-event-id="${enventOnPage.id}">
                                    <td>${numberOfEvent++}</td>
                                    <td><img src="${enventOnPage.image}" alt="${enventOnPage.title}" width="50" /></td>
                                    <td>${enventOnPage.title}</td>
                                    <td>${enventOnPage.seats}</td>
                                    <td>$${enventOnPage.price}</td>
                                    <td><span class="badge">1</span></td>
                                    <td>
                                        <button class="btn btn--small" data-action="details" data-event-id="${enventOnPage.id}">Details</button>
                                        <button class="btn btn--small" data-action="edit" data-event-id="${enventOnPage.id}">Edit</button>
                                        <button class="btn btn--danger btn--small" data-action="archive" data-event-id="${enventOnPage.id}">Delete</button>
                                        </td>
                                </tr>`
    )
    // 5. Call renderPagination()
    renderPagination(eventList.length, page, perPage);
}

function renderPagination(totalItems, currentPage, perPage) {
    // TODO:
    // Calculate total pages
    let nuberOfPages = Math.ceil(totalItems / perPage);
    // Generate pagination buttons
    // Add .is-active to current page
    // Add .is-disabled to prev/next if at boundary
    // Inject into #events-pagination
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
    // TODO:
    // 1. Check if e.target is [data-action]
    const actionBtns = e.target.closest("[data-action]");
    if (!actionBtns) return;
    // 2. Get action and eventId from attributes
    const action = actionBtns.dataset.action;
    const eventId = actionBtns.dataset.eventId;
    // 3. Call appropriate function (showDetails, editEvent, archiveEvent)
    switch (action) {
        case "details":
            showEventDetails(eventId);
            break;
        case "edit":
            editEvent(eventId);
            break;
        case "archive":
            archiveEvent(eventId)
            break;
    }
    // Use event delegation on #events-table
}

// document.getElementById('events-table').addEventListener('click', handleTableActionClick)
eventsTable.addEventListener('click', handleTableActionClick);

function showEventDetails(eventId) {
    // TODO:
    // 1. Find event by id in events array
    let eventById;
    events.forEach((e) => {
        if (e.id == eventId) {
            eventById = e
        }
    });


    modalTitle.innerHTML = eventById.title;

    // 2. Populate #modal-body with event details
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
    // 3. Remove .is-hidden from #event-modal
    eventModal.classList.remove("is-hidden");

}

function editEvent(eventId) {
    // TODO:
    // 1. Find event by id
    let eventToEdit;
    events.forEach((event) => {
        if (event.id == eventId) {
            eventToEdit = event;
        }
    });

    editMode = true;
    editEventId = eventToEdit.id;
    // 2. Populate form fields with event data
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
    // 3. Switch to 'add' screen
    switchScreen("add");
    // 4. On submit, update existing event instead of creating new
}

function archiveEvent(eventId) {
    // TODO:
    // 1. Find event by id in events
    let eventById;
    events.forEach((e) => {
        if (e.id == eventId) {
            eventById = e
        }
    });
    // 2. Move to archive array
    archive.push(eventById);
    // 3. Remove from events array

    events = events.filter((event) => event.id != eventId)

    // 4. Save data
    saveData();
    // 5. Re-render table
    renderStats();
    renderEventsTable(events);
}

// ============================================
// ARCHIVE SCREEN
// ============================================

function renderArchiveTable(archivedList) {
    // TODO:
    // Similar to renderEventsTable but read-only
    // Show "Restore" button instead of "Edit"/"Delete"
}

function restoreEvent(eventId) {
    // TODO:
    // 1. Find event by id in archive
    // 2. Move back to events array
    // 3. Remove from archive
    // 4. Save data
    // 5. Re-render both tables
}

// ============================================
// MODAL
// ============================================

function openModal(title, content) {
    // TODO:
    // 1. Set #modal-title
    // 2. Set #modal-body content
    // 3. Remove .is-hidden from #event-modal
}

function closeModal() {
    // TODO:
    // Add .is-hidden to #event-modal
    eventModal.classList.add("is-hidden");
}

// Listen to close button and overlay click
// document.getElementById('event-modal').addEventListener('click', (e) => {
//     if (e.target.dataset.action === 'close-modal' || e.target.classList.contains('modal__overlay')) {
//         closeModal()
//     }
// })
eventModal.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'close-modal' || e.target.classList.contains('modal__overlay')) {
        closeModal()
    }
})

// ============================================
// SEARCH & SORT
// ============================================

function searchEvents(query) {
    // TODO:
    // Filter events by title (case-insensitive)
    let filteredEvents = events.filter((event) => {
        return event.title.toLowerCase().includes(query.toLowerCase());
    });
    // Return filtered array
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
    // TODO:
    // Sort by: title-asc, title-desc, price-asc, price-desc, seats-asc
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
    // Return sorted array
    return eventList;
}

// Listen to search and sort changes
// document.getElementById('search-events').addEventListener('input', (e) => {
//     const filtered = searchEvents(e.target.value)
//     renderEventsTable(filtered)
// })
searchEventsInput.addEventListener("input", (e) => {
    const filtered = searchEvents(e.target.value);
    renderEventsTable(filtered);
})

// document.getElementById('sort-events').addEventListener('change', (e) => {
//     const sorted = sortEvents(events, e.target.value)
//     renderEventsTable(sorted)
// })
sortEventsSelection.addEventListener("change", (e) => {
    const sorted = sortEvents(events, e.target.value);
    renderEventsTable(sorted);
})

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // TODO:
    // 1. Load data from localStorage
    loadData();
    // 2. Render initial screen (statistics)
    // 3. Set up all event listeners
    // 4. Call renderStats(), renderEventsTable(), renderArchiveTable()
    renderStats();
    renderEventsTable(events);
    renderArchiveTable(archive);
}

// Call on page load
document.addEventListener('DOMContentLoaded', init)
