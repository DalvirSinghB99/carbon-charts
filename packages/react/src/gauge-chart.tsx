import React from 'react';
import { GaugeChart as GC } from '@carbon/charts';
import BaseChart from './base-chart';
import { ChartConfig, GaugeChartOptions } from '@carbon/charts/interfaces';
import { hasChartBeenInitialized } from './utils';

type GaugeChartProps = ChartConfig<GaugeChartOptions>;

export default class GaugeChart extends BaseChart<GaugeChartOptions> {
	chartRef!: HTMLDivElement;
	props!: GaugeChartProps;
	chart!: GC;

	componentDidMount() {
		if (hasChartBeenInitialized(this.chartRef) === false) {
			this.chart = new GC(this.chartRef, {
				data: this.props.data,
				options: this.props.options,
			});
		}
	}

	render() {
		return (
			<div
				ref={(chartRef) => (this.chartRef = chartRef!)}
				className="chart-holder"></div>
		);
	}
}
