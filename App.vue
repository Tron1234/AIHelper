<script>
	export default {
		onLaunch: function() {
			const {
				deviceId,
				deviceBrand,
				deviceModel,
				system
			} = uni.getDeviceInfo()
			// 第一次进入请求记录手机型号和id
			uni.request({
				url: 'http://81.71.149.135:3000/device/addDevice',
				method: 'POST',
				data: {
					deviceId,
					deviceBrand,
					deviceModel,
					system
				},
				success:function(res){
					console.log(res)
				},
				fail:function(error){
					console.log(error)
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
