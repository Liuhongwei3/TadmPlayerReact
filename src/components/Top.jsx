/*
 * https://liuhongwei3.github.io Inc.
 * Name: Top.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {message, Tag, Table} from "antd";

import {topList} from "../network/ReqUrl";
import {countFormat, dateFormat} from "../util";

class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topLists: [],
    };
    this.requestTopLists.bind(this);
    this.jump.bind(this);
  }

  render() {
    const topColumns = [
      {
        title: '封面',
        dataIndex: 'coverImgUrl',
        key: 'cover',
        render: (text, record) => <img width="50px" height="50px" src={text} alt={record.name}/>
      },
      {
        title: '歌单名',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '歌曲数',
        dataIndex: 'trackCount',
        key: 'trackCount',
        render: text => countFormat(text)
      },
      {
        title: '播放次数',
        dataIndex: 'playCount',
        key: 'playCount',
        render: text => countFormat(text)
      },
      {
        title: '最近更新日期',
        dataIndex: 'updateTime',
        key: 'ut',
        render: text => dateFormat(text)
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'ct',
        render: text => dateFormat(text)
      },
    ];

    return (
        <div>
          <Tag color={"red"}>热门排行榜</Tag>
          <Table columns={topColumns} dataSource={this.state.topLists}
                 onRow={record => {
                   return {
                     onClick: () => {
                       this.jump();
                       this.props.updateDetailId(record.id)
                     }, // 点击行
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

  requestTopLists = () => {
    topList().then(res => {
      let data = res.data.list;
      this.setState({
        topLists: data
      }, () => {
        message.success("^_^ Get Top-List data success~")
      })
    })
  };
  jump = () => {
    setTimeout(() => {
      this.props.history.push('/detail');
    }, 200);
  };

  componentDidMount() {
    this.requestTopLists();
  }
}

export default withRouter(Top);
