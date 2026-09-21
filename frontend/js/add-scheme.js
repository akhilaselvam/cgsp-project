document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-scheme-form');
  form.addEventListener('submit', handleAddScheme);
});

async function handleAddScheme(e) {
  e.preventDefault();

  const messageBox = document.getElementById('form-message');

  const schemeData = {
    name: document.getElementById('name').value,
    category: document.getElementById('category').value,
    department: document.getElementById('department').value,
    description: document.getElementById('description').value,
    eligibilityCriteria: document.getElementById('eligibilityCriteria').value,
    lastDate: document.getElementById('lastDate').value,
    applyLink: document.getElementById('applyLink').value
  };

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

  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 4000);
}