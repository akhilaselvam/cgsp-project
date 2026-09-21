let allSchemes = [];
let currentCategory = 'student';

const categoryLabels = {
  student: 'Student',
  agriculture: 'Agriculture',
  physicallyChallenged: 'Physically Challenged',
  health: 'Health & Wellness'
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('search');
  const urlCategory = params.get('category');

  // Modal handlers (always attach)
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });

  // Tab click handlers
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.getAttribute('data-category');
      setActiveTab(currentCategory);
      loadSchemes(currentCategory);
    });
  });

  if (searchTerm) {
    // SEARCH MODE — search across all categories
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    loadSearchResults(searchTerm);
  } else {
    // NORMAL CATEGORY MODE
    if (urlCategory && categoryLabels[urlCategory]) {
      currentCategory = urlCategory;
    }
    setActiveTab(currentCategory);
    loadSchemes(currentCategory);
  }
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

async function loadSearchResults(term) {
  const container = document.getElementById('schemes-list');
  document.getElementById('category-title').textContent = `Search results for "${term}"`;
  container.innerHTML = '<p>Searching...</p>';

  try {
    const response = await fetch(`${API_BASE}/schemes`); // all schemes, all categories
    const schemes = await response.json();

    const lowerTerm = term.toLowerCase();
    const matches = schemes.filter(s =>
      s.name.toLowerCase().includes(lowerTerm) ||
      s.description.toLowerCase().includes(lowerTerm) ||
      s.department.toLowerCase().includes(lowerTerm)
    );

    allSchemes = matches;

    if (matches.length === 0) {
      container.innerHTML = `<p>No schemes found matching "${term}".</p>`;
      return;
    }

    renderSchemes(matches, term);
  } catch (error) {
    container.innerHTML = '<p>Could not load search results.</p>';
    console.error(error);
  }
}

function highlightMatch(text, term) {
  if (!term) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark style="background:#fde68a; padding:0 2px;">$1</mark>');
}

function renderSchemes(schemes, highlightTerm = null) {
  const container = document.getElementById('schemes-list');

  if (schemes.length === 0) {
    container.innerHTML = '<p>No schemes available in this category yet.</p>';
    return;
  }

  container.innerHTML = schemes.map(scheme => {
    const name = highlightTerm ? highlightMatch(scheme.name, highlightTerm) : scheme.name;
    const description = highlightTerm ? highlightMatch(scheme.description, highlightTerm) : scheme.description;

    return `
      <div class="scheme-card">
        <div class="scheme-card-info">
          <h3>${name}</h3>
          <p>${description}</p>
          <div class="scheme-meta">
            <span><strong>Department:</strong> ${scheme.department}</span>
            <span><strong>Last Date:</strong> ${scheme.lastDate}</span>
          </div>
        </div>
        <button class="btn btn-primary" onclick="viewDetails('${scheme._id}')">View Details</button>
      </div>
    `;
  }).join('');
}

function viewDetails(schemeId) {
  const scheme = allSchemes.find(s => s._id === schemeId);
  if (!scheme) return;

  document.getElementById('modal-title').textContent = scheme.name;
  document.getElementById('modal-department').textContent = scheme.department;
  document.getElementById('modal-description').textContent = scheme.description;
  document.getElementById('modal-eligibility').textContent = scheme.eligibilityCriteria;
  document.getElementById('modal-lastdate').textContent = scheme.lastDate;

  const applyBtn = document.getElementById('modal-apply-btn');
  applyBtn.onclick = () => {
    window.open(scheme.applyLink, '_blank');
  };

  document.querySelector('.modal-overlay').classList.add('active');
}

function closeModal() {
  document.querySelector('.modal-overlay').classList.remove('active');
}