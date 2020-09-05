/*
 * https://liuhongwei3.github.io Inc.
 * Name: Search.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React, {Component, PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Card, Input, message, Table, Tag, Spin} from 'antd';

import {musicDetail, searchMusic, hotSearchKeywords} from "../network/ReqUrl";

import {timeFormat, debounce} from "../util";

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      hotSearchKeywords: [],
      searchResults: [],
      noResult: true,
      loading: false
    };
    this.handleChange.bind(this);
    this.requestHotSearchKeyWords.bind(this);
    this.updateKeyword.bind(this);
    this.searchSongs.bind(this);
    this.doSearch.bind(this);
    this.searchByKeyword.bind(this);
    this.searchDebounced = debounce(this.searchByKeyword);
  }

  render() {
    const columns = [
      {
        title: '封面',
        dataIndex: 'artists',
        key: 'cover',
        render: (text, record) => <img width="50px" height="50px" src={text[0].picUrl} alt={record.name}/>
      },
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '歌手',
        dataIndex: 'artists',
        key: 'singer',
        render: text => text[0].name
      },
      {
        title: '专辑',
        dataIndex: ['album', 'name'],
        key: 'album',
      },
      {
        title: '时长',
        dataIndex: 'duration',
        key: 'dt',
        render: text => timeFormat(Math.floor(text / 1000))
      },
    ];

    return (
        <div>
          <Card className="user-login-card" title="Search songs from Net-Ease-Music">
            <Input id="searchId" placeholder="Input search keyword" autoFocus
                   value={this.state.keyword}
                   onChange={this.handleChange}/>
            <Button onClick={this.doSearch} type="primary">Search</Button>
            <hr/>
            {
              this.state.hotSearchKeywords && this.state.hotSearchKeywords.map(item =>
                  <Tag color="volcano" key={item.first}
                       onClick={() => this.updateKeyword(item.first)}>{item.first}</Tag>
              )
            }
          </Card>
          <Spin tip="Loading..." size="large" spinning={this.state.loading}/>
          <Table columns={columns} dataSource={this.state.searchResults}
                 onRow={record => {
                   return {
                     onClick: () => {
                       this.props.updateSongId(record.id)
                     }, // 点击行
                   };
                 }}/>
        </div>
    );
  }

  handleChange = e => {
    this.setState({keyword: e.target.value})
  }
  requestHotSearchKeyWords = () => {
    hotSearchKeywords().then(res => {
      this.setState({
        hotSearchKeywords: res.data.result.hots
      })
    })
  };
  updateKeyword = keyword => {
    this.setState({keyword})
  };
  doSearch = () => {
    console.log("click")
    let keyword = document.getElementById("searchId").value;
    this.updateKeyword(keyword)
  };
  searchSongs = async keyword => {
    if (keyword.trim() !== "") {
      let {data: {result: {songs}}} = await searchMusic(keyword)
      if (songs.length === 0) {
        message.error("-_- There has nothing!");
        return;
      }
      for (const item of songs) {
        let res = await musicDetail(item.id)
        item.artists[0].picUrl = res.data.songs[0].al.picUrl;
      }
      this.setState({
        searchResults: songs,
        loading: false
      }, () => {
        message.success("^_^ Request song search success~");
      })
    }
  };
  searchByKeyword = () => {
    this.setState({
      loading: true
    }, () => this.searchSongs(this.state.keyword))
  }

  componentDidMount() {
    this.requestHotSearchKeyWords();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.keyword !== prevState.keyword && this.state.keyword !== "") {
      this.searchDebounced();
    }
  }
}

export default withRouter(Search);
