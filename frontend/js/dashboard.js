document.addEventListener('DOMContentLoaded', loadStats);

async function loadStats() {
  try {
    const response = await fetch(`${API_BASE}/schemes`);
    const schemes = await response.json();

    document.getElementById('stat-total').textContent = schemes.length;
    document.getElementById('stat-student').textContent =
      schemes.filter(s => s.category === 'student').length;
    document.getElementById('stat-agriculture').textContent =
      schemes.filter(s => s.category === 'agriculture').length;
    document.getElementById('stat-physicallyChallenged').textContent =
      schemes.filter(s => s.category === 'physicallyChallenged').length;
    document.getElementById('stat-health').textContent =
      schemes.filter(s => s.category === 'health').length;

  } catch (error) {
    console.error('Could not load stats:', error);
  }
}