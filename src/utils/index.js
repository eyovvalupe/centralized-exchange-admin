// import { validPhone } from './validate'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

// 单词首字母转大写
export function toUpperCaseWord(val) {
  if (!val) return ''
  return val.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
}
export function formatSeconds(seconds) {
  let str = '--:--:--'
  if (Number(seconds) > 0) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    str = [hours, minutes, secs]
      .map(unit => String(unit).padStart(2, '0'))
      .join(':');
  }
  return str
}

// 返回北京时区时间戳
export function getBJTimezoneMill(time) {
  const str = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  return new Date(`${str}  GMT+0800`).getTime()
}

export const dayjs2 = dayjs

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // eslint-disable-next-line prefer-regex-literals
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    // date = new Date( time )
    date = new Date(new Date(time).getTime() + (parseInt(new Date(time).getTimezoneOffset() / 60) + 8) * 3600 * 1000)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function encryptionPhone(val) {
  const phone = val + ''
  if (!validPhone(phone)) {
    return ''
  }
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return phone.replace(reg, '$1****$2')
}

/**
 * 格式化秒时间
 * @param {*} time
 * @param {*} option
 */
export function formatSecondTime(result) {
  let h = Math.floor(result / 3600)
  h = h < 10 ? `0${h}` : h
  let m = Math.floor((result / 60) % 60)
  m = m < 10 ? `0${m}` : m
  let s = Math.floor(result % 60)
  s = s < 10 ? `0${s}` : s
  return h + ':' + m + ':' + s
}

/**
 * 格式化字节
 * @param {*} size
 * @returns
 */
export function formatByteSize(size) {
  let size_int = size
  if (typeof size === 'string' && size.constructor === String) {
    size_int = parseInt(size)
  }
  let formatSize
  if (parseInt(size_int / 1024 / 1024 / 1024) > 0) {
    formatSize = (size_int / 1024 / 1024 / 1024).toFixed(2) + 'G'
  } else if (parseInt(size_int / 1024 / 1024) > 0) {
    formatSize = (size_int / 1024 / 1024).toFixed(2) + 'MB'
  } else if (parseInt(size_int / 1024) > 0) {
    formatSize = (size_int / 1024).toFixed(2) + 'kB'
  } else {
    formatSize = size_int + 'Byte'
  }
  return formatSize
}

const START_TIME = ' 00:00:00'
const END_TIME = ' 23:59:59'
const MILLSECEND_DAY1 = 1000 * 60 * 60 * 24 // 一天的毫秒数

/**
 * 格式化日期（不含时间）
 * @param {*} date
 */
const formatterDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const monthFormat = month >= 10 ? month : `0${month}`
  const day = date.getDate()
  const dayFormat = day >= 10 ? day : `0${day}`
  return `${year}-${monthFormat}-${dayFormat}`
}
/**
 * 获取今天
 * @param {*} currentDate
 */
export const getToday = function () {
  const date = formatterDate(new Date())
  return [date + START_TIME, date + END_TIME]
}
/**
 * 获取昨天
 */
export const getLastDay = function () {
  const lastDay = new Date().getTime() - MILLSECEND_DAY1
  const date = formatterDate(new Date(lastDay))
  return [date + START_TIME, date + END_TIME]
}

/**
 * 获取近三天时间
 * @param {*} currentDate
 */
export const getLatestDay = (currentDate = new Date(), day) => {
  // 起止日期数组
  const startStop = []
  const startDay = new Date(currentDate.getTime() - day * MILLSECEND_DAY1)
  // 本周起始时间
  startStop.push(formatterDate(startDay) + START_TIME)
  // 本周终止时间
  startStop.push(formatterDate(new Date()) + END_TIME)
  // 返回
  return startStop
}

/**
 * 格式化数字，处理数字精度问题
 * @param number 需要处理的数字数据  number | string
 * @param fractionDigits=2 保留小数
 * @param isrounded=true 是否四舍五入
 * @return 已处理的数字数据
 */
export function toFixed(number, fractionDigits = 2, isrounded = true) {
  let value = +number || 0
  if (!value) return 0
  const digits = +fractionDigits || 2
  let numstr = `${number}`
  const index = numstr.indexOf('.')
  if (index === 0) numstr = '0' + numstr
  let raw = 0
  if (index !== -1) {
    raw = numstr.length - 1 - index
    value = +numstr.replace(/\./g, '')
  }
  if (raw > digits) {
    value = value / Math.pow(10, raw - digits)
  } else if (raw < digits) {
    value = value * Math.pow(10, digits - raw)
  }
  const rounded = typeof isrounded === 'boolean' ? isrounded : true
  return (rounded ? Math.round(value) : Math.floor(value)) / Math.pow(10, digits)
}

/**
 * 格式化数字，处理数字精度问题
 * @param number 需要处理的数字数据 number | string
 * @param fractionDigits=2 保留小数
 * @param isrounded=true 是否四舍五入
 * @return 已处理的数字数据
 */
export function toFixedStr(number, fractionDigits = 2, isrounded = true) {
  const value = toFixed(number, fractionDigits, isrounded)
  if (typeof value === 'number' && !isNaN(value)) return value.toFixed(fractionDigits)
  return value
}
// 压缩图片
export const _compressImg = (base64, multiple, fn) => { // , useImg, targetObj
  // 第一个参数就是需要加密的base65，
  // 第二个是压缩系数 0-1，
  // 第三个压缩后的回调 用来获取处理后的 base64
  if (!base64) {
    return
  }
  // const _this = this
  const length = base64.length / 1024
  // 压缩方法
  let newImage = new Image()
  let quality = 0.6    // 压缩系数0-1之间
  newImage.src = base64
  newImage.setAttribute('crossOrigin', 'Anonymous') // url为外域时需要
  let imgWidth,
    imgHeight
  let w = undefined
  newImage.onload = function () {
    // 这里面的 this 指向 newImage
    // 通过改变图片宽高来实现压缩
    w = this.width * multiple
    imgWidth = this.width
    imgHeight = this.height
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    if (Math.max(imgWidth, imgHeight) > w) {
      if (imgWidth > imgHeight) {
        canvas.width = w
        // 等比例缩小
        canvas.height = w * (imgHeight / imgWidth)
      } else {
        canvas.height = w
        // 等比例缩小
        canvas.width = w * (imgWidth / imgHeight)
      }
    } else {
      canvas.width = imgWidth
      canvas.height = imgHeight
      // quality 设置转换为base64编码后图片的质量，取值范围为0-1  没什么压缩效果
      // 还是得通过设置 canvas 的宽高来压缩
      quality = 0.6
    }
    const size = Math.floor(base64.length / 1024)
    if (size < 50) {
      quality = 0.9
    } else if (size < 150) {
      quality = 0.8
    } else {

    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height) //  // 这里面的 this 指向 newImage
    let smallBase64 = canvas.toDataURL('image/jpeg', quality) // 压缩语句
    // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
    // while (smallBase64.length / 1024 > 150) {
    // quality -= 0.01;
    // smallBase64 = canvas.toDataURL("image/jpeg", quality);
    // }
    // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
    // while (smallBase64.length / 1024 < 50) {
    // quality += 0.001;
    // smallBase64 = canvas.toDataURL("image/jpeg", quality);
    // }

    // 必须通过回调函数返回，否则无法及时拿到该值，回调函数异步执行
    // console.log(`压缩前：${length}KB`)
    // console.log(`压缩后：${smallBase64.length / 1024} KB`)
    fn(smallBase64)
    // return smallBase64
    // useImg(smallBase64, targetObj)
  }
}
// 随机文件名
export function randomFileName(originalName) {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomNum}.${extension}`;
}
/**
 * 生成包含字母（大小写）、数字和特殊字符的6位随机密码
 * @returns {string} - 6位随机密码
 */
export function generateRandomPassword(len, isNumber) {
  // 定义字母、数字和特殊字符的集合
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialCharacters = '!@#$%&';

  // 合并所有字符集合
  let allCharacters = lowerCaseLetters + upperCaseLetters + numbers + specialCharacters;
  if (isNumber) {
    allCharacters = numbers
  }
  let password = '';
  let length = (len && !isNaN(Number(len))) ? len : 12
  // 随机选择6个字符生成密码
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
}
export function resDatatoTree(data) {
  const tree = [];
  const childrenOf = {};
  // 初始化 childrenOf 对象
  data.forEach(item => {
    const { username, father_username } = item;
    if (!childrenOf[father_username]) {
      childrenOf[father_username] = [];
    }
    childrenOf[father_username].push(item);
  });

  // 构建树形结构
  function buildNode(username) {
    if (!childrenOf[username]) {
      return [];
    }
    return childrenOf[username].map(item => ({
      id: item.partyid,
      remarks: item.remarks,
      label: item.username + (item.remarks ? ' [' + item.remarks + ']' : ''),
      username: item.username,
      children: buildNode(item.username),
    }));
  }

  // 根节点的父用户名为 null
  tree.push(...buildNode(null));

  return tree;
}
export function copy(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        ElMessage({
          message: '复制成功',
          offset: 200,
          type: 'tips'

        })
      })
      .catch(err => {
        console.error('复制失败: ', err)
        ElMessage({
          message: '复制失败',
          offset: 200,
          type: 'tips'
        })
      })
  } else {
    const inputEle = document.createElement('input')
    inputEle.value = text
    document.body.appendChild(inputEle)
    inputEle.select()
    try {
      const successful = document.execCommand('copy')
      const msg = successful ? '复制成功' : '复制失败'
      ElMessage({
        message: msg,
        offset: 200,
        type: 'tips'
      })
    } catch (err) {
      console.error('复制失败: ', err)
      ElMessage({
        message: '复制失败',
        offset: 200,
        type: 'tips'
      })
    }
    inputEle.remove()
  }
}