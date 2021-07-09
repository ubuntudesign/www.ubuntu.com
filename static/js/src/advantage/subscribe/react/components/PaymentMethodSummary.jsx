import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "@canonical/react-components";
import useStripeCustomerInfo from "../APICalls/useStripeCustomerInfo";
import { useFormikContext } from "formik";

const cardImageMap = {
  visa: "https://assets.ubuntu.com/v1/2060e728-VBM_COF.png",
  mastercard: "https://assets.ubuntu.com/v1/f42c6739-mc_symbol.svg",
  amex: "https://assets.ubuntu.com/v1/5f4f3f7b-Amex_logo_color.svg",
  discover: "https://assets.ubuntu.com/v1/f5e8abde-discover_logo.jpg",
};

function PaymentMethodSummary({ setStep }) {
  const { values } = useFormikContext();
  const { data: userInfo } = useStripeCustomerInfo();

  return (
    <>
      <Row className="u-no-padding">
        <Col size="4">
          <p className="u-text-light">Receipt will be sent to:</p>
        </Col>

        <Col size="8">
          <p>{userInfo?.customerInfo?.email}</p>
        </Col>
      </Row>

      <Row className="u-no-padding">
        <Col size="6" className="u-vertically-center">
          <p className="u-text-light">Payment method:</p>
        </Col>

        <Col size="6" className="u-align--right">
          <Button
            className="p-button js-change-payment-method"
            onClick={() => {
              setStep(1);
            }}
          >
            Change...
          </Button>
        </Col>
      </Row>

      <div
        className={`p-card ${
          values.freeTrial === "useFreeTrial" ? "u-disable" : ""
        }`}
      >
        <Row className="u-no-padding">
          <Col size="2" medium="1" small="1">
            <img
              src={
                cardImageMap[
                  userInfo?.customerInfo?.defaultPaymentMethod?.brand
                ]
              }
            />
          </Col>
          <Col size="8" small="3">
            <span>{userInfo?.customerInfo?.name}</span>
            <br />
            <span>
              <span style={{ textTransform: "capitalize" }}>
                {userInfo?.customerInfo?.defaultPaymentMethod?.brand}
              </span>{" "}
              ending in {userInfo?.customerInfo?.defaultPaymentMethod?.last4}
            </span>
          </Col>
          <Col size="2" small="3" emptySmall="2">
            <span className="u-text-light">Expires:</span>
            <br />
            <span>
              {userInfo?.customerInfo?.defaultPaymentMethod?.expMonth
                ?.toString()
                ?.padStart(2, "0")}
              /
              {userInfo?.customerInfo?.defaultPaymentMethod?.expYear
                ?.toString()
                ?.slice(-2)}
            </span>
          </Col>
        </Row>
      </div>
    </>
  );
}

PaymentMethodSummary.propTypes = {
  setStep: PropTypes.func.isRequired,
};

export default PaymentMethodSummary;
