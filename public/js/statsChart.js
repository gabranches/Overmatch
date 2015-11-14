 me.generateChart = function (data) {

        console.log(data);

        var labels = [];
        for (var i=1; i < data.result.length; i++) {
            if (data.result[i] == 0) {
                data.result[i] = data.result[i-1];
            }
            labels.push(i);
        }

        var options = {
                scaleShowGridLines : true,
                scaleGridLineColor : "rgba(255, 255, 255, 0.06)",
                scaleGridLineWidth : 1,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: false,
                bezierCurve : false,
                bezierCurveTension : 0.4,
                pointDot : true,
                pointDotRadius : 4,
                pointDotStrokeWidth : 1,
                pointHitDetectionRadius : 20,
                datasetStroke : true,
                datasetStrokeWidth : 2,
                datasetFill : true,
                scaleOverride: true, 
                scaleStartValue: 0, 
                scaleStepWidth: 1, 
                scaleSteps: 10
        };

        var chartData = {
            labels: labels,
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: data.result
                }

            ]
        };

        var ctx = $("#chart").get(0).getContext("2d");
        var statsChart = new Chart(ctx).Line(chartData, options);
    }


    // Table events

    $(document).on('click', '.data-row',  function () {
        $(".data-row").hide();
        $(this).show();
        var data = {
            hero: $(this).attr('data-hero'),
            opponent: $(this).attr('data-opponent'),
            type: $(this).attr('data-type'),
            days: settings.days,
            socketID: client.socketID
        };
        socketHelper.emit('get-graph-data', data);
    });