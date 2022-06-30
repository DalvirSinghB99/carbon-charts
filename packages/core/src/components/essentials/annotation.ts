// Internal Imports
import { Component } from '../component';
import { Tools } from '../../tools';
import {
  Alignments,
  ColorClassNameTypes,
  LegendItemType,
  RenderTypes,
  Roles,
  Events,
  TruncationTypes,
} from '../../interfaces';
import * as Configuration from '../../configuration';
import { DOMUtils } from '../../services';

// D3 Imports
import { select } from 'd3-selection';

export class Annotation extends Component {
  type = 'annotation';
  renderType = RenderTypes.HTML;


  calculatePosition = (data, width, domainMax) => {
    let positions = [0]
    let sum = 0;
    data.forEach((item, i) => {
      positions.push(sum + ((width/domainMax) * item.value))
      sum = sum + ((width/domainMax) * item.value)
    })
    console.log("Positions ", positions)
    return positions
	
  }

  annotateContainer = (data, container, width, domainMax) => {

    if (this.model.isAnnotated(data)) {
      let positions = this.calculatePosition(data, width, domainMax)
      const selections = container.selectAll('div')
      if (selections.empty() && width != 0) {
        selections.data(data)
          .join(
            enter =>
              enter.append('div')
                .style('left', function (d, i) {
                  return (positions[i] + "px");
                })
                .attr('class', 'tooltip-wrapper')
                .style('width', function (d, i) {
                  return ((positions[i + 1] - positions[i]) + "px");
                })
                .filter((d, i) => {
                  if (d.annotation) {
                    return true
                  } else {
                    return false
                  }
                })
                .style('display', 'inline-block')
                .append('div')
                .attr('class', 'tooltip-content')
                .append('p')
                .text((d) => d.annotation),
            update => {
              let selected = container.selectAll('.tooltip-wrapper')
              selected.style('left', (d, i) => {
                return (positions[i] + "px");
              })
              console.log("Positions ", positions)
              selected.style('width', (d, i) => {
                return (positions[i + 1] - positions[i] + "px");
              })
            },
            exit => exit.remove()
          )
      } else{
        let selected = container.selectAll('.tooltip-wrapper')
        selected.style('left', (d, i) => {
          return (positions[i] + "px");
        })
        selected.style('width', (d, i) => {
          return (positions[i + 1] - positions[i] + "px");
        })
        console.log("selected ", selected)
      }
    }
  }
  

  render() {

    const container = this.getComponentContainer();
    const parent = select(container.node().parentNode);
    const data = this.model.getDisplayData();
    const options = this.getOptions();
    let domainMax;
    if (Tools.getProperty(options, 'meter', 'proportional') === null) {
      domainMax = 100;
    } else {
      const total = Tools.getProperty(
        options,
        'meter',
        'proportional',
        'total'
      );
      domainMax = total
        ? total
        : this.model.getMaximumDomain(this.model.getDisplayData());
    }

    const SVG = DOMUtils.appendOrSelect(parent, 'svg').attr('class', 'layout-svg-wrapper cds--cc--annotation').style('box-shadow', 'none').style('z-index', -1)

    const { width } = DOMUtils.getSVGElementSize(SVG);
    const wrap =  DOMUtils.appendOrSelect(
    container,
    `div.wrap`
    );

    const annot =  DOMUtils.appendOrSelect(
    wrap,
    `div.annotation`
    );


    console.log("width is ", width)
    this.annotateContainer(data, annot, width, domainMax)
  }
}
