if (window.location.hostname === "www.youtube.com" && window.location.pathname.includes('/watch')) {
    console.log("YouTube Speed Controller content script loaded.");
  
    window.onload = () => {
      const controlDiv = document.createElement('div');
      controlDiv.id = 'speedController';
      controlDiv.style.position = 'fixed';
      controlDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      controlDiv.style.color = '#fff';
      controlDiv.style.padding = '8px 15px';
      controlDiv.style.borderRadius = '5px';
      controlDiv.style.fontFamily = 'Arial, sans-serif';
      controlDiv.style.fontSize = '14px';
      controlDiv.style.zIndex = '9999';
      controlDiv.style.opacity = '1';
      controlDiv.style.transition = 'opacity 0.3s ease-in-out';
      controlDiv.style.cursor = 'move';
  
      const decreaseButton = document.createElement('button');
      decreaseButton.textContent = '-';
      decreaseButton.style.marginLeft = '10px';
      decreaseButton.style.padding = '5px 10px';
      decreaseButton.style.backgroundColor = '#FF5C5C';
      decreaseButton.style.border = 'none';
      decreaseButton.style.borderRadius = '5px';
      decreaseButton.style.cursor = 'pointer';
      decreaseButton.addEventListener('click', () => adjustSpeed(-0.25));
  
      const speedLabel = document.createElement('span');
      speedLabel.id = 'currentSpeed';
      speedLabel.textContent = '1x';
      speedLabel.style.margin = '0 10px';
      controlDiv.appendChild(decreaseButton);
      controlDiv.appendChild(speedLabel);
  
      const increaseButton = document.createElement('button');
      increaseButton.textContent = '+';
      increaseButton.style.marginLeft = '10px';
      increaseButton.style.padding = '5px 10px';
      increaseButton.style.backgroundColor = '#5CFF5C';
      increaseButton.style.border = 'none';
      increaseButton.style.borderRadius = '5px';
      increaseButton.style.cursor = 'pointer';
      increaseButton.addEventListener('click', () => adjustSpeed(0.25));
  
      controlDiv.appendChild(increaseButton);
  
      document.body.appendChild(controlDiv);
  
      let currentSpeed = 1;
  
      function updateSpeedUI() {
        document.getElementById('currentSpeed').textContent = `${currentSpeed.toFixed(2)}x`;
      }
  
      function adjustSpeed(amount) {
        currentSpeed = Math.min(Math.max(currentSpeed + amount, 0.25), 16);
        const video = document.querySelector('video');
        if (video) {
          video.playbackRate = currentSpeed;
          updateSpeedUI();
        }
      }
  
      const video = document.querySelector('video');
      if (video) {
        video.playbackRate = currentSpeed;
      }
  
      const observer = new MutationObserver(() => {
        const header = document.querySelector('#masthead');
        const logo = header.querySelector('#logo');
        const searchButton = header.querySelector('#search-icon-legacy');
        
        if (logo && searchButton) {
          const logoRect = logo.getBoundingClientRect();
          const searchButtonRect = searchButton.getBoundingClientRect();
  
          const controllerX = logoRect.right + 10;
          const controllerY = logoRect.top + (logoRect.height / 2) - 20;
  
          controlDiv.style.left = `${controllerX}px`;
          controlDiv.style.top = `${controllerY}px`;
  
          observer.disconnect();
        }
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  
      let isDragging = false;
      let offsetX, offsetY;
  
      controlDiv.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - controlDiv.getBoundingClientRect().left;
        offsetY = e.clientY - controlDiv.getBoundingClientRect().top;
        controlDiv.style.transition = 'none';
      });
  
      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;
  
          controlDiv.style.left = `${x}px`;
          controlDiv.style.top = `${y}px`;
        }
      });
  
      document.addEventListener('mouseup', () => {
        isDragging = false;
        controlDiv.style.transition = 'opacity 0.3s ease-in-out';
      });
  
      controlDiv.style.opacity = '1';
  
      let opacityTimeout;
  
      function resetOpacity() {
        controlDiv.style.opacity = '1';
        clearTimeout(opacityTimeout);
        opacityTimeout = setTimeout(() => {
          controlDiv.style.opacity = '0.3';
        }, 2000);
      }
  
      controlDiv.addEventListener('mouseover', () => {
        controlDiv.style.opacity = '1';
        clearTimeout(opacityTimeout);
      });
  
      controlDiv.addEventListener('mouseleave', () => {
        opacityTimeout = setTimeout(() => {
          controlDiv.style.opacity = '0.3';
        }, 2000);
      });
  
      decreaseButton.addEventListener('click', resetOpacity);
      increaseButton.addEventListener('click', resetOpacity);
    };
  }
  