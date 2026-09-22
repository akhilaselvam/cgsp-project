async function checkEligibility() {
  const name = document.getElementById('full-name').value;
  const age = document.getElementById('age').value;
  const state = document.getElementById('state').value;
  const incomeRange = document.getElementById('income-range').value;
  const caste = document.getElementById('caste').value;
  const disabilityType = document.getElementById('disability-type').value;

  if (!name || !state) {
    showResult('Please enter at least your name and state to continue.', false);
    return;
  }

  const matchList = document.getElementById('matching-schemes');
  matchList.innerHTML = '<p>Checking matching schemes...</p>';

  try {
    const response = await fetch(`${API_BASE}/schemes`);
    const schemes = await response.json();

    const details = {
      income: incomeRange ? Number(incomeRange) : null,
      caste: caste || null,
      disability: disabilityType || null,
      age: age ? Number(age) : null
    };

    const matched = schemes.filter(scheme => isEligible(scheme, details));

    if (matched.length === 0) {
      showResult(`Hi ${name}, no schemes match the details you provided.`, false);
      matchList.innerHTML = '';
      return;
    }

    showResult(`Hi ${name}, you are eligible for ${matched.length} scheme(s) below.`, true);
    renderMatchingSchemes(matched);

  } catch (error) {
    showResult('Could not load schemes. Please check your connection.', false);
    matchList.innerHTML = '';
    console.error(error);
  }
}

function isEligible(scheme, details) {
  if (scheme.category === 'student') {
    if (scheme.maxIncome != null) {
      if (details.income == null || details.income > scheme.maxIncome) return false;
    }
    if (scheme.applicableCastes && scheme.applicableCastes.length > 0 && !scheme.applicableCastes.includes('All')) {
      if (!details.caste || !scheme.applicableCastes.includes(details.caste)) return false;
    }
    return true;
  }

  if (scheme.category === 'agriculture') {
    return true; // no restriction fields for agriculture anymore
  }

  if (scheme.category === 'physicallyChallenged') {
    if (!scheme.disabilityTypes || scheme.disabilityTypes.length === 0) return true;
    if (scheme.disabilityTypes.includes('All')) return true;
    if (!details.disability) return false;
    return scheme.disabilityTypes.includes(details.disability);
  }

  if (scheme.category === 'health') {
    if (scheme.minAge != null) {
      if (details.age == null || details.age < scheme.minAge) return false;
    }
    if (scheme.maxAge != null) {
      if (details.age == null || details.age > scheme.maxAge) return false;
    }
    if (scheme.maxIncome != null) {
      if (details.income == null || details.income > scheme.maxIncome) return false;
    }
    return true;
  }

  return true;
}

function renderMatchingSchemes(schemes) {
  const matchList = document.getElementById('matching-schemes');
  matchList.innerHTML = schemes.map(scheme => `
    <div class="scheme-card" style="margin-top:14px;">
      <div class="scheme-card-info">
        <h3>${scheme.name} <span style="font-size:12px; color:#6b7280;">(${scheme.category})</span></h3>
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