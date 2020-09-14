/*
 * https://liuhongwei3.github.io Inc.
 * Name: Home.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React, {Component} from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Menu} from 'antd';

import Play from "./Play";
import Detail from "./Detail";
import CoverLyric from "./CoverLyric";
import User from "./User";
import HotDetail from "./HotDetail";
import About from "./About";
import Top from "./Top";
import Search from "./Search";

import {web_name, song_id, detail_id} from '../initData.json';
import {topContext} from '../contexts';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: web_name,
      songId: song_id,
      detailId: detail_id,
      topLists: [],
      detailList: []
    }
  }

  render() {
    return (
        <div>
          <h4 id="top">Hello, Welcome to <a href='/tadm-player-react'>{this.state.name}</a> web~</h4>
          <Play id={this.state.songId} detailList={this.state.detailList}
                updateSongId={(id, detailList) => this.updateSongId(id, detailList)}/>

          <Router basename="/">
            <Menu className="nav-header" mode="horizontal">
              <Menu.Item key="top">
                <Link to="/top">Top</Link>
              </Menu.Item>
              <Menu.Item key="hotDetail">
                <Link to="/hotDetail">HotDetail</Link>
              </Menu.Item>
              <Menu.Item key="user">
                <Link to="/user">User</Link>
              </Menu.Item>
              <Menu.Item key="detail">
                <Link to="/detail">Detail</Link>
              </Menu.Item>
              <Menu.Item key="search">
                <Link to="/search">Search</Link>
              </Menu.Item>
              <Menu.Item key="about">
                <Link to="/about">About</Link>
              </Menu.Item>
            </Menu>
            <CoverLyric id={this.state.songId}/>
            <div className="container">
              <Switch>
                <Route exact path="/">
                  <About/>
                </Route>
                <Route exact path="/top">
                {/* <topContext.Provider value={this.updateDetailId}>
                  <Top />
                </topContext.Provider> */}
                  <Top updateDetailId={id => this.updateDetailId(id)}/>
                </Route>
                <Route exact path="/hotDetail">
                  <HotDetail updateDetailId={id => this.updateDetailId(id)}/>
                </Route>
                <Route exact path="/user">
                  <User updateDetailId={id => this.updateDetailId(id)}/>
                </Route>
                <Route exact path="/detail">
                  <Detail id={this.state.detailId}
                          updateSongId={(id, detailList) => this.updateSongId(id, detailList)}/>
                </Route>
                <Route exact path="/search">
                  <Search updateSongId={(id) => this.updateSongId(id)}/>
                </Route>
                <Route exact path="/about">
                  <About/>
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
    );
  }

  updateSongId(id, detailList = []) {
    this.setState({
      songId: id,
      detailList
    })
  }

  updateDetailId = id => {
    this.setState({
      detailId: id
    })
  };
}

export default Home;
