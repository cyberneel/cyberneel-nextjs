
document.addEventListener('mousemove', (event) => {
  const mask = document.querySelector('.background-mask');
  if (mask) {
    mask.style.setProperty('--mask-x', `${event.clientX}px`);
    mask.style.setProperty('--mask-y', `${event.clientY}px`);
  }
});
