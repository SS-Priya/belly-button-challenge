
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

var JSdata;

function init() 
{
  
  // Input ID values in dropdown list

    d3.json(url).then(function(data) 
    {
      //Storing data values in a variable that can used in multiple functions

      JSdata = data;

      let id_values = JSdata.names;
   
      // Select the dropdown element

      var dropdown_list = d3.select("#selDataset");

      //Set values to dropdown List

      id_values.forEach(function(id)
      {
        dropdown_list
        .append("option")
        .text(id)
        .property("value", id);
      });
    
    // Use the first ID  to build initial plots & Demographic Info
    // Call optionChanged Function explictly to build plots

    optionChanged(id_values[0]);
  });
}

function SetDemographic_info(NewList_value) 
{
  let demographic_info = JSdata.metadata;

  var filterValue= demographic_info.filter(obj => obj.id == NewList_value);

  var result = filterValue[0];
  
  d3.select("#sample-metadata").html("");
 
  Object.entries(result).forEach(([key, value]) => 
  {
    
    d3.select("#sample-metadata").append("h6").text(`${key.toUpperCase()}: ${value}`)
  
  });
} 

// Built charts 

function buildCharts(NewList_value)
{
  
  let sample_info = JSdata.samples;
  
  var filterValue= sample_info.filter(obj => obj.id == NewList_value);

  var result = filterValue[0];

  let sample_values = result.sample_values;
  let otu_ids = result.otu_ids;
  let otu_labels = result.otu_labels;

  //Bar Chart

  var trace1 = 
  {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      name: "Greek",
      type: "bar",
      orientation: "h"
  };
  var data = [trace1];

  var layout = 
  {
      title: "Top Ten OTUs for Subject ID : " + NewList_value,
      margin: {l: 100, r: 100, t: 100, b: 100}
  };

  Plotly.newPlot("bar", data, layout);  

  // Bubble Chart

var trace2 = 
{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: 
      {
      size: sample_values,
      color: otu_ids,
      colorscale:"Electric"
      }
  };
  var data = [trace2];

  var layout = 
  {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      hovermode: 'closest',
      xaxis: {title:"OTU (Operational Taxonomic Unit) ID " + NewList_value},
      margin: {t:30}
  };

  Plotly.newPlot('bubble', data, layout); 
 
}

function optionChanged(new_dropdown_value)
{
  SetDemographic_info(new_dropdown_value);
  buildCharts(new_dropdown_value);
}

// Call init function 
init();