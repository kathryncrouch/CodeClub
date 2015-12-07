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
    function draw (data, svg, xScale, yScale) {
        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) {
                return xScale(d.x);
            })
            .attr("cy", function(d) {
                return yScale(d.y);
            })
            .attr("r", 5);
    }

/* scale takes a domain - min and max extent of data
            and a range - min and max extent of canvas*/
    function scale(data, range, axis) {
        var scale = d3.scale.linear()
            //extent returns min and max values of data
            .domain(d3.extent(data, function(d) {
                return d[axis];
            }))
            .range(range)
        
            //makes scale end at rounded values
            .nice();
        return scale;
    }

    // this make a virtual axis, but doesn't draw it yet
    function makeAxis(scale, orientation, tickPadding) {
        var axis = d3.svg.axis()
            .scale(scale)
            .orient(orientation)
            .tickPadding(tickPadding);
        return axis;
    }


    return {

        render: function(placement, options) {
            
            d3.select(placement).html("");    
            
            //make  svg element and group 
            var svg = d3.select(placement).append("svg").attr(options).append("g");
            
            //margin is used to give space for axis labels etc
            var margin = {top: 50, right: 50, bottom: 50, left: 50};
            
            //make scaling functions
            var xScale = scale(data, [margin.left, options.width - margin.left - margin.right], "x");
            //coords start from top left, so need to invert y scale
            var yScale = scale(data, [options.height - margin.top - margin.bottom, margin.bottom], "y");

            //make axes
            var xAxis = makeAxis(xScale, "bottom", 4);
            var yAxis = makeAxis(yScale, "left", 10);

            // append group for axis, and draw
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + yScale.range()[0] + ")")
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + xScale.range()[0] + ")", 0)
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .call(yAxis);

            draw(data, svg, xScale, yScale);

            //select text elements that are children of axes for formattting
            svg.selectAll(".axis").selectAll("text")
                .style("fill", "black")
                .style("stroke", "none");

       }
    }            
})()



