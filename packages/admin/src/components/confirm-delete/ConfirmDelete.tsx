import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styles from './ConfirmDelete.module.scss';

interface ConfirmDeleteProps {
  itemName: string;
  deleteFunction: () => void;
  isLoading?: boolean;
}

const ConfirmDelete = ({
  itemName,
  deleteFunction,
  isLoading = false,
}: ConfirmDeleteProps): JSX.Element => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const handleDelete = (): void => {
    setModal(false);
    deleteFunction();
  };

  return (
    <div className={styles.confirmDelete}>
      <Button color="danger" onClick={toggle} disabled={isLoading}>
        {isLoading ? 'Deleting...' : 'Delete'}
      </Button>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>
          Delete &quot;{itemName}&quot;?
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete &quot;{itemName}&quot;? This action
          cannot be undone.
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
