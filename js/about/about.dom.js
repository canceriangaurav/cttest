
export function getAboutDom() {
  return {
    root: document.getElementById('ctAboutPage'),
    scroll: document.getElementById('ctAboutScroll'),
    pin: document.getElementById('ctAboutPin'),
    stage: document.getElementById('ctAboutStage'),
    progressBar: document.getElementById('aboutProgressBar'),
    debug: document.getElementById('aboutDebug'),
    scenes: Array.from(document.querySelectorAll('.ct-about-scene')),
    canvases: Array.from(document.querySelectorAll('.ct-about-canvas')),
    scene1: document.getElementById('aboutScene1'),
    scene2: document.getElementById('aboutScene2'),
    scene3: document.getElementById('aboutScene3'),
    scene4: document.getElementById('aboutScene4'),
    scene5: document.getElementById('aboutScene5'),
    scene6: document.getElementById('aboutScene6'),
    scene7: document.getElementById('aboutScene7'),
    scene8: document.getElementById('aboutScene8'),
    scene9: document.getElementById('aboutScene9')
  };
}
