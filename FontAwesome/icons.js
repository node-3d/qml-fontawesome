// oxlint-disable no-underscore-dangle, no-unused-vars

/*
 * Parses font metadata (icons.json) to create icon names and sets.
 *
 * icons.json `icons` structure:
 *
 * ```
 * {
 *   [name: string]: {
 *     unicode: string, // '30', 'f613',
 *     free: ('brands' | 'solid' | 'regular')[],
 *     aliases: {
 *       names: string[],
 *     },
 *   },
 * }
 * ```
 */
const categorize = (data) => {
	const styles = {
		brands: {},
		solid: {},
		regular: {},
		_all: {},
		_unique: {},
		_family: {},
		_list: [],
	};
	for (const [k, v] of Object.entries(data)) {
		const aliases = [...(v.aliases?.names || []), k];
		for (const alias of aliases) {
			for (const style of v.free) {
				const isO = style === 'regular' && v.free.length > 1 && v.free.includes('solid');
				const normK = `${alias}`.replaceAll('-', '_');
				const name = isO ? `fa_${normK}_o` : `fa_${normK}`;
				const uniStr = String.fromCodePoint(Number.parseInt(v.unicode, 16));
				styles[style][name] = uniStr;
				styles._all[name] = uniStr;
				styles._family[name] = style;
				if (alias === k) {
					styles._unique[name] = uniStr;
					styles._list.push(name);
				}
			}
		}
	}
	return styles;
};

const getCode = (styles, name) => {
	if (!styles || !name) {
		return '';
	}
	return styles._all[name] || '';
};

const getFamily = (styles, name, solid, regular, brands) => {
	if (!styles || !name) {
		return solid;
	}
	const family = styles._family[name];
	if (family === 'brands') {
		return brands;
	}
	if (family === 'regular') {
		return regular;
	}
	return solid;
};

const getWeight = (styles, name) => {
	if (!styles || !name) {
		return Font.Normal;
	}
	const family = styles._family[name];
	if (family === 'solid') {
		return Font.Black;
	}
	return Font.Normal;
};

const getAll = (styles) => {
	if (!styles) {
		return {};
	}
	return styles._all;
};

const getUnique = (styles) => {
	if (!styles) {
		return {};
	}
	return styles._unique;
};

const getList = (styles) => {
	if (!styles) {
		return [];
	}
	return styles._list;
};
