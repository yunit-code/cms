export default {
    methods: {
        setFillBlankData(data) {
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
        }
    }
}
