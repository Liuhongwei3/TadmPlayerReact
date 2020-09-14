/*
 * https://liuhongwei3.github.io Inc.
 * Name: CoverLyric.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React, {Component} from 'react';
import {message,Tooltip} from 'antd';

import '../css/CoverLyric.css'
import {musicDetail, musicLyric} from "../network/ReqUrl";

import {song_id, song_name, author_name, img_url, lyrics} from '../initData.json';

class CoverLyric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cover: '',
      name: '',
      singer: '',
      lyrics: [],
      lyricsDom: [],
      lyricIndex: 0,
      top: 0,
      translateY: 0,
      resizeTimer: -1,
    };
    this.requestMusic.bind(this);
    this.createLyricsDom.bind(this);
    this.calcTop.bind(this);
  }

  render() {
    const backGround = {
      background: `center / cover no-repeat rgba(0, 0, 0, 0.75) url(${this.state.cover})`,
    }
    return (
        <div id="cover-lyric" style={backGround}>
          <div className="left">
            <img alt="cover" src={this.state.cover}/>
            <Tooltip title="歌曲名" placement="right">
              <div>{this.state.name}</div>
            </Tooltip>
            <Tooltip title="歌手" placement="bottom">
              <div>{this.state.singer}</div>
            </Tooltip>
          </div>
          <div className="right">
            <div className="inner">
              <div id="translateY">
                {this.state.lyricsDom}
              </div>
            </div>
          </div>
        </div>
    );
  }

  requestMusic = () => {
    if (this.props.id == song_id) {
      this.setState({
        cover: img_url,
        name: song_name,
        singer: author_name,
        lyrics: this.parseLyric(lyrics)
      })
      return;
    }
    musicDetail(this.props.id).then(res => {
      let data = res.data.songs[0];
      this.setState({
        cover: data.al.picUrl,
        name: data.name,
        singer: data.ar[0].name,
      });
    }).catch(err => {
      message.error(err);
    });
    musicLyric(this.props.id).then(res => {
      let data = res.data;
      if (data.nolyric || data.lrc.lyric.length === 0) {
        this.setState({
          lyrics: "暂无歌词~"
        });
        this.createLyricsDom();
      } else {
        this.setState({
          lyrics: this.parseLyric(data.lrc.lyric)
        });
        this.createLyricsDom();
      }
    }).catch(err => {
      message.error(err);
    });
  };
  createLyricsDom = () => {
    if (this.state.lyrics.length === 5) {
      this.setState({
        lyricsDom: <div>{this.state.lyrics}</div>
      })
    } else {
      this.setState({
        lyricsDom: this.state.lyrics.map((item, index) =>
            <div key={index} className={`lyrics ${index === this.state.lyricIndex ? "active-lyric" : ""}`}>
              {item.text}
            </div>
        )
      })
    }
  };

  calcTop = () => {
    const dom = document.getElementsByClassName("right")[0];
    const {display = ""} = window.getComputedStyle(dom);
    if (display === "none") {
      return;
    }
    const height = dom.offsetHeight;
    height && this.setState({
      top: Math.floor(height / 10 / 2)
    })
  };

  parseLyric(lrc) {
    let lyrics = lrc.split("\n");
    let lrcObj = [];
    for (let i = 0; i < lyrics.length; i++) {
      let lyric = decodeURIComponent(lyrics[i]);
      let timeReg = /\[\d*:\d*((.|:)\d*)*]/g;
      let timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) continue;
      let clause = lyric.replace(timeReg, "");
      for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
        let t = timeRegExpArr[k];
        let min = Number(String(t.match(/\[\d*/i)).slice(1)),
            sec = Number(String(t.match(/:\d*/i)).slice(1));
        let time = min * 60 + sec;
        if (clause !== "") {
          lrcObj.push({time: time, text: clause});
        }
      }
    }
    return lrcObj;
  };

  componentDidMount() {
    this.requestMusic();
    const audio = document.getElementById("audio");
    typeof this.state.lyrics === "object" && audio.addEventListener("timeupdate", () => {
      let lyricIndex = 0;
      for (let i = 0; i < this.state.lyrics.length; i++) {
        if (audio.currentTime >= this.state.lyrics[i].time) {
          lyricIndex = i;
        }
      }
      this.setState({
        lyricIndex: lyricIndex
      }, () => {
        this.createLyricsDom();
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id) {
      this.requestMusic();
      this.setState({
        lyricIndex: 0
      })
    }
    if (this.state.lyrics !== prevState.lyrics) {
      this.createLyricsDom();
      this.calcTop();
      window.addEventListener("resize", () => {
        clearTimeout(this.state.resizeTimer);
        this.setState({
          resizeTimer: setTimeout(() => this.calcTop(), 60)
        }, () => {
          this.calcTop();
        })
      });
    }
    if (this.state.lyricIndex !== prevState.lyricIndex) {
      let offsetY = Math.round(document.getElementById("cover-lyric").offsetHeight / 10).toFixed(1);
      this.setState({
        translateY: -offsetY * (this.state.lyricIndex - 4) - this.state.top
      }, () => {
        let y = this.state.translateY;
        document.getElementById("translateY").style.transform =
            `translate3d(0, ${y}px, 0)`
      })
    }
  }
}

export default CoverLyric;
