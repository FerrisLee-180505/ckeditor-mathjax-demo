import React, { Component } from 'react'
import PropTypes from 'prop-types'

// === Components === //
import { Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap'

// === Utils === //
import noop from 'lodash/noop'


class AddLinkModal extends Component {
  constructor(props) {
    super(props)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  onFormSubmit(event) {
    event.preventDefault()
    const { target } = event
    const { link, text } = target
    const { onSubmit } = this.props
    onSubmit(text.value, link.value)
  }

  render() {
    const { isOpen, toggle, defaultText, defaultUrl } = this.props

    return (
      <Modal zIndex={1100} isOpen={isOpen}>
        <ModalHeader toggle={toggle}>
          Add link
        </ModalHeader>
        <Form onSubmit={this.onFormSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="text">
                text
              </Label>
              <Input required name="text" type="text" defaultValue={defaultText} />
            </FormGroup>
            <FormGroup>
              <Label for="link">
                link
              </Label>
              <Input required name="link" type="text" defaultValue={defaultUrl} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              qaSelector="qa-test-add-link-cancel-btn"
              onClick={toggle}
            >
              cancel
            </Button>
            <Button
              type="submit"
              weight="loud"
              qaSelector="qa-test-add-link-save-btn"
            >
              save
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}

AddLinkModal.propTypes = {
  defaultText: PropTypes.string.isRequired,
  defaultUrl: PropTypes.string,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func
}

AddLinkModal.defaultProps = {
  defaultUrl: '',
  toggle: noop,
  isOpen: false,
  onSubmit: noop
}

export default AddLinkModal
