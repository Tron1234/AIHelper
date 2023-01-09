<template>
	<image class="record-icon" :src="pic" mode="widthFix" @touchstart="changeRecord(true)"
		@touchend="changeRecord(false)" />
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
	import recording from '@/static/recording.svg'
	import record from '@/static/record.svg'
	const recorded: Ref = ref(false)
	const pic = computed(() => recorded.value ? recording : record)
	// 音频管理器
	const recorderManager: any = uni.getRecorderManager()
	const innerAudioContext: any = uni.createInnerAudioContext()

	interface RecorderObj {
		tempFilePath: string
	}
	
	onLoad(() => {
		// 获取设备
		const {
			deviceId,
			deviceBrand,
			deviceModel,
			system
		}: any = uni.getDeviceInfo()
		
		recorderManager.onStop(function(res: RecorderObj) {
			// loading
			uni.showLoading({})
			// 上传操作
			uni.uploadFile({
				url: 'http://81.71.149.135:3000/upload/audio',
				filePath: res.tempFilePath,
				formData: {
					deviceId,
					deviceBrand,
					deviceModel,
					system
				}, 
				success: function(data) {
					uni.hideLoading()
					// 请求完成后播放音频
					innerAudioContext.src = data
					innerAudioContext.play()
				}
			})
		})
	})

	function changeRecord(status: boolean) {
		recorded.value = status
		if (status) {
			innerAudioContext.stop()
			innerAudioContext.onStop(() => {
				// 开始录音(30秒自动停止)
				recorderManager.start({
					duration: 30000
				})
			})
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
	}
</style>
