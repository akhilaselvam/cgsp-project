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

      // Hide all field groups, show only the matching one
      document.querySelectorAll('.field-group').forEach(group => group.classList.remove('show'));
      document.getElementById('fields-' + currentEligCategory).classList.add('show');

      document.getElementById('result-box').classList.remove('show');
    });
  });
});

function checkEligibility() {
  const name = document.getElementById('full-name').value;
  const state = document.getElementById('state').value;
  const resultBox = document.getElementById('result-box');

  if (!name || !state) {
    showResult('Please enter your name and state to continue.', false);
    return;
  }

  // Category-specific validation
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

  showResult(
    `Based on the details provided, ${name} may be eligible for schemes in this category. Browse the Schemes page to see matching options and apply.`,
    true
  );
}

function showResult(message, success) {
  const resultBox = document.getElementById('result-box');
  resultBox.style.background = success ? '#f0fdf4' : '#fef2f2';
  resultBox.style.color = success ? '#16a34a' : '#dc2626';
  resultBox.textContent = message;
  resultBox.classList.add('show');
}