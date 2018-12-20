import React from 'react';
import { Link } from 'react-router-dom';

import messages from 'lib/text';
import * as helper from 'lib/helper';
import style from './style.css';
import ShippingAddressForm from './shippingAddressForm.js';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import Rune from 'rune.js';
import Noise from 'rune.noise.js';
import Delaunay from './delaunay.js';

const getShippingFieldLabel = ({ label, key }) => {
	return label && label.length > 0
		? label
		: helper.getOrderFieldLabelByKey(key);
};

const ShippingFields = ({ order, shippingMethod }) => {
	let rows = null;
	if (
		shippingMethod &&
		shippingMethod.fields &&
		shippingMethod.fields.length > 0
	) {
		rows = shippingMethod.fields.map((field, index) => {
			const fieldLabel = getShippingFieldLabel(field);
			const fieldValue = order.shipping_address[field.key];

			return (
				<ShippingFieldDiv key={index} label={fieldLabel} value={fieldValue} />
			);
		});
	}

	return <div>{rows}</div>;
};

const ShippingFieldDiv = ({ label, value }) => (
	<div>
		<label>{label}: </label>
		{value}
	</div>
);

const ShippingAddress = ({ order, settings }) => {
	const address = order.shipping_address;
	const shippingMethod = order.shipping_method_details;

	return (
		<div className={style.address} style={{ marginBottom: 20 }}>
			<ShippingFields order={order} shippingMethod={shippingMethod} />
			<div>
				<label>{messages.city}: </label>
				{address.city}
				{address.state && address.state.length > 0 ? ', ' + address.state : ''}
				{address.postal_code && address.postal_code.length > 0
					? ', ' + address.postal_code
					: ''}
			</div>
			<div>
				<label>{messages.country}: </label>
				{address.country}
			</div>
		</div>
	);
};

const BillingAddress = ({ address, settings }) => {
	const billinsAddressIsEmpty =
		address.address1 === '' &&
		address.address2 === '' &&
		address.city === '' &&
		address.company === '' &&
		address.country === '' &&
		address.full_name === '' &&
		address.phone === '' &&
		address.state === '' &&
		address.tax_number === '' &&
		address.postal_code === '';

	if (billinsAddressIsEmpty && settings.hide_billing_address) {
		return null;
	} else if (billinsAddressIsEmpty && !settings.hide_billing_address) {
		return (
			<div>
				<Divider
					style={{
						marginTop: 30,
						marginBottom: 30,
						marginLeft: -30,
						marginRight: -30
					}}
				/>
				<div style={{ paddingBottom: 16, paddingTop: 0 }}>
					{messages.billingAddress}
				</div>
				<div className={style.address}>
					<label>{messages.sameAsShipping}</label>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<Divider
					style={{
						marginTop: 30,
						marginBottom: 30,
						marginLeft: -30,
						marginRight: -30
					}}
				/>
				<div style={{ paddingBottom: 16, paddingTop: 0 }}>
					{messages.billingAddress}
				</div>
				<div className={style.address}>
					<div>{address.full_name}</div>
					<div>{address.company}</div>
					<div>{address.address1}</div>
					<div>{address.address2}</div>
					<div>
						{address.city},{' '}
						{address.state && address.state.length > 0
							? address.state + ', '
							: ''}
						{address.postal_code}
					</div>
					<div>{address.country}</div>
					<div>{address.phone}</div>
				</div>
			</div>
		);
	}
};

export default class OrderPackaging extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			openShippingEdit: false
		};
	}

	openSvg = svg => {
		var myWindow = window.open('');
		myWindow.document.write(svg);
	};

	showShippingEdit = () => {
		this.setState({ openShippingEdit: true });
	};

	hideShippingEdit = () => {
		this.setState({ openShippingEdit: false });
	};

	convertToPrint = txt => {
		var pl_keys = [
			'a_pl',
			'c_pl',
			'e_pl',
			'l_pl',
			'n_pl',
			'o_pl',
			's_pl',
			'z_pl',
			'zh_pl'
		];
		var pl_chars = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];
		var string = txt.split('');

		for (var j = 0; j < pl_chars.length; j++) {
			string = string.map(function(x) {
				return x.replace(pl_chars[j], pl_keys[j]);
			});
		}

		return string;
	};

	saveShippingEdit = address => {
		this.props.onShippingAddressUpdate(address);
		this.hideShippingEdit();
	};

	render() {
		const { order, settings } = this.props;

		const allowEdit = order.closed === false && order.cancelled === false;
		let mapAddress = `${order.shipping_address.address1} ${
			order.shipping_address.city
		} ${order.shipping_address.state} ${order.shipping_address.postal_code}`;
		mapAddress = mapAddress.replace(/ /g, '+');
		const mapUrl = `https://www.google.com/maps/place/${mapAddress}`;

		const r = new Rune({ width: '1000', height: '1130' });

		const r2 = new Rune({ width: '1000', height: '1130' });

		var noise = new Noise();

		var grid = r.grid({
			x: -20,
			y: 20,
			width: 1000,
			height: 1150,
			gutter: 20,
			columns: 37,
			rows: 23
		});

		var pattern = [];

		var first_name_init = order.shipping_address.first_name
			.charAt(0)
			.toLowerCase();
		var last_name_init = order.shipping_address.last_name
			.charAt(0)
			.toLowerCase();

		for (var i = 0; i < grid.state.columns * grid.state.rows - 1; i += 2) {
			pattern.push(first_name_init);
			pattern.push(last_name_init);
		}

		var alphabet = {
			a: [[10, 2], [2, 12], [12, 10]],
			b: [[10, 1], [1, 6], [6, 7], [4, 9], [9, 10]],
			c: [[9, 11], [11, 7], [7, 4], [4, 2], [2, 6]],
			d: [[1, 6], [6, 10], [10, 1]],
			e: [[3, 1], [1, 7], [7, 5], [5, 7], [7, 10], [10, 12]],
			f: [[3, 1], [1, 7], [7, 5], [5, 7], [7, 10]],
			g: [[8, 9], [9, 11], [11, 7], [7, 4], [4, 2], [2, 6]],
			h: [[1, 10], [7, 6], [3, 12]],
			i: [[2, 11]],
			j: [[2, 11], [11, 10]],
			k: [[12, 4], [4, 7], [7, 3], [10, 1]],
			l: [[1, 10], [10, 12]],
			m: [[10, 1], [1, 5], [5, 3], [3, 12]],
			n: [[10, 1], [1, 12], [12, 3]],
			o: [[6, 9], [9, 11], [11, 7], [7, 4], [4, 2], [2, 6]],
			p: [[10, 1], [1, 6], [6, 7]],
			q: [[6, 9], [9, 11], [11, 7], [7, 4], [4, 2], [2, 6], [8, 12]],
			r: [[10, 1], [1, 6], [6, 7], [4, 12]],
			s: [[6, 2], [2, 4], [4, 7], [7, 5], [5, 9], [9, 11], [11, 10]],
			t: [[1, 3], [2, 11]],
			u: [[1, 10], [10, 12], [12, 3]],
			v: [[1, 7], [7, 11], [11, 9], [9, 3]],
			w: [[1, 10], [10, 8], [8, 12], [12, 3]],
			x: [[1, 3], [3, 10], [10, 12], [12, 1]],
			y: [[1, 5], [5, 3], [5, 11]],
			z: [[1, 3], [3, 10], [10, 12]],
			a_pl: [[11, 10], [10, 2], [2, 12], [12, 11], [11, 9]],
			c_pl: [[9, 11], [11, 7], [7, 4], [4, 2], [2, 6], [3, 5]],
			e_pl: [
				[11, 9],
				[9, 12],
				[12, 10],
				[10, 7],
				[7, 5],
				[5, 7],
				[7, 1],
				[1, 3]
			],
			l_pl: [[1, 7], [7, 5], [5, 7], [7, 10], [10, 12]],
			n_pl: [[3, 12], [12, 1], [1, 10], [10, 4], [4, 2]],
			o_pl: [[6, 9], [9, 11], [11, 7], [7, 4], [4, 2], [2, 6], [5, 3]],
			s_pl: [[1, 6], [6, 2], [2, 4], [4, 7], [7, 5], [5, 9], [9, 11], [11, 10]],
			z_pl: [[5, 2], [2, 4], [4, 1], [1, 3], [3, 10], [10, 12]],
			zh_pl: [[1, 3], [3, 7], [6, 10], [10, 12]]
		};

		var adjectives = {
			a: 'Audacious',
			b: 'Brave',
			c: 'Charismatic',
			d: 'Diligent',
			e: 'Excellent',
			f: 'Fearless',
			g: 'Go-Getter',
			h: 'Honest',
			i: 'Industrious',
			j: 'Joyous',
			k: 'Knowledgeable',
			l: 'Lively',
			m: 'Masterful',
			n: 'Nimble-witted',
			o: 'Organized',
			p: 'Passionate',
			q: 'Qualified',
			r: 'Reliable',
			s: 'Smart',
			t: 'Tenacious',
			u: 'Unstoppable',
			v: 'Visionary',
			w: 'Wonderful',
			x: 'Xtraordinary',
			y: 'Young-at-heart',
			z: 'Zealous'
		};

		var back = r
			.polygon(0, 0)
			.stroke(false)
			.fill('hsv', 0, 0, 10)
			.lineTo(0, 0)
			.lineTo(1000, 0)
			.lineTo(1000, 1130)
			.lineTo(0, 1130);

		var xStep = 30;

		var variant = order.items[0].variant_name;

		console.log(variant);

		var colorName = variant.replace('Color: ', '').toLowerCase();

		var colour = new Rune.Color(colorName);
		var colourObj = colour.hsv();

		var x, y, i;

		var vertices = new Array(2048);

		for (i = vertices.length; i--; ) {
			do {
				x = Math.random() - 0.5;
				y = Math.random() - 0.5;
			} while (x * x + y * y > 0.25);

			x = (x * 0.96875 + 0.5) * r.width * 2.5 - r.width / 2;
			y = (y * 0.96875 + 0.5) * r.height * 2.5 - r.height / 2;

			vertices[i] = [x, y];
		}

		var triangles = Delaunay.triangulate(vertices);

		for (i = triangles.length; i; ) {
			var triangleColour = new Rune.Color(
				'hsv',
				Rune.random(colourObj.h - 15, colourObj.h + 15),
				Rune.random(colourObj.s - 15, colourObj.s + 15),
				Rune.random(colourObj.v - 15, colourObj.v + 15)
			);

			var pth = r.path();
			--i;
			pth.moveTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
			--i;
			pth.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
			--i;
			pth.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
			pth.closePath();
			pth.stroke(triangleColour);
			pth.fill(triangleColour);
		}

		var textColour = colour.hsl().l > 60 ? 0 : 255;

		r.rect(350, -5, 300, r.height + 5)
			.fill(colour)
			.stroke(false);

		r.text('Cut through the noise.', 500, 200)
			.fill(textColour)
			.stroke(false)
			.textAlign('center')
			.fontSize(25)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r.text('Take the stage.', 500, 230)
			.fill(textColour)
			.stroke(false)
			.textAlign('center')
			.fontSize(25)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r.text('Knock their socks off.', 500, 260)
			.fill(textColour)
			.stroke(false)
			.textAlign('center')
			.fontSize(25)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r.text('your suit is ready', 500, 460)
			.fill(textColour)
			.stroke(false)
			.textAlign('center')
			.fontSize(16)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r.text('stay bossy.', 500, 820)
			.fill(textColour)
			.stroke(false)
			.textAlign('center')
			.fontSize(22)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		var pckg = r
			.polygon(0, 0)
			.stroke(false)
			.fill('hsv', 0, 0, 100)
			.lineTo(250, 1000)
			.lineTo(250, 1005)
			.lineTo(130, 1005)
			.lineTo(130, 1130)
			.lineTo(250, 1130)
			.lineTo(870, 1130)
			.lineTo(870, 1005)
			.lineTo(750, 1005)
			.lineTo(750, 1000)
			.lineTo(1000, 1000)
			.lineTo(1000, 620)
			.lineTo(750, 620)
			.lineTo(750, 615)
			.lineTo(870, 615)
			.lineTo(870, 505)
			.lineTo(750, 505)
			.lineTo(740, 500)
			.lineTo(750, 495)
			.lineTo(850, 460)
			.lineTo(850, 150)
			.lineTo(740, 120)
			.lineTo(810, 120)
			.lineTo(750, 0)
			.lineTo(1000, 0)
			.lineTo(1000, 1150)
			.lineTo(0, 1150)
			.lineTo(0, 0)
			.lineTo(250, 0)
			.lineTo(190, 120)
			.lineTo(260, 120)
			.lineTo(150, 150)
			.lineTo(150, 460)
			.lineTo(250, 495)
			.lineTo(260, 500)
			.lineTo(250, 505)
			.lineTo(130, 505)
			.lineTo(130, 615)
			.lineTo(250, 615)
			.lineTo(250, 620)
			.lineTo(0, 620)
			.lineTo(0, 1000)
			.lineTo(250, 1000);

		r.draw();

		var back = r2
			.polygon(0, 0)
			.stroke(false)
			.fill('hsv', 0, 0, 0)
			.lineTo(0, 0)
			.lineTo(1000, 0)
			.lineTo(1000, 1150)
			.lineTo(0, 1150)
			.rotate(180, r2.width / 2, r2.height / 2);

		var pckg = r2
			.polygon(0, 0)
			.stroke(false)
			.fill('hsv', 0, 0, 100)
			.lineTo(250, 1000)
			.lineTo(250, 1005)
			.lineTo(130, 1005)
			.lineTo(130, 1130)
			.lineTo(250, 1130)
			.lineTo(870, 1130)
			.lineTo(870, 1005)
			.lineTo(750, 1005)
			.lineTo(750, 1000)
			.lineTo(1000, 1000)
			.lineTo(1000, 620)
			.lineTo(750, 620)
			.lineTo(750, 615)
			.lineTo(870, 615)
			.lineTo(870, 505)
			.lineTo(750, 505)
			.lineTo(740, 500)
			.lineTo(750, 495)
			.lineTo(850, 460)
			.lineTo(850, 150)
			.lineTo(740, 120)
			.lineTo(810, 120)
			.lineTo(750, 0)
			.lineTo(1000, 0)
			.lineTo(1000, 1150)
			.lineTo(0, 1150)
			.lineTo(0, 0)
			.lineTo(250, 0)
			.lineTo(190, 120)
			.lineTo(260, 120)
			.lineTo(150, 150)
			.lineTo(150, 460)
			.lineTo(250, 495)
			.lineTo(260, 500)
			.lineTo(250, 505)
			.lineTo(130, 505)
			.lineTo(130, 615)
			.lineTo(250, 615)
			.lineTo(250, 620)
			.lineTo(0, 620)
			.lineTo(0, 1000)
			.lineTo(250, 1000)
			.rotate(180, r2.width / 2, r2.height / 2);

		r2.text('The', 280, 210)
			.fill(255)
			.stroke(false)
			.fontSize(40)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r2.text(adjectives[first_name_init], 280, 250)
			.fill(255)
			.stroke(false)
			.fontSize(40)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r2.text(order.shipping_address.first_name + "'s", 280, 290)
			.fill(255)
			.stroke(false)
			.fontSize(40)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r2.text('Bossy', 280, 330)
			.fill(255)
			.stroke(false)
			.fontSize(40)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r2.text('Suit.', 280, 370)
			.fill(255)
			.stroke(false)
			.fontSize(40)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		var packing = r2.group(620, 360);

		r2.text('PASTE', 40, 60, packing)
			.fill(255)
			.stroke(false)
			.fontSize(12)
			.fontWeight(900)
			.textAlign('center')
			.fontFamily('Helvetica');

		r2.text('SHIPPING', 40, 70, packing)
			.fill(255)
			.stroke(false)
			.fontSize(12)
			.fontWeight(900)
			.textAlign('center')
			.fontFamily('Helvetica');

		r2.text('INFO', 40, 80, packing)
			.fill(255)
			.stroke(false)
			.fontSize(12)
			.fontWeight(900)
			.textAlign('center')
			.fontFamily('Helvetica');

		r2.text('HERE', 40, 90, packing)
			.fill(255)
			.stroke(false)
			.fontSize(12)
			.fontWeight(900)
			.textAlign('center')
			.fontFamily('Helvetica');

		r2.text('bossysuits', 188, 317)
			.fill(255)
			.stroke(false)
			.textAlign('center')
			.fontSize(18)
			.fontWeight(900)
			.fontFamily('Playfair Display')
			.rotate(90, 188, 317);

		r2.text('bossysuits', 812, 317)
			.fill(255)
			.stroke(false)
			.textAlign('center')
			.fontSize(18)
			.fontWeight(900)
			.fontFamily('Playfair Display')
			.rotate(-90, 812, 317);

		r2.text('stay bossy.', 500, 1090)
			.fill(255)
			.stroke(false)
			.textAlign('center')
			.fontSize(18)
			.fontWeight(900)
			.fontFamily('Playfair Display');

		r2.draw();

		var svgFileInner = r.el.outerHTML;
		var svgFileOuter = r2.el.outerHTML;

		return (
			<div>
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{'Custom Packaging'}
				</div>
				<Paper className="paper-box" zDepth={1}>
					<div className={style.innerBox} id="svg-file">
						<FlatButton
							onClick={() => {
								this.openSvg(svgFileInner);
							}}
							label={'INNER SIDE'}
							primary={true}
						/>
						<FlatButton
							onClick={() => {
								this.openSvg(svgFileOuter);
							}}
							label={'OUTER SIDE'}
							primary={true}
						/>
					</div>
				</Paper>
			</div>
		);
	}
}
