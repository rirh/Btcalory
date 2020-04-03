import {
	signRequest,
	getSignature
} from './encode.js'

module.exports = (param) => {
	const url = param.url;
	let method = param.method || '';
	let header = param.header || {};
	const data = param.data || {};
	// 请求方式: GET POST 
	method = method.toUpperCase(); // 转大写
	// if (method == "POST") {
	const bodyJson = JSON.stringify(data);
	header = {
		'content-type': 'application/json; charset=utf-8',
		...getSignature(method, url, {
			body: bodyJson
		})
	}
	// }
	console.info('=====request start===');
	console.info(JSON.stringify(param));
	console.info('=====request end===');

	// 发起请求 加载动画
	if (!param.hideloading) {
		uni.showLoading({
			title: '加载中...',
			mask: true,
		});
	}
	const success = (res) => {
		uni.hideLoading()
		console.info('=====res start===');
		console.info(res);
		console.info('=====res end===');
		if (res.statusCode && res.statusCode != 200) { // api错误
			uni.showToast({
				icon: 'none',
				title: res.data.message,
				position: 'top',
				duration: 10000
			});
			return;
		}

		typeof param.success == "function" && param.success(res.data);
	}
	const fail = (e) => {
		uni.showModal({
			content: e.message
		})
		uni.hideLoading();
		typeof param.fail == "function" && param.fail(e.data);
	}
	const complete = (e) => {
		// console.info('=====complete start===');
		// console.info(e);
		// console.info('=====complete end===');
		if (e.statusCode && e.statusCode != 200) { // api错误
			return;
		}
		typeof param.complete == "function" && param.complete(e.data);
	}
	uni.request({
		url: url,
		method: method || "GET",
		header: header,
		data: data,
		success,
		fail,
		complete
	})
}
