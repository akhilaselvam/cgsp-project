let allSchemes = [];
let currentCategory = 'student';

const categoryLabels = {
  student: 'Student',
  agriculture: 'Agriculture',
  physicallyChallenged: 'Physically Challenged',
  health: 'Health & Wellness'
};

document.addEventListener('DOMContentLoaded', () => {
  // Read category from URL (?category=student)
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get('category');
  if (urlCategory && categoryLabels[urlCategory]) {
    currentCategory = urlCategory;
  }

  setActiveTab(currentCategory);
  loadSchemes(currentCategory);

  // Tab click handlers
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.getAttribute('data-category');
      setActiveTab(currentCategory);
      loadSchemes(currentCategory);
    });
  });

  // Modal close handlers
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });
});

function setActiveTab(category) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });
  document.getElementById('category-title').textContent = categoryLabels[category] + ' Schemes';
}

async function loadSchemes(category) {
  const container = document.getElementById('schemes-list');
  container.innerHTML = '<p>Loading schemes...</p>';

  try {
    const response = await fetch(`${API_BASE}/schemes/${category}`);
    const schemes = await response.json();
    allSchemes = schemes;
    renderSchemes(schemes);
  } catch (error) {
    container.innerHTML = '<p>Could not load schemes. Please check your connection.</p>';
    console.error(error);
  }
}

function renderSchemes(schemes) {
  const container = document.getElementById('schemes-list');

  if (schemes.length === 0) {
    container.innerHTML = '<p>No schemes available in this category yet.</p>';
    return;
  }

  container.innerHTML = schemes.map(scheme => `
    <div class="scheme-card">
      <div class="scheme-card-info">
        <h3>${scheme.name}</h3>
        <p>${scheme.description}</p>
        <div class="scheme-meta">
          <span><strong>Department:</strong> ${scheme.department}</span>
          <span><strong>Last Date:</strong> ${scheme.lastDate}</span>
        </div>
      </div>
      <button class="btn btn-primary" onclick="viewDetails('${scheme._id}')">View Details</button>
    </div>
  `).join('');
}

function viewDetails(schemeId) {
  const scheme = allSchemes.find(s => s._id === schemeId);
  if (!scheme) return;

  document.getElementById('modal-title').textContent = scheme.name;
  document.getElementById('modal-department').textContent = scheme.department;
  document.getElementById('modal-description').textContent = scheme.description;
  document.getElementById('modal-eligibility').textContent = scheme.eligibilityCriteria;
  document.getElementById('modal-lastdate').textContent = scheme.lastDate;

  // Apply button opens the official scheme link in a new tab
  const applyBtn = document.getElementById('modal-apply-btn');
  applyBtn.onclick = () => {
    window.open(scheme.applyLink, '_blank');
  };

  document.querySelector('.modal-overlay').classList.add('active');
}

function closeModal() {
  document.querySelector('.modal-overlay').classList.remove('active');
}