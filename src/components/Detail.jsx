/*
 * https://liuhongwei3.github.io Inc.
 * Name: Detail.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Tag, message, Collapse, Tooltip, Table} from 'antd';

import {musicDetail, playListDetail} from "../network/ReqUrl";
import {dateFormat, timeFormat} from "../util";

const {Panel} = Collapse;

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailId: 0,
      detailName: '',
      detailAuthor: '',
      description: '',
      detailList: []
    }
  }

  render() {
    const columns = [
      {
        title: '封面',
        dataIndex: ['al', 'picUrl'],
        key: 'cover',
        render: (text, record) => <img width="50px" height="50px" src={text} alt={record.name}/>
      },
      {
        title: '歌曲名',
        dataIndex: 'name',
        key: 'name',
        render: text => <Tooltip placement="right" title={text}><a>{text}</a></Tooltip>,
      },
      {
        title: '歌手',
        dataIndex: 'ar',
        key: 'singer',
        render: text => text[0].name
      },
      {
        title: '专辑',
        dataIndex: ['al', 'name'],
        key: 'album',
      },
      {
        title: '时长',
        dataIndex: 'dt',
        key: 'dt',
        render: text => timeFormat(Math.floor(text / 1000))
      },
      {
        title: '发行日期',
        dateIndex: 'publishTime',
        key: 'pt',
        render: text => dateFormat(text.publishTime)
      }
    ];

    return (
        <div>
          <div>
            <Tag color="orange">{this.state.detailName}</Tag>
            <Tooltip title={"点击查看用户详情"} placement="top">
              <Tag color="green">{this.state.detailAuthor}</Tag>
            </Tooltip>
          </div>
          {
            this.state.description && <Collapse defaultActiveKey={['1']}>
              <Panel header="歌单简介" key="1">
                <p>{this.state.description}</p>
              </Panel>
            </Collapse>
          }

          <Table columns={columns} dataSource={this.state.detailList}
                 onRow={record => {
                   return {
                     onClick: () => {
                       this.props.updateSongId(record.id, this.state.detailList)
                     }, // 点击行
                     onDoubleClick: () => {
                       this.props.updateSongId(record.id, this.state.detailList)
                     },
                     onContextMenu: event => {
                     },
                     onMouseEnter: event => {
                     }, // 鼠标移入行
                     onMouseLeave: event => {
                     },
                   };
                 }}/>
        </div>
    );
  }

  requestDetail = id => {
    playListDetail(id).then(res => {
      let data = res.data.playlist;
      data && this.setState({
        detailName: data.name,
        // detailAuthorId : res.data.playlist.creator.userId,
        detailAuthor: data.creator.nickname,
        description: data.description,
      }, () => {
        message.success("^_^ Get Detail data success~")
      });
      let temp = data.trackIds;
      let songIds = '';
      temp.forEach(item => {
        songIds += item.id + ",";
      });
      let last = songIds.length - 1;
      songIds = songIds.substring(0, last);
      songIds && musicDetail(songIds).then(res => {
        let {data} = res;
        data && this.setState({
          detailList: data.songs
        })
      })
    })
  };

  componentDidMount() {
    this.requestDetail(this.props.id)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.id !== prevProps.id) {
      this.requestDetail(this.props.id);
    }
  }
}

export default withRouter(Detail);
