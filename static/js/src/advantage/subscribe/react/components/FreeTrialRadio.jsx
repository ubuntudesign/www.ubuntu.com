import { RadioInput } from "@canonical/react-components";
import PropTypes from "prop-types";
import { Field } from "formik";
import React from "react";
import FormRow from "./FormRow";

const FreeTrialRadio = ({ step }) => {
  const isCheckedByDefault = !(window.isGuest && step === 2);

  return (
    <FormRow label="Free Trial:">
      <div className="u-sv3 p-form p-form--inline" role="group">
        <Field
          as={RadioInput}
          name="freeTrial"
          value="useFreeTrial"
          label="Use free trial month"
          defaultChecked={isCheckedByDefault}
        />
        <Field
          as={RadioInput}
          name="freeTrial"
          value="payNow"
          label="Pay now"
          defaultChecked={!isCheckedByDefault}
        />
      </div>
    </FormRow>
  );
};

FreeTrialRadio.propTypes = {
  step: PropTypes.number.isRequired,
};

export default FreeTrialRadio;
