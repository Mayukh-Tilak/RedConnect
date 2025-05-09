document.addEventListener('DOMContentLoaded', () => {
    showTab('donorsTab');

    document.getElementById('donorForm').addEventListener('submit', handleAddDonor);
    document.getElementById('requestForm').addEventListener('submit', handleAddRequest);
    document.getElementById('appointmentForm').addEventListener('submit', handleAddAppointment);
    document.getElementById('inventoryForm').addEventListener('submit', handleUpdateInventory);
    document.getElementById('reportForm').addEventListener('submit', handleGenerateReport);
    document.getElementById('hospitalForm').addEventListener('submit', handleAddHospital);
    document.getElementById('transfusionForm').addEventListener('submit', handleAddTransfusion);

    fetchDonors();
    fetchRequests();
    fetchAppointments();
    fetchInventory();
    fetchReports();
    fetchHospitals();
    fetchTransfusions();
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
}

async function getCurrentData(url, id) {
    const res = await fetch(`${url}/${id}`);
    return await res.json();
}

function formatDateForPrompt(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}


// ----------------- DONORS ------------------
async function handleAddDonor(e) {
    e.preventDefault();
    const donor = {
        Name: document.getElementById('name').value,
        BloodType: document.getElementById('bloodType').value,
        Contact: document.getElementById('contact').value,
        DateOfBirth: document.getElementById('dob').value,
        Address: document.getElementById('address').value,
        LastDonationDate: document.getElementById('lastDonationDate').value
    };
    const res = await fetch('http://localhost:3000/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donor)
    });
    if (res.ok) {
        alert('Donor added!');
        fetchDonors();
    } else {
        alert('Failed to add donor');
    }
}

async function handleDeleteDonor(id) {
    await fetch(`http://localhost:3000/donors/${id}`, { method: 'DELETE' });
    fetchDonors();
}

async function handleUpdateDonor(id) {
    const donor = await getCurrentData('http://localhost:3000/donors', id);

    const newName = prompt("Enter new name:", donor.Name);
    const newBloodType = prompt("Enter new blood type:", donor.BloodType);
    const newContact = prompt("Enter new contact:", donor.Contact);
    const newDOB = prompt("Enter new DOB (DD-MM-YYYY):", formatDateForPrompt(donor.DateOfBirth));
    const newAddress = prompt("Enter new address:", donor.Address);
    const newLastDonationDate = prompt("Enter new donation date (DD-MM-YYYY):", formatDateForPrompt(donor.LastDonationDate));

    const updatedDonor = {
        Name: newName || donor.Name,
        BloodType: newBloodType || donor.BloodType,
        Contact: newContact || donor.Contact,
        DateOfBirth: newDOB || donor.DateOfBirth,
        Address: newAddress || donor.Address,
        LastDonationDate: newLastDonationDate || donor.LastDonationDate
    };

    const res = await fetch(`http://localhost:3000/donors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDonor)
    });

    if (res.ok) {
        alert('Donor updated!');
        fetchDonors();
    } else {
        alert('Failed to update donor');
    }
}


async function fetchDonors() {
    const res = await fetch('http://localhost:3000/donors');
    const donors = await res.json();
    const list = document.getElementById('donorList');
    list.innerHTML = '';
    donors.forEach(d => {
        const li = document.createElement('li');
        li.innerHTML = `${d.Name} - ${d.BloodType}
            <button onclick="handleUpdateDonor(${d.DonorID})">Update</button>
            <button onclick="handleDeleteDonor(${d.DonorID})">Delete</button>`;
        list.appendChild(li);
    });
}

// ----------------- REQUESTS ------------------
async function handleAddRequest(e) {
    e.preventDefault();
    const request = {
        HospitalID: document.getElementById('hospitalId').value,
        BloodType: document.getElementById('bloodTypeRequest').value,
        Urgency: document.getElementById('urgency').value,
        RequestStatus: document.getElementById('requestStatus').value,
        RequestDate: document.getElementById('requestDate').value
    };
    const res = await fetch('http://localhost:3000/bloodrequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });
    if (res.ok) {
        alert('Request added!');
        fetchRequests();
    } else {
        alert('Failed to add request');
    }
}

async function handleDeleteRequest(id) {
    await fetch(`http://localhost:3000/bloodrequests/${id}`, { method: 'DELETE' });
    fetchRequests();
}

async function handleUpdateRequest(id) {
    const request = await getCurrentData('http://localhost:3000/bloodrequests', id);

    const newBloodType = prompt("Enter new blood type:", request.BloodType);
    const newUrgency = prompt("Enter new urgency:", request.Urgency);
    const newRequestStatus = prompt("Enter new status:", request.RequestStatus);
    const newRequestDate = prompt("Enter new date (DD-MM-YYYY):", formatDateForPrompt(request.RequestDate));

    const updatedRequest = {
        BloodType: newBloodType || request.BloodType,
        Urgency: newUrgency || request.Urgency,
        RequestStatus: newRequestStatus || request.RequestStatus,
        RequestDate: newRequestDate || request.RequestDate
    };

    const res = await fetch(`http://localhost:3000/bloodrequests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRequest)
    });

    if (res.ok) {
        alert('Request updated!');
        fetchRequests();
    } else {
        alert('Failed to update request');
    }
}

async function fetchRequests() {
    const res = await fetch('http://localhost:3000/bloodrequests');
    const data = await res.json();
    const list = document.getElementById('requestList');
    list.innerHTML = '';
    data.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `${r.BloodType} - ${r.Urgency} - ${r.RequestStatus}
            <button onclick="handleUpdateRequest(${r.RequestID})">Update</button>
            <button onclick="handleDeleteRequest(${r.RequestID})">Delete</button>`;
        list.appendChild(li);
    });
}

// ----------------- APPOINTMENTS ------------------
async function handleAddAppointment(e) {
    e.preventDefault();
    const data = {
        DonorID: document.getElementById('donorId').value,
        Date: document.getElementById('appointmentDate').value,
        Status: document.getElementById('status').value
    };
    const res = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (res.ok) {
        alert('Appointment scheduled!');
        fetchAppointments();
    } else {
        alert('Failed to schedule appointment');
    }
}

async function handleDeleteAppointment(id) {
    await fetch(`http://localhost:3000/appointments/${id}`, { method: 'DELETE' });
    fetchAppointments();
}

async function handleUpdateAppointment(id) {
    const appointment = await getCurrentData('http://localhost:3000/appointments', id);

    const newDate = prompt("Enter new date (DD-MM-YYYY):", formatDateForPrompt(appointment.Date));
    const newStatus = prompt("Enter new status:", appointment.Status);

    const updatedAppointment = {
        Date: newDate || appointment.Date,
        Status: newStatus || appointment.Status
    };

    const res = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAppointment)
    });

    if (res.ok) {
        alert('Appointment updated!');
        fetchAppointments();
    } else {
        alert('Failed to update appointment');
    }
}

async function fetchAppointments() {
    const res = await fetch('http://localhost:3000/appointments');
    const data = await res.json();
    const list = document.getElementById('appointmentList');
    list.innerHTML = '';
    data.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `Donor ID: ${a.DonorID} - Date: ${a.Date}
            <button onclick="handleUpdateAppointment(${a.AppointmentID})">Update</button>
            <button onclick="handleDeleteAppointment(${a.AppointmentID})">Delete</button>`;
        list.appendChild(li);
    });
}

// ----------------- INVENTORY ------------------
async function handleUpdateInventory(e) {
    e.preventDefault();
    const inv = {
        HospitalID: document.getElementById('hospitalIdInventory').value,
        BloodType: document.getElementById('bloodTypeInventory').value,
        Quantity: document.getElementById('quantity').value,
        ExpiryDate: document.getElementById('expiryDate').value
    };
    const res = await fetch('http://localhost:3000/bloodinventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inv)
    });
    if (res.ok) {
        alert('Inventory updated!');
        fetchInventory();
    } else {
        alert('Failed to update inventory');
    }
}

async function handleDeleteInventory(id) {
    await fetch(`http://localhost:3000/bloodinventory/${id}`, { method: 'DELETE' });
    fetchInventory();
}

async function handleUpdateInventoryEntry(id) {
    const inventory = await getCurrentData('http://localhost:3000/bloodinventory', id);

    const newQuantity = prompt("Enter new quantity:", inventory.Quantity);
    const newExpiryDate = prompt("Enter new expiry date (DD-MM-YYYY):", formatDateForPrompt(inventory.ExpiryDate));

    const updatedInventory = {
        Quantity: newQuantity || inventory.Quantity,
        ExpiryDate: newExpiryDate || inventory.ExpiryDate
    };

    const res = await fetch(`http://localhost:3000/bloodinventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInventory)
    });

    if (res.ok) {
        alert('Inventory updated!');
        fetchInventory();
    } else {
        alert('Failed to update inventory');
    }
}

async function fetchInventory() {
    const res = await fetch('http://localhost:3000/bloodinventory');
    const data = await res.json();
    const list = document.getElementById('inventoryList');
    list.innerHTML = '';
    data.forEach(i => {
        const li = document.createElement('li');
        li.innerHTML = `${i.BloodType} - Quantity: ${i.Quantity}
            <button onclick="handleUpdateInventoryEntry(${i.InventoryID})">Update</button>
            <button onclick="handleDeleteInventory(${i.InventoryID})">Delete</button>`;
        list.appendChild(li);
    });
}

// ----------------- REPORTS ------------------
async function handleGenerateReport(e) {
    e.preventDefault();
    const report = {
        HospitalID: document.getElementById('hospitalIdReport').value,
        BloodType: document.getElementById('bloodTypeReport').value,
        ShortageLevel: document.getElementById('shortageLevel').value,
        Date: document.getElementById('reportDate').value
    };
    const res = await fetch('http://localhost:3000/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
    });
    if (res.ok) {
        alert('Report generated!');
        fetchReports();
    } else {
        alert('Failed to generate report');
    }
}

async function handleDeleteReport(id) {
    await fetch(`http://localhost:3000/reports/${id}`, { method: 'DELETE' });
    fetchReports();
}

async function handleUpdateReport(id) {
    const report = await getCurrentData('http://localhost:3000/reports', id);

    const newBloodType = prompt("Enter new blood type:", report.BloodType);
    const newShortageLevel = prompt("Enter new shortage level:", report.ShortageLevel);
    const newDate = prompt("Enter new date (DD-MM-YYYY):", formatDateForPrompt(report.Date));

    const updatedReport = {
        BloodType: newBloodType || report.BloodType,
        ShortageLevel: newShortageLevel || report.ShortageLevel,
        Date: newDate || report.Date
    };

    const res = await fetch(`http://localhost:3000/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReport)
    });

    if (res.ok) {
        alert('Report updated!');
        fetchReports();
    } else {
        alert('Failed to update report');
    }
}


async function fetchReports() {
    const res = await fetch('http://localhost:3000/reports');
    const data = await res.json();
    const list = document.getElementById('reportList');
    list.innerHTML = '';
    data.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `${r.BloodType} - Shortage: ${r.ShortageLevel}
            <button onclick="handleUpdateReport(${r.ReportID})">Update</button>
            <button onclick="handleDeleteReport(${r.ReportID})">Delete</button>`;
        list.appendChild(li);
    });
}

// ----------------- HOSPITALS ------------------
async function handleAddHospital(e) {
    e.preventDefault();
    const hospital = {
        Name: document.getElementById('hospitalName').value,
        Location: document.getElementById('hospitalLocation').value,
        Contact: document.getElementById('hospitalContact').value
    };
    const res = await fetch('http://localhost:3000/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospital)
    });
    if (res.ok) {
        alert('Hospital added!');
        fetchHospitals();
    } else {
        alert('Failed to add hospital');
    }
}

async function handleDeleteHospital(id) {
    await fetch(`http://localhost:3000/hospitals/${id}`, { method: 'DELETE' });
    fetchHospitals();
}

async function handleUpdateHospital(id) {
    const hospital = await getCurrentData('http://localhost:3000/hospitals', id);

    const newName = prompt("Enter new name:", hospital.Name);
    const newLocation = prompt("Enter new location:", hospital.Location);
    const newContact = prompt("Enter new contact:", hospital.Contact);

    const updatedHospital = {
        Name: newName || hospital.Name,
        Location: newLocation || hospital.Location,
        Contact: newContact || hospital.Contact
    };

    const res = await fetch(`http://localhost:3000/hospitals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHospital)
    });

    if (res.ok) {
        alert('Hospital updated!');
        fetchHospitals();
    } else {
        alert('Failed to update hospital');
    }
}


async function fetchHospitals() {
    const res = await fetch('http://localhost:3000/hospitals');
    const data = await res.json();
    const list = document.getElementById('hospitalList');
    list.innerHTML = '';
    data.forEach(h => {
        const li = document.createElement('li');
        li.innerHTML = `${h.Name} - ${h.Location}
            <button onclick="handleUpdateHospital(${h.HospitalID})">Update</button>
            <button onclick="handleDeleteHospital(${h.HospitalID})">Delete</button>`;
        list.appendChild(li);
    });
}

// ----------------- TRANSFUSIONS ------------------
async function handleAddTransfusion(e) {
    e.preventDefault();
    const data = {
        DonorID: document.getElementById('donorIdTransfusion').value,
        HospitalID: document.getElementById('hospitalIdTransfusion').value,
        TransfusionDate: document.getElementById('transfusionDate').value
    };
    const res = await fetch('http://localhost:3000/transfusions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (res.ok) {
        alert('Transfusion recorded!');
        fetchTransfusions();
    } else {
        alert('Failed to record transfusion');
    }
}

async function handleDeleteTransfusion(id) {
    await fetch(`http://localhost:3000/transfusions/${id}`, { method: 'DELETE' });
    fetchTransfusions();
}

async function handleUpdateTransfusion(id) {
    const transfusion = await getCurrentData('http://localhost:3000/transfusions', id);

    const newDonorID = prompt("Enter new donor ID:", transfusion.DonorID);
    const newHospitalID = prompt("Enter new hospital ID:", transfusion.HospitalID);
    const newTransfusionDate = prompt("Enter new transfusion date (DD-MM-YYYY):", formatDateForPrompt(transfusion.TransfusionDate));

    const updatedTransfusion = {
        DonorID: newDonorID || transfusion.DonorID,
        HospitalID: newHospitalID || transfusion.HospitalID,
        TransfusionDate: newTransfusionDate || transfusion.TransfusionDate
    };

    const res = await fetch(`http://localhost:3000/transfusions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTransfusion)
    });

    if (res.ok) {
        alert('Transfusion updated!');
        fetchTransfusions();
    } else {
        alert('Failed to update transfusion');
    }
}


async function fetchTransfusions() {
    const res = await fetch('http://localhost:3000/transfusions');
    const data = await res.json();
    const list = document.getElementById('transfusionList');
    list.innerHTML = '';
    data.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `Donor ID: ${t.DonorID} - Hospital ID: ${t.HospitalID}
            <button onclick="handleUpdateTransfusion(${t.TransfusionID})">Update</button>
            <button onclick="handleDeleteTransfusion(${t.TransfusionID})">Delete</button>`;
        list.appendChild(li);
    });
}