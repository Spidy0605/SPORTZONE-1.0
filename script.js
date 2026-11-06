const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  menuToggle.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.textContent = '☰';
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const matchCards = document.querySelectorAll('.match-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    const filter = button.dataset.filter;
    matchCards.forEach(card => {
      card.style.display = filter === 'all' || card.dataset.sport === filter ? 'block' : 'none';
    });
  });
});
