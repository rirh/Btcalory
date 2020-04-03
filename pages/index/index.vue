<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<button @click="handle_test">ping</button>
	</view>
</template>

<script>
import axios from 'axios/index.js';
import config from 'config.json';
import * as crypto from 'crypto';
import * as querystring from 'querystring';

export default {
	data() {
		return {
			title: 'Hello'
		};
	},
	onLoad() {},
	methods: {
		handle_test() {

			const signRequest = (method, path, options = {}) => {
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
			const getSignature = (method, relativeURI, opts = {}) => {
				const sig = signRequest(method, relativeURI, opts);
				return {
					'OK-ACCESS-KEY': sig.key,
					'OK-ACCESS-PASSPHRASE': sig.passphrase,
					'OK-ACCESS-SIGN': sig.signature,
					'OK-ACCESS-TIMESTAMP': sig.timestamp
				};
			};
			const url = `${config.host}/api/account/v3/wallet`;
			uni.request({
				url,
				header: { ...getSignature('get', url) },
				success: res => {
					this.title = res;
					console.log(res);
				}
			});
		}
	}
};
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
