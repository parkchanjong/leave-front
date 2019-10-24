import React, { useState, useEffect, useContext } from "react";
import "antd/dist/antd.css";
import moment from "moment";
import {
  Modal,
  Row,
  Col,
  DatePicker,
  Select,
  Input,
  message,
  Upload,
  Button
} from "antd";
import useAxios from "../Hooks/useAxios";

const { Option } = Select;

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text"
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

const modal = ({ visible, onCancel, callback }) => {
  const [leaveDate, setLeaveDate] = useState(null);
  const [leaveReason, setLeaveReason] = useState(null);
  const [joinDate, setJoinDate] = useState(null);
  const [leaveuser, setLeaveUser] = useState(null);

  const { request, loading, response } = useAxios();

  useEffect(() => {
    if (!response) return;

    callback(response);
  }, [response]);

  return (
    <>
      <Modal
        confirmLoading={loading}
        title="퇴사 처리"
        visible={visible}
        onOk={() => {
          if (!leaveDate) {
            message.error("마지막 근무일을 입력해주세요.");
            return;
          }

          if (!leaveReason) {
            message.error("퇴직 사유를 입력해주세요.");
            return;
          }

          request({
            method: "post",
            url: `/employee/write`,
            data: {
              employeeName: leaveuser,
              leaveDate: leaveDate.format("YYYY-MM-DD"),
              joinDate: joinDate.format("YYYY-MM-DD"),
              leaveReason,
              file: "/c",
              deleted: false
            }
          });

          setLeaveUser(null);
          setLeaveDate(null);
          setLeaveReason(null);
          setJoinDate(null);

          onCancel();
        }}
        onCancel={onCancel}
        cancelText="취소"
        okText="퇴사처리"
        className="LeaveModal"
      >
        <Row>
          <Col span={12}>
            <label className="label">직원이름</label>
            <Input
              style={{
                width: "90%",
                marginBottom: "1.5rem",
                marginRight: "1.5rem"
              }}
              value={leaveuser}
              onChange={({ target }) => setLeaveUser(target.value)}
            />
          </Col>
          <Col span={12}>
            <label className="label">입사일</label>
            <DatePicker
              style={{ width: "100%" }}
              value={joinDate}
              onChange={date => setJoinDate(date)}
              placeholder="날짜 선택"
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <label className="label">마지막 근무일</label>
            <DatePicker
              placeholder={"날짜 선택"}
              style={{ width: "100%", marginBottom: "1.5rem" }}
              value={leaveDate}
              onChange={date => setLeaveDate(date)}
            />
          </Col>
        </Row>
        <Row>
          <Col style={{ width: "100%", marginBottom: "1.8rem" }}>
            <label className="label">근무 기간</label>
            <br />

            {!leaveDate
              ? "마지막 근무일을 입력해 주세요."
              : [
                  leaveDate && leaveDate.diff(moment(joinDate), "days") + 1,
                  "일"
                ].join("")}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <label className="label">퇴직 사유</label>
            <Select
              style={{ width: "100%", marginBottom: "1rem" }}
              value={leaveReason}
              onChange={value => setLeaveReason(value)}
            >
              <Option value="근로자 자진 퇴사">근로자 자진 퇴사</Option>
              <Option value="권고사직">권고사직</Option>
              <Option value="해고">해고</Option>
              <Option value="계약기간 만료">계약기간 만료</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <label className="label">사직서 업로드</label>
          <Row>
            <Upload {...props}>
              <Button style={{ width: "100%", backgroundColor: "red" }} />
            </Upload>
          </Row>
        </Row>
      </Modal>
    </>
  );
};

export default modal;
