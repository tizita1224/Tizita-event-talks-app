document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('searchInput');

  function renderSchedule(filter = '') {
    scheduleContainer.innerHTML = '';
    const lowerCaseFilter = filter.toLowerCase();

    scheduleData.forEach(item => {
      if (item.type === 'talk') {
        const hasCategory = item.categories.some(category => category.toLowerCase().includes(lowerCaseFilter));
        if (filter && !hasCategory) {
          return;
        }

        const talkElement = document.createElement('div');
        talkElement.className = 'schedule-item';
        talkElement.innerHTML = `
          <div class="time">
            ${item.startTime} - ${item.endTime}
          </div>
          <div class="details">
            <h2>${item.title}</h2>
            <div class="speakers">${item.speakers.join(', ')}</div>
            <div class="categories">
              ${item.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
            </div>
            <p class="description">${item.description}</p>
          </div>
        `;
        scheduleContainer.appendChild(talkElement);
      } else if (item.type === 'break' && !filter) {
        const breakElement = document.createElement('div');
        breakElement.className = 'schedule-item break';
        breakElement.innerHTML = `
          <div class="time">
            ${item.startTime} - ${item.endTime}
          </div>
          <div class="details">
            <h2>${item.title}</h2>
          </div>
        `;
        scheduleContainer.appendChild(breakElement);
      }
    });
  }

  searchInput.addEventListener('input', (e) => {
    renderSchedule(e.target.value);
  });

  renderSchedule();
});
