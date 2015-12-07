var circles = (function() {


//add circles and text to data point nodes
    function draw (data, svg, colors) {
        svg.append("circle")
            .attr("class", "dot")
            .attr("r", 5)
            .style("fill", function(d) {
                return colors(d.manufacturer);
            });
         svg.append("text")
            .style("text-anchor", "middle")
            .attr("dy", -10)
            .text(function (d) {
                return d.name;
            })
    }

    function scale(data, range, axis, x) {
        var extent = d3.extent (data, function(d) {
            return d[axis];
        });
        var scale = d3.scale.linear()
            .domain([d3.min(extent) -x , d3.max(extent) +x])
            .range(range);
        return scale;
    }

    function makeAxis (scale, orient, tickPad) {
        var axis = d3.svg.axis()
            .scale(scale) 
            .orient(orient)
            .tickPadding(tickPad);
       
        return axis;
    }

    /*nodeGroup is an abstract group that is bound to the data
    allows text label to become part of point
    and gives larger target area for mouse events */
    function makeNodeGroup (data, svg, xScale, yScale, htmlClass, nodeName) {
        var dataPoint = svg.selectAll("g." + nodeName).data(data, function(d) {
            return d.name;
        });

        var nodeGroup = dataPoint.enter().append("g").attr("class", htmlClass)
            .attr("transform", function(d) {
                d.scale = 1;
                return "translate(" + xScale(d.price) + "," + yScale(d.rating) + ")";
            });
        return nodeGroup;
    }


    return {

        render: function(placement, options, file) {
            
            /*load from json file
              requires callback function
                in this case, callback wraps the rest */
            d3.json(file, function(jsonData) {
            
                var data = jsonData.chocolates;
                d3.select(placement).html("");    

                var margin = {top: 50, right: 50, bottom: 50, left: 150};
               
                var xScale = scale(data, [margin.left, options.width - margin.left - margin.right], "price", 1);
                var yScale = scale(data, [options.height - margin.top - margin.bottom, margin.bottom], "rating", 0.5);

                var xAxis = makeAxis(xScale, "bottom", 4);
                var yAxis = makeAxis(yScale, "left", 10);
                
                /* NOTE - this actually makes a scale
                i.e., a function that will fit the domain of your data
                to the range of colours available */
                var colors = d3.scale.category10();
                
                //defines what happens when an area is brushed - called below
               var brushed = function () {
                    var extent = brush.extent();
                    //empty associative array for selected data points
                    selected = {};
                    //function defines node behaviour on brush 
                    d3.selectAll("g.chocolateNode").attr("transform", function(d) {
                        d.selected = (xScale(d.price) > xScale(extent[0][0]) && xScale(d.price) < xScale(extent[1][0])) && (yScale(d.rating) < yScale(extent[0][1]) && yScale(d.rating) > yScale(extent[1][1]));
                        if(d.selected) {
                            selected[d.name] = d;
                        }
                        return d.selected ? "translate(" + xScale(d.price) + "," + yScale(d.rating) + ")scale(2)" : "translate(" + xScale(d.price) + "," + yScale(d.rating) + ")";
                    });
                }            
    
                var brush = d3.svg.brush()
                    .x(xScale)
                    .y(yScale)
                    //when brush starts, reset selected data points
                    .on("brushstart", function() {
                        console.log("Resetting selected var");
                        selected = {};
                    })
                    //while there is an active brush, perform behaviour in brushed function above
                    .on("brush", brushed)
    
                    //return selected data points
                    .on("brushend", function() {
                        console.log("Selected");
                        console.log(Object.keys(selected));
                    });
        
                var svg = d3.select(placement).append("svg").attr(options).append("g");

                svg.append("rect").attr("width", options.width).attr("height", options.height).style("fill", "rgba(1,1,1,0)");

                //defines shape that is created when brush is called
                svg.append("g")
                    .attr("class", "brush")
                    .style("fill", "none")
                    .style("stroke", "black")
                    .call(brush);
                
                //create groups for axes
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + yScale.range()[0] + ")")
                    .style("stroke-width", "1px")
                    .style("fill", "none")
                    .style("stroke", "black") 

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + xScale.range()[0] + ")", 0)
                    .style("fill", "none")
                    .style("stroke", "black")
                    .style("stroke-width", "1px")

                //add x-axis label
                svg.append("text")
                    .attr("fill", "#414241")
                    .attr("text-anchor", "end")
                    .attr("x", options.width / 2)
                    .attr("y", options.height - 35)
                    .text("Price in pence (£)");

                //draw axes
                svg.selectAll("g.y.axis").call(yAxis);
                svg.selectAll("g.x.axis").call(xAxis);
    
                //select text belonging to axes and overide formatting
                svg.selectAll("g.axis").selectAll("text")
                    .style("fill", "black")
                    .style("stroke", "none");

                var nodeName = "chocolateNode";

                var chocolateGroup = makeNodeGroup(data, svg, xScale, yScale, nodeName);

                draw(data, chocolateGroup, colors);

                chocolateGroup.on("mouseover", function(d) {
                    d3.select(this).attr("transform", "translate(" + xScale(d.price) + "," + yScale(d.rating) + ") scale(2)");
                    d3.select(this).append("text")
                        .style("text-anchor", "middle")
                        .style("stroke", "none")
                        .attr("class", "mouseover")
                        .attr("dy", 20)
                        .text("Manufacturer: " + d.manufacturer);
                })
                .on("mouseout", function(d) {
                    d3.select(this).attr("transform", "translate(" + xScale(d.price) + "," + yScale(d.rating) + ")");
                    d3.select(this).select(".mouseover").remove();
                });    

           });
        }
    }            
})()



