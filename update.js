var liveVis = (function() {

    //get a random number in a set range
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /*generate a random dataset
        random number of data points in form
        x, y, r, i
    */
    var makeRandomDataset = function() {
        var values = getRandomInt(3,100);
        var randomData = [];
        for (var i = 0; i < values; i++) {
            randomData.push({x: getRandomInt(10,800), y: getRandomInt(50, 800), r: getRandomInt(2,100), i: getRandomInt(0,1000)})
        }
        return randomData;
    }

    //makes an array of 20 colour values
    var colors = d3.scale.category20()

    //draw dataset
    var update = function(data, svg) {
        //select all circles and bind data
        var dataEntry = svg.selectAll("circle")
            .data(data);
        
        //for any data points not already associated with a circle, draw one
        dataEntry.enter().append("circle").style("fill", "#000000");

        /*for any existing circles where the data has changed, redraw
          existing circles where the data does not change will not be touched */
        dataEntry.transition("elastic").duration(2000)

            //x, y, radius and colour derived from data
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .attr("r", function(d) {
                return d.r;
            })
//            .style("fill", function(d, i) {
//               return colors(i);
            .style("fill", function(d) {
                return colors(d.i);
            });
        
        //circles which no longer have data associated with them turn black, then fade out
        dataEntry.exit().transition("elastic").style("fill", "#000000").duration(2000).attr("r", 0).remove();
    }

    return {
        render: function(placement, options) {
            d3.select(placement).html("");

            var svg = d3.select(placement).append("svg").attr(options).append("g");

            //update function run every 2000ms
            setInterval(function(){
                        var randomData = makeRandomDataset();
                        update(randomData,svg);
            }, 2000)
        }
    }
})()
