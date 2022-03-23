import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalOverlay as ChakraModalOverlay,
  ModalContent as ChakraModalContent,
  ModalHeader as ChakraModalHeader,
  ModalFooter as ChakraModalFooter,
  ModalBody as ChakraModalBody,
  ModalCloseButton as ChakraModalCloseButton
} from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

export type ModalProps = ChakraModalProps;

export const Modal = styled(ChakraModal)``;

Modal.defaultProps = {
  autoFocus: false
};

export const ModalOverlay = styled(ChakraModalOverlay)``;

export const ModalContent = styled(ChakraModalContent)`
  color: ${({ theme }) => theme.colors.font.body};
  background: white;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  outline: transparent solid 2px;
  outline-offset: 2px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderColor1};
  background: ${({ theme }) => theme.colors.card};
  color: inherit;
  margin-top: 6.5rem;
  margin-bottom: 6.5rem;
  z-index: 1;
  max-width: 560px;
`;

export const ModalHeader = styled(ChakraModalHeader)`
  padding: 20px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.font.title};
`;

export const ModalFooter = styled(ChakraModalFooter)``;

export const ModalBody = styled(ChakraModalBody)`
  padding: 0 0;
`;

export const ModalCloseButton = styled(ChakraModalCloseButton)`
  background: transparent;
  color: ${({ theme }) => theme.colors.font.body};

  outline: transparent solid 2px;
  outline-offset: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32;
  height: 32;
  font-size: 12px;
  position: absolute;
  top: 24px;
  right: 20px;
  cursor: pointer;

  &:focus {
    box-shadow: none;
  }
`;
