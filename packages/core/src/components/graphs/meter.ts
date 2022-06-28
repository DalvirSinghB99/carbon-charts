// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import { Tools } from '../../tools';
import {
	Roles,
	ColorClassNameTypes,
	Events,
	RenderTypes,
} from '../../interfaces';
import * as Configuration from '../../configuration';

// D3 Imports
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

export class Meter extends Component {
	type = 'meter';
	renderType = RenderTypes.HTML;

	getStackedBounds(data, scale) {
		let prevX = 0;
		const stackedData = data.map((d, i) => {
			if (i !== 0) {
				prevX += scale(d.value);
				return {
					...d,
					width: Math.abs(
						scale(d.value) - Configuration.meter.dividerWidth
					),
					x: prevX - scale(d.value),
				};
			} else {
				prevX = scale(d.value);
				return {
					...d,
					width: Math.abs(
						scale(d.value) - Configuration.meter.dividerWidth
					),
					x: 0,
				};
			}
		});

		return stackedData;
	}

	calculatePosition = (data, width) => {
		let positions = [0];
		let sum = 0;
		data.forEach((item, i) => {
			positions.push(sum + ((width/100) * item.value))
			sum = sum + ((width/100) * item.value)
		})
		// console.log("positions ", positions)
		return positions
	
	}

	annotateContainer = (data, container, width) => {

		if (false) {
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

	render(animate = true) {
		const self = this;
		const container = this.getComponentContainer();
		const parent = select(container.node().parentNode);
		const options = this.getOptions();
		const proportional = Tools.getProperty(
			options,
			'meter',
			'proportional'
		);
		const data = this.model.getDisplayData();
		const status = this.model.getStatus();


		const { groupMapsTo } = options.data;

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

		const userProvidedHeight = Tools.getProperty(
			options,
			'meter',
			'height'
		);

		const SVG = DOMUtils.appendOrSelect(parent, 'svg').attr('class', 'layout-svg-wrapper cds--cc--meter')

		const annot =  DOMUtils.appendOrSelect(
		container,
		`div.annotation-content`
		);

		const { width } = DOMUtils.getSVGElementSize(SVG, {
			useAttrs: true,
		});

		// each meter has a scale for the value but no visual axis
		const xScale = scaleLinear().domain([0, domainMax]).range([0, width]);
		
		const stackedData = this.getStackedBounds(data, xScale);

		DOMUtils.appendOrSelect(SVG, 'rect.container')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', width)
			.attr(
				'height',
				userProvidedHeight
					? userProvidedHeight
					: proportional
					? Configuration.meter.height.proportional
					: Configuration.meter.height.default
			);

		
		console.log('Height ', userProvidedHeight
		? userProvidedHeight
		: proportional
		? Configuration.meter.height.proportional
		: Configuration.meter.height.default)
		// draw the container max range value indicator
		DOMUtils.appendOrSelect(SVG, 'line.rangeIndicator')
			.attr('x1', width)
			.attr('x2', width)
			.attr('y1', 0)
			.attr(
				'y2',
				userProvidedHeight
					? userProvidedHeight
					: proportional
					? Configuration.meter.height.proportional
					: Configuration.meter.height.default
			);

		// rect with the value binded
		const valued = SVG.selectAll('rect.value').data(stackedData);

		// if user provided a color for the bar, we dont want to attach a status class
		const className =
			status != null &&
			!self.model.isUserProvidedColorScaleValid() &&
			!proportional
				? `value status--${status}`
				: 'value';

		// draw the value bar
		valued
			.enter()
			.append('rect')
			.classed('value', true)
			.merge(valued)
			.attr('x', (d) => {
				return d.x;
			})
			.attr('y', 0)
			.attr('height', () => {
				const userProvidedHeight = Tools.getProperty(
					options,
					'meter',
					'height'
				);
				return userProvidedHeight
					? userProvidedHeight
					: proportional
					? Configuration.meter.height.proportional
					: Configuration.meter.height.default;
			})
			.attr('class', (d) =>
				this.model.getColorClassName({
					classNameTypes: [ColorClassNameTypes.FILL],
					dataGroupName: d[groupMapsTo],
					originalClassName: className,
				})
			)
			.transition()
			.call((t) =>
				this.services.transitions.setupTransition({
					transition: t,
					name: 'meter-bar-update',
					animate,
				})
			)
			.attr('width', (d, i) => {
				return d.value > domainMax ? xScale(domainMax) : d.width;
			})
			.style('fill', (d) => self.model.getFillColor(d[groupMapsTo]))
			// a11y
			.attr('role', Roles.GRAPHICS_SYMBOL)
			.attr('aria-roledescription', 'value')
			.attr('aria-label', (d) => d.value);
		
		this.annotateContainer(data, annot, width)

		valued.exit().remove();

		// draw the peak
		const peakValue = Tools.getProperty(options, 'meter', 'peak');

		let peakData = peakValue;
		if (peakValue !== null) {
			if (peakValue > domainMax) {
				peakData = domainMax;
			} else if (peakValue < data[0].value) {
				peakData =
					data[0].value > domainMax ? domainMax : data[0].value;
			}
		}

		// if a peak is supplied within the domain, we want to render it
		const peak = SVG
			.selectAll('line.peak')
			.data(peakData == null ? [] : [peakData]);

		peak.enter()
			.append('line')
			.classed('peak', true)
			.merge(peak)
			.attr('y1', 0)
			.attr('y2', () => {
				const userProvidedHeight = Tools.getProperty(
					options,
					'meter',
					'height'
				);

				return userProvidedHeight
					? userProvidedHeight
					: proportional
					? Configuration.meter.height.proportional
					: Configuration.meter.height.default;
			})
			.transition()
			.call((t) =>
				this.services.transitions.setupTransition({
					transition: t,
					name: 'peak-line-update',
					animate,
				})
			)
			.attr('x1', (d) => xScale(d))
			.attr('x2', (d) => xScale(d))
			// a11y
			.attr('role', Roles.GRAPHICS_SYMBOL)
			.attr('aria-roledescription', 'peak')
			.attr('aria-label', (d) => d);

		peak.exit().remove();

		// this forces the meter chart to only take up as much height as needed (if no height is provided)
		this.services.domUtils.setSVGMaxHeight();

		// Add event listeners to elements and legend
		this.addEventListeners();
	}

	// add event listeners for tooltips on proportional meter bars
	addEventListeners() {
		const options = this.getOptions();
		const { groupMapsTo } = options.data;
		const self = this;
		const proportional = Tools.getProperty(
			options,
			'meter',
			'proportional'
		);

		this.parent
			.selectAll('rect.value')
			.on('mouseover', function (event, datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Meter.METER_MOUSEOVER,
					{
						event,
						element: hoveredElement,
						datum,
					}
				);

				if (proportional) {
					hoveredElement.classed('hovered', true);

					// Show tooltip
					self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
						event,
						hoveredElement,
						items: [
							{
								label: datum[groupMapsTo],
								value: datum.value,
							},
						],
					});
				}
			})
			.on('mousemove', function (event, datum) {
				const hoveredElement = select(this);
				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Meter.METER_MOUSEMOVE,
					{
						event,
						element: hoveredElement,
						datum,
					}
				);

				if (proportional) {
					self.services.events.dispatchEvent(Events.Tooltip.MOVE, {
						event,
					});
				}
			})
			.on('click', function (event, datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Meter.METER_CLICK, {
					event,
					element: select(this),
					datum,
				});
			})
			.on('mouseout', function (event, datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Meter.METER_MOUSEOUT,
					{
						event,
						element: hoveredElement,
						datum,
					}
				);

				if (proportional) {
					hoveredElement.classed('hovered', false);

					// Hide tooltip
					self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
						hoveredElement,
					});
				}
			});
	}

	destroy() {
		// Remove event listeners
		this.parent
			.selectAll('rect.value')
			.on('mouseover', null)
			.on('mousemove', null)
			.on('mouseout', null)
			.on('click', null);
	}
}
