import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styles from './ConfirmDelete.module.scss';

interface Props {
  itemName: string;
  deleteFunction(this: void): Promise<void>;
}

const ConfirmDelete = (props: Props): JSX.Element => {
  const { itemName, deleteFunction } = props;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const handleDelete = async (): Promise<void> => {
    setModal(false);
    await deleteFunction();
  };

  return (
    <div className={styles.confirmDelete}>
      <Button color="danger" onClick={toggle}>
        Delete
      </Button>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Delete "{itemName}"?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete "{itemName}"? This action cannot be
          undone.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConfirmDelete;
