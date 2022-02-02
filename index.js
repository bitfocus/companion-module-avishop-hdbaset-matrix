var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions
	self.init_presets();	// init presets

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;

	self.init_presets();
	self.actions();
}

instance.prototype.init = function() {
	var self = this;

	self.init_presets();
	self.status(self.STATE_OK);

	debug = self.debug;
	log = self.log;
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 5,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'HTTP Port (Default: 80)',
			width: 4,
			default: 80,
			regex: this.REGEX_PORT
		}
	]
}

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
}

// List of Inputs
const Input = [
	{ id: 1,	label: 'IN 1'},	
	{ id: 2,	label: 'IN 2'},	
	{ id: 3,	label: 'IN 3'},	
	{ id: 4,	label: 'IN 4'},	
	{ id: 5,	label: 'IN 5'},	
	{ id: 6,	label: 'IN 6'},	
	{ id: 7,	label: 'IN 7'},	
	{ id: 8,	label: 'IN 8'},
]

// List of Outputs
const Output = [
	{ id: 1,	label: 'HDMI OUT A', short: 'OUT A'},	
	{ id: 2,	label: 'HDMI OUT B', short: 'OUT B'},	
	{ id: 3,	label: 'HDMI OUT C', short: 'OUT C'},	
	{ id: 4,	label: 'HDMI OUT D', short: 'OUT D'},	
	{ id: 5,	label: 'HDMI OUT E', short: 'OUT E'},	
	{ id: 6,	label: 'HDMI OUT F', short: 'OUT F'},	
	{ id: 7,	label: 'HDMI OUT G', short: 'OUT G'},	
	{ id: 8,	label: 'HDMI OUT H', short: 'OUT H'},
]

// List of Inputs + ALL
const Input_All = [
	{ id: 1,	label: 'IN 1'},	
	{ id: 2,	label: 'IN 2'},	
	{ id: 3,	label: 'IN 3'},	
	{ id: 4,	label: 'IN 4'},	
	{ id: 5,	label: 'IN 5'},	
	{ id: 6,	label: 'IN 6'},	
	{ id: 7,	label: 'IN 7'},	
	{ id: 8,	label: 'IN 8'},
	{ id: 9,	label: 'ALL'},
]

// EDID Index Setup
const EDID_Index = [
	{ id: 1,	label: '1080P Stereo Audio 2.0', 	short: '1080P 2.0'},
	{ id: 2,	label: '1080P Dolby/DTS 5.1', 		short: '1080P 5.1'},
	{ id: 3,	label: '1080P HD Audio 7.1', 		short: '1080P 7.1'},
	{ id: 4,	label: '1080i Stereo Audio 2.0', 	short: '1080i 2.0'},
	{ id: 5,	label: '1080i Dolby/DTS 5.1', 		short: '1080i 5.1'},
	{ id: 6,	label: '1080i HD Audio 7.1', 		short: '1080i 7.1'},
	{ id: 7,	label: '3D Stereo Audio 2.0', 		short: '3D 2.0'},
	{ id: 8,	label: '3D Dolby/DTS 5.1', 			short: '3D 5.1'},
	{ id: 9,	label: '3D HD Audio 7.1', 			short: '3D 7.1'},	
	{ id: 10,	label: '4K2K30 Stereo Audio 2.0', 	short: '4K2K30 2.0'},	
	{ id: 11,	label: '4K2K30 Dolby/DTS 5.1', 		short: '4K2K30 5.1'},	
	{ id: 12,	label: '4K2K30 HD Audio 7.1', 		short: '4K2K30 7.1'},	
	{ id: 13,	label: '4K2K60 Stereo Audio 2.0', 	short: '4K2K60 2.0'},
	{ id: 14,	label: '4K2K60 Dolby/DTS 5.1', 		short: '4K2K60 5.1'},	
	{ id: 15,	label: '4K2K60 HD Audio 7.1', 		short: '4K2K60 7.1'},	
]

// EDID ON / OFF
const EDID_ON_OFF = [
	{ id: '0', label: 'OFF'},	
	{ id: '1',	label: 'ON'},	
]

// ARC ON / OFF
const ARC_ON_OFF = [
	{ id: '0f', label: 'ON'},	
	{ id: 'f0', label: 'OFF'},	
]

// List ON / OFF
const ON_OFF = [
	{ id: '0', label: 'OFF'},	
	{ id: '1',	label: 'ON'},	
]

instance.prototype.init_presets = function () {
	var self = this;
	var presets = [];
	var pstSize = '14';

	for (var x in Output) {
		for (var y in Input) {
			presets.push({
				category: 'Input X To ' + Output[x].label,
				label: Input[y].label + ' To ' +  Output[x].label,
				bank: {
					style: 'text',
					text: Input[y].label + '\\nTo\\n' +  Output[x].short,
					size: pstSize,
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0)
				},
				actions: [{	
					action: 'InOut', 
					options: {
						input: Input[y].id,
						output: Output[x].id
					}
				}]
			});
		}		
	}

	for (var y in Input) {
		presets.push({
			category: 'Input X To All Out',
			label: 'Input X To All HDMI Out',
			bank: {
				style: 'text',
				text: Input[y].label + '\\nTo\\nALL OUT',
				size: pstSize,
				color: self.rgb(255,255,255),
				bgcolor: self.rgb(0,0,0),
				relative_delay: true,
			},
			actions: [
				{
					action: 'InOut', 
					options: {
						input: Input[y].id,
						output: 1
					}
				},
				{
					action: 'InOut', 
					options: {
						input: Input[y].id,
						output: 2
					}
				},
				{
					action: 'InOut', 
					delay: 100,
					options: {
						input: Input[y].id,
						output: 3
					}
				},
				{
					action: 'InOut', 
					options: {
						input: Input[y].id,
						output: 4
					}
				},
				{
					action: 'InOut', 
					delay: 100,
					options: {
						input: Input[y].id,
						output: 5
					}
				},
				{
					action: 'InOut', 
					options: {
						input: Input[y].id,
						output: 6
					}
				},
				{
					action: 'InOut', 
					delay: 100,
					options: {
						input: Input[y].id,
						output: 7
					}
				},
				{
					action: 'InOut', 
					options: {
						input: Input[y].id,
						output: 8
					}
				},
			]
		});
	}

	for (var x in EDID_Index) {
		presets.push({
			category: 'Video/Audio Format',
			label: 'Set Format To ' + EDID_Index[x].label,
			bank: {
				style: 'text',
				text: 'Set ' + EDID_Index[x].short,
				size: pstSize,
				color: self.rgb(255,255,255),
				bgcolor: self.rgb(0,0,0)
			},
			actions: [{	
				action: 'EDIDSet', 
				options: {
					value: EDID_Index[x].id,
					input: 1
				}
			}]
		});
	}		

	presets.push({
		category: 'Video/Audio Format',
		label: 'Copy Format',
		bank: {
			style: 'text',
			text: 'Copy Format',
			size: pstSize,
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [{	
			action: 'EDIDCopy', 
			options: {
				input: 1,
				value: 1
			}
		}]
	});

	presets.push({
		category: 'Video/Audio Format',
		label: 'Auto Set Format OFF',
		bank: {
			style: 'text',
			text: 'Auto Format OFF',
			size: pstSize,
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [{	
			action: 'EDIDAuto',
			options: {
				flag: '0', 
			}
		}]
	});

	presets.push({
		category: 'Video/Audio Format',
		label: 'Auto Set Format ON',
		bank: {
			style: 'text',
			text: 'Auto Format ON',
			size: pstSize,
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [{	
			action: 'EDIDAuto',
			options: {
				flag: '1', 
			}
		}]
	});

	for (var y in Input) {
		for (var x in ARC_ON_OFF) {
			presets.push({
				category: 'Turn ARC ON/OFF',
				label: 'Turn ARC ON/OFF',
				bank: {
					style: 'text',
					text: Input[y].label +'\\nTurn\\nARC ' + ARC_ON_OFF[x].label,
					size: pstSize,
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0)
				},
				actions: [{	
					action: 'Arc', 
					options: {
						input: Input[y].id,
						option: ARC_ON_OFF[x].id
					}
				}]
			});
		}
	}

	for (var x in ON_OFF) {
		presets.push({
			category: 'System',
			label: 'Turn Beep ' + ON_OFF[x].label,
			bank: {
				style: 'text',
				text: 'Turn Beep ' + ON_OFF[x].label,
				size: pstSize,
				color: self.rgb(255,255,255),
				bgcolor: self.rgb(0,0,0)
			},
			actions: [{	
				action: 'Power', 
				options: {
					option: ON_OFF[x].id
				}
			}]
		});
	}

	for (var x in ON_OFF) {
		presets.push({
			category: 'System',
			label: 'Turn Device ' + ON_OFF[x].label,
			bank: {
				style: 'text',
				text: 'Turn Device ' + ON_OFF[x].label,
				size: pstSize,
				color: self.rgb(255,255,255),
				bgcolor: self.rgb(0,0,0)
			},
			actions: [{	
				action: 'Power', 
				options: {
					option: ON_OFF[x].id
				}
			}]
		});
	}		

	presets.push({
		category: 'System',
		label: 'Reboot Device',
		bank: {
			style: 'text',
			text: 'Reboot Device',
			size: pstSize,
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [{	
			action: 'Reboot', 
		}]
	});

	presets.push({
		category: 'System',
		label: 'Restore Device',
		bank: {
			style: 'text',
			text: 'Restore Device',
			size: pstSize,
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [{	
			action: 'Restore', 
		}]
	});

	self.setPresetDefinitions(presets);
}

instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({

		'InOut': { 
			label: 'Set Input and Output', 
			options: [
				{
					type: 'dropdown',
					id: 'input',
					label: 'Input',
					default: 1,
					choices: Input
				},
				{
					type: 'dropdown',
					id: 'output',
					label: 'Output',
					default: 1,
					choices: Output
				},
			]
		},
		'EDIDAuto': { 
			label: 'Auto Set Format',
			options: [
				{
					type: 'dropdown',
					id: 'flag',
					label: 'Option',
					default: '1',
					choices: EDID_ON_OFF
				},
			]
		},
		'EDIDSet': { 
			label: 'Set Format (EDID) to Input',
			options: [
				{
					type: 'dropdown',
					id: 'value',
					label: 'Option',
					default: 1,
					choices: EDID_Index
				},
				{
					type: 'dropdown',
					id: 'input',
					label: 'Input',
					default: 1,
					choices: Input_All
				},
			]
		},
		'EDIDCopy': { 
			label: 'Copy Video (EDID) From Output to Input',
			options: [
				{
					type: 'dropdown',
					id: 'output',
					label: 'Output',
					default: 1,
					choices: Output
				},
				{
					type: 'dropdown',
					id: 'input',
					label: 'Input',
					default: 1,
					choices: Input_All
				},
			]
		},
		'Arc': { 
			label: 'Turn ARC ON/OFF', 
			options: [
				{
					type: 'dropdown',
					id: 'option',
					label: 'Option',
					default: '1',
					choices: ARC_ON_OFF
				},
				{
					type: 'dropdown',
					id: 'input',
					label: 'Input',
					default: '0f',
					choices: Input
				},
			]
		},
		'Beep': { 
			label: 'Turn Beep ON/OFF', 
			options: [
				{
					type: 'dropdown',
					id: 'option',
					label: 'Option',
					default: '0',
					choices: ON_OFF
				},
			]
		},
		'Power': { 
			label: 'Turn Device ON/OFF',
			options: [
				{
				type: 'dropdown',
				id: 'option',
				label: 'Option',
				default: '0',
				choices: ON_OFF
				},
			]
		},
		'Reboot': { label: 'Reboot Device', },
		'Restore': { label: 'Factory Reset', },
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options;
	var conf = self.config;
	var cmd;

	switch(action.action) {
		case 'InOut':
			// "a5,5b,02,03,03,00,01,00,00,00,00,00,ed";
			var paraIn = opt.input.toString(16).replace(/^(\w)$/, "0$1");
			var paraOut = opt.output.toString(16).replace(/^(\w)$/, "0$1");
			var verify = (0x100 - (parseInt(opt.input) + parseInt(opt.output) + 0x05) % 0x100).toString(16).replace(/^(\w)$/, "0$1");
	
			cmd = "a5,5b,02,03," + paraIn + ",00," + paraOut + ",00,00,00,00,00," + verify;
			break;

		case 'EDIDAuto':
			// 03 08
			var paraFlag = opt.flag ? "0f" : "f0";
			var verify = opt.flag ? "e6" : "05";

			if (opt.flag === '1') {
				cmd = "a5,5b,03,08,0f,00,00,00,00,00,00,00,e6";
			}
			if (opt.flag === '0') {
				cmd = "a5,5b,03,08,f0,00,00,00,00,00,00,00,05";
			}
			break;

		case 'EDIDSet':
			// "a5,5b,03,02,03,00,02,00,00,00,00,00,ed";
			var edidIndex = parseInt(opt.value).toString(16).replace(/^(\w)$/, "0$1");
			var inIndex = parseInt(opt.input).toString(16).replace(/^(\w)$/, "0$1");
			var verify = (0x100 - (parseInt(opt.value) + parseInt(opt.input) + 0x05) % 0x100).toString(16).replace(/^(\w)$/, "0$1");

			if (opt.input === 9) {
				// INPUT ALL    03 01
				verify = (0x100 - (0x04 + parseInt(opt.value)) % 0x100).toString(16).replace(/^(\w)$/, "0$1");
				cmd = "a5,5b,03,01," + edidIndex + ",00,00,00,00,00,00,00," + verify;
			}
			else {
				cmd = "a5,5b,03,02," + edidIndex + ",00," + inIndex + ",00,00,00,00,00," + verify;
			}
			break;
	
		case 'EDIDCopy':
			// 03 04
			var paraCopy = parseInt(opt.output).toString(16).replace(/^(\w)$/, "0$1");
			var paraTo = parseInt(opt.input).toString(16).replace(/^(\w)$/, "0$1");
			var verify = (0x100 - (parseInt(opt.output) + parseInt(opt.input) + 0x07) % 0x100).toString(16).replace(/^(\w)$/, "0$1");

			if (opt.input === 9) {
				// INPUT ALL    03 03
				verify = (0x100 - (0x06 + parseInt(opt.output)) % 0x100).toString(16).replace(/^(\w)$/, "0$1");
				cmd = "a5,5b,03,03," + paraCopy + ",00,00,00,00,00,00,00," + verify;
			}
			else {
				cmd = "a5,5b,03,04," + paraCopy + ",00," + paraTo + ",00,00,00,00,00," + verify;				
			}
			break;

		case 'Arc':
			// "a5,5b,10,01,0f,00,01,00,00,00,00,00,df";

			var paraIndex = opt.input.toString(16).replace(/^(\w)$/, "0$1");
			var paraFlag = opt.option;
			var verify = (0x100 - (parseInt(opt.input) + 0x11 + parseInt(paraFlag, 16)) % 0x100).toString(16).replace(/^(\w)$/, "0$1");

			cmd = "a5,5b,10,01," + paraFlag + ",00," + paraIndex + ",00,00,00,00,00," + verify;
			break;	

		case 'Beep':
			if (opt.option == '0') { // OFF
				cmd = "a5,5b,06,01,f0,00,00,00,00,00,00,00,09";
			}
			if (opt.option == '1') { // ON
				cmd = "a5,5b,06,01,0f,00,00,00,00,00,00,00,ea";
			}
			break;
	
		case 'Power':
			if (opt.option == '0') { // OFF
				cmd = "a5,5b,08,0b,f0,00,00,00,00,00,00,00,fd";
			}
			if (opt.option == '1') { // ON
				cmd = "a5,5b,08,0b,0f,00,00,00,00,00,00,00,de";
			}
			break;
		
		case 'Reboot':
			cmd = "a5,5b,08,0d,00,00,00,00,00,00,00,00,eb";
			break;

		case 'Restore':
			cmd = "a5,5b,08,0a,00,00,00,00,00,00,00,00,ee";
			break;
		
	}	

	if (cmd !== undefined) {
		var message = 'http://' + conf.host + ':' + conf.port + '/cgi-bin/submit?cmd=hex(' + cmd + ')';

		self.debug('sending ',message);
		console.log('sending ',message);

		self.system.emit('rest_get', message, function (err, result) {
			if (err !== null) {
				self.log('error', 'HTTP GET Request failed (' + result.error.code + ')');
				self.status(self.STATUS_ERROR, result.error.code);
			}
			else {
				self.status(self.STATUS_OK);
				self.log('info', 'HTTP GET Response (' + result + ')');
				console.log('HTTP GET Response (' + result + ')');
			}
		});	
	}
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;