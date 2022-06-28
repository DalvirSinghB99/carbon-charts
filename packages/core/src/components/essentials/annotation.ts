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

// import the settings for the css prefix
import { carbonPrefix } from '../../configuration-non-customizable';

// Carbon position service
import Position, { PLACEMENTS } from '@carbon/utils-position';

// D3 Imports
import { select } from 'd3-selection';

export class Annotation extends Component {
  type = 'annotation';
  renderType = RenderTypes.HTML;


  calculatePosition = (data, width) => {
    let positions = [0]
    let sum = 0;
    data.forEach((item, i) => {
      positions.push(sum + ((width/100) * item.value))
      sum = sum + ((width/100) * item.value)
    })
    return positions
	
  }

  annotateContainer = (data, container, width) => {

    if (this.model.isAnnotated(data)) {
      const selections = container.selectAll('div')
      if (width != 0) {
        let positions = this.calculatePosition(data, width)
        selections.data(data)
        .join(
        enter =>
          enter.append('div')
            .style('left', function (d, i) {
              return (positions[i] + "px");
            })
            .style('max-width', function (d, i) {
              return ((positions[i + 1] - positions[i]) + "px");
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
          let selected = container.selectAll('.tooltip-wrapper').data(data);
          console.log("Selected ", selected)
          selected.style('left', (d, i) => {
            console.log("Updating ", d);
            return (positions[i] + "px");
          })
          .style('max-width', function (d, i) {
            return ((positions[i + 1] - positions[i]) + "px");
          })

        },
            exit => exit.remove()
          )
      }
    }
  }
  

  render() {

    const container = this.getComponentContainer();
    const parent = select(container.node().parentNode);
    const data = this.model.getDisplayData();

    console.log("Parent ", parent);
    console.log("Container ", container);

    const SVG = DOMUtils.appendOrSelect(parent, 'svg').attr('class', 'layout-svg-wrapper cds--cc--annotation').style('box-shadow', 'none').style('z-index', -1)

    const annot =  DOMUtils.appendOrSelect(
    container,
    `div.annotation`
    );
    const { width } = DOMUtils.getSVGElementSize(SVG);

    console.log("width is ", width)
    this.annotateContainer(data, annot, width)
  }
}
