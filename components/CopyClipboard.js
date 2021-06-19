import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState, useEffect } from "react";
import styled from "styled-components";

const CopyClipboard = ({ copyText }) => {
  //copy to clipboard
  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <CopyCtn className="copied-text-icon">
      <CopyToClipboard text={copyText} onCopy={onCopyText}>
        <img
          src="/images/copy-clip.svg"
          alt="copy to clipboard"
          className="copy-clip-svg"
        />
      </CopyToClipboard>

      {isCopied && (
        <div className="copied-link">
          <p>Copied!</p>
        </div>
      )}
    </CopyCtn>
  );
};

const CopyCtn = styled.div`
  .copy-clip-svg {
    width: 0.8rem;

    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }

  .copied-link {
    padding: 0.1rem 1rem;
    height: 1.5rem;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5),
      inset 1px 1px 4px rgba(0, 0, 0, 0.7);
    border-radius: 5px;

    position: absolute;
    top: 0;
    top: 8rem;
    margin: 0;
    right: 2rem;

    p {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 600px) {
    .copied-link {
      top: 0;
      top: 4.5rem;
      right: 50%;
      transform: translateX(50%);
    }
  }
`;

export default CopyClipboard;
