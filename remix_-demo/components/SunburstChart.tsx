
import React from 'react';
import * as d3 from 'd3';
import { DashboardRecord, FilterState, HierarchyNode, HierarchyField } from '../types';

interface SunburstChartProps {
  data: DashboardRecord[];
  filters: FilterState;
  activeHierarchy: HierarchyField[];
  forceLabels?: boolean;
  onHover?: (node: d3.HierarchyRectangularNode<HierarchyNode> | null) => void;
  onNodeClick?: (filters: Partial<Record<keyof FilterState, string>>) => void;
}

export const SunburstChart: React.FC<SunburstChartProps> = ({ data, activeHierarchy, forceLabels = false, onHover, onNodeClick }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getDisplayName = (name: string) => {
    if (name === 'Met') return 'Metastatic Tumor Biopsy';
    if (name === 'Prim') return 'Primary Tumor Biopsy';
    return name.replace(/_/g, ' ');
  };

  const buildHierarchy = React.useCallback((): HierarchyNode => {
    const root: HierarchyNode = { name: "Root", children: [] };

    data.forEach(patient => {
      let currentNode = root;
      activeHierarchy.forEach((layer) => {
        const val = patient[layer];
        const key = Array.isArray(val) ? (val.length > 0 ? val.join(', ') : 'None') : (val as string || 'Unknown');
        
        if (!currentNode.children) currentNode.children = [];
        
        let child = currentNode.children.find(c => c.name === key);
        if (!child) {
          child = { name: key, children: [] };
          currentNode.children.push(child);
        }
        currentNode = child;
      });
      currentNode.value = (currentNode.value || 0) + 1;
    });

    return root;
  }, [data, activeHierarchy]);

  const drawChart = React.useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const margin = 15;
    const maxRadius = Math.min(width, height) / 2 - margin;
    
    const numLayers = activeHierarchy.length;
    const centerRadius = 88; 
    const availableRingSpace = maxRadius - centerRadius;
    const ringWidth = Math.max(30, availableRingSpace / Math.max(1, numLayers || 1));
    
    const hierarchyData = buildHierarchy();
    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<HierarchyNode>()
      .size([2 * Math.PI, 1]); 

    const arc = d3.arc<d3.HierarchyRectangularNode<HierarchyNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.012))
      .padRadius(centerRadius)
      .innerRadius(d => centerRadius + (d.depth - 1) * ringWidth)
      .outerRadius(d => centerRadius + d.depth * ringWidth - 1);

    const uniquePatientsCount = new Set(data.map(d => d.sap)).size;
    
    const layerColors = [
      '#2B4A64', // Blue 600
      '#B8CEE0', // Indigo 600 
      '#FB8500', // Emerald 600
      '#73ADD3', // Violet 600
      '#db2777', // Pink 600
      '#ea580c', // Orange 600
    ];

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('font-family', 'Inter, sans-serif')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Center Display
    const center = svg.append('g')
      .attr('text-anchor', 'middle')
      .attr('class', 'cursor-pointer group')
      .on('click', () => onNodeClick && onNodeClick({}));

    center.append('circle')
      .attr('r', centerRadius)
      .attr('fill', 'transparent');
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });

    center.append('text')
      .attr('dy', '-3.2em')
      .attr('class', 'text-[8px] font-black uppercase tracking-[0.25em] fill-slate-300')
      .text(currentDate);
    center.append('text')
      .attr('dy', '0.4em')
      .style('font-size', '52px')
      .attr('class', 'font-black fill-slate-900 tracking-tighter')
      .text(uniquePatientsCount.toLocaleString());
    center.append('text')
      .attr('dy', '4.2em')
      .attr('class', 'text-[9px] font-bold fill-blue-500 uppercase tracking-widest')
      .text('Total Patients');

    svg.append('g')
      .selectAll('path')
      .data(partition(root).descendants().filter(d => d.depth))
      .join('path')
      .attr('fill', (d) => layerColors[(d.depth - 1) % layerColors.length])
      .attr('fill-opacity', (d) => {
        const siblings = d.parent?.children || [];
        const index = siblings.indexOf(d);
        return 0.8 + (index % 4) * 0.05;
      })
      .attr('d', arc)
      .attr('class', 'cursor-pointer transition-all duration-300')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseenter', function(event, d: d3.HierarchyRectangularNode<HierarchyNode>) {
        d3.select(this).attr('fill-opacity', 1).attr('stroke-width', 2).attr('stroke', '#fff');
        
        if (onHover) onHover(d);

        const ancestors = d.ancestors().reverse().slice(1);
        const pathString = ancestors
          .map(a => `<span class="px-0.5 py-0.5 rounded bg-slate-50 text-slate-800 mx-0.5 whitespace-nowrap leading-none border border-slate-100">${getDisplayName(a.data.name)}</span>`)
          .join('<span class="text-slate-300 font-light mx-0.5 text-[8px]">›</span>');

        const layerNameMap: Record<string, string> = {
          type: 'Biopsy Origin',
          omicsData: 'Omics Data',
          molecularInfo: 'Molecular Info',
          primaryTumor: 'Primary Tumor',
          sex: 'Biological Sex',
          rangeAge: 'Age Range',
          treatment: 'Treatment',
          biopsySite: 'Biopsy Site'
        };
        const layerName = layerNameMap[activeHierarchy[d.depth-1]] || activeHierarchy[d.depth-1] || 'Level';

        const tip = d3.select('#tooltip');
        tip.style('opacity', 1)
           .html(`<div class="p-2 bg-white rounded-lg shadow-xl border border-slate-100 min-w-[140px] max-w-[220px]">
                    <div class="flex items-center gap-1.5 mb-1.5">
                       <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${layerColors[(d.depth-1)%layerColors.length]}"></span>
                       <p class="text-[7px] font-black uppercase text-slate-400 tracking-widest">${layerName}</p>
                    </div>
                    <div class="flex flex-wrap items-center text-[8px] font-bold capitalize leading-tight mb-2">
                      ${pathString}
                    </div>
                    <div class="flex items-center justify-between pt-1.5 border-t border-slate-50">
                      <div class="flex flex-col">
                        <span class="text-[6px] font-black text-slate-400 uppercase mb-0.5">Specimens</span>
                        <span class="text-sm font-black text-blue-600 leading-none">${d.value}</span>
                      </div>
                      <span class="px-1 py-0.5 bg-blue-50 text-[8px] font-black text-blue-600 rounded">
                        ${((d.value || 0) / (root.value || 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>`);
      })
      .on('mousemove', function(event) {
        d3.select('#tooltip')
          .style('left', (event.pageX + 8) + 'px')
          .style('top', (event.pageY - 8) + 'px');
      })
      .on('click', function(event, d: d3.HierarchyRectangularNode<HierarchyNode>) {
        if (!onNodeClick) return;

        const ancestors = d.ancestors().reverse().slice(1);
        const filterUpdates: Partial<Record<keyof FilterState, string>> = {};
        
        const layerToFilterKey: Record<string, keyof FilterState> = {
          primaryTumor: 'primaryTumors',
          gender: 'sex',
          rangeAge: 'ageRanges',
          biopsySite: 'biopsySites',
          type: 'types',
          treatment: 'treatments',
          omicsData: 'omicsData',
          molecularInfo: 'molecularInfo'
        };

        ancestors.forEach((a, index) => {
          const field = activeHierarchy[index];
          const filterKey = layerToFilterKey[field as string];
          if (filterKey) {
            filterUpdates[filterKey] = a.data.name;
          }
        });

        onNodeClick(filterUpdates);
      })
      .on('mouseleave', function() {
        d3.select(this)
          .attr('fill-opacity', (d: d3.HierarchyRectangularNode<HierarchyNode>) => {
            const siblings = d.parent?.children || [];
            const index = siblings.indexOf(d);
            return 0.8 + (index % 4) * 0.05;
          })
          .attr('stroke-width', 0.5)
          .attr('stroke', '#fff');
        d3.select('#tooltip').style('opacity', 0);
        if (onHover) onHover(null);
      });

    // Labeling with adaptive visibility logic
    svg.append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .selectAll('text')
      .data(partition(root).descendants().filter(d => d.depth))
      .join('text')
      .each(function(d) {
        const label = getDisplayName(d.data.name);
        const angle = d.x1 - d.x0;
        const radiusAtCentroid = centerRadius + (d.depth - 0.5) * ringWidth;
        const chordLength = 2 * radiusAtCentroid * Math.sin(angle / 2);
        const estimatedTextWidth = label.length * 4.5;
        
        let visibleText = label;
        let shouldShow = true;

        // Apply forceLabels setting: override sizing restrictions if forceLabels is true
        if (!forceLabels) {
          if (chordLength < 18 || angle < 0.12) {
            shouldShow = false;
          } else if (estimatedTextWidth > chordLength * 0.95) {
            const maxChars = Math.floor(chordLength / 5);
            if (maxChars < 3) {
              shouldShow = false;
            } else {
              visibleText = label.slice(0, maxChars) + '..';
            }
          }
        } else {
          // If forced, show whatever fits or at least a snippet
          if (chordLength < 8) shouldShow = false;
          else if (estimatedTextWidth > chordLength) {
             visibleText = label.slice(0, Math.max(1, Math.floor(chordLength / 5))) + '.';
          }
        }

        if (shouldShow) {
          const [x, y] = arc.centroid(d);
          d3.select(this)
            .attr('transform', `translate(${x},${y})`)
            .attr('dy', '0.35em')
            .attr('font-size', '7px')
            .attr('font-weight', '900')
            .attr('fill', 'white')
            .attr('class', 'drop-shadow-sm uppercase tracking-tighter')
            .text(visibleText);
        } else {
          d3.select(this).remove();
        }
      });

  }, [buildHierarchy, activeHierarchy, data, forceLabels, onHover, onNodeClick]);

  React.useEffect(() => {
    drawChart();
    const handleResize = () => drawChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChart]);

  return (
    <div className="w-full h-full flex items-center justify-center p-0 bg-white relative overflow-hidden">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
      <div id="tooltip" className="fixed opacity-0 pointer-events-none transition-all duration-300 z-50 transform scale-90"></div>
    </div>
  );
};
