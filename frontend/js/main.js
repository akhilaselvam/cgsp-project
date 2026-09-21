// ===== SHARED CONFIG (used by all pages) =====
const API_BASE = 'https://cgsp-backend-vl26.onrender.com/api';

// ===== HOME PAGE: category card clicks =====
document.addEventListener('DOMContentLoaded', () => {
  const categoryCards = document.querySelectorAll('.category-card');

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      // Redirect to schemes.html with category in the URL query
      window.location.href = `schemes.html?category=${category}`;
    });
  });

  // Search box - redirect to schemes page with search term (basic version)
  const searchInput = document.querySelector('.search-box input');
  const searchBox = document.querySelector('.search-box');
  if (searchBox) {
    searchBox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        window.location.href = `schemes.html?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }
});