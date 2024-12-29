import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';

export const useHandTracking = () => {
  const detectHand = async (videoRef, setModelPath) => {
    const net = await handpose.load();
    setInterval(async () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === 4
      ) {
        const predictions = await net.estimateHands(videoRef.current);
        if (predictions.length > 0) {
          const hand = predictions[0];
          if (hand.boundingBox.topLeft[0] < 200) {
            setModelPath("/models/hat.glb");
          } else {
            setModelPath("/models/glasses.glb");
          }
        }
      }
    }, 1000);
  };

  return { detectHand };
};
