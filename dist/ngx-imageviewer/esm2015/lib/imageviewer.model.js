import { Subject } from 'rxjs';
export class Button {
    //#endregion
    //#region Lifecycle events
    constructor(config, style) {
        this.style = style;
        //#region Properties
        this.sortId = 0;
        // hover state
        this.hover = false;
        // show/hide button
        this.display = true;
        // drawn on position
        this.drawPosition = null;
        this.drawRadius = 0;
        this.sortId = config.sortId;
        this.display = config.show;
        this.icon = config.icon;
        this.tooltip = config.tooltip;
    }
    //#endregion
    //#region Events
    // click action
    onClick(evt) { alert('no click action set!'); return true; }
    // mouse down action
    onMouseDown(evt) { return false; }
    //#endregion
    //#region Draw Button
    draw(ctx, x, y, radius) {
        this.drawPosition = { x: x, y: y };
        this.drawRadius = radius;
        // preserve context
        ctx.save();
        // drawing settings
        const isHover = (typeof this.hover === 'function') ? this.hover() : this.hover;
        ctx.globalAlpha = (isHover) ? this.style.hoverAlpha : this.style.alpha;
        ctx.fillStyle = this.style.bgStyle;
        ctx.lineWidth = 0;
        // draw circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        if (this.style.borderWidth > 0) {
            ctx.lineWidth = this.style.borderWidth;
            ctx.strokeStyle = this.style.borderStyle;
            ctx.stroke();
        }
        // draw icon
        if (this.icon !== null) {
            ctx.save();
            // ctx.globalCompositeOperation = 'destination-out';
            this.drawIconFont(ctx, x, y, radius);
            ctx.restore();
        }
        // restore context
        ctx.restore();
    }
    drawIconFont(ctx, centreX, centreY, size) {
        // font settings
        ctx.font = size + 'px ' + this.style.iconFontFamily;
        ctx.fillStyle = this.style.iconStyle;
        // calculate position
        const textSize = ctx.measureText(this.icon);
        const x = centreX - textSize.width / 2;
        const y = centreY + size / 2;
        // draw it
        ctx.fillText(this.icon, x, y);
    }
    //#endregion
    //#region Utils
    isWithinBounds(x, y) {
        if (this.drawPosition === null) {
            return false;
        }
        const dx = Math.abs(this.drawPosition.x - x), dy = Math.abs(this.drawPosition.y - y);
        return dx * dx + dy * dy <= this.drawRadius * this.drawRadius;
    }
}
export class Viewport {
    constructor(width, height, scale, rotation, x, y) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.rotation = rotation;
        this.x = x;
        this.y = y;
    }
}
export class ResourceLoader {
    constructor() {
        this.viewport = { width: 0, height: 0, scale: 1, rotation: 0, x: 0, y: 0 };
        this.minScale = 0;
        this.maxScale = 4;
        this.currentItem = 1;
        this.totalItem = 1;
        this.showItemsQuantity = false;
        this.loaded = false;
        this.loading = false;
        this.rendering = false;
        this.resourceChange = new Subject();
    }
    resetViewport(canvasDim) {
        if (!this.loaded || !canvasDim) {
            return;
        }
        const rotation = this.viewport ? this.viewport.rotation : 0;
        const inverted = toSquareAngle(rotation) / 90 % 2 !== 0;
        const canvas = {
            width: !inverted ? canvasDim.width : canvasDim.height,
            height: !inverted ? canvasDim.height : canvasDim.width
        };
        if (((canvas.height / this._image.height) * this._image.width) <= canvas.width) {
            this.viewport.scale = canvas.height / this._image.height;
        }
        else {
            this.viewport.scale = canvas.width / this._image.width;
        }
        this.minScale = this.viewport.scale / 4;
        this.maxScale = this.viewport.scale * 4;
        // start point to draw image
        this.viewport.width = this._image.width * this.viewport.scale;
        this.viewport.height = this._image.height * this.viewport.scale;
        this.viewport.x = (canvasDim.width - this.viewport.width) / 2;
        this.viewport.y = (canvasDim.height - this.viewport.height) / 2;
    }
    draw(ctx, config, canvasDim, onFinish) {
        // clear canvas
        ctx.clearRect(0, 0, canvasDim.width, canvasDim.height);
        // Draw background color;
        ctx.fillStyle = config.bgStyle;
        ctx.fillRect(0, 0, canvasDim.width, canvasDim.height);
        // draw image (transformed, rotate and scaled)
        if (!this.loading && this.loaded) {
            ctx.translate(this.viewport.x + this.viewport.width / 2, this.viewport.y + this.viewport.height / 2);
            ctx.rotate(this.viewport.rotation * Math.PI / 180);
            ctx.scale(this.viewport.scale, this.viewport.scale);
            ctx.drawImage(this._image, -this._image.width / 2, -this._image.height / 2);
        }
        else {
            ctx.fillStyle = '#333';
            ctx.font = '25px Verdana';
            ctx.textAlign = 'center';
            ctx.fillText(config.loadingMessage || 'Loading...', canvasDim.width / 2, canvasDim.height / 2);
        }
        onFinish(ctx, config, canvasDim);
    }
    onResourceChange() { return this.resourceChange.asObservable(); }
}
export function toSquareAngle(angle) {
    return 90 * ((Math.trunc(angle / 90) + (Math.trunc(angle % 90) > 45 ? 1 : 0)) % 4);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2V2aWV3ZXIubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaW1hZ2V2aWV3ZXIvc3JjL2xpYi9pbWFnZXZpZXdlci5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTNDLE1BQU0sT0FBTyxNQUFNO0lBZ0JqQixZQUFZO0lBRVosMEJBQTBCO0lBQzFCLFlBQ0UsTUFBb0IsRUFDWixLQUFrQjtRQUFsQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBcEI1QixvQkFBb0I7UUFDcEIsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUtYLGNBQWM7UUFDZCxVQUFLLEdBQThCLEtBQUssQ0FBQztRQUV6QyxtQkFBbUI7UUFDbkIsWUFBTyxHQUFHLElBQUksQ0FBQztRQUVmLG9CQUFvQjtRQUNaLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFRckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFDRCxZQUFZO0lBRVosZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixPQUFPLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTVELG9CQUFvQjtJQUNwQixXQUFXLENBQUMsR0FBRyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNsQyxZQUFZO0lBRVoscUJBQXFCO0lBQ3JCLElBQUksQ0FBQyxHQUFHLEVB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Q0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJ1dHRvbkNvbmZpZywgQnV0dG9uU3R5bGUsIEltYWdlVmlld2VyQ29uZmlnIH0gZnJvbSAnLi9pbWFnZXZpZXdlci5jb25maWcnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgY2xhc3MgQnV0dG9uIHtcbiAgLy8jcmVnaW9uIFByb3BlcnRpZXNcbiAgc29ydElkID0gMDtcblxuICBpY29uOiBzdHJpbmc7XG4gIHRvb2x0aXA6IHN0cmluZztcblxuICAvLyBob3ZlciBzdGF0ZVxuICBob3ZlcjogYm9vbGVhbiB8ICgoKSA9PiBib29sZWFuKSA9IGZhbHNlO1xuXG4gIC8vIHNob3cvaGlkZSBidXR0b25cbiAgZGlzcGxheSA9IHRydWU7XG5cbiAgLy8gZHJhd24gb24gcG9zaXRpb25cbiAgcHJpdmF0ZSBkcmF3UG9zaXRpb24gPSBudWxsO1xuICBwcml2YXRlIGRyYXdSYWRpdXMgPSAwO1xuICAvLyNlbmRyZWdpb25cblxuICAvLyNyZWdpb24gTGlmZWN5Y2xlIGV2ZW50c1xuICBjb25zdHJ1Y3RvcihcbiAgICBjb25maWc6IEJ1dHRvbkNvbmZpZyxcbiAgICBwcml2YXRlIHN0eWxlOiBCdXR0b25TdHlsZVxuICApIHtcbiAgICB0aGlzLnNvcnRJZCA9IGNvbmZpZy5zb3J0SWQ7XG4gICAgdGhpcy5kaXNwbGF5ID0gY29uZmlnLnNob3c7XG4gICAgdGhpcy5pY29uID0gY29uZmlnLmljb247XG4gICAgdGhpcy50b29sdGlwID0gY29uZmlnLnRvb2x0aXA7XG4gIH1cbiAgLy8jZW5kcmVnaW9uXG5cbiAgLy8jcmVnaW9uIEV2ZW50c1xuICAvLyBjbGljayBhY3Rpb25cbiAgb25DbGljayhldnQpIHsgYWxlcnQoJ25vIGNsaWNrIGFjdGlvbiBzZXQhJyk7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gbW91c2UgZG93biBhY3Rpb25cbiAgb25Nb3VzZURvd24oZXZ0KSB7IHJldHVybiBmYWxzZTsgfVxuICAvLyNlbmRyZWdpb25cblxuICAvLyNyZWdpb24gRHJhdyBCdXR0b25cbiAgZHJhdyhjdHgsIHgsIHksIHJhZGl1cykge1xuICAgIHRoaXMuZHJhd1Bvc2l0aW9uID0geyB4OiB4LCB5OiB5IH07XG4gICAgdGhpcy5kcmF3UmFkaXVzID0gcmFkaXVzO1xuXG4gICAgLy8gcHJlc2VydmUgY29udGV4dFxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICAvLyBkcmF3aW5nIHNldHRpbmdzXG4gICAgY29uc3QgaXNIb3ZlciA9ICh0eXBlb2YgdGhpcy5ob3ZlciA9PT0gJ2Z1bmN0aW9uJykgPyB0aGlzLmhvdmVyKCkgOiB0aGlzLmhvdmVyO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IChpc0hvdmVyKSA/IHRoaXMuc3R5bGUuaG92ZXJBbHBoYSA6IHRoaXMuc3R5bGUuYWxwaGE7XG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuc3R5bGUuYmdTdHlsZTtcbiAgICBjdHgubGluZVdpZHRoID0gMDtcblxuICAgIC8vIGRyYXcgY2lyY2xlXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoeCwgeSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgaWYgKHRoaXMuc3R5bGUuYm9yZGVyV2lkdGggPiAwKSB7XG4gICAgICBjdHgubGluZVdpZHRoID0gdGhpcy5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3R5bGUuYm9yZGVyU3R5bGU7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgLy8gZHJhdyBpY29uXG4gICAgaWYgKHRoaXMuaWNvbiAhPT0gbnVsbCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIC8vIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcbiAgICAgIHRoaXMuZHJhd0ljb25Gb250KGN0eCwgeCwgeSwgcmFkaXVzKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgLy8gcmVzdG9yZSBjb250ZXh0XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0ljb25Gb250KGN0eCwgY2VudHJlWCwgY2VudHJlWSwgc2l6ZSkge1xuICAgIC8vIGZvbnQgc2V0dGluZ3NcbiAgICBjdHguZm9udCA9IHNpemUgKyAncHggJyArIHRoaXMuc3R5bGUuaWNvbkZvbnRGYW1pbHk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuc3R5bGUuaWNvblN0eWxlO1xuXG4gICAgLy8gY2FsY3VsYXRlIHBvc2l0aW9uXG4gICAgY29uc3QgdGV4dFNpemUgPSBjdHgubWVhc3VyZVRleHQodGhpcy5pY29uKTtcbiAgICBjb25zdCB4ID0gY2VudHJlWCAtIHRleHRTaXplLndpZHRoIC8gMjtcbiAgICBjb25zdCB5ID0gY2VudHJlWSArIHNpemUgLyAyO1xuXG4gICAgLy8gZHJhdyBpdFxuICAgIGN0eC5maWxsVGV4dCh0aGlzLmljb24sIHgsIHkpO1xuICB9XG4gIC8vI2VuZHJlZ2lvblxuXG4gIC8vI3JlZ2lvbiBVdGlsc1xuICBpc1dpdGhpbkJvdW5kcyh4LCB5KSB7XG4gICAgaWYgKHRoaXMuZHJhd1Bvc2l0aW9uID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGNvbnN0IGR4ID0gTWF0aC5hYnModGhpcy5kcmF3UG9zaXRpb24ueCAtIHgpLCBkeSA9IE1hdGguYWJzKHRoaXMuZHJhd1Bvc2l0aW9uLnkgLSB5KTtcbiAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHkgPD0gdGhpcy5kcmF3UmFkaXVzICogdGhpcy5kcmF3UmFkaXVzO1xuICB9XG4gIC8vI2VuZHJlZ2lvblxufVxuXG5leHBvcnQgY2xhc3MgVmlld3BvcnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgd2lkdGg6IG51bWJlcixcbiAgICBwdWJsaWMgaGVpZ2h0OiBudW1iZXIsXG4gICAgcHVibGljIHNjYWxlOiBudW1iZXIsXG4gICAgcHVibGljIHJvdGF0aW9uOiBudW1iZXIsXG4gICAgcHVibGljIHg6IG51bWJlcixcbiAgICBwdWJsaWMgeTogbnVtYmVyXG4gICkge31cbn1cblxuZXhwb3J0IGludGVyZmFjZSBEaW1lbnNpb24geyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcjsgfVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzb3VyY2VMb2FkZXIge1xuICBwdWJsaWMgc3JjOiBzdHJpbmc7XG4gIHB1YmxpYyBzb3VyY2VEaW06IHsgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgfTtcbiAgcHVibGljIHZpZXdwb3J0OiBWaWV3cG9ydCA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCwgc2NhbGU6IDEsIHJvdGF0aW9uOiAwLCB4OiAwLCB5OiAwIH07XG4gIHB1YmxpYyBtaW5TY2FsZSA9IDA7XG4gIHB1YmxpYyBtYXhTY2FsZSA9IDQ7XG4gIHB1YmxpYyBjdXJyZW50SXRlbSA9IDE7XG4gIHB1YmxpYyB0b3RhbEl0ZW0gPSAxO1xuICBwdWJsaWMgc2hvd0l0ZW1zUXVhbnRpdHkgPSBmYWxzZTtcbiAgcHVibGljIGxvYWRlZCA9IGZhbHNlO1xuICBwdWJsaWMgbG9hZGluZyA9IGZhbHNlO1xuICBwdWJsaWMgcmVuZGVyaW5nID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9pbWFnZTtcbiAgcHJvdGVjdGVkIHJlc291cmNlQ2hhbmdlID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIGFic3RyYWN0IHNldFVwKCk7XG4gIGFic3RyYWN0IGxvYWRSZXNvdXJjZSgpO1xuXG4gIHB1YmxpYyByZXNldFZpZXdwb3J0KGNhbnZhc0RpbTogRGltZW5zaW9uKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmxvYWRlZCB8fCAhY2FudmFzRGltKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3Qgcm90YXRpb24gPSB0aGlzLnZpZXdwb3J0ID8gdGhpcy52aWV3cG9ydC5yb3RhdGlvbiA6IDA7XG4gICAgY29uc3QgaW52ZXJ0ZWQgPSB0b1NxdWFyZUFuZ2xlKHJvdGF0aW9uKSAvIDkwICUgMiAhPT0gMDtcbiAgICBjb25zdCBjYW52YXMgPSB7XG4gICAgICB3aWR0aDogIWludmVydGVkID8gY2FudmFzRGltLndpZHRoIDogY2FudmFzRGltLmhlaWdodCxcbiAgICAgIGhlaWdodDogIWludmVydGVkID8gY2FudmFzRGltLmhlaWdodCA6IGNhbnZhc0RpbS53aWR0aFxuICAgIH07XG5cbiAgICBpZiAoKChjYW52YXMuaGVpZ2h0IC8gdGhpcy5faW1hZ2UuaGVpZ2h0KSAqIHRoaXMuX2ltYWdlLndpZHRoKSA8PSBjYW52YXMud2lkdGgpIHtcbiAgICAgIHRoaXMudmlld3BvcnQuc2NhbGUgPSBjYW52YXMuaGVpZ2h0IC8gdGhpcy5faW1hZ2UuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXdwb3J0LnNjYWxlID0gY2FudmFzLndpZHRoIC8gdGhpcy5faW1hZ2Uud2lkdGg7XG4gICAgfVxuICAgIHRoaXMubWluU2NhbGUgPSB0aGlzLnZpZXdwb3J0LnNjYWxlIC8gNDtcbiAgICB0aGlzLm1heFNjYWxlID0gdGhpcy52aWV3cG9ydC5zY2FsZSAqIDQ7XG5cbiAgICAvLyBzdGFydCBwb2ludCB0byBkcmF3IGltYWdlXG4gICAgdGhpcy52aWV3cG9ydC53aWR0aCA9IHRoaXMuX2ltYWdlLndpZHRoICogdGhpcy52aWV3cG9ydC5zY2FsZTtcbiAgICB0aGlzLnZpZXdwb3J0LmhlaWdodCA9IHRoaXMuX2ltYWdlLmhlaWdodCAqIHRoaXMudmlld3BvcnQuc2NhbGU7XG4gICAgdGhpcy52aWV3cG9ydC54ID0gKGNhbnZhc0RpbS53aWR0aCAtIHRoaXMudmlld3BvcnQud2lkdGgpIC8gMjtcbiAgICB0aGlzLnZpZXdwb3J0LnkgPSAoY2FudmFzRGltLmhlaWdodCAtIHRoaXMudmlld3BvcnQuaGVpZ2h0KSAvIDI7XG4gIH1cblxuICBwdWJsaWMgZHJhdyhjdHgsIGNvbmZpZzogSW1hZ2VWaWV3ZXJDb25maWcsIGNhbnZhc0RpbTogRGltZW5zaW9uLCBvbkZpbmlzaCkge1xuICAgIC8vIGNsZWFyIGNhbnZhc1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzRGltLndpZHRoLCBjYW52YXNEaW0uaGVpZ2h0KTtcblxuICAgIC8vIERyYXcgYmFja2dyb3VuZCBjb2xvcjtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmJnU3R5bGU7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhc0RpbS53aWR0aCwgY2FudmFzRGltLmhlaWdodCk7XG5cbiAgICAvLyBkcmF3IGltYWdlICh0cmFuc2Zvcm1lZCwgcm90YXRlIGFuZCBzY2FsZWQpXG4gICAgaWYgKCF0aGlzLmxvYWRpbmcgJiYgdGhpcy5sb2FkZWQpIHtcbiAgICAgIGN0eC50cmFuc2xhdGUodGhpcy52aWV3cG9ydC54ICsgdGhpcy52aWV3cG9ydC53aWR0aCAvIDIsIHRoaXMudmlld3BvcnQueSArIHRoaXMudmlld3BvcnQuaGVpZ2h0IC8gMik7XG4gICAgICBjdHgucm90YXRlKHRoaXMudmlld3BvcnQucm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKTtcbiAgICAgIGN0eC5zY2FsZSh0aGlzLnZpZXdwb3J0LnNjYWxlLCB0aGlzLnZpZXdwb3J0LnNjYWxlKTtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5faW1hZ2UsIC10aGlzLl9pbWFnZS53aWR0aCAvIDIsIC10aGlzLl9pbWFnZS5oZWlnaHQgLyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzMzJztcbiAgICAgIGN0eC5mb250ID0gJzI1cHggVmVyZGFuYSc7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHguZmlsbFRleHQoY29uZmlnLmxvYWRpbmdNZXNzYWdlIHx8ICdMb2FkaW5nLi4uJywgY2FudmFzRGltLndpZHRoIC8gMiwgY2FudmFzRGltLmhlaWdodCAvIDIpO1xuICAgIH1cblxuICAgIG9uRmluaXNoKGN0eCwgY29uZmlnLCBjYW52YXNEaW0pO1xuICB9XG5cbiAgcHVibGljIG9uUmVzb3VyY2VDaGFuZ2UoKSB7IHJldHVybiB0aGlzLnJlc291cmNlQ2hhbmdlLmFzT2JzZXJ2YWJsZSgpOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1NxdWFyZUFuZ2xlKGFuZ2xlOiBudW1iZXIpIHtcbiAgcmV0dXJuIDkwICogKChNYXRoLnRydW5jKGFuZ2xlIC8gOTApICsgKE1hdGgudHJ1bmMoYW5nbGUgJSA5MCkgPiA0NSA/IDEgOiAwKSkgJSA0KTtcbn1cbiJdfQ==