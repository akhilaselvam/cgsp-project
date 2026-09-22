let allSchemesData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadAllSchemes();

  document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allSchemesData.filter(s => s.name.toLowerCase().includes(term));
    renderTable(filtered);
  });

  document.getElementById('edit-modal-close').addEventListener('click', closeEditModal);
  document.getElementById('edit-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal') closeEditModal();
  });

  document.getElementById('edit-scheme-form').addEventListener('submit', handleEditSubmit);
});

async function loadAllSchemes() {
  try {
    const response = await fetch(`${API_BASE}/schemes`);
    const schemes = await response.json();
    allSchemesData = schemes;
    renderTable(schemes);
  } catch (error) {
    document.getElementById('schemes-table-body').innerHTML =
      '<tr><td colspan="4">Could not load schemes.</td></tr>';
    console.error(error);
  }
}

function renderTable(schemes) {
  const tbody = document.getElementById('schemes-table-body');
  if (schemes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No schemes found.</td></tr>';
    return;
  }
  tbody.innerHTML = schemes.map(scheme => `
    <tr>
      <td>${scheme.name}</td>
      <td>${scheme.category}</td>
      <td>${scheme.department}</td>
      <td>
        <button class="btn-edit" onclick="openEditModal('${scheme._id}')">Edit</button>
        <button class="btn-delete" onclick="deleteScheme('${scheme._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function setMultiSelectValues(selectId, values) {
  const select = document.getElementById(selectId);
  if (!select) return;
  Array.from(select.options).forEach(opt => {
    opt.selected = !!(values && values.includes(opt.value));
  });
}

function getMultiSelectValues(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return [];
  return Array.from(el.selectedOptions).map(opt => opt.value);
}

function openEditModal(id) {
  const scheme = allSchemesData.find(s => s._id === id);
  if (!scheme) {
    alert('Scheme not found.');
    return;
  }

  document.getElementById('edit-id').value = scheme._id;
  document.getElementById('edit-name').value = scheme.name || '';
  document.getElementById('edit-category').value = scheme.category || '';
  document.getElementById('edit-department').value = scheme.department || '';
  document.getElementById('edit-description').value = scheme.description || '';
  document.getElementById('edit-eligibilityCriteria').value = scheme.eligibilityCriteria || '';
  document.getElementById('edit-lastDate').value = scheme.lastDate || '';
  document.getElementById('edit-applyLink').value = scheme.applyLink || '';

  const maxIncomeField = document.getElementById('edit-maxIncome');
  if (!maxIncomeField) {
    alert('ERROR: edit-maxIncome field not found in HTML. The page did not load correctly.');
    return;
  }
  maxIncomeField.value = (scheme.maxIncome !== null && scheme.maxIncome !== undefined) ? scheme.maxIncome : '';

  setMultiSelectValues('edit-applicableCastes', scheme.applicableCastes);
  setMultiSelectValues('edit-disabilityTypes', scheme.disabilityTypes);

  document.getElementById('edit-minAge').value = (scheme.minAge !== null && scheme.minAge !== undefined) ? scheme.minAge : '';
  document.getElementById('edit-maxAge').value = (scheme.maxAge !== null && scheme.maxAge !== undefined) ? scheme.maxAge : '';

  document.getElementById('edit-caste-group').style.display = scheme.category === 'student' ? 'block' : 'none';
  document.getElementById('edit-disability-group').style.display = scheme.category === 'physicallyChallenged' ? 'block' : 'none';
  document.getElementById('edit-age-group').style.display = scheme.category === 'health' ? 'block' : 'none';

  document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('active');
}

async function handleEditSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('edit-id').value;
  const category = document.getElementById('edit-category').value;
  const maxIncomeField = document.getElementById('edit-maxIncome');
  const maxIncomeRaw = maxIncomeField ? maxIncomeField.value : '';

  const updatedData = {
    name: document.getElementById('edit-name').value,
    category: category,
    department: document.getElementById('edit-department').value,
    description: document.getElementById('edit-description').value,
    eligibilityCriteria: document.getElementById('edit-eligibilityCriteria').value,
    lastDate: document.getElementById('edit-lastDate').value,
    applyLink: document.getElementById('edit-applyLink').value,
    maxIncome: maxIncomeRaw !== '' ? Number(maxIncomeRaw) : null,
    applicableCastes: getMultiSelectValues('edit-applicableCastes'),
    disabilityTypes: getMultiSelectValues('edit-disabilityTypes'),
    minAge: document.getElementById('edit-minAge').value !== '' ? Number(document.getElementById('edit-minAge').value) : null,
    maxAge: document.getElementById('edit-maxAge').value !== '' ? Number(document.getElementById('edit-maxAge').value) : null
  };

  try {
    const response = await fetch(`${API_BASE}/schemes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData)
    });

    const result = await response.json();

    if (!response.ok) {
      alert('Failed to update: ' + (result.message || 'Unknown error'));
      return;
    }

    alert('Saved! Max Income is now: ' + result.maxIncome);
    closeEditModal();
    loadAllSchemes();

  } catch (error) {
    alert('Could not connect to server.');
    console.error(error);
  }
}

async function deleteScheme(id) {
  if (!confirm('Delete this scheme?')) return;
  try {
    const response = await fetch(`${API_BASE}/schemes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      alert('Failed to delete scheme.');
      return;
    }
    loadAllSchemes();
  } catch (error) {
    alert('Could not connect to server.');
    console.error(error);
  }
}