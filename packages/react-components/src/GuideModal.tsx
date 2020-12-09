// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VoidFn } from "@canvas-ui/react-util/types";
import { BareProps } from "./types";

import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useToggle } from "@canvas-ui/react-hooks";
import { classes } from "@canvas-ui/react-util";

import Button from "./Button";
import Modal from "./Modal";
import { useTranslation } from "./translate";

interface Page {
  content: React.ReactNode;
  header: React.ReactNode;
}

interface Props extends BareProps {
  onClose: VoidFn;
}

function GuideModal({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen] = useToggle(true);
  const [index, setIndex] = useState(0);

  const incrementIndex = useCallback((): void => setIndex(index + 1), [index]);

  const decrementIndex = useCallback((): void => setIndex(index - 1), [index]);

  const _setIndex = useCallback((index: number): (() => void) => {
    return function() {
      setIndex(index);
    };
  }, []);

  const _onClose = useCallback((): void => {
    toggleIsOpen();
    onClose && onClose();
  }, [onClose, toggleIsOpen]);

  const pages = useMemo(
    (): Page[] => [
      {
        content: (
          <>
            <p>...</p>
          </>
        ),
        header: t<string>("About Acala smart contracts")
      }
    ],
    [t]
  );

  const [header, content] = useMemo((): [React.ReactNode, React.ReactNode] => {
    const { content, header } = pages[index];

    return [
      header,
      <>
        {content}
        <div className="page-control">
          {pages.map(
            (_, pageIndex): React.ReactNode => {
              return (
                <div
                  className={classes("page", index === pageIndex && "isActive")}
                  key={`guide-page-${pageIndex}`}
                  onClick={_setIndex(pageIndex)}
                />
              );
            }
          )}
        </div>
      </>
    ];
  }, [index, pages, _setIndex]);

  const isFirstPage = index === 0;
  const isLastPage = index === pages.length - 1;

  return (
    <Modal className={className} isOpen={isOpen} onClose={_onClose}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>{content}</Modal.Content>
      <Modal.Actions
        cancelLabel={t<string>(isFirstPage ? "Skip Intro" : "Go Back")}
        onCancel={isFirstPage ? _onClose : decrementIndex}
      >
        <Button
          isPrimary
          label={t<string>(isLastPage ? "Let's Go" : "Next")}
          onClick={isLastPage ? _onClose : incrementIndex}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default styled(React.memo(GuideModal))`
  height: 320px;

  &.visible.transition {
    display: flex !important;
    flex-direction: column;
  }

  .content {
    flex-grow: 1;
  }

  .page-control {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;

    .page {
      background: var(--grey40);
      cursor: pointer;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 2rem;

      &:not(.isActive):hover {
        background: var(--grey50);
      }

      &:not(:last-child) {
        margin-right: 0.5rem;
      }

      &.isActive {
        background: var(--grey60);
      }
    }
  }
`;
