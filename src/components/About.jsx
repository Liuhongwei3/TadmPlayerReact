/*
 * https://liuhongwei3.github.io Inc.
 * Name: About.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React,{useState} from 'react';
import { Tooltip } from 'antd';

function About() {
  const [year] = useState(new Date().getFullYear())

  return (
    <div id="about">
      <code>Hello React</code><br />
      <code>Welcome to use Tadm-Player by React~</code>
      <div>本站点是个人学习 React 所制作的小项目，后续会不断优化以及改进~</div>
      <div>在此再次感谢 Netease-Music-Api 贡献者、网易云音乐等，没有你们本站也不能像现在这样正常的运行~</div>
      <div>Notice: 本站仅作学习用途，不存储任何媒体资源，音乐版权均归网易云音乐等专有，谢谢合作！！！</div>
      <footer>
        <div>&copy;&nbsp;&nbsp;2020 - {year}&nbsp;&nbsp;
            <i className="fa fa-heart" aria-hidden="true" id="myheart" />&nbsp;&nbsp;
            <Tooltip placement="bottom" title="去他的博客看看">
            <a href="https://liuhongwei3.github.io"><code>Tadm</code></a>
          </Tooltip>&nbsp;&nbsp;
          <Tooltip placement="bottom" title="去他的 Github 看看">
            <a href="https://github.com/Liuhongwei3/TadmPlayerReact">
              <i className="fa fa-github" aria-hidden="true" />
            </a>
          </Tooltip>
        </div>
      </footer>
    </div>
  );
}

export default About;
