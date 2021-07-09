import React from "react";
import PropTypes from "prop-types";
import { Field, useFormikContext } from "formik";
import { Row, Col, CheckboxInput } from "@canonical/react-components";

const TermsCheckBox = ({ step }) => {
  const { values } = useFormikContext();

  if (step === 1 && values.freeTrial !== "useFreeTrial") {
    return null;
  }

  const purchaseLabel = (
    <>
      I agree to the{" "}
      <a
        href="/legal/ubuntu-advantage-service-terms"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ubuntu Advantage service terms
      </a>
    </>
  );

  const freeTrialLabel = (
    <>
      I agree that my subscription is subject to the{" "}
      <a
        href="/legal/ubuntu-advantage-service-terms"
        target="_blank"
        rel="noopener noreferrer"
      >
        UA Essential Terms of Service
      </a>
      ,{" "}
      <a
        href="/legal/data-privacy/online-purchase"
        target="_blank"
        rel="noopener noreferrer"
      >
        privacy notice{" "}
      </a>
      and{" "}
      <a href="/legal/data-privacy" target="_blank" rel="noopener noreferrer">
        privacy policy
      </a>
      .
    </>
  );

  return (
    <Row className="u-no-padding">
      <Col size="12">
        <Field
          as={CheckboxInput}
          name="terms"
          label={
            values.freeTrial === "useFreeTrial" ? freeTrialLabel : purchaseLabel
          }
        />
      </Col>
    </Row>
  );
};

TermsCheckBox.propTypes = {
  step: PropTypes.number,
};

export default TermsCheckBox;
