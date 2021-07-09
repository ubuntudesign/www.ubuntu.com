import React from "react";
import { Row, Col } from "@canonical/react-components";

const formRow = ({ label, disabled, children, error }) => {
  return (
    <Row
      className={`p-form__group  u-no-padding u-vertically-center ${
        disabled ? "u-disable" : ""
      }`}
    >
      <Col size="4" style={{ alignSelf: "start" }}>
        <label>{label}</label>
      </Col>

      <Col size="8" style={{ marginBottom: "1.2rem" }}>
        {children}
      </Col>

      {error && (
        <Col size="8" emptyLarge="5" style={{ marginTop: "-0.5rem" }}>
          <p id="card-errors" className="p-form-validation__message">
            {error}
          </p>
        </Col>
      )}
    </Row>
  );
};

export default formRow;
