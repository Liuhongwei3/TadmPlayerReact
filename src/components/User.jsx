/*
 * https://liuhongwei3.github.io Inc.
 * Name: User.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Tag, Input, Card, Button, Popconfirm, message, notification, Table, Tooltip} from 'antd';

import {userDetail, userFollows, userMusic} from "../network/ReqUrl";
import {countFormat, dateFormat} from "../util";

import {user_id} from "../initData.json";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tips: true,
      userId: user_id,
      username: '',
      avatarUrl: '',
      backgroundUrl: '',
      userDetailLists: [],
      followLists: [],
    };
    this.requestUser.bind(this);
    this.updateUserId.bind(this);
    this.doLogOut.bind(this);
    this.jump.bind(this);
  }

  render() {
    const createColumns = [
      {
        title: '封面',
        dataIndex: 'coverImgUrl',
        key: 'cover',
        render: (text, record) => <img width="50px" height="50px" src={text} alt={record.name}/>
      },
      {
        title: '歌单名',
        ellipsis: true,
        dataIndex: 'name',
        key: 'name',
        render: text => <Tooltip title={text} placement="right"><a>{text}</a></Tooltip>,
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
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'ct',
        render: text => dateFormat(text)
      },
    ];
    const followColumns = [
      {
        title: '封面',
        dataIndex: 'avatarUrl',
        key: 'avatarUrl',
        render: (text, record) => <img width="50px" height="50px" src={text} alt={record.name}/>
      },
      {
        title: '名字',
        dataIndex: 'nickname',
        key: 'nickname',
        render: text => <a>{text}</a>,
      },
      {
        title: '歌单',
        dataIndex: 'playlistCount',
        key: 'playlistCount',
        render: text => countFormat(text)
      },
      {
        title: '粉丝',
        dataIndex: 'followeds',
        key: 'followeds',
        render: text => countFormat(text)
      },
      {
        title: '个人介绍',
        ellipsis: true,
        dataIndex: 'signature',
        key: 'signature',
        render: text => text
      },
    ]

    return (
        <div>
          {
            this.state.tips && <Card className="user-login-card" title="User Information Tips">
              <div>Input your NetEase-music id and continue~</div>
              <div>https://music.163.com/#/user/home?id=
                <span className="myId" title="My-NetEaseMusic-id">537069044</span>
              </div>
              <div>Unknown?---> <a href="https://music.163.com">网易云</a> & copy id.</div>
              <Input id="userId" style={{width: '30vw'}} autoFocus placeholder="Input your NetEase ID~"/>
              <Button onClick={() => this.updateUserId()} type="primary">Go</Button>
            </Card>
          }
          {
            this.state.username && <div>
              <img alt={this.state.username} src={this.state.avatarUrl} className="avatar"/>
              <Tooltip title="点击切换 ID" placement="rightBottom">
                <Tag color="cyan" className="user-name">
                  <Popconfirm
                      title="Are you sure change this userId?"
                      onConfirm={() => this.confirm()}
                      onCancel={() => this.cancel()}
                      okText="Yes"
                      cancelText="Cancel"
                  >
                    {this.state.username}
                  </Popconfirm>
                </Tag>
              </Tooltip>
              <div>
                <div>创建的歌单</div>
                <Table columns={createColumns} dataSource={this.state.userDetailLists}
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
              <div>
                <div>关注</div>
                <Table columns={followColumns} dataSource={this.state.followLists}
                       onRow={record => {
                         return {
                           onClick: () => {
                            //  this.$store.commit('updateSingerName', record.name);
                            //  this.$router.push('/singer');
                           }, // 点击行
                         };
                       }}/>
              </div>
            </div>
          }
        </div>
    );
  }

  requestUser = (uid) => {
    uid && userDetail(uid).then(res => {
      let data = res.data.profile;
      data && this.setState({
        username: data.nickname,
        avatarUrl: data.avatarUrl,
        backgroundUrl: data.backgroundUrl,
        tips: false
      });
      userMusic(uid).then(res => {
        let list = res.data.playlist;
        list && this.setState({
          userDetailLists: list
        })
      })
    }).catch(() => {
      message.error("This userId maybe invalid, you should check and try again!");
    });
    userFollows(uid).then(res => {
      let data = res.data.follow;
      data && this.setState({
        followLists: data
      })
    })
  };
  updateUserId = () => {
    const dom = document.getElementById("userId");
    let id = dom.value;
    id && this.setState({
      userId: id
    }, () => {
      message.success("^_^ Get your Net-Ease-Id success~")
    });
    window.localStorage.setItem("userId", id);
    notification["success"]({
      message: 'Tadm-Player-React 通知',
      description: '获取网易云 ID 成功 ~'
    })
  };
  jump = () => {
    setTimeout(() => {
      this.props.history.push('/detail');
    }, 200);
  };
  confirm = () => {
    this.doLogOut();
    message.success('LogOut Success~');
  };

  cancel = () => {
    message.warn('Operation canceled~');
  };
  doLogOut = () => {
    this.setState({
      userId: 0,
      username: '',
      tips: true
    });
    window.localStorage.clear();
  };

  componentDidMount() {
    let lastId = window.localStorage.getItem("userId");
    lastId && this.setState({
      userId: lastId
    }, () => {
      this.requestUser(this.state.userId);
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.userId !== prevState.userId) {
      this.requestUser(this.state.userId);
    }
  }

}

export default withRouter(User);
