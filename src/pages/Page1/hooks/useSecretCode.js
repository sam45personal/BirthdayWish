import { useState } from "react";

const SECRET_CODE = "3911"; // The secret code to unlock the next page.

export default function useSecretCode(onSuccess) {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addDigit = (digit) => {
    if (code.length >= 4) return;

    setIsError(false);
    setCode((previous) => previous + digit);
  };

  const removeDigit = () => {
    setIsError(false);
    setCode((previous) => previous.slice(0, -1));
  };

  const submitCode = () => {
    if (code.length !== 4) return;

    if (code === SECRET_CODE) {
      setIsSuccess(true);

      setTimeout(() => {
        onSuccess();
      }, 900);

      return;
    }

    setIsError(true);

    setTimeout(() => {
      setIsError(false);
    }, 650);
  };

  const resetCode = () => {
    setCode("");
    setIsError(false);
    setIsSuccess(false);
  };

  return {
    code,
    isError,
    isSuccess,
    addDigit,
    removeDigit,
    submitCode,
    resetCode,
  };
}