document.addEventListener('DOMContentLoaded', () => {
    // Show the first tab by default
    showTab('donorsTab');

    // Event Listeners for forms
    document.getElementById('donorForm').addEventListener('submit', handleAddDonor);
    document.getElementById('requestForm').addEventListener('submit', handleAddRequest);
    document.getElementById('appointmentForm').addEventListener('submit', handleAddAppointment);
    document.getElementById('inventoryForm').addEventListener('submit', handleUpdateInventory);
    document.getElementById('reportForm').addEventListener('submit', handleGenerateReport);
    document.getElementById('hospitalForm').addEventListener('submit', handleAddHospital);
    document.getElementById('transfusionForm').addEventListener('submit', handleAddTransfusion);
    document.getElementById('searchForm').addEventListener('submit', handleSearch);

    // Fetch data when the page loads
    fetchDonors();
    fetchRequests();
    fetchAppointments();
    fetchInventory();
    fetchReports();
    fetchHospitals();
    fetchTransfusions();
});

// Show specific tab
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
}

// Handle Add Donor
async function handleAddDonor(event) {
    event.preventDefault();

    const donor = {
        Name: document.getElementById('name').value,
        BloodType: document.getElementById('bloodType').value,
        Contact: document.getElementById('contact').value,
        DateOfBirth: document.getElementById('dob').value,
        Address: document.getElementById('address').value,
        LastDonationDate: document.getElementById('lastDonationDate').value
    };

    const response = await fetch('http://localhost:3000/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donor)
    });

    if (response.ok) {
        alert('Donor added!');
        fetchDonors();
    } else {
        alert('Failed to add donor');
    }
}

// Handle Add Request
async function handleAddRequest(event) {
    event.preventDefault();

    const request = {
        HospitalID: document.getElementById('hospitalId').value,
        BloodType: document.getElementById('bloodTypeRequest').value,
        Urgency: document.getElementById('urgency').value,
        RequestStatus: document.getElementById('requestStatus').value,
        RequestDate: document.getElementById('requestDate').value
    };

    const response = await fetch('http://localhost:3000/bloodrequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });

    if (response.ok) {
        alert('Request added!');
        fetchRequests();
    } else {
        alert('Failed to add request');
    }
}

// Handle Add Appointment
async function handleAddAppointment(event) {
    event.preventDefault();

    const appointment = {
        DonorID: document.getElementById('donorId').value,
        Date: document.getElementById('appointmentDate').value,
        Status: document.getElementById('status').value
    };

    const response = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
    });

    if (response.ok) {
        alert('Appointment scheduled!');
        fetchAppointments();
    } else {
        alert('Failed to schedule appointment');
    }
}

// Handle Update Inventory
async function handleUpdateInventory(event) {
    event.preventDefault();

    const inventory = {
        HospitalID: document.getElementById('hospitalIdInventory').value,
        BloodType: document.getElementById('bloodTypeInventory').value,
        Quantity: document.getElementById('quantity').value,
        ExpiryDate: document.getElementById('expiryDate').value
    };

    const response = await fetch('http://localhost:3000/bloodinventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventory)
    });

    if (response.ok) {
        alert('Inventory updated!');
        fetchInventory();
    } else {
        alert('Failed to update inventory');
    }
}

// Handle Generate Report
async function handleGenerateReport(event) {
    event.preventDefault();

    const report = {
        HospitalID: document.getElementById('hospitalIdReport').value,
        BloodType: document.getElementById('bloodTypeReport').value,
        ShortageLevel: document.getElementById('shortageLevel').value,
        ReportDate: document.getElementById('reportDate').value
    };

    const response = await fetch('http://localhost:3000/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
    });

    if (response.ok) {
        alert('Report generated!');
        fetchReports();
    } else {
        alert('Failed to generate report');
    }
}

// Handle Add Hospital
async function handleAddHospital(event) {
    event.preventDefault();

    const hospital = {
        Name: document.getElementById('hospitalName').value,
        Location: document.getElementById('hospitalLocation').value,
        Contact: document.getElementById('hospitalContact').value
    };

    const response = await fetch('http://localhost:3000/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospital)
    });

    if (response.ok) {
        alert('Hospital added!');
        fetchHospitals();
    } else {
        alert('Failed to add hospital');
    }
}

// Handle Add Transfusion
async function handleAddTransfusion(event) {
    event.preventDefault();

    const transfusion = {
        DonorID: document.getElementById('donorIdTransfusion').value,
        HospitalID: document.getElementById('hospitalIdTransfusion').value,
        TransfusionDate: document.getElementById('transfusionDate').value
    };

    const response = await fetch('http://localhost:3000/transfusions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transfusion)
    });

    if (response.ok) {
        alert('Transfusion recorded!');
        fetchTransfusions();
    } else {
        alert('Failed to record transfusion');
    }
}

// Handle Search
async function handleSearch(event) {
    event.preventDefault();

    const table = document.getElementById('searchTable').value;
    const columns = Array.from(document.getElementById('columnsContainer').querySelectorAll('.searchColumn')).map(option => option.value);
    const query = document.getElementById('searchQuery').value;

    const response = await fetch(`http://localhost:3000/search?table=${table}&columns=${JSON.stringify(columns)}&query=${query}`);
    const results = await response.json();
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = JSON.stringify(result); // Customize this based on your result structure
        searchResults.appendChild(li);
    });
}

// Fetch and display all donors
async function fetchDonors() {
    const response = await fetch('http://localhost:3000/donors');
    const donors = await response.json();
    const donorList = document.getElementById('donorList');
    donorList.innerHTML = '';
    donors.forEach(donor => {
        const li = document.createElement('li');
        li.textContent = `${donor.Name} - ${donor.BloodType}`;
        li.innerHTML += `
            <button onclick="handleDeleteDonor(${donor.DonorID})">Delete</button>
            <button onclick="handleUpdateDonor(${donor.DonorID})">Update</button>
        `;
        donorList.appendChild(li);
    });
}

// Fetch and display all requests
async function fetchRequests() {
    const response = await fetch('http://localhost:3000/bloodrequests');
    const requests = await response.json();
    const requestList = document.getElementById('requestList');
    requestList.innerHTML = '';
    requests.forEach(request => {
        const li = document.createElement('li');
        li.textContent = `${request.BloodType} - ${request.Urgency} - ${request.RequestStatus}`;
        li.innerHTML += `
            <button onclick="handleDeleteRequest(${request.RequestID})">Delete</button>
            <button onclick="handleUpdateRequest(${request.RequestID})">Update</button>
        `;
        requestList.appendChild(li);
    });
}

// Fetch and display all appointments
async function fetchAppointments() {
    const response = await fetch('http://localhost:3000/appointments');
    const appointments = await response.json();
    const appointmentList = document.getElementById('appointmentList');
    appointmentList.innerHTML = '';
    appointments.forEach(appointment => {
        const li = document.createElement('li');
        li.textContent = `Donor ID: ${appointment.DonorID} - Date: ${appointment.Date}`;
        li.innerHTML += `
            <button onclick="handleDeleteAppointment(${appointment.AppointmentID})">Delete</button>
            <button onclick="handleUpdateAppointment(${appointment.AppointmentID})">Update</button>
        `;
        appointmentList.appendChild(li);
    });
}

// Fetch and display all inventory
async function fetchInventory() {
    const response = await fetch('http://localhost:3000/bloodinventory');
    const inventory = await response.json();
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = '';
    inventory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.BloodType} - Quantity: ${item.Quantity}`;
        li.innerHTML += `
            <button onclick="handleDeleteInventory(${item.InventoryID})">Delete</button>
            <button onclick="handleUpdateInventory(${item.InventoryID})">Update</button>
        `;
        inventoryList.appendChild(li);
    });
}

// Fetch and display all reports
async function fetchReports() {
    const response = await fetch('http://localhost:3000/reports');
    const reports = await response.json();
    const reportList = document.getElementById('reportList');
    reportList.innerHTML = '';
    reports.forEach(report => {
        const li = document.createElement('li');
        li.textContent = `${report.BloodType} - Shortage: ${report.ShortageLevel}`;
        li.innerHTML += `<button onclick="handleDeleteReport(${report.ReportID})">Delete</button> <button onclick="handleUpdateReport(${report.ReportID})">Update</button>`;
        reportList.appendChild(li);
    });
}

// Fetch and display all hospitals
async function fetchHospitals() {
    const response = await fetch('http://localhost:3000/hospitals');
    const hospitals = await response.json();
    const hospitalList = document.getElementById('hospitalList');
    hospitalList.innerHTML = '';
    hospitals.forEach(hospital => {
        const li = document.createElement('li');
        li.textContent = `${hospital.Name} - ${hospital.Location}`;
        li.innerHTML += `<button onclick="handleDeleteHospital(${hospital.HospitalID})">Delete</button> <button onclick="handleUpdateHospital(${hospital.HospitalID})">Update</button>`;
        hospitalList.appendChild(li);
    });
}

// Fetch and display all transfusions
async function fetchTransfusions() {
    const response = await fetch('http://localhost:3000/transfusions');
    const transfusions = await response.json();
    const transfusionList = document.getElementById('transfusionList');
    transfusionList.innerHTML = '';
    transfusions.forEach(transfusion => {
        const li = document.createElement('li');
        li.textContent = `Donor ID: ${transfusion.DonorID} - Hospital ID: ${transfusion.HospitalID}`;
        li.innerHTML += `<button onclick="handleDeleteTransfusion(${transfusion.TransfusionID})">Delete</button> <button onclick="handleUpdateTransfusion(${transfusion.TransfusionID})">Update</button>`;
        transfusionList.appendChild(li);
    });
}
