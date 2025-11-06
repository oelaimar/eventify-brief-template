const btnsStepers = document.querySelectorAll(".sidebar__btn");
const screens = document.querySelectorAll(".screen");
const headerTitle = document.getElementById("page-title");
const headerSubTitle = document.getElementById("page-subtitle");

// ============================================
// DATA MANAGEMENT
// ============================================

//titles and subtitles of the headew
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
    // JSON.parse(localStorage.getItem('events'))
}

function saveData() {
    // TODO: Save events and archive to localStorage
    // localStorage.setItem('events', JSON.stringify(events))
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

function renderStats() {
    // TODO:
    // Calculate from events array:
    const totalEvents = events.length;
    const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);

    // Update DOM:
    document.getElementById('stat-total-events').textContent = totalEvents;
    document.getElementById('stat-total-seats').textContent = totalSeats;
    document.getElementById('stat-total-price').textContent = '$' + totalPrice.toFixed(2);
}

// ============================================
// ADD EVENT FORM
// ============================================

function handleFormSubmit(e) {
    // TODO:
    // 1. Prevent default
    // 2. Validate form inputs
    // 3. If valid: create new event object, add to events array, save data, reset form
    // 4. If invalid: show errors in #form-errors
}

// document.getElementById('event-form').addEventListener('submit', handleFormSubmit)

function addVariantRow() {
    // TODO:
    // 1. Clone .variant-row template
    // 2. Append to #variants-list
    // 3. Add remove listener to new row's remove button
}

// document.getElementById('btn-add-variant').addEventListener('click', addVariantRow)

function removeVariantRow(button) {
    // TODO:
    // Find closest .variant-row and remove it
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
    // 2. Render initial screen (statistics)
    // 3. Set up all event listeners
    // 4. Call renderStats(), renderEventsTable(), renderArchiveTable()
}

// Call on page load
// document.addEventListener('DOMContentLoaded', init)