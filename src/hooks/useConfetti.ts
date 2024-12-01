import confetti from "canvas-confetti";
import { useCallback } from "react";

export const useConfetti = () => {
  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
    });
  }, []);
  return fireConfetti;
};
