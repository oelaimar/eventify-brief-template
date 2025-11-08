const btnsStepers = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");
const headerTitle = document.getElementById("page-title");
const headerSubTitle = document.getElementById("page-subtitle");
const form = document.getElementById("event-form");
const variantRowList = document.getElementById("variants-list");
const btnAddVariant = document.getElementById("btn-add-variant");
const formErrors = document.getElementById("form-errors");

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

// Your app's data structure
let events = [];
let archive = [];

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

let id = 1;

function handleFormSubmit(e) {
    // TODO:
    // 1. Prevent default
    e.preventDefault();
    // 2. Validate form inputs
    const eventTitle = document.getElementById("event-title");
    const eventImg = document.getElementById("event-image");
    const eventDescription = document.getElementById("event-description");
    const eventSeats = document.getElementById("event-seats");
    const eventPrice = document.getElementById("event-price");
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
            formErrors.innerHTML += `<div>Variant #${index + 1}: Quantity must be positive.</div>`;
            isValid = false;
        }
        if (Number(variantsValue[index].value) < 0 || variantsValue[index].value === "") {
            formErrors.innerHTML += `<div>Variant #${index + 1}: Value must be a valid number.</div>`;
            isValid = false;
        }
        variants.push({ id: index + 1, name: variantsName, qty: variantQuantity, value: variantsValue, type: variantsType });
    });
    
    // 4. If invalid: show errors in #form-errors
    if (!isValid) {

        formErrors.classList.remove("is-hidden");
        formErrors.classList.remove("alert--success");
        formErrors.classList.add("alert--error");

        clearTimeout(window.hideErrorTimeout);

        window.hideErrorTimeout = setTimeout(() => {
            formErrors.innerHTML = "";
            formErrors.classList.add("is-hidden");
        }, 4000);
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
    }, 4000);

    events.push(newEvent)
    saveData();
    renderStats();
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
    // 2. Generate table rows for each event
    // 3. Add data-event-id to each row
    // 4. Inject into #events-table tbody
    // 5. Call renderPagination()
}

function renderPagination(totalItems, currentPage, perPage) {
    // TODO:
    // Calculate total pages
    // Generate pagination buttons
    // Add .is-active to current page
    // Add .is-disabled to prev/next if at boundary
    // Inject into #events-pagination
}

function handleTableActionClick(e) {
    // TODO:
    // 1. Check if e.target is [data-action]
    // 2. Get action and eventId from attributes
    // 3. Call appropriate function (showDetails, editEvent, archiveEvent)
    // Use event delegation on #events-table
}

// document.getElementById('events-table').addEventListener('click', handleTableActionClick)

function showEventDetails(eventId) {
    // TODO:
    // 1. Find event by id in events array
    // 2. Populate #modal-body with event details
    // 3. Remove .is-hidden from #event-modal
}

function editEvent(eventId) {
    // TODO:
    // 1. Find event by id
    // 2. Populate form fields with event data
    // 3. Switch to 'add' screen
    // 4. On submit, update existing event instead of creating new
}

function archiveEvent(eventId) {
    // TODO:
    // 1. Find event by id in events
    // 2. Move to archive array
    // 3. Remove from events array
    // 4. Save data
    // 5. Re-render table
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
}

// Listen to close button and overlay click
// document.getElementById('event-modal').addEventListener('click', (e) => {
//     if (e.target.dataset.action === 'close-modal' || e.target.classList.contains('modal__overlay')) {
//         closeModal()
//     }
// })

// ============================================
// SEARCH & SORT
// ============================================

function searchEvents(query) {
    // TODO:
    // Filter events by title (case-insensitive)
    // Return filtered array
}

function sortEvents(eventList, sortType) {
    // TODO:
    // Sort by: title-asc, title-desc, price-asc, price-desc, seats-asc
    // Return sorted array
}

// Listen to search and sort changes
// document.getElementById('search-events').addEventListener('input', (e) => {
//     const filtered = searchEvents(e.target.value)
//     renderEventsTable(filtered)
// })

// document.getElementById('sort-events').addEventListener('change', (e) => {
//     const sorted = sortEvents(events, e.target.value)
//     renderEventsTable(sorted)
// })

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
}

// Call on page load
document.addEventListener('DOMContentLoaded', init)
