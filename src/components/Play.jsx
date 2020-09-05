/*
 * https://liuhongwei3.github.io Inc.
 * Name: Play.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React, {Component} from 'react';
import {message, Tooltip} from 'antd';

import {musicUrl} from "../network/ReqUrl";
import {timeFormat} from "../util";

import '../css/play.css'

import {song_id, play_url} from '../initData.json';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playState: true,
      orderState: true,
      controlPosition: true,
      src: '',
      currentTime: 0,
      duration: 0,
      detailList: [],
      randomList: [],
      currentId: 0,
    };
    this.changePlayState.bind(this);
    this.changeListState.bind(this);
    this.changeControlPosition.bind(this);
    this.reqMusicUrl.bind(this);
    this.play.bind(this);
    this.pause.bind(this);
    this.prev.bind(this);
    this.next.bind(this);
    this.audioListen.bind(this);
    this.toTime.bind(this);
    this.toLeft.bind(this);
    this.toRight.bind(this);
    this.doError.bind(this);
  }

  render() {
    return (
        <div>
          {/*crossOrigin="anonymous"*/}
          <audio id="audio" src={this.state.src}/>
          <div className="play-icon">
            <Tooltip title="随机播放" placement="topRight">
              <i className="fa fa-random fa-x" aria-hidden="true" id="random"
                 onClick={() => this.doOrder()}/>
            </Tooltip>
            <Tooltip title="顺序播放" placement="topRight">
              <i className="fa fa-bars fa-x" aria-hidden="true" id="order"
                 onClick={() => this.doRandom()}/>
            </Tooltip>
            <Tooltip title="上一曲" placement="topRight">
              <i className="fa fa-step-backward fa-x" aria-hidden="true"
                 onClick={() => this.prev()}/>
            </Tooltip>
            <Tooltip title="继续播放" placement="topRight">
              <i className="fa fa-play fa-x" aria-hidden="true" id="play"
                 onClick={() => this.play()}/>
            </Tooltip>
            <Tooltip title="暂停播放" placement="topRight">
              <i className="fa fa-pause fa-x" aria-hidden="true" id="pause"
                 onClick={() => this.pause()}/>
            </Tooltip>
            <Tooltip title="下一曲" placement="topRight">
              <i className="fa fa-step-forward fa-x" aria-hidden="true"
                 onClick={() => this.next()}/>
            </Tooltip>
            {/*<Tooltip title="查看热评" placement="topRight">*/}
            {/*  <i className="fa fa-commenting fa-x" aria-hidden="true"*/}
            {/*     onClick={() => this.toComment()}/>*/}
            {/*</Tooltip>*/}
            {/*<i className="fa fa-download fa-x" aria-hidden="true" title="下载"/>*/}
            <div className="current-time">{timeFormat(this.state.currentTime)}</div>
            <div className="pg-btm" onClick={event => this.toTime(event)}>
              <hr className="progressTop"/>
              <i className="fa fa-dot-circle-o" aria-hidden="true" id="progress"
                 draggable="true"/>
              <hr className="progressBtm"/>
            </div>
            <div className="duration">{timeFormat(this.state.duration)}</div>
            <Tooltip title="收起" placement="topRight">
              <i className="fa fa-chevron-left" aria-hidden="true" id="left"
                 onClick={() => this.toLeft()}/>
            </Tooltip>
            <Tooltip title="显示" placement="topRight">
              <i className="fa fa-chevron-right" aria-hidden="true" id="right"
                 onClick={() => this.toRight()}/>
            </Tooltip>
          </div>
        </div>
    );
  };

  doRandom = () => {
    this.setState({
      orderState: false
    });
    this.changeListState();
    this.setState({
      randomList: [...this.state.detailList]
    }, () => {
      let i = this.state.randomList.length;
      while (i) {
        let j = Math.floor(Math.random() * i--);
        [this.state.randomList[j], this.state.randomList[i]] = [this.state.randomList[i], this.state.randomList[j]];
      }
      this.setState({
        detailList: this.state.randomList
      })
    });
  };
  doOrder = () => {
    this.setState({
      orderState: true
    });
    this.changeListState();
    this.setState({
      detailList: this.props.detailList,
      randomList: []
    })
  };
  toTime = event => {
    event.persist();
    let oWidth = document.getElementsByClassName("progressBtm")[0].clientWidth;
    let offsetX = event.nativeEvent.offsetX;
    let percent = (offsetX / oWidth).toFixed(2);
    this.setState({
      currentTime: parseInt(percent * this.state.duration)
    }, () => {
      document.getElementById("audio").currentTime = this.state.currentTime;
    })
  };
  reqMusicUrl = () => {
    if (this.props.id == song_id) {
      this.setState({
        src: play_url
      })
      return;
    }
    musicUrl(this.props.id).then(res => {
      let url = res.data.data[0].url;
      if (url) {
        this.setState({
          src: url
        }, () => {
          this.play();
        });
      } else {
        this.doError();
      }
    }).catch(err => {
      this.doError();
    })
  };
  doError = () => {
    message.error('播放出现错误(网络错误 OR 暂无版权)，已为您自动切换到下一首！');
    this.next();
  };
  play = () => {
    const audio = document.getElementById("audio");
    // Show loading animation.
    let playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        audio.play();
      })
          .catch(error => {
            console.log(error);
          });
    }
    this.setState({
      playState: true
    }, () => {
      this.changePlayState();
    });
  };
  pause = () => {
    const audio = document.getElementById("audio");
    audio.pause();
    message.warning("已暂停播放音乐~");
    this.setState({
      playState: false
    }, () => {
      this.changePlayState();
    });
  };
  prev = () => {
    if (this.state.detailList.length === 0) {
      this.pause();
      message.warning("当前歌单列表为空，现已暂停播放，您可以选择一个歌单继续享受音乐~");
      return;
    }
    let id = this.state.currentId ? this.state.currentId : 0;
    id--;
    if (id < 0) {
      id = this.state.detailList.length - 1;
    }
    this.setState({
      currentId: id
    }, () => {
      this.props.updateSongId(this.state.detailList[id].id, this.state.detailList)
    });
  };
  next = () => {
    if (this.state.detailList.length === 0) {
      this.pause();
      message.warning("当前歌单列表为空，现已暂停播放，您可以选择一个歌单继续享受音乐~");
      return;
    }
    let id = this.state.currentId ? this.state.currentId : 0;
    id++;
    if (id >= this.state.detailList.length) {
      id = 0;
    }
    this.setState({
      currentId: id
    }, () => {
      this.props.updateSongId(this.state.detailList[id].id, this.state.detailList)
    })
  };
  audioListen = (audio) => {
    let progress = document.getElementById("progress");
    let progressTop = document.getElementsByClassName("progressTop")[0];
    audio.addEventListener("timeupdate", () => {
      this.setState({
        duration: audio.duration,
        currentTime: audio.currentTime
      })
      progress.style.left = progressTop.getBoundingClientRect().width + "px";
    });
    audio.addEventListener("ended", () => {
      this.setState({
        playState: false,
        currentTime: 0,
        duration: 0
      });
      this.next();
    });
    audio.addEventListener("error", () => this.pause());
  };
  changePlayState = () => {
    const playIcon = document.getElementById("play");
    const pauseIcon = document.getElementById("pause");
    if (this.state.playState) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "flex";
    } else {
      playIcon.style.display = "flex";
      pauseIcon.style.display = "none";
    }
  };
  changeListState = () => {
    const order = document.getElementById("order");
    const random = document.getElementById("random");
    if (this.state.orderState) {
      order.style.display = "flex";
      random.style.display = "none";
    } else {
      order.style.display = "none";
      random.style.display = "flex";
    }
  };
  changeControlPosition = () => {
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    if (this.state.controlPosition) {
      left.style.display = "none";
      right.style.display = "flex";
    } else {
      left.style.display = "flex";
      right.style.display = "none";
    }
    this.setState({
      controlPosition: !this.state.controlPosition
    })
  };
  toLeft = () => {
    let playIcon = document.getElementsByClassName("play-icon")[0];
    let pageWidth = document.body.clientWidth;
    if (pageWidth > 768) {
      playIcon.style.left = '-66vw';
    } else {
      playIcon.style.left = '-' + 0.92 * pageWidth + 'px';
    }
    this.changeControlPosition();
  };
  toRight = () => {
    let playIcon = document.getElementsByClassName("play-icon")[0];
    playIcon.style.left = '0';
    this.changeControlPosition();
  };

  componentDidMount() {
    this.setState({
      id: this.props.id,
      detailList: this.props.detailList
    });
    this.changePlayState();
    this.changeListState();
    this.changeControlPosition();
    this.reqMusicUrl();
    if (!this.state.orderState) {
      this.doRandom();
    }
    const audio = document.getElementById("audio");
    this.audioListen(audio);
    //  绑定拖拽
    // let dragging = false, position = [0];
    // let progress = document.getElementById("progress");
    // progress.addEventListener("mousedown", e => {
    //   dragging = true
    //   position = [e.clientX]
    // })
    // document.addEventListener('mousemove', e => {
    //   if (dragging === false) return null;
    //   const x = e.clientX
    //   // const y = e.clientY
    //   const deltaX = x - position[0]
    //   // const deltaY = y - position[1]
    //   const left = parseInt(progress.style.left || 0)
    //   // const top = parseInt(progress.style.top || 0)
    //   progress.style.left = left + deltaX + 'px'
    //   // progress.style.top = Math.floor((top + deltaY) % 5 + window.innerHeight * 0.03) + 'px'
    //   position = [x]
    // })
    // document.addEventListener("mouseup", e => {
    //   dragging = false
    // })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.playState !== prevState.playState) {
      this.changePlayState();
    }
    if (this.state.orderState !== prevState.orderState) {
      this.changeListState();
    }
    if (this.state.currentTime !== prevState.currentTime) {
      const pgTop = document.getElementsByClassName("progressTop")[0];
      pgTop.style.width = (this.state.currentTime / this.state.duration) * 100 + "%";
    }
    if (this.props.detailList !== prevProps.detailList) {
      this.setState({
        detailList: this.props.detailList
      });
    }
    if (this.props.id !== prevProps.id) {
      if (this.props.detailList !== prevProps.detailList) {
        this.setState({
          detailList: this.props.detailList
        }, () => {
          this.reqMusicUrl();
          if (this.props.id !== this.state.detailList[this.state.currentId]) {
            this.setState({
              currentId: this.state.detailList.findIndex(item => item.id === this.props.id)
            })
          }
        });
      } else {
        this.reqMusicUrl();
        if (this.props.id !== this.state.detailList[this.state.currentId]) {
          this.setState({
            currentId: this.state.detailList.findIndex(item => item.id === this.props.id)
          })
        }
      }
    }
  }
}

export default Play;
