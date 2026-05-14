class PollCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.state = {
            location: '202 Bukit Batok Ave 2',
            startTime: '17:00',
            endTime: '20:00',
            attendees: []
        };
    }

    connectedCallback() {
        this.render();
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
                .details p {
                    margin: 0.5rem 0;
                }
                .details input {
                    background: #333;
                    color: var(--text-color);
                    border: 1px solid #555;
                    border-radius: 5px;
                    padding: 0.25rem;
                    width: calc(100% - 1rem);
                }
                .attendees {
                    margin-top: 1rem;
                }
                .attendees-list {
                    list-style: none;
                    padding: 0;
                }
                .attendee {
                    padding: 0.5rem;
                    background: #333;
                    border-radius: 5px;
                    margin-bottom: 0.5rem;
                }
                .actions {
                    margin-top: 1rem;
                    display: flex;
                    gap: 1rem;
                }
                button {
                    background-color: var(--primary-color);
                    color: gold;
                    border: none;
                    padding: 0.75rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s, box-shadow 0.3s;
                    font-weight: 600;
                }
                button:hover {
                    background-color: var(--secondary-color);
                    box-shadow: 0 0 15px var(--glow-color);
                }
            </style>
            <div class="card">
                <h3>${day} - ${date}</h3>
                <div class="details">
                    <p><strong>Location:</strong> <input type="text" class="location" value="${this.state.location}"></p>
                    <p><strong>Time:</strong> <input type="time" class="start-time" value="${this.state.startTime}"> - <input type="time" class="end-time" value="${this.state.endTime}"></p>
                </div>
                <div class="attendees">
                    <h4>Attendees</h4>
                    <ul class="attendees-list">
                        ${this.state.attendees.map(p => `<li class="attendee">${p.name}${p.isFriend ? ' (+1)' : ''}</li>`).join('')}
                    </ul>
                </div>
                <div class="actions">
                    <button class="coming">Coming</button>
                    <button class="friend">Bring a Friend</button>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.coming').addEventListener('click', () => this.addAttendee(false));
        this.shadowRoot.querySelector('.friend').addEventListener('click', () => this.addAttendee(true));
        this.shadowRoot.querySelector('.location').addEventListener('change', (e) => this.state.location = e.target.value);
        this.shadowRoot.querySelector('.start-time').addEventListener('change', (e) => this.state.startTime = e.target.value);
        this.shadowRoot.querySelector('.end-time').addEventListener('change', (e) => this.state.endTime = e.target.value);
    }

    addAttendee(isFriend) {
        const name = prompt("Please enter your name:");
        if (name) {
            this.state.attendees.push({ name, isFriend });
            this.render();
        }
    }
}
customElements.define('poll-card', PollCard);

const pollContainer = document.getElementById('poll-container');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function generatePolls(startDate, endDate) {
    pollContainer.innerHTML = '';
    const start = new Date(startDate);
    const end = new Date(endDate);

    let currentDate = start;
    while (currentDate <= end) {
        const pollCard = document.createElement('poll-card');
        pollCard.setAttribute('day', days[currentDate.getDay()]);
        pollCard.setAttribute('date', currentDate.toLocaleDateString());
        pollContainer.appendChild(pollCard);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function setDefaultDates() {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    startDateInput.valueAsDate = startOfWeek;
    endDateInput.valueAsDate = endOfWeek;

    generatePolls(startOfWeek, endOfWeek);
}

startDateInput.addEventListener('change', () => {
    if (startDateInput.value && endDateInput.value) {
        generatePolls(startDateInput.value, endDateInput.value);
    }
});

endDateInput.addEventListener('change', () => {
    if (startDateInput.value && endDateInput.value) {
        generatePolls(startDateInput.value, endDateInput.value);
    }
});

setDefaultDates();
