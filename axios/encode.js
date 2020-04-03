import config from 'config.json';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
export const signRequest = (method, path, options = {}) => {
	const timestamp = Date.now() / 1000;
	const what = timestamp + method.toUpperCase() + path + (options.body || '');
	const hmac = crypto.createHmac('sha256', config.secretKey);
	const signature = hmac.update(what).digest('base64');
	return {
		key: config.apikey,
		passphrase: config.passphrase,
		signature,
		timestamp
	};
};

export const getSignature = (method, relativeURI, opts = {}) => {
	const sig = signRequest(method, relativeURI, opts);
	return {
		'OK-ACCESS-KEY': sig.key,
		'OK-ACCESS-PASSPHRASE': sig.passphrase,
		'OK-ACCESS-SIGN': sig.signature,
		'OK-ACCESS-TIMESTAMP': sig.timestamp
	};
};
