import React from "react";
import { Row, Col } from "@canonical/react-components";
import { add, format } from "date-fns";
import { formatter } from "../../renderers/form-renderer";
import usePreview from "../APICalls/usePreview";
import useProduct from "../APICalls/useProduct";

export const DATE_FORMAT = "dd MMMM yyyy";

function Summary() {
  const { product, quantity, isMonthly } = useProduct();
  const { data: preview } = usePreview();

  let totalSection = (
    <Row className="u-no-padding u-sv1">
      <Col size="4">
        <div className="u-text-light">Subtotal:</div>
      </Col>
      <Col size="8">
        <div>{formatter.format((product?.price?.value * quantity) / 100)}</div>
      </Col>
    </Row>
  );

  if (preview?.taxAmount) {
    totalSection = (
      <>
        {preview?.subscriptionEndOfCycle && (
          <Row className="u-no-padding u-sv1">
            <Col size="4">
              <div className="u-text-light">For this period:</div>
            </Col>
            <Col size="8">
              <div>
                {formatter.format((preview?.total - preview?.taxAmount) / 100)}
              </div>
            </Col>
          </Row>
        )}
        <Row className="u-no-padding u-sv1">
          <Col size="4">
            <div className="u-text-light">Tax:</div>
          </Col>
          <Col size="8">
            <div>{formatter.format(preview?.taxAmount / 100)}</div>
          </Col>
        </Row>
        <Row className="u-no-padding u-sv1">
          <Col size="4">
            <div className="u-text-light">Total</div>
          </Col>
          <Col size="8">
            <div>
              <b>{formatter.format(preview?.total / 100)}</b>
            </div>
          </Col>
        </Row>
      </>
    );
  } else if (preview) {
    totalSection = (
      <Row className="u-no-padding u-sv1">
        <Col size="4">
          <div className="u-text-light">
            Total
            {preview?.subscriptionEndOfCycle && " for this period"}
          </div>
        </Col>
        <Col size="8">
          <div>
            <b>{formatter.format(preview?.total / 100)}</b>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <section
      id="summary-section"
      className="p-strip is-shallow u-no-padding--top"
    >
      <Row className="u-no-padding u-sv1">
        <Col size="4">
          <div className="u-text-light">Plan type:</div>
        </Col>
        <Col size="8">
          <div dangerouslySetInnerHTML={{ __html: product?.name }} />
        </Col>
      </Row>
      <Row className="u-no-padding u-sv1">
        <Col size="4">
          <div className="u-text-light">Machines:</div>
        </Col>
        <Col size="8">
          <div>
            {quantity} x {formatter.format(product?.price?.value / 100)}
          </div>
        </Col>
      </Row>
      <Row className="u-no-padding u-sv1">
        <Col size="4">
          <div className="u-text-light">Starts:</div>
        </Col>
        <Col size="8">
          <div>{format(new Date(), DATE_FORMAT)}</div>
        </Col>
      </Row>
      <Row className="u-no-padding u-sv1">
        <Col size="4">
          <div className="u-text-light">Ends:</div>
        </Col>

        {preview?.subscriptionEndOfCycle ? (
          <Col size="8">
            {format(new Date(preview?.subscriptionEndOfCycle), DATE_FORMAT)}
            <br />
            <small>The same date as your existing subscription.</small>
          </Col>
        ) : (
          <Col size="8">
            <div>
              {format(
                add(new Date(), {
                  months: isMonthly ? 1 : 12,
                }),
                DATE_FORMAT
              )}
            </div>
          </Col>
        )}
      </Row>
      {totalSection}
    </section>
  );
}

export default Summary;
