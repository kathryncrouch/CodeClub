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
                
                var colors = d3.scale.category10();

                //registers zoom event listener
                var zoom = d3.behavior.zoom()
                    //x and y axis should conform to scales already set
                    .x(xScale)
                    .y(yScale)
                    
                    //can zoom from 1:5x original
                    .scaleExtent([1,5])
                    
                    //what to do when zoom event is triggered
                    .on("zoom", function() {
                        
                        //re-draw axis on new scale
                        d3.selectAll("g.x.axis").call(xAxis);
                        d3.selectAll("g.y.axis").call(yAxis);
                        
                        //move the nodes to the correct locations on the new scale and resize
                        svg.selectAll("g.chocolateNode").attr("transform", function(d) {
                        return "translate(" + xScale(d.price) + "," + yScale(d.rating) + ")scale(" +d3.event.scale + ")"
                        });
            
                        //format new tick labels
                        svg.selectAll("g.axis").selectAll("text")
                            .style("fill", "black")
                            .style("stroke", "none");
                });
                
                //make svg element as previously but call zoom on it
                var svg = d3.select(placement).append("svg").attr(options).append("g").call(zoom);

                //add transparent element in svg to allow zooming from any location
                svg.append("rect").attr("width", options.width).attr("height", options.height).style("fill", "rgba(1,1,1,0)");

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

                //create nodes for data points and bind
                var nodeName = "chocolateNode";
                var chocolateGroup = makeNodeGroup(data, svg, xScale, yScale, nodeName);

                draw(data, chocolateGroup, colors);

                //mouseover behaviour on nodes - applies to all nodes
                chocolateGroup.on("mouseover", function(d) {

                    //this returns the specific node you have selected
                    //scale by factor of 2
                    d3.select(this).attr("transform", "translate(" + xScale(d.price) + "," + yScale(d.rating) + ") scale(" + zoom.scale()*2 + ")");
                    //and append text with manufacturer
                    d3.select(this).append("text")
                        .style("text-anchor", "middle")
                        .style("stroke", "none")
                        .attr("class", "mouseover")
                        .attr("dy", 20)
                        .text("Manufacturer: " + d.manufacturer);
                })
                //mouseout explicitly undoes the mouseover behaviour
                .on("mouseout", function(d) {
                    d3.select(this).attr("transform", "translate(" + xScale(d.price) + "," + yScale(d.rating) + ")scale(" + zoom.scale() + ")");
                    d3.select(this).select(".mouseover").remove();
                });    

           });
        }
    }            
})()



