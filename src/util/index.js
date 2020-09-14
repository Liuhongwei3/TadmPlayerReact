/*
 * https://liuhongwei3.github.io Inc.
 * Name: index.js
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

export function dateFormat(dateIn = 0) {
    const time = new Date(dateIn);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    m = m.toString().padStart(2, "0");
    let d = time.getDate();
    d = d.toString().padStart(2, "0");
    return `${y}/${m}/${d}`;
}

export function timeFormat(timeIn = 0) {
    const time = timeIn ? new Date(timeIn * 1000) : 0;
    if (time) {
        let minute = time.getMinutes();
        let second = time.getSeconds();
        second = second.toString().padStart(2, "0")
        return `${minute} : ${second}`;
    }
    return "0 : 00";
}

export function countFormat(value) {
    if (value < 1000) {
        return value
    } else if (value > 1000 && value < 10000) {
        return Math.round(value / 1000) + ' K+'
    } else if (value > 10000 && value < 1000000) {
        return Math.round(value / 10000) + ' W+'
    } else if (value > 1000000 && value < 10000000) {
        return Math.round(value / 1000000) + ' 百W+'
    } else if (value > 10000000 && value < 100000000) {
        return Math.round(value / 10000000) + ' 千W+'
    } else {
        return Math.round(value / 100000000) + ' 亿+'
    }
}

export function shuffle(arr) {
    let i = arr.length;
    if (i <= 0) {
        return [];
    }
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function debounce(func, wait = 500, immediate = false) {
    let timer;
    return function(...args) {
        let context = this;
        timer && clearTimeout(timer)
        if (immediate) {
            let callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, wait);
            if (callNow) func.apply(context, args);
        } else {
            timer = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        }
    }
}

export function throttle(func, delay) {
    let prev = 0;
    return function(...args) {
        let now = Date.now();
        let context = this;
        if (now - prev >= delay) {
            func.apply(context, args);
            prev = Date.now();
        }
    }

    //  延时器版本
    // let timeout;
    // return function(...args) {
    //     if (!timeout) {
    //         let context = this;
    //         timeout = setTimeout(() => {
    //             timeout = null;
    //             func.apply(context, args);
    //         }, wait);
    //     }
    // }
}