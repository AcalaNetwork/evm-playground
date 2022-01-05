import React from 'react';
import { Modal, ModalProps, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from './Modal';

export const SelectModal = ({ children, title, onClose, ...props }: ModalProps & { title: React.ReactNode }) => {
  return (
    <Modal {...props} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
