export const meterData = [
	{
		group: 'Dataset 1',
		value: 56,
	},
];

export const meterOptionsWithStatus = {
	title: 'Meter Chart - with statuses',
	meter: {
		peak: 80,
		status: {
			ranges: [
				{ range: [0, 50], status: 'success' },
				{ range: [50, 60], status: 'warning' },
				{ range: [60, 100], status: 'danger' },
			],
		},
	},
	height: '100px',
};

export const meterOptionsCustomColor = {
	title: 'Meter Chart - statuses and custom color',
	meter: {
		peak: 70,
		status: {
			ranges: [
				{ range: [0, 40], status: 'success' },
				{ range: [40, 60], status: 'warning' },
				{ range: [60, 100], status: 'danger' },
			],
		},
	},
	color: {
		scale: {
			'Dataset 1': '#925699',
		},
	},
	height: '100px',
};

export const meterOptionsNoStatus = {
	title: 'Meter Chart - no status',
	meter: {
		peak: 70,
	},
	height: '100px',
};

export const propMeterData = [
	{ group: '4.3.10.21', value: 10, annotation: "" },
	{ group: '5.4.9.21', value: 20, annotation: "" },
	{ group: '6.5.12.3', value: 30, annotation: "Current Level (6.5.12.3)" },
	{ group: '7.6.9.22', value: 25, annotation: "Recommended Level (7.6.9.22)" },
	{ group: '8.7.9.22', value: 5, annotation: "Fourth Label" },
	{ group: 'others', value: 10, annotation: "Others" },
];

export const propMeterOptions = {
	title: 'Installed code levels for all 2423-961 assets',
	height: '300px',
	meter: {
		proportional: {
			total: 100,
			unit: 'percent',
		},
	},

	color: {
		scale: {
			"4.3.10.21": "#e35252",
			"5.4.9.21": "#c75b18",
			"6.5.12.3": "#e8b556",
			"7.6.9.22": "#3c8025",
			"8.7.9.22": "#6de645",
			"8.8.9.21": "#60c93c",
			"others": "gray"
		},
		pairing: {
			option: 2,
		},
	},
};

export const propMeterStatusOptions = {
	title: 'Proportional Meter Chart - peak and statuses',
	height: '130px',
	meter: {
		peak: 1800,
		proportional: {
			total: 2000,
			unit: 'GB',
		},
		status: {
			ranges: [
				{
					range: [0, 800],
					status: 'success',
				},
				{
					range: [800, 1800],
					status: 'warning',
				},
				{
					range: [1800, 2000],
					status: 'danger',
				},
			],
		},
	},
	color: {
		pairing: {
			option: 2,
		},
	},
};

export const propMeterTruncationOptions = {
	title: 'Proportional Meter Chart (truncated)',
	height: '130px',
	meter: {
		proportional: {
			total: 2000,
			unit: 'MB',
			totalFormatter: (total) => `custom total string for: ${total}`,
			breakdownFormatter: (x) =>
				`You are using ${x.datasetsTotal} GB of the space this label is really long will need to be truncated with a tooltip Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
		},
	},
};
