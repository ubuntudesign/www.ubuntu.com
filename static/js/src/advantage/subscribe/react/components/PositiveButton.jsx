import React from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import FreeTrialButton from "./Buttons/FreeTrialButton";
import PaymentMethodFormButton from "./Buttons/PaymentMethodFormButton";
import PayNowButton from "./Buttons/PayNowButton";

const PositiveButton = ({ step, isCardValid, setError, userInfo }) => {
  const { values } = useFormikContext();

  if (values.freeTrial === "useFreeTrial") {
    return <FreeTrialButton setError={setError} userInfo={userInfo} />;
  }
  if (step === 2) {
    return <PayNowButton setError={setError} />;
  }

  return (
    <PaymentMethodFormButton isCardValid={isCardValid} userInfo={userInfo} />
  );
};

PositiveButton.propTypes = {
  step: PropTypes.number.isRequired,
  isCardValid: PropTypes.bool.isRequired,
  setError: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default PositiveButton;
