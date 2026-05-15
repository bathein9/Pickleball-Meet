
class PollCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._data = {
            location: '202 Bukit Batok Ave 2',
            startTime: '17:00',
            endTime: '20:00',
            attendees: []
        };
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('.coming').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add-attendee', { detail: { isFriend: false }, bubbles: true, composed: true }));
        });
        this.shadowRoot.querySelector('.friend').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add-attendee', { detail: { isFriend: true }, bubbles: true, composed: true }));
        });
        this.shadowRoot.querySelector('.location').addEventListener('change', (e) => this.updateData({ location: e.target.value }));
        this.shadowRoot.querySelector('.start-time').addEventListener('change', (e) => this.updateData({ startTime: e.target.value }));
        this.shadowRoot.querySelector('.end-time').addEventListener('change', (e) => this.updateData({ endTime: e.target.value }));
    }

    setData(data) {
        this._data = { ...this._data, ...data };
        this.render();
    }

    updateData(change) {
        this.dispatchEvent(new CustomEvent('data-change', {
            bubbles: true,
            composed: true,
            detail: change
        }));
    }

    render() {
        const day = this.getAttribute('day');
        const date = this.getAttribute('date');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--card-background);
                    border-radius: 10px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 20px var(--shadow-color);
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 25px var(--glow-color);
                }
                h3 {
                    font-size: 1.5rem;
                    color: var(--primary-color);
                    margin-top: 0;
                }
                .details p { margin: 0.5rem 0; }
                .details input {
                    background: #333;
                    color: var(--text-color);
                    border: 1px solid #555;
                    border-radius: 5px;
                    padding: 0.25rem;
                    width: calc(100% - 1rem);
                }
                .attendees { margin-top: 1rem; }
                .attendees-list { list-style: none; padding: 0; }
                .attendee {
                    padding: 0.5rem;
                    background: #333;
                    border-radius: 5px;
                    margin-bottom: 0.5rem;
                }
                .actions { margin-top: 1rem; display: flex; gap: 1rem; }
                button {
                    background-color: var(--primary-color);
                    color: gold;
                    border: none;
                    padding: 0.75rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.3s, box-shadow 0.3s;
                }
                button:hover {
                    background-color: var(--secondary-color);
                    box-shadow: 0 0 15px var(--glow-color);
                }
                button:disabled {
                    background-color: #555;
                    cursor: not-allowed;
                }
            </style>
            <div class="card">
                <h3>${day} - ${date}</h3>
                <div class="details">
                    <p><strong>Location:</strong> <input type="text" class="location" value="${this._data.location}"></p>
                    <p><strong>Time:</strong> <input type="time" class="start-time" value="${this._data.startTime}"> - <input type="time" class="end-time" value="${this._data.endTime}"></p>
                </div>
                <div class="attendees">
                    <h4>Attendees</h4>
                    <ul class="attendees-list">
                        ${this._data.attendees.map(p => `<li class="attendee">${p.name} (DUPR: ${p.dupr})${p.isFriend ? ' (+1)' : ''}</li>`).join('')}
                    </ul>
                </div>
                <div class="actions">
                    <button class="coming">Coming</button>
                    <button class="friend">Bring a Friend</button>
                </div>
            </div>
        `;
    }
}
customElements.define('poll-card', PollCard);

const pollContainer = document.getElementById('poll-container');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const locationInput = document.getElementById('location-input');
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeBtn = document.querySelector('.close-btn');
const loginSubmit = document.getElementById('login-submit');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const attendeeModal = document.getElementById('attendee-modal');
const closeAttendeeBtn = document.querySelector('.close-attendee-btn');
const attendeeModalTitle = document.getElementById('attendee-modal-title');
const attendeeNameInput = document.getElementById('attendee-name');
const attendeeDuprInput = document.getElementById('attendee-dupr');
const addAttendeeSubmit = document.getElementById('add-attendee-submit');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let locationPolls = {};
let user = null;
let currentCard = null;
let isFriend = false;

function getCurrentLocationId() {
    return locationInput.value.trim() || 'default';
}

function updateUIAccess() {
    const isAdmin = user && user.isAdmin;

    locationInput.disabled = !isAdmin;
    startDateInput.disabled = !isAdmin;
    endDateInput.disabled = !isAdmin;

    document.querySelectorAll('poll-card').forEach(card => {
        const shadowRoot = card.shadowRoot;
        shadowRoot.querySelector('.location').disabled = !isAdmin;
        shadowRoot.querySelector('.start-time').disabled = !isAdmin;
        shadowRoot.querySelector('.end-time').disabled = !isAdmin;
    });
}

function loadLocation(locationId) {
    if (!locationPolls[locationId]) {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(new Date(startOfWeek).setDate(startOfWeek.getDate() + 6));
        
        locationPolls[locationId] = {
            startDate: startOfWeek.toISOString().split('T')[0],
            endDate: endOfWeek.toISOString().split('T')[0],
            polls: {}
        };
    }
    
    const locationData = locationPolls[locationId];
    startDateInput.value = locationData.startDate;
    endDateInput.value = locationData.endDate;
    
    generatePolls();
}

function generatePolls() {
    const locationId = getCurrentLocationId();
    const locationData = locationPolls[locationId];
    if (!locationData) return;

    pollContainer.innerHTML = '';
    
    const start = new Date(locationData.startDate);
    const end = new Date(locationData.endDate);

    let currentDate = new Date(start);
    while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        if (!locationData.polls[dateString]) {
            locationData.polls[dateString] = {
                location: locationInput.value.trim() || '202 Bukit Batok Ave 2',
                startTime: '17:00',
                endTime: '20:00',
                attendees: []
            };
        }
        
        const pollDayData = locationData.polls[dateString];

        const pollCard = document.createElement('poll-card');
        pollCard.setAttribute('day', days[currentDate.getDay()]);
        pollCard.setAttribute('date', currentDate.toLocaleDateString());
        pollCard.dataset.date = dateString;
        pollCard.setData(pollDayData);
        
        pollContainer.appendChild(pollCard);
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    updateUIAccess();
}

pollContainer.addEventListener('data-change', (e) => {
    if (!user || !user.isAdmin) return;
    const card = e.target;
    const date = card.dataset.date;
    const locationId = getCurrentLocationId();
    const locationData = locationPolls[locationId];

    if (locationData && locationData.polls[date]) {
        const newDayData = { ...locationData.polls[date], ...e.detail };
        locationData.polls[date] = newDayData;
        card.setData(newDayData);
    }
});

pollContainer.addEventListener('add-attendee', (e) => {
    currentCard = e.target;
    isFriend = e.detail.isFriend;
    attendeeModalTitle.textContent = isFriend ? 'Add Friend' : 'Add Yourself';
    attendeeModal.style.display = 'block';
});

function handleDateChange() {
    const locationId = getCurrentLocationId();
    const locationData = locationPolls[locationId];
    if (locationData && startDateInput.value && endDateInput.value) {
        locationData.startDate = startDateInput.value;
        locationData.endDate = endDateInput.value;
        generatePolls();
    }
}

locationInput.addEventListener('change', () => loadLocation(getCurrentLocationId()));
startDateInput.addEventListener('change', handleDateChange);
endDateInput.addEventListener('change', handleDateChange);

// Login Logic
loginBtn.addEventListener('click', () => {
    if (user) { // Logout
        user = null;
        loginBtn.textContent = 'Login';
        updateUIAccess();
    } else { // Login
        loginModal.style.display = 'block';
    }
});

closeBtn.addEventListener('click', () => loginModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

loginSubmit.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === 'Admin' && password === 'Admin123') {
        user = { name: 'Admin', isAdmin: true };
        loginBtn.textContent = 'Logout';
        loginModal.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
        updateUIAccess();
    } else {
        alert('Invalid admin credentials.');
    }
});

// Attendee Modal Logic
closeAttendeeBtn.addEventListener('click', () => attendeeModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === attendeeModal) {
        attendeeModal.style.display = 'none';
    }
});

addAttendeeSubmit.addEventListener('click', () => {
    const name = attendeeNameInput.value.trim();
    const dupr = parseFloat(attendeeDuprInput.value);

    if (!name || isNaN(dupr)) {
        alert('Please enter a valid name and DUPR rating.');
        return;
    }

    const date = currentCard.dataset.date;
    const locationId = getCurrentLocationId();
    const locationData = locationPolls[locationId];

    if (locationData && locationData.polls[date]) {
        const newAttendee = { name, dupr, isFriend };
        const attendees = [...locationData.polls[date].attendees, newAttendee];
        const newDayData = { ...locationData.polls[date], attendees };
        locationData.polls[date] = newDayData;
        currentCard.setData(newDayData);
    }

    attendeeModal.style.display = 'none';
    attendeeNameInput.value = '';
    attendeeDuprInput.value = '';
});

// Initial Load
loadLocation(getCurrentLocationId());
