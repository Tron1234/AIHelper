<template>
	<view class="record-icon" @touchstart="changeRecord(true)" @touchend="changeRecord(false)">
		<image v-show="recorded" src="@/static/recording.svg" mode="widthFix" />
		<image v-show="!recorded" src="@/static/record.svg" mode="widthFix" />
	</view>
</template>

<script lang="ts" setup>
	import {
		ref,
		computed,
		Ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const recorded: Ref = ref(false)
	let deviceId: string
	// 音频管理器
	const recorderManager: any = uni.getRecorderManager()
	const innerAudioContext: any = uni.createInnerAudioContext()

	interface RecorderObj {
		tempFilePath: string
	}

	onLoad(() => {
		// 获取社保
		deviceId = uni.getDeviceInfo().deviceId
		recorderManager.onStop(function(res: RecorderObj) {
			// loading
			uni.showLoading({})
			// 上传操作
			uni.uploadFile({
				url: 'http://81.71.149.135:3000/upload/audio',
				filePath: res.tempFilePath,
				name:'audio',
				formData: {
					deviceId
				},
				success: function(data) {
					uni.hideLoading()
					// 请求完成后播放音频
					innerAudioContext.src = JSON.parse(data.data).data
					innerAudioContext.play()
				},
				fail:function(){
					uni.hideLoading()
				}
			})
		})
	})

	function changeRecord(status: boolean) {
		recorded.value = status
		if (status) {
			recorderManager.start({
				duration: 30000
			})
			// innerAudioContext.stop()
			// innerAudioContext.onStop((e) => {
			// 	// 开始录音(30秒自动停止)
				
			// })
		} else {
			// 停止录音
			recorderManager.stop()
		}
	}
</script>

<style lang="scss">
	.record-icon {
		width: 140rpx;
		height: 140rpx;
		position: fixed;
		bottom: 140rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
