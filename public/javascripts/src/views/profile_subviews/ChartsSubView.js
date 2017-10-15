const Languages = require('../../collections/StatisticLanguages')
const Frameworks = require('../../collections/StatisticFrameworks')
const Technologys = require('../../collections/StatisticTechnologys')

module.exports = Mn.View.extend({
  className: 'box-canvas-profile',
  template: '#sub-view-charts',
  ui: {
    'progress-bar': '.progress-bar',
    'button-switch-chart': "button[role='btn-chart-type']",
  },
  events: {
    'click @ui.button-switch-chart': 'renderChart',
  },
  initialize: function() {
    this.user_id = this.options.user_id;

    this.CollectionLanguages = new Languages([], {
      user_id: this.user_id
    });

    this.CollectionFrameworks = new Frameworks([], {
      user_id: this.user_id
    });

    this.CollectionTechnologys = new Technologys([], {
      user_id: this.user_id
    });

    this.default_statistic_type = 'languages';

    this.statistic_types = {
      languages:    ['Times used this language', this.CollectionLanguages],
      frameworks:   ['Times used this framework', this.CollectionFrameworks],
      technologys:  ['Times used this technology', this.CollectionTechnologys]
    }

    this.listenTo(this.statistic_types[this.default_statistic_type][1], 'add', this.renderDefaultChart);
  },
  renderChart: function (event) {
    var that = this,
        button = $(event.target);

    // TODO: Fix esto: Esta renderizando el chart aunque ya este renderizado este tipo
    if (!button.hasClass('active')) {
      var chart_type = button.data('chart');

      button.addClass('active');

      $('.btn-sm.active').removeClass('active');

      this.Chart.config.data.datasets[0].label = this.statistic_types[chart_type][0];

      this.statistic_types[chart_type][1].each(function(model) {
        that.moveChart(model.get('count'), model.get('name'));
      })
    }
  },
  renderDefaultChart: function (model) {
    /*
     * Render per default de chart of languages when render de view
     * */
    this.moveChart(model.get('count'), model.get('name'));
  },
  onBeforeRender: function () {
    this.CollectionLanguages.fetch();
    this.CollectionFrameworks.fetch();
    this.CollectionTechnologys.fetch();
  },
  onRender: function () {
    this.renderInitialChart();

    // TODO: Fix esto: no agrega la clase active al boton del statistic type por defecto
    $("button[data-chart='" + this.default_statistic_type + "']").addClass('active');
  },
  renderInitialChart: function () {
    var initial_datasets_labels = this.statistic_types[this.default_statistic_type][0];

    this.Chart = new Chart(this.$el.find('canvas'), {
      type: 'bar',
      data: {
        labels: ['', '', '', '', '', ''],
        datasets: [{
          label: initial_datasets_labels,
          data: [1, 1, 1, 1, 1, 1],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  },
  moveChart: function(data, label) {
    this.Chart.data.labels.push(label);  // Add new label at end
    this.Chart.data.labels.splice(0, 1); // Remove first label

    this.Chart.data.datasets.forEach(function(dataset) {
      dataset.data.push(data);           // Add new data at end
      dataset.data.splice(0, 1);         // Remove first data point
    });

    this.Chart.update();
  }
});