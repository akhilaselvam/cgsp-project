document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-scheme-form');
  form.addEventListener('submit', handleAddScheme);

  const categorySelect = document.getElementById('category');
  categorySelect.addEventListener('change', () => {
    document.querySelectorAll('.field-group').forEach(g => g.classList.remove('show'));
    const selected = categorySelect.value;
    if (selected && document.getElementById('match-' + selected)) {
      document.getElementById('match-' + selected).classList.add('show');
    }
  });
});

function getSelectedValues(selectId) {
  const select = document.getElementById(selectId);
  return Array.from(select.selectedOptions).map(opt => opt.value);
}

async function handleAddScheme(e) {
  e.preventDefault();

  const category = document.getElementById('category').value;

  const schemeData = {
    name: document.getElementById('name').value,
    category: category,
    department: document.getElementById('department').value,
    description: document.getElementById('description').value,
    eligibilityCriteria: document.getElementById('eligibilityCriteria').value,
    lastDate: document.getElementById('lastDate').value,
    applyLink: document.getElementById('applyLink').value,
    maxIncome: null,
    applicableCastes: [],
    disabilityTypes: [],
    minAge: null,
    maxAge: null
  };

  if (category === 'student') {
    const income = document.getElementById('maxIncome-student').value;
    schemeData.maxIncome = income ? Number(income) : null;
    schemeData.applicableCastes = getSelectedValues('applicableCastes-student');
  }

  if (category === 'physicallyChallenged') {
    schemeData.disabilityTypes = getSelectedValues('disabilityTypes');
  }

  if (category === 'health') {
    const minAge = document.getElementById('minAge').value;
    const maxAge = document.getElementById('maxAge').value;
    const income = document.getElementById('maxIncome-health').value;
    schemeData.minAge = minAge ? Number(minAge) : null;
    schemeData.maxAge = maxAge ? Number(maxAge) : null;
    schemeData.maxIncome = income ? Number(income) : null;
  }

  try {
    const response = await fetch(`${API_BASE}/schemes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(schemeData)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Failed to add scheme', false);
      return;
    }

    showMessage('Scheme added successfully!', true);
    document.getElementById('add-scheme-form').reset();
    document.querySelectorAll('.field-group').forEach(g => g.classList.remove('show'));

  } catch (error) {
    showMessage('Could not connect to server.', false);
    console.error(error);
  }
}

function showMessage(text, success) {
  const messageBox = document.getElementById('form-message');
  messageBox.textContent = text;
  messageBox.style.display = 'block';
  messageBox.style.background = success ? '#f0fdf4' : '#fef2f2';
  messageBox.style.color = success ? '#16a34a' : '#dc2626';
  setTimeout(() => { messageBox.style.display = 'none'; }, 4000);
}