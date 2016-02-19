// var chart = c3.generate({
//     data: {
//         columns: [
//             ['data1', 30, 20, 50, 40, 60, 50],
//             ['data2', 200, 130, 90, 240, 130, 220],
//             ['data3', 300, 200, 160, 400, 250, 250]
//         ],
//         type: 'bar',
//         colors: {
//             data1: '#ff0000',
//             data2: '#00ff00',
//             data3: '#0000ff'
//         },
//         color: function (color, d) {
//             // d will be 'id' when called for legends
//             return d.id && d.id === 'data3' ? d3.rgb(color).darker(d.value / 150) : color;
//         }
//     }
// });


 var chart = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      columns: [
         ['x', '2015-11-25', '2015-11-26', '2015-11-27', '2015-11-28', '2015-11-29',
          '2015-11-30', '2015-12-01', '2015-12-02', '2015-12-03','2015-12-04'
          ,'2015-12-05','2015-12-06','2015-12-07'],
        ['data1', 40, 85, 25, 65, 89, 46, 58, 74, 90, 37, 49, 81, 69],

        ['data2', 40, 85, 25, 65, 89, 46, 58, 74, 90, 37, 49, 81, 69]
      ],

     
      names: {
            data1: '# Customers',
            data2: '# Customers'
        },

      axes: {
        data2: 'y1'
      },
      types: {
        data2: 'bar' // ADD

      },
      color: function (color, d) {
            console.log(d.value);
            if(d.value>=85)
              return "#3ADF00";
            if(d.value<85&&d.value>=65)
              return "#FFFF00";
            if(d.value<65)
              return "#FF0000";
        }

    },

    legend: {
        hide: 'data2'
    },
    tooltip: {
        grouped: false // Default true
    },
    axis: {
      y: {
        label: {
          text: 'Score',
          position: 'outer-middle'
        }
      },
      x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        },

      y2: {
        show: false,
        label: {
          //text: 'Y2 Label',
          position: 'outer-middle'
        }
      }
    }
});
