/*
 * https://liuhongwei3.github.io Inc.
 * Name: HotDetail.jsx
 * Date: 2020/5/24 下午12:32
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { message, Tag, Table, Tooltip } from "antd";

import { hotDetails } from "../network/ReqUrl";
import { countFormat, dateFormat } from "../util";

function HotDetail(props) {
  let history = useHistory();
  const [colors] = useState([
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ]);
  const [hotDetailLists, setHotDetailLists] = useState([]);

  const topColumns = [
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            return (
              <Tag
                color={colors[Math.floor(Math.random() * colors.length + 1)]}
                key={tag}
              >
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "封面",
      dataIndex: "coverImgUrl",
      key: "cover",
      render: (text, record) => (
        <img width="50px" height="50px" src={text} alt={record.name} />
      ),
    },
    {
      title: "歌单名",
      ellipsis: true,
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text} placement="topRight">
          <a>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: "创建者",
      // ellipsis: true,
      dataIndex: ["creator", "nickname"],
      key: "cname",
    },
    {
      title: "歌曲数",
      dataIndex: "trackCount",
      key: "trackCount",
      render: (text) => countFormat(text),
    },
    {
      title: "播放次数",
      dataIndex: "playCount",
      key: "playCount",
      render: (text) => countFormat(text),
    },
    {
      title: "最近更新日期",
      dataIndex: "updateTime",
      key: "ut",
      render: (text) => dateFormat(text),
    },
    {
      title: "创建日期",
      dataIndex: "createTime",
      key: "ct",
      render: (text) => dateFormat(text),
    },
  ];

  let requestHotDetail = async () => {
    let res = await hotDetails(48);
    let {
      data: { playlists },
    } = res;
    setHotDetailLists(playlists);
    message.success("^_^ Get Hot-Detail data success~");
  };
  let jump = () => {
    setTimeout(() => {
      history.push("/detail");
    }, 200);
  };

  useEffect(() => {
    requestHotDetail();
  }, []);

  return (
    <div>
      <Tag color={"cyan"}>热门歌单</Tag>
      <Table
        columns={topColumns}
        dataSource={hotDetailLists}
        onRow={(record) => {
          return {
            onClick: () => {
              props.updateDetailId(record.id);
              jump();
            }, // 点击行
            onContextMenu: (event) => {},
            onMouseEnter: (event) => {}, // 鼠标移入行
            onMouseLeave: (event) => {},
          };
        }}
      />
    </div>
  );
}

export default withRouter(HotDetail);
