d3.csv('https://raw.githubusercontent.com/levvsha/d3-in-all-its-glory-en/master/stats/data.csv').then(data => draw(data));

function draw(data) {
  const margin = {top: 20, right: 20, bottom: 50, left: 50};
  const width = 750 - margin.left - margin.right;
  const height = 420 - margin.top - margin.bottom;

  const x = d3.scaleTime()
    .range([0, width]);

  const y = d3.scaleLinear()
    .range([height, 0]);

  const svg = d3.select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${ margin.left },${ margin.top })`);

  const colorScale = d3.scaleOrdinal()
    .range([
      '#4c78a8',
      '#9ecae9',
      '#f58518',
      '#ffbf79',
      '#54a24b',
      '#88d27a',
      '#b79a20',
      '#439894',
      '#83bcb6',
      '#e45756',
      '#ff9d98',
      '#79706e',
      '#bab0ac',
      '#d67195',
      '#fcbfd2',
      '#b279a2',
      '#9e765f',
      '#d8b5a5'
    ]);

  data.forEach(function (d) {
    d.date = new Date(d.date);
    d.percent = +d.percent;
  });

  x.domain(d3.extent(data, d => d.date));
  y.domain([0, d3.max(data, d => d.percent)]);
  colorScale.domain(d3.map(data, d => d.regionId).keys());

  const xAxis = d3.axisBottom(x)
    .ticks((width + 2) / (height + 2) * 5)
    .tickSize(-height - 6)
    .tickPadding(10);

  const yAxis = d3.axisRight(y)
    .ticks(5)
    .tickSize(7 + width)
    .tickPadding(-11 - width)
    .tickFormat(d => d + '%');

  svg.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${ height + 6 })`)
    .call(xAxis);

  svg.append('g')
    .attr('transform', 'translate(-7, 0)')
    .attr('class', 'axis y-axis')
    .call(yAxis);

  svg.append('g')
    .attr('transform', `translate(0,${ height })`)
    .call(d3.axisBottom(x)
      .ticks(0));

  svg.append('g')
    .call(d3.axisLeft(y)
      .ticks(0));

  const nestByRegionId = d3.nest()
    .key(d => d.regionId)
    .sortKeys((v1, v2) => (parseInt(v1, 10) > parseInt(v2, 10) ? 1 : -1))
    .entries(data);

  const regions = {};

  d3.map(data, d => d.regionId)
    .keys()
    .forEach(function (d, i) {
      regions[d] = nestByRegionId[i].values;
    });

  const regionIds = Object.keys(regions);

  const lineGenerator = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.percent));

  svg
    .selectAll('.line')
    .data(regionIds)
    .enter()
    .append('path')
    .attr('class', 'line')
    .attr('id', regionId => `region-${ regionId }`)
    .attr('d', regionId => lineGenerator(regions[regionId]))
    .style('stroke', regionId => colorScale(regionId));
}
