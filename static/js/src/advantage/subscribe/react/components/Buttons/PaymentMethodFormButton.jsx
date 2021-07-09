import React from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { ActionButton } from "@canonical/react-components";

const PaymentMethodFormButton = ({ isCardValid, userInfo }) => {
  const { isSubmitting, dirty, isValid, submitForm } = useFormikContext();

  return (
    <ActionButton
      disabled={(!userInfo && !dirty) || !isValid || !isCardValid}
      appearance="positive"
      className="col-small-2 col-medium-2 col-3 u-no-margin"
      style={{ textAlign: "center" }}
      onClick={submitForm}
      loading={isSubmitting}
    >
      Continue
    </ActionButton>
  );
};

PaymentMethodFormButton.propTypes = {
  isCardValid: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default PaymentMethodFormButton;
