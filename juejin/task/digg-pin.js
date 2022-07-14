// 沸点点赞 
const { getCookie } = require('../cookie')
const JuejinHttp = require('../api')
const { logger } = require("./../../utils/log")

const pinDigg = async task => {
    const cookie = await getCookie()
    const API = new JuejinHttp(cookie)
    const articles = await API.getRecommendPins()
    const list = articles.filter(v => v.user_interact && v.user_interact.is_digg === false)
    if (list.length == 0) {
        console.log(`获取沸点列表失败[f2]`)
        return
    }
    const times = task.limit - task.done; //需要执行的次数
    console.log(`需要点赞${times}篇沸点`)
    const ids = []
    for (let i = 0; i < times; i++) {
        const article = list[i] || list[0]
        await API.diggSave(article['msg_id'], 4)
        // 取消点赞
        // await API.diggCancel(article['msg_id'], 4)
        ids.push(article['msg_id'])

    }
    logger.set('pins.diggs', ids).save()
    console.log(`点赞沸点 done`)
}

module.exports = pinDigg