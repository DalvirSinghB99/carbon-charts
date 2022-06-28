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
          .join(function (enter) {
            return enter
              .append('div')
              .style('left', function (d, i) {
                console.log("Positions ", positions);
                return (positions[i] + "px");
              })
              .filter((d, i) => {
                if (d.annotation) {
                  return true
                } else {
                  return false
                }
              })
              .attr('class', 'item')
            .append('p')
            .text((d) => d.annotation)
          },
            function (update) {
              return update.style('left', function (d, i) {

                console.log("Positions ", positions);
                return (positions[i] + "px");
              })
            }
            
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

    const SVG = DOMUtils.appendOrSelect(parent, 'svg').attr('class', 'layout-svg-wrapper cds--cc--annotation').style('box-shadow', 'none')

    const annot =  DOMUtils.appendOrSelect(
    container,
    `div.annotation`
    );
    const { width } = DOMUtils.getSVGElementSize(SVG);

    console.log("width is ", width)
    this.annotateContainer(data, annot, width)
  }
}
