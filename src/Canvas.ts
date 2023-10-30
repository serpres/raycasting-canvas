class Canvas {
    el: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    colors: Record<string, string>;

    constructor(elem: HTMLCanvasElement) {
        this.el = elem;
        this.ctx = elem.getContext("2d") as CanvasRenderingContext2D;
        this.line = this.line.bind(this);
        this.circle = this.circle.bind(this);
        this.rect = this.rect.bind(this);
        this.clear = this.clear.bind(this);
        this.colors = {
            grey: "#828282",
            blue: "#00bfff",
            yellow: "#fde910",
            orange: "#ff7433",
            dark: "#633327",
            light: "#884535",
            green: "#5da130",
        };
    }

    line({
        x1,
        y1,
        x2,
        y2,
        color,
    }: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
        color: string;
    }) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    circle({
        x,
        y,
        r,
        color,
    }: {
        x: number;
        y: number;
        r: number;
        color: string;
    }) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    rect({
        x,
        y,
        w,
        h,
        color,
    }: {
        x: number;
        y: number;
        w: number;
        h: number;
        color: string;
    }) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.closePath();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    }
}

export { Canvas };
