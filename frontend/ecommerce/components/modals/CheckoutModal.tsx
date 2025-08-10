import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface CheckoutModalProps {
  show: boolean;
  onHide: () => void;
  onPlaceOrder: (deliveryLocation: string, landmark: string, paymentOption: string) => void;
}

export default function CheckoutModal({ show, onHide, onPlaceOrder }: CheckoutModalProps) {
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [paymentOption, setPaymentOption] = useState("cash");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder(deliveryLocation, landmark, paymentOption);
    setDeliveryLocation("");
    setLandmark("");
    setPaymentOption("cash");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="deliveryLocation">
            <Form.Label>Delivery Location</Form.Label>
            <Form.Control
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="landmark">
            <Form.Label>Landmark</Form.Label>
            <Form.Control
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="paymentOption">
            <Form.Label>Payment Option</Form.Label>
            <Form.Select
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile">Mobile Money</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Place Order
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
