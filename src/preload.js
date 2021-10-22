import { ipcRenderer } from 'electron';

ipcRenderer.on('wallpaper', (event, wallpaperPath) => {
    console.log('wallpaper', wallpaperPath);
    document.getElementById('mica-background').style.backgroundImage = `url("data:image/png;base64,${wallpaperPath}")`;
});

ipcRenderer.on('screen-size', (event, screenSize) => {
    document.getElementById('mica-background').style.backgroundSize = `${screenSize.width}px ${screenSize.height}px`;
    document.getElementById('mica-background').style.backgroundPosition = `${-screenSize.x}px ${-screenSize.y}px`;
});

ipcRenderer.on('window-move', (event, newBounds) => {
    document.getElementById('mica-background').style.backgroundPosition = `${-newBounds.x}px ${-newBounds.y}px`;
});