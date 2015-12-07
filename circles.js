var circles = (function() {

    var data = [
      {x: 10.0, y: 9.14},
      {x: 15.0, y: 18.14},
      {x: 13.0, y: 28.74},
      {x: 49.0, y: 35.77},
      {x: 11.0, y: 9.26},
      {x: 23.0, y: 18.10},
      {x: 43.0, y: 16.13},
      {x: 65.0, y: 13.10},
      {x: 12.0, y: 19.13},
      {x: 30.0, y: 70.26},
      {x: 25.0, y: 40.74}
      ];

//draw circles with coordinates based on data
    function draw (data, svg) {

        //select all circle elements - returns empty selection here
        svg.selectAll("circle")

            //joins array of data to the current selection - creates a virtual selection for each data point
            .data(data)

            //creates placeholders for any data points that don't already have a circle (in this case all of them
            .enter()

            //tells it what to do for data points that aren't already represented by a circle
            .append("circle")
            .attr("class", "dot")

            //cx and cy are derived from the data
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .attr("r", 5);
    }



    return {

        render: function(placement, options) {
            
            d3.select(placement).html("");    
    
            var svg = d3.select(placement).append("svg").attr(options).append("g");
            
            draw(data, svg);

       }
    }            
})()



