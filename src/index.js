import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./styles.css";
import { Button, Table } from "antd";
import Modal from "../Componts/Modal";
import useAxios from "../Hooks/useAxios";

const App = () => {
  const { request: listupdate } = useAxios();
  const { request: removedata } = useAxios();

  const [user, setUser] = useState([]);

  const [visible, setVisible] = useState(false);

  const Remove = formID => {
    removedata({
      method: "put",
      url: `/employee/delete/${formID}`,
      data: {
        deleted: true
      }
    }).then(res => {
      console.log("asdf", res);
    });

    //  setUser(user.filter(info => info.id !== item.id));
  };

  const columns = [
    {
      title: "#",
      dataIndex: "formID",
      key: "formID"
    },
    {
      title: "직원명",
      dataIndex: "employeeName",
      key: "empaloyeeName"
    },
    {
      title: "퇴사일",
      dataIndex: "leaveDate",
      key: "leaveDate"
    },
    {
      title: "퇴사사유",
      dataIndex: "leaveReason",
      key: "leaveReason"
    },
    {
      title: "",
      dataIndex: "formID",
      key: "id",
      render: (formID, record) => (
        <Button
          style={{ width: "60%" }}
          type="danger"
          onClick={() => {
            Remove(formID);
          }}
        >
          삭제
        </Button>
      )
    }
  ];

  useEffect(() => {
    listupdate({
      method: "get",
      url: `/employee/read`
    }).then(res => {
      setUser(res);
    });
  }, [user]);

  const showModal = e => {
    setVisible(true);
  };

  const handleOk = e => {
    setVisible(false);
  };

  const handleCancel = e => {
    setVisible(false);
  };

  return (
    <div className="App">
      <Table
        style={{ width: "100%", marginLeft: "1.8rem", fontWeight: "bold" }}
        columns={columns}
        dataSource={user}
      />
      <Button type="primary" onClick={showModal}>
        퇴사 처리
      </Button>
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        callback={response => {
          setUser([...user, { ...response }]);
        }}
      />
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
