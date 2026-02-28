export const useSound = () => {
  const playSuccess = () => {
    const audio = new Audio('/sounds/success.mp3');
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  const playError = () => {
    const audio = new Audio('/sounds/error.mp3');
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  return { playSuccess, playError };
};