document.querySelectorAll('canvas').forEach((canvas)=>{
  const myChart = new Chart(canvas, {
    type: 'doughnut',
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
})

const ctx = document.createElement('canvas');
// ctx.forEach((canvas) => {
  const myChart = new Chart(ctx, {
    type: 'doughnut',
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

