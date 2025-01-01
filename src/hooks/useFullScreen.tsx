import { useEffect } from 'react';

export const useFullScreen = () => {
  useEffect(() => {
    const enterFullScreen = () => {
      const elem = document.documentElement; // Full-screen the whole document
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    };

    const handleInteraction = () => {
      enterFullScreen();
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);

    // Add Zoom Controls
    let scale = 1; // Default zoom level
    let offsetX = 0; // Horizontal pan
    let offsetY = 0; // Vertical pan

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const handleZoom = (event: WheelEvent) => {
      if (!document.fullscreenElement) return;

      if (event.ctrlKey) {
        event.preventDefault();
        if (event.deltaY < 0) {
          // Zoom in
          scale = clamp(scale + 0.1, 1, 3); // Max zoom-in at 3x
        } else {
          // Zoom out
          scale = clamp(scale - 0.1, 1, 1); // Prevent zoom-out below 1x
        }

        document.documentElement.style.transform = `scale(${scale})`;
        document.documentElement.style.transformOrigin = 'center center';
        document.documentElement.style.overflow = 'hidden'; // Prevent scrollbars during zoom
      }
    };

    const handlePan = (event: MouseEvent) => {
      if (!document.fullscreenElement || scale <= 1) return;

      if (event.buttons === 1) {
        // Left mouse button is pressed
        event.preventDefault();
        offsetX = clamp(
          offsetX + event.movementX,
          -window.innerWidth * (scale - 1),
          window.innerWidth * (scale - 1)
        );
        offsetY = clamp(
          offsetY + event.movementY,
          -window.innerHeight * (scale - 1),
          window.innerHeight * (scale - 1)
        );

        document.documentElement.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    const resetZoom = () => {
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      document.documentElement.style.transform = '';
      document.documentElement.style.transformOrigin = '';
      document.documentElement.style.overflow = '';
    };

    window.addEventListener('wheel', handleZoom, { passive: false });
    window.addEventListener('mousemove', handlePan);
    document.addEventListener('fullscreenchange', resetZoom);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('wheel', handleZoom);
      window.removeEventListener('mousemove', handlePan);
      document.removeEventListener('fullscreenchange', resetZoom);
    };
  }, []);
};
