app.controller('report:list', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $rootScope.actionHelper($scope, {}, '/api/report/usage', 'GET', function(data){
    var name, yearMonth, i, j;
    var categories = [];
    var toalData = [];

    for(name in data.reports){
      for(yearMonth in data.reports[name]){
        if(categories.indexOf(yearMonth) < 0){ categories.push(yearMonth); }
      }
    }

    if(categories.length === 1){ categories[1] = categories[0]; }

    var chartData = {
      title: {
        text: $rootScope.team.name + ' messages',
        align: 'left',
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: { text: 'Message Count' },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      plotOptions: {
        line: {
          dataLabels: { enabled: true },
          enableMouseTracking: true
        }
      },
      tooltip: { valueSuffix: ' messages' },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        borderWidth: 1
      },
      series: []
    };

    for(name in data.reports){
      var localData = [];
      for(i in categories){
        yearMonth = categories[i];
        if(!data.reports[name][yearMonth]){ data.reports[name][yearMonth] = 0; }
        localData.push(data.reports[name][yearMonth]);

        if(!toalData[i]){ toalData[i] = 0; }
        toalData[i] = toalData[i] + data.reports[name][yearMonth];
      }
      chartData.series.push({
        name: name,
        data: localData
      });
    }

    chartData.series.push({
      name: 'Total',
      data: toalData,
      lineWidth: 5,
    });

    // hadck to defer loading to next cycle
    setTimeout(function(){
      $('#reportUsage').highcharts(chartData);
    }, 1);
  });


  $rootScope.actionHelper($scope, {}, '/api/report/billing', 'GET', function(data){
    $scope.charges = data.reports.charges;
  });
}]);
