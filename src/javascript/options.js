document.querySelectorAll('canvas').forEach((canvas)=>{
  const myChart = new Chart(canvas, {
    type: 'bar',
    data: {
        labels: [
          'Red',
          'Blue',
          'Yellow',
          'Red',
          'Blue',
          'Yellow',
          'Yellow',
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100, 500, 332, 452, 124],
          backgroundColor: [
            '#003f5c',
            '#374c80',
            '#7a5195',
            '#bc5090',
            '#ef5675',
            '#ff764a',
            '#ffa600',
          ],
          hoverOffset: 4
        }]
    },
    options:{
        responsive: false,
        maintainAspectRatio: false,
    }
});
})

const ctx = document.createElement('canvas');
// ctx.forEach((canvas) => {
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
    },
    options:{
        responsive: false,
        maintainAspectRatio: false,
    }
});

document.body.append(ctx)
// })

