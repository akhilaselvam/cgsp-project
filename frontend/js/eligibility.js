const categoryTitles = {
  student: '🎓 Student Eligibility',
  agriculture: '🌾 Agriculture Eligibility',
  physicallyChallenged: '♿ Physically Challenged Eligibility',
  health: '❤️ Health & Wellness Eligibility'
};

let currentEligCategory = 'student';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.eligibility-sidebar button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.eligibility-sidebar button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentEligCategory = btn.getAttribute('data-cat');
      document.getElementById('form-heading').textContent = categoryTitles[currentEligCategory];

      document.querySelectorAll('.field-group').forEach(group => group.classList.remove('show'));
      document.getElementById('fields-' + currentEligCategory).classList.add('show');

      document.getElementById('result-box').classList.remove('show');
      document.getElementById('matching-schemes').innerHTML = '';
    });
  });
});

async function checkEligibility() {
  const name = document.getElementById('full-name').value;
  const state = document.getElementById('state').value;

  if (!name || !state) {
    showResult('Please enter your name and state to continue.', false);
    return;
  }

  if (currentEligCategory === 'student') {
    const field = document.getElementById('field-of-study').value;
    const education = document.getElementById('education-level').value;
    const income = document.getElementById('income-student').value;
    if (!field || !education || !income) {
      showResult('Please fill in all student details to check eligibility.', false);
      return;
    }
  }
  if (currentEligCategory === 'agriculture') {
    const land = document.getElementById('land-area').value;
    if (!land) {
      showResult('Please enter your land area to check eligibility.', false);
      return;
    }
  }
  if (currentEligCategory === 'physicallyChallenged') {
    const disability = document.getElementById('disability-type').value;
    if (!disability) {
      showResult('Please select your disability type to check eligibility.', false);
      return;
    }
  }
  if (currentEligCategory === 'health') {
    const age = document.getElementById('age').value;
    const income = document.getElementById('income-health').value;
    if (!age || !income) {
      showResult('Please fill in age and income to check eligibility.', false);
      return;
    }
  }

  // Fetch real schemes for this category from the database
  const matchList = document.getElementById('matching-schemes');
  matchList.innerHTML = '<p>Checking matching schemes...</p>';

  try {
    const response = await fetch(`${API_BASE}/schemes/${currentEligCategory}`);
    const schemes = await response.json();

    if (schemes.length === 0) {
      showResult(`Hi ${name}, no schemes are currently listed in this category. Please check back later.`, false);
      matchList.innerHTML = '';
      return;
    }

    showResult(`Hi ${name}, based on your details, here are the schemes available in this category. Please read each scheme's eligibility criteria carefully to confirm you qualify.`, true);
    renderMatchingSchemes(schemes);

  } catch (error) {
    showResult('Could not load schemes. Please check your connection.', false);
    matchList.innerHTML = '';
    console.error(error);
  }
}

function renderMatchingSchemes(schemes) {
  const matchList = document.getElementById('matching-schemes');
  matchList.innerHTML = schemes.map(scheme => `
    <div class="scheme-card" style="margin-top:14px;">
      <div class="scheme-card-info">
        <h3>${scheme.name}</h3>
        <p><strong>Eligibility:</strong> ${scheme.eligibilityCriteria}</p>
        <div class="scheme-meta">
          <span><strong>Department:</strong> ${scheme.department}</span>
          <span><strong>Last Date:</strong> ${scheme.lastDate}</span>
        </div>
      </div>
      <button class="btn btn-primary" onclick="window.open('${scheme.applyLink}', '_blank')">Apply Now →</button>
    </div>
  `).join('');
}

function showResult(message, success) {
  const resultBox = document.getElementById('result-box');
  resultBox.style.background = success ? '#f0fdf4' : '#fef2f2';
  resultBox.style.color = success ? '#16a34a' : '#dc2626';
  resultBox.textContent = message;
  resultBox.classList.add('show');
}