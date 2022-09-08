export default {
    methods: {
        setFillBlankData(data) {
            if(data.length === 0) return []
            const arr = []
            if (this.propData.fillBlank) {
                if (this.propData.contentNumber > data.length) {
                    return this.fillComponentData(arr, data)
                }
            }
            return data
        },
        fillComponentData(arr, data) {
            const finallyArr = [...arr, ...data]
            console.log(finallyArr, data, this.propData.contentNumber)
            if (finallyArr.length >= this.propData.contentNumber) {
                finallyArr.length = this.propData.contentNumber
                return finallyArr
            }
            return this.fillComponentData(finallyArr, data)
        },
        /**
         * 通用的url参数对象
         * 所有地址的url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject()
            var params = {
                pageId:
                    window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : '',
                ...urlObject
            }
            return params
        }
    }
}
