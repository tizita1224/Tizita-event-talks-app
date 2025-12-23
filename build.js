const fs = require('fs');

const talks = require('./talks.json');

function generateSchedule() {
  const schedule = [];
  let currentTime = new Date();
  currentTime.setHours(10, 0, 0, 0);

  talks.forEach((talk, index) => {
    const startTime = new Date(currentTime);
    const endTime = new Date(startTime.getTime() + talk.duration * 60000);
    
    schedule.push({
      type: 'talk',
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...talk
    });

    currentTime = new Date(endTime.getTime());

    if (index === 2) { // Lunch break after the 3rd talk
      const lunchStartTime = new Date(currentTime);
      const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
      schedule.push({
        type: 'break',
        title: 'Lunch Break',
        startTime: lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      currentTime = new Date(lunchEndTime.getTime());
    } else if (index < talks.length - 1) { // Transition break
      const breakStartTime = new Date(currentTime);
      const breakEndTime = new Date(breakStartTime.getTime() + 10 * 60000);
      schedule.push({
        type: 'break',
        title: 'Transition',
        startTime: breakStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: breakEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      currentTime = new Date(breakEndTime.getTime());
    }
  });

  return schedule;
}

const schedule = generateSchedule();

let template = fs.readFileSync('template.html', 'utf-8');
const style = fs.readFileSync('style.css', 'utf-8');
const script = fs.readFileSync('script.js', 'utf-8');

template = template.replace('{{style}}', `<style>${style}</style>`);
template = template.replace('{{script}}', `<script>const scheduleData = ${JSON.stringify(schedule)};
${script}</script>`);

fs.writeFileSync('index.html', template);

console.log('Successfully generated index.html');
